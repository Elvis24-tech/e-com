// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button'; // Assuming styled Button component

function HomePage() {
  const userRole = localStorage.getItem('userRole'); // Get user role to conditionally show links

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center py-16 px-4">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4 leading-tight animate-bounce">
          Welcome to <span className="text-blue-700">Farmart</span>
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Your trusted marketplace for quality farm animals. Connect with farmers and buyers, and manage your livestock with ease.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link to="/animals" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 text-center">
            Browse Animals
          </Link>
          {!userRole && ( // Show Login/Register only if not logged in
            <Link to="/login" className="inline-block bg-white hover:bg-gray-100 text-blue-700 font-bold py-3 px-8 rounded-lg shadow-lg border-2 border-blue-700 transform transition duration-300 hover:scale-105 text-center">
              Get Started
            </Link>
          )}
          {/* Conditionally show dashboard links */}
          {userRole === 'BUYER' && (
            <Link to="/buyer-dashboard" className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 text-center">
              My Dashboard
            </Link>
          )}
          {userRole === 'FARMER' && (
            <Link to="/seller-dashboard" className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 text-center">
              Seller Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;