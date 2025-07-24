import React from 'react';
import Button from '../../components/common/Button';

const BuyerLandingPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center text-center px-4">
      <div className="flex items-center space-x-3 mb-4">
        <img
          src="/images/image.jpg.jpg" 
          alt="Farmart Logo"
          className="w-12 h-12 rounded-full object-cover shadow"
        />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-green-700 drop-shadow-sm">
          Welcome to <span className="text-green-600">Farmart</span>
        </h1>
      </div>

      <p className="text-lg text-gray-600 mb-10 max-w-md">
        Buy fresh and healthy livestock directly from trusted farmers across the region.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <Button
          onClick={() => onNavigate('/shop')}
          className="px-8 py-3 bg-green-700 text-white font-semibold rounded-md hover:bg-green-800 transition duration-300 shadow-md"
        >
          Start Shopping
        </Button>
        <Button
          onClick={() => onNavigate('/my-orders')}
          className="px-8 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-300 shadow-md"
        >
          Login / Register
        </Button>
      </div>
      <p className="text-sm text-gray-500">
        Are you a farmer?{' '}
        <a
          href="/seller"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/seller');
          }}
          className="text-green-600 hover:underline font-medium"
        >
          Go to Seller Central
        </a>
      </p>
    </div>
  );
};

export default BuyerLandingPage;
