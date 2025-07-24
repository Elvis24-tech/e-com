import React from 'react';

const FarmerSidebar = ({ onNavigate, currentPage }) => {
  const navItem =
    'block py-2.5 px-4 rounded-md transition-colors duration-200 text-sm font-medium hover:bg-green-100 hover:text-green-900';
  const activeItem =
    'block py-2.5 px-4 rounded-md bg-green-600 text-white text-sm font-semibold shadow';

  return (
    <aside className="w-64 bg-green-50 text-green-900 h-screen p-6 border-r border-green-200 shadow-md flex-shrink-0">
      <div className="flex items-center justify-center pb-4 border-b border-green-200">
        <img
          src="/images/image.jpg.jpg"
          alt="Farmer Icon"
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <h1 className="text-xl font-bold text-green-800">
          <span className="text-green-700">Farmer's</span> Portal
        </h1>
      </div>

      <nav className="mt-6">
        <ul className="space-y-2">
          <li>
            <a
              href="#"
              onClick={() => onNavigate('seller-dashboard')}
              className={currentPage === 'seller-dashboard' ? activeItem : navItem}
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={() => onNavigate('seller-listings')}
              className={currentPage === 'seller-listings' ? activeItem : navItem}
            >
              Manage Listings
            </a>
          </li>
          <li>
            <a
              href="#"
              onClick={() => onNavigate('seller-orders')}
              className={currentPage === 'seller-orders' ? activeItem : navItem}
            >
              Manage Orders
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default FarmerSidebar;
