require('dotenv').config();
const { Pool } = require('pg');
const { runMigrations } = require('./migrate');

if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set.');
  console.error('Set DATABASE_URL to the connection string for your PostgreSQL database.');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const initialize = async () => {
  const client = await pool.connect();
  try {
    // Create tables (without strict constraints that might need updates)
    await client.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        company VARCHAR(255) NOT NULL,
        position VARCHAR(255) NOT NULL,
        source VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Applied',
        job_url TEXT,
        location VARCHAR(255),
        salary_range VARCHAR(100),
        description TEXT,
        notes TEXT,
        applied_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add constraints if table is newly created
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'jobs_source_check'
        ) THEN
          ALTER TABLE jobs ADD CONSTRAINT jobs_source_check 
            CHECK (source IN ('Indeed', 'LinkedIn', 'Other'));
        END IF;
      END $$;
    `);

    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'jobs_status_check'
        ) THEN
          ALTER TABLE jobs ADD CONSTRAINT jobs_status_check 
            CHECK (status IN ('Saved', 'Applied', 'Interview Scheduled', 'Interviewed', 'Offer', 'Rejected', 'Declined', 'Accepted', 'No Response', 'Applications Closed'));
        END IF;
      END $$;
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS attachments (
        id SERIAL PRIMARY KEY,
        job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
        file_name VARCHAR(255) NOT NULL,
        file_type VARCHAR(50),
        google_drive_id VARCHAR(255),
        google_drive_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(50),
        position VARCHAR(255),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create index for better query performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_jobs_source ON jobs(source);
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_attachments_job_id ON attachments(job_id);
    `);

    console.log('Database initialized successfully');
    
    // Run migrations after initial setup
    await runMigrations();
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  initialize,
  pool
};
