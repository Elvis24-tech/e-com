// src/api/orders.js
import { apiClient } from './apiService'; // Import the configured axios instance
import { getAuthHeaders } from './apiService'; // Import helper for auth headers

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