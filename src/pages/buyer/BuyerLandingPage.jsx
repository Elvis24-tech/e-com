import React from 'react';

const BuyerLandingPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-green-700 mb-4">Welcome to Farmart</h1>
      <p className="text-gray-600 mb-8">Buy fresh and healthy farm animals directly from trusted farmers.</p>
      <button
        onClick={() => onNavigate('shop')}
        className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        Start Shopping
      </button>
    </div>
  );
};

export default BuyerLandingPage;
