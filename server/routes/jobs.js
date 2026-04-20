const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all jobs with optional filtering
router.get('/', async (req, res) => {
  try {
    const { status, source, search } = req.query;
    let query = 'SELECT * FROM jobs WHERE 1=1';
    const params = [];
    let paramCount = 1;

    if (status) {
      query += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (source) {
      query += ` AND source = $${paramCount}`;
      params.push(source);
      paramCount++;
    }

    if (search) {
      query += ` AND (company ILIKE $${paramCount} OR position ILIKE $${paramCount} OR location ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Get single job with attachments and contacts
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const jobResult = await db.query('SELECT * FROM jobs WHERE id = $1', [id]);
    if (jobResult.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const attachmentsResult = await db.query('SELECT * FROM attachments WHERE job_id = $1', [id]);
    const contactsResult = await db.query('SELECT * FROM contacts WHERE job_id = $1', [id]);

    res.json({
      ...jobResult.rows[0],
      attachments: attachmentsResult.rows,
      contacts: contactsResult.rows
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// Create new job
router.post('/', async (req, res) => {
  try {
    const {
      company,
      position,
      source,
      status,
      job_url,
      location,
      salary_range,
      description,
      notes,
      applied_date
    } = req.body;

    if (!company || !position || !source) {
      return res.status(400).json({ error: 'Company, position, and source are required' });
    }

    const result = await db.query(
      `INSERT INTO jobs (company, position, source, status, job_url, location, salary_range, description, notes, applied_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [company, position, source, status || 'Applied', job_url, location, salary_range, description, notes, applied_date]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// Update job
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      company,
      position,
      source,
      status,
      job_url,
      location,
      salary_range,
      description,
      notes,
      applied_date
    } = req.body;

    const result = await db.query(
      `UPDATE jobs 
       SET company = $1, position = $2, source = $3, status = $4, job_url = $5, 
           location = $6, salary_range = $7, description = $8, notes = $9, 
           applied_date = $10, updated_at = CURRENT_TIMESTAMP
       WHERE id = $11
       RETURNING *`,
      [company, position, source, status, job_url, location, salary_range, description, notes, applied_date, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// Delete job
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM jobs WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

// Get job statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'Applied' THEN 1 END) as applied,
        COUNT(CASE WHEN status = 'Interview Scheduled' THEN 1 END) as interview_scheduled,
        COUNT(CASE WHEN status = 'Interviewed' THEN 1 END) as interviewed,
        COUNT(CASE WHEN status = 'Offer' THEN 1 END) as offers,
        COUNT(CASE WHEN status = 'Rejected' THEN 1 END) as rejected,
        COUNT(CASE WHEN source = 'Indeed' THEN 1 END) as indeed_count,
        COUNT(CASE WHEN source = 'LinkedIn' THEN 1 END) as linkedin_count
      FROM jobs
    `);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
