import React, { useState } from 'react';
import './JobDetails.css';

function JobDetails({ job, onEdit, onDelete, onAddAttachment, onDeleteAttachment, onAddContact, onUpdateContact, onDeleteContact }) {
  const [showAttachmentForm, setShowAttachmentForm] = useState(false);
  const [attachmentData, setAttachmentData] = useState({
    file_name: '',
    google_drive_url: '',
    file_type: ''
  });
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    notes: ''
  });

  const getStatusColor = (status) => {
    const colors = {
      'Saved': '#6c757d',
      'Applied': '#0066cc',
      'Interview Scheduled': '#ffc107',
      'Interviewed': '#ff9800',
      'Offer': '#28a745',
      'No Response': '#17a2b8',
      'Applications Closed': '#6c757d',
      'Rejected': '#dc3545',
      'Declined': '#6c757d',
      'Accepted': '#28a745'
    };
    return colors[status] || '#6c757d';
  };

  const handleAddAttachment = (e) => {
    e.preventDefault();
    if (attachmentData.file_name && attachmentData.google_drive_url) {
      onAddAttachment(job.id, attachmentData);
      setAttachmentData({ file_name: '', google_drive_url: '', file_type: '' });
      setShowAttachmentForm(false);
    }
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    if (contactData.name) {
      if (editingContact) {
        onUpdateContact(editingContact.id, contactData);
      } else {
        onAddContact(contactData);
      }
      setContactData({ name: '', email: '', phone: '', position: '', notes: '' });
      setShowContactForm(false);
      setEditingContact(null);
    }
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setContactData({
      name: contact.name,
      email: contact.email || '',
      phone: contact.phone || '',
      position: contact.position || '',
      notes: contact.notes || ''
    });
    setShowContactForm(true);
  };

  const handleCancelContact = () => {
    setContactData({ name: '', email: '', phone: '', position: '', notes: '' });
    setShowContactForm(false);
    setEditingContact(null);
  };

  return (
    <div className="job-details-container">
      <div className="job-details-header">
        <div>
          <h1 className="job-details-title">{job.position}</h1>
          <h2 className="job-details-company">{job.company}</h2>
        </div>
        <div className="job-details-actions">
          <button className="btn btn-secondary btn-small" onClick={onEdit}>
            ✏️ Edit
          </button>
          <button className="btn btn-danger btn-small" onClick={onDelete}>
            🗑️ Delete
          </button>
        </div>
      </div>

      <div className="job-details-content">
        <div className="detail-card">
          <div className="detail-row">
            <span className="detail-label">Status:</span>
            <span
              className="detail-status"
              style={{ background: getStatusColor(job.status), color: 'white' }}
            >
              {job.status}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Source:</span>
            <span className="detail-value">{job.source}</span>
          </div>

          {job.location && (
            <div className="detail-row">
              <span className="detail-label">Location:</span>
              <span className="detail-value">📍 {job.location}</span>
            </div>
          )}

          {job.salary_range && (
            <div className="detail-row">
              <span className="detail-label">Salary Range:</span>
              <span className="detail-value">💰 {job.salary_range}</span>
            </div>
          )}

          {job.applied_date && (
            <div className="detail-row">
              <span className="detail-label">Applied Date:</span>
              <span className="detail-value">
                {new Date(job.applied_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          )}

          {job.job_url && (
            <div className="detail-row">
              <span className="detail-label">Job URL:</span>
              <a href={job.job_url} target="_blank" rel="noopener noreferrer" className="detail-link">
                View Job Posting 🔗
              </a>
            </div>
          )}
        </div>

        {job.description && (
          <div className="detail-card">
            <h3 className="section-title">Job Description</h3>
            <div className="detail-text">{job.description}</div>
          </div>
        )}

        {job.notes && (
          <div className="detail-card">
            <h3 className="section-title">Notes</h3>
            <div className="detail-text">{job.notes}</div>
          </div>
        )}

        <div className="detail-card">
          <div className="section-header">
            <h3 className="section-title">Attachments ({job.attachments?.length || 0})</h3>
            <button
              className="btn btn-primary btn-small"
              onClick={() => setShowAttachmentForm(!showAttachmentForm)}
            >
              {showAttachmentForm ? '✕ Cancel' : '+ Add Attachment'}
            </button>
          </div>

          {showAttachmentForm && (
            <form onSubmit={handleAddAttachment} className="attachment-form">
              <div className="form-group">
                <label>File Name *</label>
                <input
                  type="text"
                  value={attachmentData.file_name}
                  onChange={(e) => setAttachmentData({ ...attachmentData, file_name: e.target.value })}
                  placeholder="e.g., Resume.pdf"
                  required
                />
              </div>
              <div className="form-group">
                <label>Google Drive URL *</label>
                <input
                  type="url"
                  value={attachmentData.google_drive_url}
                  onChange={(e) => setAttachmentData({ ...attachmentData, google_drive_url: e.target.value })}
                  placeholder="https://drive.google.com/..."
                  required
                />
              </div>
              <div className="form-group">
                <label>File Type</label>
                <input
                  type="text"
                  value={attachmentData.file_type}
                  onChange={(e) => setAttachmentData({ ...attachmentData, file_type: e.target.value })}
                  placeholder="e.g., PDF, DOCX"
                />
              </div>
              <button type="submit" className="btn btn-success">Save Attachment</button>
            </form>
          )}

          <div className="attachments-list">
            {job.attachments && job.attachments.length > 0 ? (
              job.attachments.map((attachment) => (
                <div key={attachment.id} className="attachment-item">
                  <div className="attachment-info">
                    <span className="attachment-icon">📎</span>
                    <div>
                      <div className="attachment-name">{attachment.file_name}</div>
                      {attachment.file_type && (
                        <div className="attachment-type">{attachment.file_type}</div>
                      )}
                    </div>
                  </div>
                  <div className="attachment-actions">
                    {attachment.google_drive_url && (
                      <a
                        href={attachment.google_drive_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-link"
                      >
                        Open
                      </a>
                    )}
                    <button
                      className="btn-link danger"
                      onClick={() => onDeleteAttachment(attachment.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-attachments">
                No attachments yet. Add links to your resume, cover letter, or other documents from Google Drive.
              </div>
            )}
          </div>
        </div>

        <div className="detail-card">
          <div className="section-header">
            <h3 className="section-title">Contacts ({job.contacts?.length || 0})</h3>
            <button
              className="btn btn-primary btn-small"
              onClick={() => setShowContactForm(!showContactForm)}
            >
              {showContactForm ? '✕ Cancel' : '+ Add Contact'}
            </button>
          </div>

          {showContactForm && (
            <form onSubmit={handleAddContact} className="attachment-form">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={contactData.name}
                  onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                  placeholder="e.g., John Smith"
                  required
                />
              </div>
              <div className="form-group">
                <label>Position</label>
                <input
                  type="text"
                  value={contactData.position}
                  onChange={(e) => setContactData({ ...contactData, position: e.target.value })}
                  placeholder="e.g., HR Manager"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                  placeholder="e.g., john@company.com"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  value={contactData.phone}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                  placeholder="e.g., (555) 123-4567"
                />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={contactData.notes}
                  onChange={(e) => setContactData({ ...contactData, notes: e.target.value })}
                  placeholder="Add any notes about this contact..."
                  rows={2}
                />
              </div>
              <button type="submit" className="btn btn-success">
                {editingContact ? 'Update Contact' : 'Save Contact'}
              </button>
            </form>
          )}

          <div className="attachments-list">
            {job.contacts && job.contacts.length > 0 ? (
              job.contacts.map((contact) => (
                <div key={contact.id} className="attachment-item">
                  <div className="attachment-info">
                    <span className="attachment-icon">👤</span>
                    <div>
                      <div className="attachment-name">{contact.name}</div>
                      {contact.position && (
                        <div className="attachment-type">{contact.position}</div>
                      )}
                      {contact.email && (
                        <div className="contact-email">{contact.email}</div>
                      )}
                      {contact.phone && (
                        <div className="contact-phone">{contact.phone}</div>
                      )}
                      {contact.notes && (
                        <div className="contact-notes">{contact.notes}</div>
                      )}
                    </div>
                  </div>
                  <div className="attachment-actions">
                    <button
                      className="btn-link"
                      onClick={() => handleEditContact(contact)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-link danger"
                      onClick={() => onDeleteContact(contact.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-attachments">
                No contacts yet. Add people you've met at this company.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
