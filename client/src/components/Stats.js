import React from 'react';
import './Stats.css';

function Stats({ stats }) {
  const responseRate = stats.total > 0 
    ? Math.round(((parseInt(stats.interview_scheduled) + parseInt(stats.interviewed) + parseInt(stats.offers)) / parseInt(stats.total)) * 100)
    : 0;

  return (
    <div className="stats">
      <h3 className="stats-title">Overview</h3>
      
      <div className="stat-grid">
        <div className="stat-item">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Applications</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-value">{stats.applied}</div>
          <div className="stat-label">Applied</div>
        </div>
        
        <div className="stat-item stat-highlight">
          <div className="stat-value">{stats.interview_scheduled}</div>
          <div className="stat-label">Interviews Scheduled</div>
        </div>
        
        <div className="stat-item stat-success">
          <div className="stat-value">{stats.offers}</div>
          <div className="stat-label">Offers</div>
        </div>
      </div>

      <div className="stat-divider"></div>

      <div className="stat-detail">
        <span>Response Rate:</span>
        <strong>{responseRate}%</strong>
      </div>

      <div className="stat-sources">
        <div className="source-item">
          <span className="source-badge indeed">Indeed</span>
          <span>{stats.indeed_count}</span>
        </div>
        <div className="source-item">
          <span className="source-badge linkedin">LinkedIn</span>
          <span>{stats.linkedin_count}</span>
        </div>
      </div>
    </div>
  );
}

export default Stats;
