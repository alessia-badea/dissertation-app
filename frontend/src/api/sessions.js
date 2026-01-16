// API service for session management
const API_BASE_URL = '/api';

/**
 * Create a new session (professors only)
 * @param {Object} sessionData - Session data
 * @param {string} sessionData.title - Session title
 * @param {string} sessionData.startDate - Start date (ISO string)
 * @param {string} sessionData.endDate - End date (ISO string)
 * @param {number} sessionData.maxStudents - Maximum students (1-50)
 * @returns {Promise<Object>} Response with created session
 */
export async function createSession(sessionData) {
  const response = await fetch(`${API_BASE_URL}/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(sessionData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create session');
  }

  return data;
}

/**
 * Get all active/future sessions
 * @returns {Promise<Object>} Response with sessions array
 */
export async function getAllSessions() {
  const response = await fetch(`${API_BASE_URL}/sessions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch sessions');
  }

  return data;
}

/**
 * Get sessions created by the logged-in professor
 * @returns {Promise<Object>} Response with professor's sessions
 */
export async function getMySessions() {
  const response = await fetch(`${API_BASE_URL}/sessions/my`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch your sessions');
  }

  return data;
}

/**
 * Get details of a specific session
 * @param {number} id - Session ID
 * @returns {Promise<Object>} Response with session details
 */
export async function getSessionById(id) {
  const response = await fetch(`${API_BASE_URL}/sessions/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch session');
  }

  return data;
}

/**
 * Update a session (professors only)
 * @param {number} id - Session ID
 * @param {Object} sessionData - Updated session data
 * @returns {Promise<Object>} Response with updated session
 */
export async function updateSession(id, sessionData) {
  const response = await fetch(`${API_BASE_URL}/sessions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(sessionData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update session');
  }

  return data;
}

/**
 * Delete a session (professors only)
 * @param {number} id - Session ID
 * @returns {Promise<Object>} Response confirming deletion
 */
export async function deleteSession(id) {
  const response = await fetch(`${API_BASE_URL}/sessions/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete session');
  }

  return data;
}
