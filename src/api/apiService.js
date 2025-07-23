import axios from 'axios';

// Base API URL for your deployed backend
const API_URL = 'https://farmart-end.onrender.com/api/';

// Create an Axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach access token to all protected requests
apiClient.interceptors.request.use(
  (config) => {
    const publicPaths = ['auth/users/', 'auth/jwt/create/', 'animals/'];
    const isPublic = publicPaths.some((path) => config.url.includes(path));

    if (!isPublic) {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      } else {
        console.warn('⚠️ No access token found for:', config.url);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --------------------- AUTH ---------------------

export const loginUser = async (credentials) => {
  const res = await apiClient.post('auth/jwt/create/', credentials);
  localStorage.setItem('accessToken', res.data.access);
  localStorage.setItem('refreshToken', res.data.refresh);
  localStorage.setItem('username', credentials.username);
  await fetchAndStoreUserRole(res.data.access);
  return res.data;
};

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}register/`, userData);
  return response.data;
};


export const fetchUserRole = async (token) => {
  try {
    const res = await apiClient.get('users/me/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.role;
  } catch (err) {
    console.error('Error fetching user role:', err);
    return null;
  }
};

export const fetchAndStoreUserRole = async (token) => {
  const role = await fetchUserRole(token);
  localStorage.setItem('userRole', role || 'BUYER');
  return role;
};

export const logoutUser = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('username');
  window.location.reload();
};

// --------------------- USERS ---------------------

export const getUsers = () => apiClient.get('users/');

// --------------------- ANIMALS ---------------------

export const fetchAnimals = async (params = {}) => {
  return await apiClient.get('animals/', { params });
};

export const fetchAnimalDetail = async (id) => {
  return await apiClient.get(`animals/${id}/`);
};

export const createAnimal = async (animalData) => {
  return await apiClient.post('animals/', animalData, {
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateAnimal = async (id, animalData) => {
  return await apiClient.put(`animals/${id}/`, animalData, {
    headers: getAuthHeaders(),
  });
};

export const deleteAnimal = async (id) => {
  return await apiClient.delete(`animals/${id}/`, {
    headers: getAuthHeaders(),
  });
};

export const fetchFarmerAnimals = async () => {
  return await apiClient.get('my-animals/', {
    headers: getAuthHeaders(),
  });
};

// --------------------- ORDERS ---------------------

export const createOrder = async (orderData) => {
  return await apiClient.post('orders/', orderData, {
    headers: getAuthHeaders(),
  });
};

export const fetchUserOrders = async () => {
  return await apiClient.get('orders/', {
    headers: getAuthHeaders(),
  });
};

export const fetchOrderDetails = async (id) => {
  return await apiClient.get(`orders/${id}/`, {
    headers: getAuthHeaders(),
  });
};

export const fetchFarmerSales = async () => {
  return await apiClient.get('my-sales/', {
    headers: getAuthHeaders(),
  });
};

// --------------------- M-PESA ---------------------

export const initiateMpesaPayment = async (orderId, phoneNumber) => {
  return await apiClient.post(
    'make-payment/',
    { order_id: orderId, phone_number: phoneNumber },
    { headers: getAuthHeaders() }
  );
};

export const fetchOrderStatus = async (orderId) => {
  return await apiClient.get(`orders/${orderId}/`, {
    headers: getAuthHeaders(),
  });
};

// --------------------- HELPERS ---------------------

export const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
