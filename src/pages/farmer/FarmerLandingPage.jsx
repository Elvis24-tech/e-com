
import React from 'react';
import Button from '../../components/common/Button';

const FarmerLandingPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-800 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in-down">Seller Central</h1>
      <p className="text-lg text-gray-300 mb-8 animate-fade-in-up">Manage your livestock, view orders, and reach customers directly.</p>
       <div className="space-x-4">
        <Button onClick={() => onNavigate('/seller/dashboard')} variant="secondary" className="px-8 py-3">Go to Dashboard</Button>
        <Button onClick={() => onNavigate('/seller/auth')} variant="ghost">Login / Register</Button>
      </div>
      <p className="absolute bottom-5 text-sm text-gray-400">
          Not a farmer? <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('/'); }} className="text-blue-400 hover:underline">Go to Buyer Site</a>
      </p>
    </div>
  );
};

export default FarmerLandingPage;
