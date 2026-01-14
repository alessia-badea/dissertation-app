import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMyApplications } from '../api/applications';

const ApplicationContext = createContext();

export function useApplications() {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplications must be used within ApplicationProvider');
  }
  return context;
}

export function ApplicationProvider({ children }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch applications on mount
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await getMyApplications();
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      // If error (e.g., not logged in), just set empty array
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const addApplication = (application) => {
    setApplications(prev => [...prev, application]);
  };

  const updateApplication = (id, updates) => {
    setApplications(prev =>
      prev.map(app => (app.id === id ? { ...app, ...updates } : app))
    );
  };

  const removeApplication = (id) => {
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  const hasAppliedTo = (professorId) => {
    return applications.some(app => app.professorId === professorId);
  };

  const value = {
    applications,
    loading,
    addApplication,
    updateApplication,
    removeApplication,
    hasAppliedTo,
    refreshApplications: fetchApplications,
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
}
