// src/api/auth.js
import { apiClient } from './apiService'; // Import the configured axios instance
import { fetchUserRole as fetchUserRoleFromBackend } from './apiService'; // Import the specific function

// Login user: POST to /token/ with credentials
export const loginUser = async (credentials) => {
    const response = await apiClient.post('token/', credentials); // Uses /token/ endpoint

    // Store tokens and username for session persistence
    localStorage.setItem('accessToken', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);
    localStorage.setItem('username', credentials.username); 
    
    // Fetch and store user role after successful login
    await fetchAndStoreUserRole(response.data.access); // This function also calls localStorage
    return response.data;
};

// Register a user: POST to /auth/users/
export const registerUser = async (userData) => {
    // Assumes backend's user creation endpoint is at /auth/users/
    // userData should include: username, email, password, re_password, user_type
    const response = await apiClient.post('auth/users/', userData);
    return response.data;
};

// Fetch current user details (including role) from backend's /users/me/ endpoint
export const fetchUserRole = async (token) => {
  try {
    const response = await apiClient.get('users/me/', { // Assumes backend endpoint is /users/me/
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data.role; // Expecting 'role' field from backend response
  } catch (error) {
    console.error("Failed to fetch user role:", error);
    return null;
  }
};

// Helper to fetch user role and store it in localStorage
export const fetchAndStoreUserRole = async (token) => {
  const role = await fetchUserRole(token);
  localStorage.setItem('userRole', role || 'BUYER'); // Default to BUYER if role is missing
  return role;
};

// Logout: Clears tokens and user info from localStorage
export const logoutUser = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    window.location.reload(); // Reload the page to reflect logged-out state
};