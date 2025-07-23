// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import axios from 'axios'; // Imported for potential direct use if needed, though API functions are preferred

// --- Import Pages ---
// Ensure these files exist in src/pages/
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AnimalListPage from './pages/AnimalListPage';
import AnimalDetailPage from './pages/AnimalDetailPage';
import CreateAnimalPage from './pages/CreateAnimalPage'; // For Sellers
import EditAnimalPage from './pages/EditAnimalPage';     // For Sellers
import BuyerDashboardPage from './pages/BuyerDashboardPage';
import SellerDashboardPage from './pages/SellerDashboardPage';
import OrderListPage from './pages/OrderListPage';
import OrderDetailPage from './pages/OrderDetailPage';
import PaymentStatusPage from './pages/PaymentStatusPage';
import NotFoundPage from './pages/NotFoundPage';

// --- Import Components ---
import Navbar from './components/common/Navbar'; // Your custom Navbar component

// --- Import Auth Context ---
// Ensure AuthProvider and useAuth are exported from src/context/AuthContext.jsx
import { AuthProvider, useAuth } from './context/AuthContext'; 
// Import fetchUserRole directly if needed, but App uses the context hook primarily
// import { fetchUserRole } from './api/apiService'; 

// --- API Configuration ---
// Your deployed backend URL
const API_URL = 'https://farmart-end.onrender.com/api'; 

// --- Protected Route Component ---
// This component ensures that only logged-in users with specific roles can access certain pages.
function ProtectedRoute({ children, allowedRoles }) {
  const accessToken = localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('userRole'); // Get user role from localStorage

  // If no token is found, redirect to the login page.
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in but doesn't have an allowed role for this route.
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to a role-appropriate dashboard or login page.
    if (userRole === 'FARMER') return <Navigate to="/seller-dashboard" replace />;
    if (userRole === 'BUYER') return <Navigate to="/buyer-dashboard" replace />;
    // Fallback redirect for unknown roles or if no role-specific redirect is set
    return <Navigate to="/login" replace />;
  }

  // If authenticated and has the required role, render the protected component.
  return children;
}

// --- Main App Component ---
function App() {
  // State to hold the user's role, managed by AuthContext
  const [userRole, setUserRole] = useState(null); 
  // State to manage the initial loading of authentication status
  const [loadingUser, setLoadingUser] = useState(true); 

  // Effect hook to initialize authentication state when the app loads
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          // Fetch user details (including role) from backend
          // This requires a '/users/me/' endpoint in your Django backend
          const fetchedUserRole = await fetchUserRole(token); // Use imported function
          const username = localStorage.getItem('username'); // Get username from storage
          
          // Set the user state with fetched details
          setUserRole({ username: username, role: fetchedUserRole }); 
        } catch (error) {
          console.error("Token invalid or fetch failed, clearing auth:", error);
          // Clear auth info if session is invalid (e.g., expired token)
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userRole');
          localStorage.removeItem('username');
          setUserRole(null); // Ensure user state is cleared
        }
      }
      setLoadingUser(false); // Indicate that the initial user check is complete
    };

    initializeAuth();
  }, []); // Empty dependency array: runs only once when the component mounts

  // Show a loading indicator while checking authentication status
  if (loadingUser) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-gray-600"><Spinner /> Loading application...</div>;
  }

  return (
    <Router>
      {/* Navbar is always rendered, but its content changes based on userRole */}
      <Navbar userRole={userRole ? userRole.role : null} />

      {/* Main content area: provides padding and takes up remaining space */}
      <div className="pt-16 min-h-screen bg-gray-50"> {/* pt-16 accounts for fixed Navbar height */}
        <Routes>
          {/* --- Public Routes (Accessible to anyone) --- */}
          <Route path="/" element={<HomePage />} />
          <Route path="/animals" element={<AnimalListPage />} />
          <Route path="/animals/:id" element={<AnimalDetailPage />} /> {/* Dynamic route for individual animal */}
          <Route path="/login" element={<LoginPage setUserRole={setUserRole} />} /> {/* Pass setUserRole to update App's state */}
          <Route path="/register" element={<RegisterPage />} />

          {/* --- Buyer Routes --- */}
          {/* Protected: Only accessible to BUYERs or ADMINs */}
          <Route
            path="/buyer-dashboard"
            element={
              <ProtectedRoute allowedRoles={['BUYER', 'ADMIN']}>
                <BuyerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders" // List of orders for the current buyer
            element={
              <ProtectedRoute allowedRoles={['BUYER', 'ADMIN']}>
                <OrderListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id" // Detail view for a specific order
            element={
              <ProtectedRoute allowedRoles={['BUYER', 'ADMIN']}>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />
          {/* Route for initiating payment, likely from OrderDetailPage or a Cart */}
          <Route
            path="/pay-order/:orderId"
            element={
              <ProtectedRoute allowedRoles={['BUYER', 'ADMIN']}>
                {/* This would be a component like PaymentForm */}
                <div>Placeholder for Payment Form for Order ID: :orderId</div>
              </ProtectedRoute>
            }
          />

          {/* --- Seller Routes --- */}
          {/* Protected: Only accessible to FARMERs or ADMINs */}
          <Route
            path="/seller-dashboard"
            element={
              <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
                <SellerDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/animals/new" // Seller creates a new animal listing
            element={
              <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
                <CreateAnimalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/animals/edit/:id" // Seller edits an existing animal listing
            element={
              <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
                <EditAnimalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-sales" // Seller's view of their sales
            element={
              <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
                <div>My Sales Dashboard Content</div> {/* Replace with your SellerSalesComponent */}
              </ProtectedRoute>
            }
          />

          {/* --- M-Pesa Callback Route --- */}
          {/* This route is not for direct user navigation but is hit by Safaricom's servers */}
          {/* You might redirect to a status page after the callback is processed */}
          <Route path="/payment-status" element={<PaymentStatusPage />} />

          {/* --- Fallback Route for 404 Not Found --- */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;