import React from 'react';
import './JobList.css';

function JobList({ jobs, selectedJob, onSelectJob, loading }) {
  const getStatusColor = (status) => {
    const colors = {
      'Saved': '#6c757d',
      'Applied': '#0066cc',
      'Interview Scheduled': '#ffc107',
      'Interviewed': '#ff9800',
      'Offer': '#28a745',
      'Rejected': '#dc3545',
      'Declined': '#6c757d',
      'Accepted': '#28a745'
    };
    return colors[status] || '#6c757d';
  };

  const getSourceIcon = (source) => {
    if (source === 'Indeed') return '🔍';
    if (source === 'LinkedIn') return '💼';
    return '📄';
  };

  if (loading) {
    return (
      <div className="job-list">
        <div className="job-list-header">
          <h3>Applications</h3>
        </div>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="job-list">
      <div className="job-list-header">
        <h3>Applications ({jobs.length})</h3>
      </div>
      
      <div className="job-list-items">
        {jobs.length === 0 ? (
          <div className="no-jobs">
            <p>No applications found</p>
            <p className="hint">Try adjusting your filters or add a new job</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className={`job-item ${selectedJob?.id === job.id ? 'active' : ''}`}
              onClick={() => onSelectJob(job)}
            >
              <div className="job-item-header">
                <h4 className="job-company">
                  <span className="source-icon">{getSourceIcon(job.source)}</span>
                  {job.company}
                </h4>
                <span
                  className="job-status-badge"
                  style={{ background: getStatusColor(job.status) }}
                >
                  {job.status}
                </span>
              </div>
              
              <div className="job-position">{job.position}</div>
              
              {job.location && (
                <div className="job-location">📍 {job.location}</div>
              )}
              
              {job.applied_date && (
                <div className="job-date">
                  Applied: {new Date(job.applied_date).toLocaleDateString()}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default JobList;
