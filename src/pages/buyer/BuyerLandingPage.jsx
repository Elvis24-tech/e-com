
import React from 'react';
import Button from '../../components/common/Button';

const BuyerLandingPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-bold text-green-700 mb-4 animate-fade-in-down">Welcome to Farmart</h1>
      <p className="text-lg text-gray-600 mb-8 animate-fade-in-up">Buy fresh and healthy livestock directly from trusted farmers.</p>
      <div className="space-x-4">
        <Button onClick={() => onNavigate('/shop')} className="px-8 py-3">Start Shopping</Button>
        <Button onClick={() => onNavigate('/my-orders')} variant="ghost">Login / Register</Button>
      </div>
       <p className="absolute bottom-5 text-sm text-gray-500">
          Are you a farmer? <a href="/seller" onClick={(e) => { e.preventDefault(); onNavigate('/seller'); }} className="text-blue-600 hover:underline">Go to Seller Central</a>
        </p>
    </div>
  );
};

export default BuyerLandingPage;