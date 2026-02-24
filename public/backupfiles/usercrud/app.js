// app.js
//require('dotenv').config();  // Load .env variables
const express = require('express');
const { Pool } = require('pg');

const app = express();
app.use(express.json());

const PORT = 3000;//process.env.PORT || 3000;

//console.log(process.env.DB_HOST, process.env.DB_PORT, process.env.DB_USER);

// const pool = new Pool({
//   host: process.env.DB_HOST || 'db',
//   port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
//   user: process.env.DB_USER || 'admin',
//   password: process.env.DB_PASSWORD || 'admin123',
//   database: process.env.DB_NAME || 'mydb',
//   // connectionTimeoutMillis, etc. can be added
// });


const pool = new Pool({
    user: 'postgres',
    host: 'postgres-db',      // container name of the existing DB
    database: 'mydb',
    password: 'postgres',
    port: 5432,
  });
  


// Ensure table exists and seed data if empty
async function ensureDb() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(200) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const r = await client.query('SELECT count(*)::int AS c FROM users');
    if (r.rows[0].c === 0) {
      await client.query(
        `INSERT INTO users (name, email) VALUES
          ('Alice Developer','alice@example.com'),
          ('Bob Tester','bob@example.com'),
          ('Carol Mobile','carol@example.com')
        `
      );
      console.log('Seeded users table');
    }
  } 
  catch (err) {
    console.error('❌ Database connection failed:', err.message);
  } 
  finally {
    client.release();
  }
}

app.get('/', (req, res) => res.send('API is running'));

app.get('/api/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error('DB error', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// health/readiness endpoints for K8s
app.get('/healthz', (req, res) => res.send('ok'));
app.get('/readyz', (req, res) => res.send('ready'));

(async () => {
  try {
    await ensureDb();
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start app', err);
    process.exit(1);
  }
})();
