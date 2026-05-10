require('dotenv').config();
const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set.');
  process.exit(1);
}

console.log('DATABASE_URL is set (length: ' + process.env.DATABASE_URL.length + ')');

// Determine if we should use SSL based on the database host
const databaseUrl = process.env.DATABASE_URL;
const isLocalDatabase = databaseUrl.includes('localhost') || 
                        databaseUrl.includes('127.0.0.1') || 
                        databaseUrl.includes('@postgres:') ||
                        databaseUrl.includes('@db:');

// Single shared pool instance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Only use SSL for remote databases (not localhost or Docker containers)
  ssl: isLocalDatabase ? false : { rejectUnauthorized: false },
  // Vercel serverless: minimal connections
  max: 1,
  min: 0,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,  // Increased from 5000
  statement_timeout: 30000,
  query_timeout: 30000,
});

// Error handling
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

pool.on('connect', () => {
  console.log('New database connection established');
});

pool.on('remove', () => {
  console.log('Database connection removed');
});

// Test connection on startup
pool.query('SELECT NOW()', (err, result) => {
  if (err) {
    console.error('Failed to connect to database on startup:', err.message);
  } else {
    console.log('Database connection test successful');
  }
});

module.exports = pool;
