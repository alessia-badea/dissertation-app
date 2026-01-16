import React, { createContext, useContext, useState, useEffect } from 'react';
import * as sessionAPI from '../api/sessions';
import { useAuth } from './AuthContext';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [mySessions, setMySessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all sessions when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllSessions();
      if (user?.role === 'professor') {
        fetchMySessions();
      }
    }
  }, [isAuthenticated, user]);

  const fetchAllSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sessionAPI.getAllSessions();
      setSessions(response.sessions || []);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMySessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sessionAPI.getMySessions();
      console.log('Fetched my sessions:', response);
      console.log('Sessions order:', response.sessions?.map(s => ({ id: s.id, startDate: s.startDate })));
      setMySessions(response.sessions || []);
    } catch (err) {
      console.error('Failed to fetch my sessions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createSession = async (sessionData) => {
    try {
      setError(null);
      console.log('Creating session with data:', sessionData);
      const response = await sessionAPI.createSession(sessionData);
      console.log('Session created successfully:', response);
      // Refresh sessions after creation
      await fetchMySessions();
      await fetchAllSessions();
      return { success: true, session: response.session };
    } catch (err) {
      console.error('Error creating session:', err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const updateSession = async (id, sessionData) => {
    try {
      setError(null);
      const response = await sessionAPI.updateSession(id, sessionData);
      // Refresh sessions after update
      await fetchMySessions();
      await fetchAllSessions();
      return { success: true, session: response.session };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const deleteSession = async (id) => {
    try {
      setError(null);
      await sessionAPI.deleteSession(id);
      // Refresh sessions after deletion
      await fetchMySessions();
      await fetchAllSessions();
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const getSessionById = async (id) => {
    try {
      setError(null);
      const response = await sessionAPI.getSessionById(id);
      return { success: true, session: response.session };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const value = {
    sessions,
    mySessions,
    loading,
    error,
    createSession,
    updateSession,
    deleteSession,
    getSessionById,
    refreshSessions: fetchAllSessions,
    refreshMySessions: fetchMySessions,
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

export default SessionContext;
