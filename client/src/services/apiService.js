// API Service for Resource Server
const RESOURCE_SERVER_URL = 'http://localhost:9090/api';

// Helper function to get headers with JWT token
const getHeaders = (token) => ({
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
});

// Handle API errors
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// ==================== USER APIs ====================

export const userAPI = {
  // Get all users
  getAllUsers: async (token) => {
    const response = await fetch(`${RESOURCE_SERVER_URL}/users`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  // Get user by ID
  getUserById: async (token, userId) => {
    const response = await fetch(`${RESOURCE_SERVER_URL}/users/${userId}`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  // Get user by username
  getUserByUsername: async (token, username) => {
    const response = await fetch(`${RESOURCE_SERVER_URL}/users/username/${username}`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  // Create user
  createUser: async (token, userData) => {
    const response = await fetch(`${RESOURCE_SERVER_URL}/users`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Update user
  updateUser: async (token, userId, userData) => {
    const response = await fetch(`${RESOURCE_SERVER_URL}/users/${userId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Delete user
  deleteUser: async (token, userId) => {
    const response = await fetch(`${RESOURCE_SERVER_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  // Add user to company
  addUserToCompany: async (token, userId, companyId) => {
    const response = await fetch(`${RESOURCE_SERVER_URL}/users/${userId}/companies/${companyId}`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  // Remove user from company
  removeUserFromCompany: async (token, userId, companyId) => {
    const response = await fetch(`${RESOURCE_SERVER_URL}/users/${userId}/companies/${companyId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  // Get users by company
  getUsersByCompany: async (token, companyId) => {
    const response = await fetch(`${RESOURCE_SERVER_URL}/users/company/${companyId}`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  // Sync current user
  syncCurrentUser: async (token) => {
    const response = await fetch(`${RESOURCE_SERVER_URL}/users/sync`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  // Get current user info
  getCurrentUserInfo: async (token) => {
    const response = await fetch(`${RESOURCE_SERVER_URL}/users/me`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },
};

// ==================== COMPANY APIs ====================

export const companyAPI = {
  // Get all companies
  getAllCompanies: async (token) => {
    const response = await fetch(`${RESOURCE_SERVER_URL}/companies`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  // Get company by ID
  getCompanyById: async (token, companyId) => {
    const response = await fetch(`${RESOURCE_SERVER_URL}/companies/${companyId}`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  // Get company by name
  getCompanyByName: async (token, name) => {
    const response = await fetch(`${RESOURCE_SERVER_URL}/companies/name/${name}`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  // Get companies by industry
  getCompaniesByIndustry: async (token, industry) => {
    const response = await fetch(`${RESOURCE_SERVER_URL}/companies/industry/${industry}`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  // Create company
  createCompany: async (token, companyData) => {
    const response = await fetch(`${RESOURCE_SERVER_URL}/companies`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(companyData),
    });
    return handleResponse(response);
  },

  // Update company
  updateCompany: async (token, companyId, companyData) => {
    const response = await fetch(`${RESOURCE_SERVER_URL}/companies/${companyId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(companyData),
    });
    return handleResponse(response);
  },

  // Delete company
  deleteCompany: async (token, companyId) => {
    const response = await fetch(`${RESOURCE_SERVER_URL}/companies/${companyId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  // Add user to company
  addUserToCompany: async (token, companyId, userId) => {
    const response = await fetch(`${RESOURCE_SERVER_URL}/companies/${companyId}/users/${userId}`, {
      method: 'POST',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  // Remove user from company
  removeUserFromCompany: async (token, companyId, userId) => {
    const response = await fetch(`${RESOURCE_SERVER_URL}/companies/${companyId}/users/${userId}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },

  // Get companies by user
  getCompaniesByUser: async (token, userId) => {
    const response = await fetch(`${RESOURCE_SERVER_URL}/companies/user/${userId}`, {
      headers: getHeaders(token),
    });
    return handleResponse(response);
  },
};
