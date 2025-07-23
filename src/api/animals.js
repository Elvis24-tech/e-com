// src/api/animals.js
import { apiClient } from './apiService'; // Import the configured axios instance
import { getAuthHeaders } from './apiService'; // Import helper for auth headers

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