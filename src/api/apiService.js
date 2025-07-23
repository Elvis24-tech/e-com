// src/api/apiService.js
import axios from 'axios';

// Your deployed backend URL
const API_URL = 'https://farmart-end.onrender.com/api';

// Axios instance setup with base URL and common headers
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to automatically add the JWT access token to requests that need it
apiClient.interceptors.request.use(
  (config) => {
    // List of paths that do NOT require authentication
    // Ensure these paths are accurate for your backend
    const publicPaths = ['auth/users/', 'token/', 'animals/']; // Added animals/ as usually public for browsing
    
    // Check if the current request path is considered public
    const isPublic = publicPaths.some(path => config.url.includes(path));
    
    if (!isPublic) {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`; // Add the token if available
      }
    }
    return config; // Return the config to proceed with the request
  },
  (error) => Promise.reject(error) // Handle request errors
);

// --- AUTHENTICATION API Functions ---
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

export const registerUser = async (userData) => {
    // Assumes backend's user creation endpoint is at /auth/users/
    // userData should include: username, email, password, re_password, user_type
    const response = await apiClient.post('auth/users/', userData);
    return response.data;
};

// Fetch current user details (including role) from backend's /users/me/ endpoint
export const fetchUserRole = async (token) => {
  try {
    // Assumes backend has a '/users/me/' endpoint returning user details including role
    const response = await apiClient.get('users/me/', { 
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

// --- USERS API Functions (Likely for Admin) ---
// Fetch all users (assuming backend endpoint /users/ and admin permission)
export const getUsers = () => apiClient.get('users/');

// --- ANIMALS API Functions ---
export const fetchAnimals = async (params = {}) => {
  // Params could be { type: 'cow', breed: 'friesian' } for filtering
  return await apiClient.get('animals/', { params });
};

export const fetchAnimalDetail = async (id) => {
  return await apiClient.get(`animals/${id}/`);
};

export const createAnimal = async (animalData) => {
  // animalData is expected to be FormData for file uploads
  return await apiClient.post('animals/', animalData, {
    headers: { 'Content-Type': 'multipart/form-data' }, // Crucial for file uploads
  });
};

export const updateAnimal = async (id, animalData) => {
  // animalData could be FormData if updating image, or JSON otherwise
  return await apiClient.put(`animals/${id}/`, animalData, { headers: getAuthHeaders() }); // Add headers if token is needed for update
};

export const deleteAnimal = async (id) => {
  return await apiClient.delete(`animals/${id}/`, { headers: getAuthHeaders() });
};

// Example: If you have a farmer-specific endpoint for their animals
export const fetchFarmerAnimals = async () => {
  // Assumes your backend has a '/my-animals/' endpoint for the current farmer
  return await apiClient.get('my-animals/', { headers: getAuthHeaders() });
};

// --- ORDERS API Functions ---
export const createOrder = async (orderData) => {
  // orderData would contain items, etc.
  return await apiClient.post('orders/', orderData, { headers: getAuthHeaders() });
};

export const fetchUserOrders = async () => {
  // This will fetch orders relevant to the current user based on backend logic
  // Adjust the URL if your backend has specific endpoints like '/my-orders/'
  return await apiClient.get('orders/', { headers: getAuthHeaders() });
};

export const fetchOrderDetails = async (id) => {
  return await apiClient.get(`orders/${id}/`, { headers: getAuthHeaders() });
};

// Example: If you have a farmer-specific endpoint for their sales
export const fetchFarmerSales = async () => {
  // Assumes your backend has a '/my-sales/' endpoint for the current farmer
  return await apiClient.get('my-sales/', { headers: getAuthHeaders() });
};

// --- M-PESA API Functions ---
export const initiateMpesaPayment = async (orderId, phoneNumber) => {
  // Ensure orderId is passed correctly as per your backend's expectation
  return await apiClient.post('make-payment/', { order_id: orderId, phone_number: phoneNumber }, { headers: getAuthHeaders() });
};

// Function for frontend to poll the backend for order status updates
export const fetchOrderStatus = async (orderId) => {
  // Assumes your Order detail view `/orders/<id>/` also returns the status
  return await apiClient.get(`orders/${orderId}/`, { headers: getAuthHeaders() });
};