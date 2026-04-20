-- Migration: Add new job statuses
-- Date: 2026-04-20
-- Description: Add 'No Response' and 'Applications Closed' to status CHECK constraint

-- Drop the existing constraint
ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_status_check;

-- Add the new constraint with additional statuses
ALTER TABLE jobs ADD CONSTRAINT jobs_status_check 
  CHECK (status IN ('Saved', 'Applied', 'Interview Scheduled', 'Interviewed', 'Offer', 'Rejected', 'Declined', 'Accepted', 'No Response', 'Applications Closed'));
