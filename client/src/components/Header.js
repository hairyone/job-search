import React from 'react';
import './Header.css';

function Header({ onAddJob, filters, setFilters, statuses = [] }) {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">Job Application Tracker</h1>
        
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search jobs..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="search-input"
            />
          </div>

          <select
            value={filters.source}
            onChange={(e) => setFilters({ ...filters, source: e.target.value })}
            className="filter-select"
          >
            <option value="">All Sources</option>
            <option value="Indeed">Indeed</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <button className="btn btn-primary" onClick={onAddJob}>
            + Add Job
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
