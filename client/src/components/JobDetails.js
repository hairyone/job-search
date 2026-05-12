import React, { useState } from 'react';
import './JobDetails.css';

function JobDetails({ job, onEdit, onDelete, onAddAttachment, onDeleteAttachment, onAddContact, onUpdateContact, onDeleteContact, onAddJobNote, onUpdateJobNote, onDeleteJobNote }) {
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
  const [showJobNoteForm, setShowJobNoteForm] = useState(false);
  const [editingJobNote, setEditingJobNote] = useState(null);
  const [jobNoteData, setJobNoteData] = useState({
    note_date: new Date().toISOString().split('T')[0],
    note_text: ''
  });
  const [collapsed, setCollapsed] = useState({});

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

  const handleAddJobNote = (e) => {
    e.preventDefault();
    if (jobNoteData.note_date && jobNoteData.note_text) {
      if (editingJobNote) {
        onUpdateJobNote(editingJobNote.id, jobNoteData);
      } else {
        onAddJobNote(jobNoteData);
      }
      setJobNoteData({ note_date: new Date().toISOString().split('T')[0], note_text: '' });
      setShowJobNoteForm(false);
      setEditingJobNote(null);
    }
  };

  const handleEditJobNote = (note) => {
    setEditingJobNote(note);
    setJobNoteData({
      note_date: note.note_date,
      note_text: note.note_text
    });
    setShowJobNoteForm(true);
  };

  const handleCancelJobNote = () => {
    setJobNoteData({ note_date: new Date().toISOString().split('T')[0], note_text: '' });
    setShowJobNoteForm(false);
    setEditingJobNote(null);
  };

  const toggleSection = (section) => {
    setCollapsed(prev => ({ ...prev, [section]: !prev[section] }));
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
          <div className="detail-card collapsible">
            <div className="collapsible-header" onClick={() => toggleSection('description')}>
              <h3 className="section-title">Job Description</h3>
              <span className="collapse-icon">{collapsed.description ? '▼' : '▲'}</span>
            </div>
            {!collapsed.description && <div className="detail-text">{job.description}</div>}
          </div>
        )}

        <div className="detail-card collapsible">
          <div className="section-header collapsible-header" onClick={() => toggleSection('notes')}>
            <h3 className="section-title">Dated Notes ({job.job_notes?.length || 0})</h3>
            <div className="header-right">
              <button
                className="btn btn-primary btn-small"
                onClick={(e) => { e.stopPropagation(); setShowJobNoteForm(!showJobNoteForm); }}
              >
                {showJobNoteForm ? '✕ Cancel' : '+ Add Note'}
              </button>
              <span className="collapse-icon">{collapsed.notes ? '▼' : '▲'}</span>
            </div>
          </div>

          {showJobNoteForm && (
            <form onSubmit={handleAddJobNote} className="attachment-form">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={jobNoteData.note_date}
                  onChange={(e) => setJobNoteData({ ...jobNoteData, note_date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Note *</label>
                <textarea
                  value={jobNoteData.note_text}
                  onChange={(e) => setJobNoteData({ ...jobNoteData, note_text: e.target.value })}
                  placeholder="Add your note..."
                  rows={3}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">
                {editingJobNote ? 'Update Note' : 'Save Note'}
              </button>
            </form>
          )}

          {!collapsed.notes && (
            <div className="job-notes-list">
              {job.job_notes && job.job_notes.length > 0 ? (
                job.job_notes.map((note) => (
                  <div key={note.id} className="job-note-item">
                    <div className="job-note-header">
                      <span className="job-note-date">
                        {new Date(note.note_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                      <div className="job-note-actions">
                        <button
                          className="btn-link"
                          onClick={() => handleEditJobNote(note)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-link danger"
                          onClick={() => onDeleteJobNote(note.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="job-note-text">{note.note_text}</div>
                  </div>
                ))
              ) : (
                <div className="no-attachments">
                  No dated notes yet. Add notes with dates to track your job search progress.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="detail-card collapsible">
          <div className="section-header collapsible-header" onClick={() => toggleSection('attachments')}>
            <h3 className="section-title">Attachments ({job.attachments?.length || 0})</h3>
            <div className="header-right">
              <button
                className="btn btn-primary btn-small"
                onClick={(e) => { e.stopPropagation(); setShowAttachmentForm(!showAttachmentForm); }}
              >
                {showAttachmentForm ? '✕ Cancel' : '+ Add Attachment'}
              </button>
              <span className="collapse-icon">{collapsed.attachments ? '▼' : '▲'}</span>
            </div>
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

          {!collapsed.attachments && (
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
          )}
        </div>

        <div className="detail-card collapsible">
          <div className="section-header collapsible-header" onClick={() => toggleSection('contacts')}>
            <h3 className="section-title">Contacts ({job.contacts?.length || 0})</h3>
            <div className="header-right">
              <button
                className="btn btn-primary btn-small"
                onClick={(e) => { e.stopPropagation(); setShowContactForm(!showContactForm); }}
              >
                {showContactForm ? '✕ Cancel' : '+ Add Contact'}
              </button>
              <span className="collapse-icon">{collapsed.contacts ? '▼' : '▲'}</span>
            </div>
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

          {!collapsed.contacts && (
            <div className="attachments-list">
              {job.contacts && job.contacts.length > 0 ? (
                job.contacts.map((contact) => (
                  <div key={contact.id} className="attachment-item contact-item">
                    <div className="attachment-info">
                      <span className="attachment-icon">👤</span>
                      <div className="contact-details">
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
                        <div className="contact-actions">
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
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-attachments">
                  No contacts yet. Add people you've met at this company.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
