// newapp.js
// Small Express app organized with SOLID principles (Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion)

const express = require('express');
const session = require('express-session');

// -------------------- Interfaces / Abstractions --------------------
// Note: JavaScript doesn't have interfaces; we document the expected shape.

// ILogger: { debug(msg), info(msg), warn(msg), error(msg) }
class ILogger {
  debug() {}
  info() {}
  warn() {}
  error() {}
}

// IUserRepository: { findByEmail(email), create(user) }
class IUserRepository {
  async findByEmail() {}
  async create() {}
}

// -------------------- Implementations --------------------
// Simple ConsoleLogger implementing ILogger (Dependency Inversion)
class ConsoleLogger extends ILogger {
  debug(msg, meta) {
    console.debug('[DEBUG]', msg, meta || '');
  }
  info(msg, meta) {
    console.info('[INFO]', msg, meta || '');
  }
  warn(msg, meta) {
    console.warn('[WARN]', msg, meta || '');
  }
  error(msg, meta) {
    console.error('[ERROR]', msg, meta || '');
  }
}

// InMemoryUserRepository implementing IUserRepository (Single Responsibility)
class InMemoryUserRepository extends IUserRepository {
  constructor() {
    super();
    this.users = new Map(); // key: email -> user object
  }

  async findByEmail(email) {
    return this.users.get(email) || null;
  }

  async create(user) {
    if (this.users.has(user.email)) {
      throw new Error('User exists');
    }
    this.users.set(user.email, user);
    return user;
  }
}

// -------------------- Services (High-level modules) --------------------
// AuthService: responsible for registration/login logic (Open/Closed)
class AuthService {
  constructor(userRepo, logger) {
    this.userRepo = userRepo; // depends on abstraction
    this.logger = logger;
  }

  async register({ email, password, name, address }) {
    if (!email || !password) throw new Error('email/password required');
    const exists = await this.userRepo.findByEmail(email);
    if (exists) return { success: false, message: 'Email already registered' };

    const user = { email, password, name: name || '', address: address || '' };
    await this.userRepo.create(user);
    this.logger.info('user registered', { email });
    return { success: true };
  }

  async login({ email, password }) {
    const user = await this.userRepo.findByEmail(email);
    if (!user || user.password !== password) return { success: false, message: 'Invalid email or password' };
    this.logger.info('user logged in', { email });
    return { success: true, user };
  }
}

// OrderService: small focused class for placing orders
class OrderService {
  constructor(logger) {
    this.logger = logger;
    this.orders = [];
  }

  placeOrder(userEmail, { product, quantity, paymentMethod }) {
    if (!userEmail) return { success: false, message: 'Please login to place order' };
    const order = {
      id: Math.floor(Math.random() * 1000000),
      user: userEmail,
      product,
      quantity: Number(quantity) || 1,
      paymentMethod: paymentMethod || 'COD',
      createdAt: Date.now(),
    };
    this.orders.push(order);
    this.logger.info('order placed', { orderId: order.id, user: userEmail });
    return { success: true, orderId: order.id };
  }
}

// -------------------- Composition Root --------------------
function createApp({ port = 4000, logger = new ConsoleLogger(), userRepo = new InMemoryUserRepository() } = {}) {
  const app = express();
  const authService = new AuthService(userRepo, logger);
  const orderService = new OrderService(logger);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'solid-secret',
      resave: false,
      saveUninitialized: true,
    })
  );

  // Routes are thin controllers delegating to services (Single Responsibility)
  app.get('/', (req, res) => {
    res.send('<h1>newapp.js - SOLID demo</h1><p>Use /api/register /api/login /api/order</p>');
  });

  app.post('/api/register', async (req, res) => {
    try {
      const result = await authService.register(req.body);
      if (result.success) {
        req.session.userId = req.body.email;
        req.session.userName = req.body.name;
      }
      res.json(result);
    } catch (err) {
      logger.error('register error', err.message);
      res.json({ success: false, message: err.message });
    }
  });

  app.post('/api/login', async (req, res) => {
    try {
      const result = await authService.login(req.body);
      if (result.success) {
        req.session.userId = req.body.email;
        req.session.userName = result.user.name;
      }
      res.json(result);
    } catch (err) {
      logger.error('login error', err.message);
      res.json({ success: false, message: err.message });
    }
  });

  app.get('/api/check-login', (req, res) => {
    if (req.session.userId) return res.json({ isLoggedIn: true, userName: req.session.userName });
    return res.json({ isLoggedIn: false });
  });

  app.post('/api/logout', (req, res) => {
    req.session.destroy(() => {});
    res.json({ success: true });
  });

  app.post('/api/order', (req, res) => {
    const userEmail = req.session.userId;
    const result = orderService.placeOrder(userEmail, req.body);
    res.json(result);
  });

  // Small health endpoint
  app.get('/healthz', (req, res) => res.status(200).send('ok'));

  // 404 last
  app.use((req, res) => res.status(404).json({ error: 'Not Found' }));

  return { app, port };
}

// -------------------- Run if invoked directly --------------------
if (require.main === module) {
  const { app, port } = createApp();
  app.listen(port, () => console.log(`newapp.js listening on http://localhost:${port}`));
}

module.exports = { createApp, ConsoleLogger, InMemoryUserRepository, AuthService, OrderService };
