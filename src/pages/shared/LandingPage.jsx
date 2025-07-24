import React from 'react';

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-6 text-center">
        Welcome to Farmart
      </h1>
      <p className="text-lg text-gray-700 mb-8 text-center max-w-xl">
        An e-commerce platform where farmers and buyers connect directly — no middlemen.
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => onNavigate('landing-buyer')}
          className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          I'm a Buyer
        </button>

        <button
          onClick={() => onNavigate('landing-farmer')}
          className="px-6 py-3 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
        >
          I'm a Farmer
        </button>

        <button
          onClick={() => onNavigate('contact')}
          className="px-6 py-3 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
