import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../context/CartContext';

const BuyerNavbar = ({ onNavigate, onCartClick }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="bg-green-800 text-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1
          className="text-2xl font-bold cursor-pointer hover:text-green-300"
          onClick={() => onNavigate('home')}
        >
          <span className="text-green-600">Farm</span>art
        </h1>

        <div className="flex-1 max-w-xl mx-4">
          <input
            type="search"
            placeholder="Search livestock..."
            className="w-full px-4 py-2 rounded-lg text-black-900 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>

        <nav className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm">Hello, <span className="font-semibold">{user.username}</span></span>
              <button onClick={() => onNavigate('my-orders')} className="text-sm hover:text-green-200">
                Orders
              </button>
              <button
                onClick={() => { logout(); onNavigate('home'); }}
                className="text-sm hover:text-green-200"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigate('auth')}
              className="text-sm hover:text-green-200"
            >
              Login / Register
            </button>
          )}

          <button
            onClick={onCartClick}
            className="relative p-2 rounded-full hover:bg-green-500 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5
                M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17
                m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default BuyerNavbar;
