// API service for applications
const API_BASE_URL = '/api';

/**
 * Create a new application
 * @param {number} professorId - Professor's user ID
 * @param {string} thesisTitle - Thesis title
 * @param {string} thesisDescription - Thesis description
 * @returns {Promise<Object>} Response with application data
 */
export async function createApplication(professorId, thesisTitle, thesisDescription) {
  const response = await fetch(`${API_BASE_URL}/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ professorId, thesisTitle, thesisDescription }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create application');
  }

  return data;
}

/**
 * Get all applications for the logged-in user
 * @returns {Promise<Object>} Response with applications array
 */
export async function getMyApplications() {
  const response = await fetch(`${API_BASE_URL}/applications`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch applications');
  }

  return data;
}

/**
 * Get a specific application by ID
 * @param {number} id - Application ID
 * @returns {Promise<Object>} Response with application data
 */
export async function getApplicationById(id) {
  const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch application');
  }

  return data;
}

/**
 * Update application status (professor only)
 * @param {number} id - Application ID
 * @param {string} status - New status
 * @param {string} rejectionMessage - Optional rejection message
 * @returns {Promise<Object>} Response with updated application
 */
export async function updateApplicationStatus(id, status, rejectionMessage = null) {
  const response = await fetch(`${API_BASE_URL}/applications/${id}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ status, rejectionMessage }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update application');
  }

  return data;
}

/**
 * Delete an application (student only, pending only)
 * @param {number} id - Application ID
 * @returns {Promise<Object>} Response confirming deletion
 */
export async function deleteApplication(id) {
  const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to delete application');
  }

  return data;
}
