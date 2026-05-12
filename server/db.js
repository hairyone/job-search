require('dotenv').config();
const pool = require('./pool');
const { runMigrations } = require('./migrate');

const initialize = async () => {
  let client;
  try {
    // Test connection first
    console.log('Testing database connection...');
    client = await pool.connect();
    console.log('Database connection successful');

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

    await client.query(`
      CREATE TABLE IF NOT EXISTS job_notes (
        id SERIAL PRIMARY KEY,
        job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
        note_date DATE NOT NULL,
        note_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_job_notes_job_id ON job_notes(job_id);
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
  } catch (error) {
    console.error('Database initialization error:', error.message);
    console.error('Error code:', error.code);
    console.error('Error details:', error);
    throw error;
  } finally {
    if (client) {
      client.release();
    }
  }

  // Run migrations after connection is released (avoids pool deadlock with max=1)
  await runMigrations();
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  initialize,
  pool
};