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

    query += ' ORDER BY applied_date DESC NULLS LAST, created_at DESC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Get single job with attachments, contacts, and job_notes
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const jobResult = await db.query('SELECT * FROM jobs WHERE id = $1', [id]);
    if (jobResult.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const attachmentsResult = await db.query('SELECT * FROM attachments WHERE job_id = $1', [id]);
    const contactsResult = await db.query('SELECT * FROM contacts WHERE job_id = $1', [id]);
    const jobNotesResult = await db.query('SELECT * FROM job_notes WHERE job_id = $1 ORDER BY note_date DESC', [id]);

    res.json({
      ...jobResult.rows[0],
      attachments: attachmentsResult.rows,
      contacts: contactsResult.rows,
      job_notes: jobNotesResult.rows
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
      applied_date
    } = req.body;

    if (!company || !position || !source) {
      return res.status(400).json({ error: 'Company, position, and source are required' });
    }

    const result = await db.query(
      `INSERT INTO jobs (company, position, source, status, job_url, location, salary_range, description, applied_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [company, position, source, status || 'Applied', job_url, location, salary_range, description, applied_date]
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
      applied_date
    } = req.body;

    const result = await db.query(
      `UPDATE jobs
       SET company = $1, position = $2, source = $3, status = $4, job_url = $5,
           location = $6, salary_range = $7, description = $8,
           applied_date = $9, updated_at = CURRENT_TIMESTAMP
       WHERE id = $10
       RETURNING *`,
      [company, position, source, status, job_url, location, salary_range, description, applied_date, id]
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

// Create contact
router.post('/:jobId/contacts', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { name, email, phone, position, notes } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Contact name is required' });
    }

    const result = await db.query(
      `INSERT INTO contacts (job_id, name, email, phone, position, notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [jobId, name, email, phone, position, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

// Update contact
router.put('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, position, notes } = req.body;

    const result = await db.query(
      `UPDATE contacts
       SET name = $1, email = $2, phone = $3, position = $4, notes = $5
       WHERE id = $6
       RETURNING *`,
      [name, email, phone, position, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// Delete contact
router.delete('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM contacts WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

// Create job note
router.post('/:jobId/job_notes', async (req, res) => {
  try {
    const { jobId } = req.params;
    const { note_date, note_text } = req.body;

    if (!note_date || !note_text) {
      return res.status(400).json({ error: 'Note date and text are required' });
    }

    const result = await db.query(
      `INSERT INTO job_notes (job_id, note_date, note_text)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [jobId, note_date, note_text]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating job note:', error);
    res.status(500).json({ error: 'Failed to create job note' });
  }
});

// Update job note
router.put('/job_notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { note_date, note_text } = req.body;

    const result = await db.query(
      `UPDATE job_notes
       SET note_date = $1, note_text = $2
       WHERE id = $3
       RETURNING *`,
      [note_date, note_text, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job note not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating job note:', error);
    res.status(500).json({ error: 'Failed to update job note' });
  }
});

// Delete job note
router.delete('/job_notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM job_notes WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job note not found' });
    }

    res.json({ message: 'Job note deleted successfully' });
  } catch (error) {
    console.error('Error deleting job note:', error);
    res.status(500).json({ error: 'Failed to delete job note' });
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
