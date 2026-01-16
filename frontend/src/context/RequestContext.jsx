import React, { createContext, useContext, useState, useEffect } from 'react';
import * as requestAPI from '../api/requests';
import { useAuth } from './AuthContext';

const RequestContext = createContext(null);

export function RequestProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch requests when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchMyRequests();
    }
  }, [isAuthenticated]);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching my requests...');
      const response = await requestAPI.getMyRequests();
      console.log('✅ Requests fetched:', response);
      setRequests(response.requests || []);
    } catch (err) {
      console.error('❌ Failed to fetch requests:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (requestData) => {
    try {
      setError(null);
      const response = await requestAPI.createRequest(requestData);
      // Refresh requests after creation
      await fetchMyRequests();
      return { success: true, request: response.request };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const updateRequestStatus = async (id, status, reason = null) => {
    try {
      setError(null);
      const response = await requestAPI.updateRequestStatus(id, status, reason);
      // Refresh requests after update
      await fetchMyRequests();
      return { success: true, request: response.request };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const uploadStudentFile = async (id, file) => {
    try {
      setError(null);
      const response = await requestAPI.uploadStudentFile(id, file);
      // Refresh requests after upload
      await fetchMyRequests();
      return { success: true, request: response.request };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const uploadProfessorFile = async (id, file) => {
    try {
      setError(null);
      const response = await requestAPI.uploadProfessorFile(id, file);
      // Refresh requests after upload
      await fetchMyRequests();
      return { success: true, request: response.request };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const downloadFile = async (id, type) => {
    try {
      setError(null);
      const blob = await requestAPI.downloadFile(id, type);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-file-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const deleteRequest = async (id) => {
    try {
      setError(null);
      await requestAPI.deleteRequest(id);
      // Refresh requests after deletion
      await fetchMyRequests();
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const getRequestById = async (id) => {
    try {
      setError(null);
      const response = await requestAPI.getRequestById(id);
      return { success: true, request: response.request };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const value = {
    requests,
    loading,
    error,
    createRequest,
    updateRequestStatus,
    uploadStudentFile,
    uploadProfessorFile,
    downloadFile,
    deleteRequest,
    getRequestById,
    refreshRequests: fetchMyRequests,
  };

  return <RequestContext.Provider value={value}>{children}</RequestContext.Provider>;
}

export function useRequest() {
  const context = useContext(RequestContext);
  if (!context) {
    throw new Error('useRequest must be used within a RequestProvider');
  }
  return context;
}

export default RequestContext;
