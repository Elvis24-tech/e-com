// src/components/Navbar.jsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom'; // useNavigate for programmatic navigation, Link for routing

function Navbar({ userRole }) { // Receives userRole from App.js to conditionally render links
  const navigate = useNavigate();

  // Handler for the logout action
  const handleLogout = () => {
    // Clear all user-related data from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    // Reload the page to reset the UI state and reflect the logged-out status
    window.location.reload(); 
  };

  // Function to conditionally render authentication buttons and role-specific links
  const renderAuthButtons = () => {
    if (userRole) { // If a user is logged in (userRole is not null or undefined)
      const username = localStorage.getItem('username') || 'User'; // Get username for display
      return (
        <div className="flex items-center space-x-4">
          {/* Display welcome message with username and role */}
          <span className="text-sm font-medium text-gray-300">Welcome, {username}</span>
          
          {/* Conditional Navigation Links Based on Role */}
          {userRole === 'FARMER' && (
            <Link to="/seller-dashboard" className="text-gray-300 hover:text-white transition duration-200">Seller Dashboard</Link>
          )}
          {userRole === 'BUYER' && (
            <Link to="/buyer-dashboard" className="text-gray-300 hover:text-white transition duration-200">Buyer Dashboard</Link>
          )}
          {userRole === 'ADMIN' && (
            // Link to Django Admin or a custom admin panel
            <a href="/admin" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-200">Admin Panel</a>
          )}
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded transition duration-200"
          >
            Logout
          </button>
        </div>
      );
    } else {
      // If user is not logged in, show Login and Register links
      return (
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-gray-300 hover:text-white transition duration-200">Login</Link>
          <Link to="/register" className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded transition duration-200">Register</Link>
        </div>
      );
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-600 shadow-lg fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left side: Logo/Brand */}
        <Link to="/" className="text-2xl font-extrabold text-white hover:text-gray-200 transition duration-200 flex items-center">
          {/* Simple SVG icon for farm */}
          <svg className="h-8 w-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s.895 2 2 2 2-.895 2-2-.895-2-2-2z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14c-2.761 0-5-2.239-5-5 0-1.761.95-3.278 2.379-4.152C8.889 6.393 10.327 6 12 6s3.111.393 4.379 1.084C17.05 7.722 18 9.239 18 11c0 2.761-2.239 5-5 5z"></path>
          </svg>
          Farmart
        </Link>

        {/* Right side: Navigation and Auth */}
        <div className="flex items-center space-x-6">
          {/* Main Navigation Links */}
          <Link to="/animals" className="text-gray-300 hover:text-white transition duration-200">Animals</Link>
          
          {/* Dynamic Auth and Role-Based Navigation */}
          {renderAuthButtons()}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;