// API service for request management
const API_BASE_URL = '/api';

/**
 * Create a new request (students only)
 * @param {Object} requestData - Request data
 * @param {number} requestData.sessionId - Session ID
 * @param {number} requestData.professorId - Professor ID
 * @returns {Promise<Object>} Response with created request
 */
export async function createRequest(requestData) {
  const response = await fetch(`${API_BASE_URL}/requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(requestData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create request');
  }

  return data;
}

/**
 * Get all requests for the logged-in user
 * @returns {Promise<Object>} Response with requests array
 */
export async function getMyRequests() {
  const response = await fetch(`${API_BASE_URL}/requests`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch requests');
  }

  return data;
}

/**
 * Get details of a specific request
 * @param {number} id - Request ID
 * @returns {Promise<Object>} Response with request details
 */
export async function getRequestById(id) {
  const response = await fetch(`${API_BASE_URL}/requests/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch request');
  }

  return data;
}

/**
 * Update request status (professors only)
 * @param {number} id - Request ID
 * @param {string} status - New status ('approved' or 'rejected')
 * @param {string} reason - Optional reason for rejection
 * @returns {Promise<Object>} Response with updated request
 */
export async function updateRequestStatus(id, status, reason = null) {
  const response = await fetch(`${API_BASE_URL}/requests/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ status, reason }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update request status');
  }

  return data;
}

/**
 * Upload student file (students only)
 * @param {number} id - Request ID
 * @param {File} file - File to upload (PDF/DOC/DOCX, max 10MB)
 * @returns {Promise<Object>} Response with updated request
 */
export async function uploadStudentFile(id, file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/requests/${id}/upload/student`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to upload file');
  }

  return data;
}

/**
 * Upload professor file (professors only)
 * @param {number} id - Request ID
 * @param {File} file - File to upload (PDF/DOC/DOCX, max 10MB)
 * @returns {Promise<Object>} Response with updated request
 */
export async function uploadProfessorFile(id, file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/requests/${id}/upload/professor`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to upload file');
  }

  return data;
}

/**
 * Download file
 * @param {number} id - Request ID
 * @param {string} type - File type ('student' or 'professor')
 * @returns {Promise<Blob>} File blob
 */
export async function downloadFile(id, type) {
  const response = await fetch(`${API_BASE_URL}/requests/${id}/download/${type}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to download file');
  }

  return response.blob();
}

/**
 * Delete a request (students only, pending only)
 * @param {number} id - Request ID
 * @returns {Promise<Object>} Response confirming deletion
 */
export async function deleteRequest(id) {
  const response = await fetch(`${API_BASE_URL}/requests/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete request');
  }

  return data;
}
