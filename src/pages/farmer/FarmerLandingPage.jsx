import React from 'react';

const FarmerLandingPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-green-700 mb-4">Welcome Farmers</h1>
      <p className="text-gray-600 mb-8">Manage your livestock, view orders, and reach customers directly.</p>
      <button
        onClick={() => onNavigate('seller-auth')}
        className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Go to Seller Portal
      </button>
    </div>
  );
};

export default FarmerLandingPage;
