import React, { useState } from 'react';
import './JobForm.css';

function JobForm({ job, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    company: job?.company || '',
    position: job?.position || '',
    source: job?.source || 'Indeed',
    status: job?.status || 'Applied',
    job_url: job?.job_url || '',
    location: job?.location || '',
    salary_range: job?.salary_range || '',
    description: job?.description || '',
    notes: job?.notes || '',
    applied_date: job?.applied_date ? job.applied_date.split('T')[0] : new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="job-form-container">
      <div className="job-form-header">
        <h2>{job ? 'Edit Job Application' : 'New Job Application'}</h2>
      </div>

      <form onSubmit={handleSubmit} className="job-form">
        <div className="form-group-row">
          <div className="form-group">
            <label>Company *</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              placeholder="e.g., Google"
            />
          </div>

          <div className="form-group">
            <label>Position *</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              placeholder="e.g., Software Engineer"
            />
          </div>
        </div>

        <div className="form-group-row">
          <div className="form-group">
            <label>Source *</label>
            <select name="source" value={formData.source} onChange={handleChange} required>
              <option value="Indeed">Indeed</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Status *</label>
            <select name="status" value={formData.status} onChange={handleChange} required>
              <option value="Saved">Saved</option>
              <option value="Applied">Applied</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Interviewed">Interviewed</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
              <option value="Declined">Declined</option>
              <option value="Accepted">Accepted</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Job URL</label>
          <input
            type="url"
            name="job_url"
            value={formData.job_url}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        <div className="form-group-row">
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., San Francisco, CA"
            />
          </div>

          <div className="form-group">
            <label>Salary Range</label>
            <input
              type="text"
              name="salary_range"
              value={formData.salary_range}
              onChange={handleChange}
              placeholder="e.g., $100k - $150k"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Applied Date</label>
          <input
            type="date"
            name="applied_date"
            value={formData.applied_date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Job Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Paste job description here..."
            rows="6"
          />
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional notes..."
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {job ? 'Update' : 'Create'} Application
          </button>
        </div>
      </form>
    </div>
  );
}

export default JobForm;
