// src/api/mpesa.js
import { apiClient } from './apiService'; // Import the configured axios instance
import { getAuthHeaders } from './apiService'; // Import helper for auth headers

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