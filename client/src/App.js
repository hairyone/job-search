import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import api from './api';
import JobList from './components/JobList';
import JobForm from './components/JobForm';
import JobDetails from './components/JobDetails';
import Stats from './components/Stats';
import Header from './components/Header';

function App() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [filters, setFilters] = useState({ status: '', source: '', search: '' });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMobileList, setShowMobileList] = useState(true);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getJobs(filters);
      setJobs(data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, [fetchJobs, fetchStats]);

  const handleAddJob = () => {
    setEditingJob(null);
    setShowForm(true);
    setSelectedJob(null);
    setShowMobileList(false); // Hide list on mobile when opening form
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setShowForm(true);
    setSelectedJob(null);
  };

  const handleSaveJob = async (jobData) => {
    try {
      if (editingJob) {
        await api.updateJob(editingJob.id, jobData);
      } else {
        await api.createJob(jobData);
      }
      setShowForm(false);
      setEditingJob(null);
      fetchJobs();
      fetchStats();
    } catch (error) {
      console.error('Failed to save job:', error);
      alert('Failed to save job. Please try again.');
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      try {
        await api.deleteJob(id);
        setSelectedJob(null);
        fetchJobs();
        fetchStats();
      } catch (error) {
        console.error('Failed to delete job:', error);
        alert('Failed to delete job. Please try again.');
      }
    }
  };

  const handleSelectJob = async (job) => {
    try {
      const detailedJob = await api.getJob(job.id);
      setSelectedJob(detailedJob);
      setShowForm(false);
      setShowMobileList(false); // Hide list on mobile when viewing details
    } catch (error) {
      console.error('Failed to fetch job details:', error);
    }
  };

  const handleBackToList = () => {
    setSelectedJob(null);
    setShowForm(false);
    setShowMobileList(true);
  };

  const handleAddAttachment = async (jobId, attachmentData) => {
    try {
      await api.createAttachment({ ...attachmentData, job_id: jobId });
      const updatedJob = await api.getJob(jobId);
      setSelectedJob(updatedJob);
    } catch (error) {
      console.error('Failed to add attachment:', error);
      alert('Failed to add attachment. Please try again.');
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    try {
      await api.deleteAttachment(attachmentId);
      const updatedJob = await api.getJob(selectedJob.id);
      setSelectedJob(updatedJob);
    } catch (error) {
      console.error('Failed to delete attachment:', error);
      alert('Failed to delete attachment. Please try again.');
    }
  };

  const handleAddContact = async (contactData) => {
    try {
      await api.createContact(selectedJob.id, contactData);
      const updatedJob = await api.getJob(selectedJob.id);
      setSelectedJob(updatedJob);
    } catch (error) {
      console.error('Failed to add contact:', error);
      alert('Failed to add contact. Please try again.');
    }
  };

  const handleUpdateContact = async (contactId, contactData) => {
    try {
      await api.updateContact(contactId, contactData);
      const updatedJob = await api.getJob(selectedJob.id);
      setSelectedJob(updatedJob);
    } catch (error) {
      console.error('Failed to update contact:', error);
      alert('Failed to update contact. Please try again.');
    }
  };

  const handleDeleteContact = async (contactId) => {
    try {
      await api.deleteContact(contactId);
      const updatedJob = await api.getJob(selectedJob.id);
      setSelectedJob(updatedJob);
    } catch (error) {
      console.error('Failed to delete contact:', error);
      alert('Failed to delete contact. Please try again.');
    }
  };

  const handleAddJobNote = async (noteData) => {
    try {
      await api.createJobNote(selectedJob.id, noteData);
      const updatedJob = await api.getJob(selectedJob.id);
      setSelectedJob(updatedJob);
    } catch (error) {
      console.error('Failed to add job note:', error);
      alert('Failed to add job note. Please try again.');
    }
  };

  const handleUpdateJobNote = async (noteId, noteData) => {
    try {
      await api.updateJobNote(noteId, noteData);
      const updatedJob = await api.getJob(selectedJob.id);
      setSelectedJob(updatedJob);
    } catch (error) {
      console.error('Failed to update job note:', error);
      alert('Failed to update job note. Please try again.');
    }
  };

  const handleDeleteJobNote = async (noteId) => {
    try {
      await api.deleteJobNote(noteId);
      const updatedJob = await api.getJob(selectedJob.id);
      setSelectedJob(updatedJob);
    } catch (error) {
      console.error('Failed to delete job note:', error);
      alert('Failed to delete job note. Please try again.');
    }
  };

  return (
    <div className="app">
      <Header onAddJob={handleAddJob} filters={filters} setFilters={setFilters} />
      
      <div className="main-container">
        <aside className={`sidebar ${showMobileList ? 'show-mobile' : 'hide-mobile'}`}>
          {stats && <Stats stats={stats} />}
          <JobList
            jobs={jobs}
            selectedJob={selectedJob}
            onSelectJob={handleSelectJob}
            loading={loading}
          />
        </aside>

        <main className={`content ${!showMobileList ? 'show-mobile' : 'hide-mobile'}`}>
          {(showForm || selectedJob) && (
            <button className="back-button mobile-only" onClick={handleBackToList}>
              ← Back
            </button>
          )}
          {showForm ? (
            <JobForm
              job={editingJob}
              onSave={handleSaveJob}
              onCancel={() => setShowForm(false)}
            />
          ) : selectedJob ? (
            <JobDetails
              job={selectedJob}
              onEdit={() => handleEditJob(selectedJob)}
              onDelete={() => handleDeleteJob(selectedJob.id)}
              onAddAttachment={handleAddAttachment}
              onDeleteAttachment={handleDeleteAttachment}
              onAddContact={handleAddContact}
              onUpdateContact={handleUpdateContact}
              onDeleteContact={handleDeleteContact}
              onAddJobNote={handleAddJobNote}
              onUpdateJobNote={handleUpdateJobNote}
              onDeleteJobNote={handleDeleteJobNote}
            />
          ) : (
            <div className="empty-state">
              <h2>Welcome to Job Application Tracker</h2>
              <p>Select a job from the list or add a new one to get started.</p>
              <button className="btn btn-primary" onClick={handleAddJob}>
                + Add New Job Application
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
