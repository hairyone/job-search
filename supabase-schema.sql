-- Supabase Database Setup Script
-- Copy and paste this entire file into Supabase SQL Editor

-- Step 1: Create the jobs table
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT jobs_source_check CHECK (source IN ('Indeed', 'LinkedIn', 'Other')),
  CONSTRAINT jobs_status_check CHECK (status IN ('Saved', 'Applied', 'Interview Scheduled', 'Interviewed', 'Offer', 'Rejected', 'Declined', 'Accepted', 'No Response', 'Applications Closed'))
);

-- Step 2: Create the attachments table
CREATE TABLE IF NOT EXISTS attachments (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  google_drive_id VARCHAR(255),
  google_drive_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 3: Create the contacts table
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

-- Step 4: Create the migrations tracking table
CREATE TABLE IF NOT EXISTS migrations (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL UNIQUE,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 5: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_source ON jobs(source);
CREATE INDEX IF NOT EXISTS idx_attachments_job_id ON attachments(job_id);
CREATE INDEX IF NOT EXISTS idx_contacts_job_id ON contacts(job_id);

-- Step 6: Record that migrations have been run (prevents re-running)
INSERT INTO migrations (filename, executed_at) 
VALUES ('001_add_new_statuses.sql', NOW())
ON CONFLICT (filename) DO NOTHING;

-- Done! Your database schema is ready.
-- Now you can import your data from Railway.
