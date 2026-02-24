'use strict';

/**
 * High-performance Node.js app skeleton:
 * - Async I/O
 * - Clustering across CPU cores
 * - L1 in-memory LRU cache + optional L2 Redis
 * - Gzip compression, static assets with long-term caching headers
 * - Pino async logging
 * - Streaming endpoint for large files
 * - Graceful shutdown
 *
 * Dependencies (install):
 *   npm i express compression pino pino-http lru-cache ioredis
 *
 * Optional (static files): create ./public and put assets there
 */

const cluster = require('cluster');
const os = require('os');

if (cluster.isPrimary) {
  // ---- CLUSTER MASTER ----
  const cores = Number(process.env.WEB_CONCURRENCY) || os.cpus().length;
  console.log(`[master] Starting ${cores} workers...`);

  for (let i = 0; i < cores; i++) cluster.fork();

  cluster.on('exit', (worker, code, signal) => {
    console.error(`[master] Worker ${worker.process.pid} died (${signal || code}). Restarting…`);
    cluster.fork();
  });

  // Graceful shutdown for master -> workers
  const shutdown = () => {
    console.log('[master] Shutting down...');
    for (const id in cluster.workers) {
      cluster.workers[id].process.kill('SIGTERM');
    }
    setTimeout(() => process.exit(0), 5000).unref();
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
} else {
  // ---- CLUSTER WORKER: start the HTTP server ----
  startServer().catch((err) => {
    console.error('[worker] Failed to start server:', err);
    process.exit(1);
  });
}

async function startServer() {
  const express = require('express');
  const compression = require('compression');
  const pino = require('pino');
  const pinoHttp = require('pino-http');
  // lru-cache may export the constructor as the module itself or as the default export
  let LRU = require('lru-cache');
  // Normalize exports for different lru-cache versions/builds
  if (LRU && typeof LRU !== 'function') {
    if (typeof LRU.default === 'function') {
      LRU = LRU.default;
    } else if (typeof LRU.LRUCache === 'function') {
      LRU = LRU.LRUCache;
    } else if (typeof LRU === 'object' && LRU !== null && typeof LRU.prototype === 'object' && typeof LRU.prototype.get === 'function') {
      // already a constructor-like object
    } else {
      // Fallback: implement a tiny LRU class compatible with the minimal API used here
      class SimpleLRU {
        constructor(opts = {}) {
          this.max = opts.max || 1000;
          this.ttl = opts.ttl || 0;
          this.map = new Map(); // key -> { value, expiry }
        }
        _isExpired(entry) {
          return entry && entry.expiry && Date.now() > entry.expiry;
        }
        get(key) {
          const entry = this.map.get(key);
          if (!entry) return undefined;
          if (this._isExpired(entry)) {
            this.map.delete(key);
            return undefined;
          }
          // refresh LRU order
          this.map.delete(key);
          this.map.set(key, entry);
          return entry.value;
        }
        set(key, value, options = {}) {
          const ttl = options && (options.ttl ?? this.ttl);
          const expiry = ttl ? Date.now() + ttl : null;
          this.map.set(key, { value, expiry });
          while (this.map.size > this.max) {
            const firstKey = this.map.keys().next().value;
            this.map.delete(firstKey);
          }
        }
      }
      LRU = SimpleLRU;
    }
  }
  const fs = require('fs');
  const path = require('path');
  const session = require('express-session');

  // Optional Redis L2 cache
  const Redis = safeRequire('ioredis');

  // ---------- CONFIG ----------
  const PORT = Number(process.env.PORT) || 3000;
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const IS_PROD = NODE_ENV === 'production';

  // L1 in-memory cache (bounded): fast & local per worker
  const l1Cache = new LRU({
    max: Number(process.env.LRU_MAX_ENTRIES) || 1000,
    ttl: Number(process.env.LRU_TTL_MS) || 60000, // 60s default
  });

  // L2 Redis (shared across workers/instances) – optional
  const redis =
    Redis && process.env.REDIS_URL
      ? new Redis(process.env.REDIS_URL, {
          lazyConnect: true,
          maxRetriesPerRequest: 3,
          enableOfflineQueue: false,
        })
      : null;

  if (redis) {
    try {
      await redis.connect?.(); // ioredis v5 uses .connect()
      console.log(`[worker ${process.pid}] Connected to Redis`);
    } catch (e) {
      console.warn(`[worker ${process.pid}] Redis not connected; falling back to L1 only`, e.message);
    }
  }

  // ---------- LOGGER ----------
  // Configure transport only when pino-pretty is installed and not in prod
  let transportCfg;
  if (!IS_PROD) {
    const pretty = safeRequire('pino-pretty');
    if (pretty) {
      transportCfg = { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } };
    } else {
      transportCfg = undefined;
      console.warn('[worker] pino-pretty not installed; using default pino output');
    }
  }

  const logger = pino({
    level: process.env.LOG_LEVEL || (IS_PROD ? 'info' : 'debug'),
    transport: transportCfg,
  });

  const app = express();
  // Body parsing and session middleware (needed by the frontend)
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: true,
    })
  );
  // Simple in-memory user storage (for demo purposes)
  const users = {};
  app.set('json spaces', IS_PROD ? 0 : 2);
  app.set('etag', 'strong'); // caching support for responses
  app.disable('x-powered-by');
  app.set('trust proxy', true); // when behind CDN/load balancer

  // Request logging (non-blocking)
  app.use(
    pinoHttp({
      logger,
      autoLogging: { ignorePaths: ['/healthz'] },
    })
  );

  // Gzip compression; enable Brotli at CDN/reverse proxy
  app.use(
    compression({
      threshold: 1024, // only compress > 1KB
      filter: (req, res) => {
        if (req.headers['x-no-compress']) return false;
        return compression.filter(req, res);
      },
    })
  );

  // Static assets with long cache; use versioned filenames to make 'immutable' safe
  app.use(
    express.static(path.join(__dirname, 'public'), {
      etag: true,
      lastModified: true,
      maxAge: IS_PROD ? '365d' : 0,
      immutable: IS_PROD, // set true when using hashed filenames
      fallthrough: true,
    })
  );

  // ---------- SIMPLE HELPERS ----------
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // Simulated DB call (async & “expensive”) — replace with your real pooled DB logic
  async function getUserFromDB(userId) {
    // TODO: Plug your real DB client with connection pooling here (e.g., oracledb, pg, mysql2).
    // Example pattern:
    // const conn = await pool.getConnection();
    // const result = await conn.execute('SELECT ... WHERE id = :id', [userId]);
    // await conn.close();
    // return result.rows[0];
    await sleep(30); // simulate I/O latency
    return { id: userId, name: 'User ' + userId, ts: Date.now() };
  }

  // Cache helpers: L1 (in-memory) + L2 (Redis) with TTL
  const DEFAULT_TTL_SEC = Number(process.env.CACHE_TTL_SEC) || 60;

  async function cacheGet(key) {
    const l1 = l1Cache.get(key);
    if (l1 !== undefined) return l1;

    if (redis) {
      try {
        const v = await redis.get(key);
        if (v) {
          const parsed = JSON.parse(v);
          l1Cache.set(key, parsed, { ttl: DEFAULT_TTL_SEC * 1000 });
          return parsed;
        }
      } catch (e) {
        logger.warn({ err: e, key }, 'Redis GET failed');
      }
    }
    return undefined;
  }

  async function cacheSet(key, value, ttlSec = DEFAULT_TTL_SEC) {
    l1Cache.set(key, value, { ttl: ttlSec * 1000 });
    if (redis) {
      try {
        await redis.set(key, JSON.stringify(value), 'EX', ttlSec);
      } catch (e) {
        logger.warn({ err: e, key }, 'Redis SET failed');
      }
    }
  }

  // ---------- ROUTES ----------

  // Health endpoint for monitoring
  app.get('/healthz', (req, res) => res.status(200).send('ok'));

  // Example: cached API (GET) — demonstrates async I/O + L1/L2 caching
  app.get('/api/users/:id', async (req, res, next) => {
    try {
      const userId = String(req.params.id);
      const cacheKey = `user:${userId}`;
      const cached = await cacheGet(cacheKey);
      if (cached) {
        res.set('X-Cache', 'HIT');
        return res.json(cached);
      }

      const user = await getUserFromDB(userId);
      await cacheSet(cacheKey, user, DEFAULT_TTL_SEC);
      res.set('X-Cache', 'MISS');
      return res.json(user);
    } catch (err) {
      next(err);
    }
  });

  // Example: streaming large file (no big memory spike)
  app.get('/download', (req, res, next) => {
    const filePath = path.join(__dirname, 'public', 'bigfile.bin'); // put a file there
    const stream = fs.createReadStream(filePath);
    stream.on('error', next);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename="bigfile.bin"');
    stream.pipe(res);
  });


  // Serve frontend root (r.html)
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'r.html'));
  });

  // Register user
  app.post('/api/register', (req, res) => {
    const { email, password, name, address } = req.body;

    if (users[email]) {
      return res.json({ success: false, message: 'Email already registered' });
    }

    users[email] = { email, password, name, address };
    req.session.userId = email;
    req.session.userName = name;

    res.json({ success: true, message: 'Registration successful' });
  });

  // Login user
  app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!users[email] || users[email].password !== password) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    req.session.userId = email;
    req.session.userName = users[email].name;

    res.json({ success: true, message: 'Login successful' });
  });

  // Check login status
  app.get('/api/check-login', (req, res) => {
    if (req.session.userId) {
      res.json({ isLoggedIn: true, userName: req.session.userName });
    } else {
      res.json({ isLoggedIn: false });
    }
  });

  // Logout user
  app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
  });

  // Place order
  app.post('/api/order', (req, res) => {
    if (!req.session.userId) {
      return res.json({ success: false, message: 'Please login to place order' });
    }

    const { product, quantity, paymentMethod } = req.body;

    // Store order (in-memory for demo)
    res.json({
      success: true,
      message: `Order placed successfully! ${quantity} x ${product} via ${paymentMethod}`,
      orderId: Math.floor(Math.random() * 10000),
    });
  });
  // 404 handler (last)
  app.use((req, res) => res.status(404).json({ error: 'Not Found' }));
  // Error handler
  app.use((err, req, res, next) => {
    req.log?.error({ err }, 'Unhandled error');
    res.status(500).json({ error: 'Internal Server Error' });
  });

  // ---------- SERVER LIFECYCLE ----------
  const server = app.listen(PORT, () => {
    logger.info(`[worker ${process.pid}] Listening on port ${PORT} (${NODE_ENV})`);
  });

  // Graceful shutdown (close Redis, stop accepting new connections)
  async function gracefulShutdown(signal) {
    try {
      logger.info({ signal }, 'Shutting down gracefully...');
      server.close(() => {
        logger.info('HTTP server closed');
      });

      // Stop Redis
      if (redis) {
        try {
          await redis.quit();
        } catch {
          await redis.disconnect();
        }
      }

      // Give outstanding requests a moment to finish
      setTimeout(() => process.exit(0), 4000).unref();
    } catch (e) {
      logger.error({ err: e }, 'Graceful shutdown error');
      process.exit(1);
    }
  }

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
}

// Safe conditional require for optional deps
function safeRequire(name) {
  try {
    return require(name);
  } catch {
    return null;
  }
}
