const express = require('express');
const router = express.Router();
const db = require('../db');

// Get attachments for a job
router.get('/job/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const result = await db.query('SELECT * FROM attachments WHERE job_id = $1', [jobId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching attachments:', error);
    res.status(500).json({ error: 'Failed to fetch attachments' });
  }
});

// Add attachment (Google Drive link)
router.post('/', async (req, res) => {
  try {
    const { job_id, file_name, file_type, google_drive_id, google_drive_url } = req.body;

    if (!job_id || !file_name) {
      return res.status(400).json({ error: 'job_id and file_name are required' });
    }

    const result = await db.query(
      `INSERT INTO attachments (job_id, file_name, file_type, google_drive_id, google_drive_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [job_id, file_name, file_type, google_drive_id, google_drive_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating attachment:', error);
    res.status(500).json({ error: 'Failed to create attachment' });
  }
});

// Delete attachment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM attachments WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Attachment not found' });
    }

    res.json({ message: 'Attachment deleted successfully' });
  } catch (error) {
    console.error('Error deleting attachment:', error);
    res.status(500).json({ error: 'Failed to delete attachment' });
  }
});

module.exports = router;
