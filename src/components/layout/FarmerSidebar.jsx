
import React from 'react';

const FarmerSidebar = ({ onNavigate, currentPage }) => {
    const navItem = "block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 hover:text-white";
    const activeItem = "block py-2.5 px-4 rounded bg-blue-700 text-white font-bold";
    
    return (
        <aside className="w-64 bg-gray-50 text-gray-800 h-screen p-4 border-r flex-shrink-0">
             <h1 className="text-2xl font-bold text-center py-4 border-b">
                <span className="text-blue-600">Seller</span> Central
            </h1>
            <nav className="mt-6">
                <ul>
                    <li><a href="#" onClick={() => onNavigate('seller-dashboard')} className={currentPage === 'seller-dashboard' ? activeItem : navItem}>Dashboard</a></li>
                    <li><a href="#" onClick={() => onNavigate('seller-listings')} className={currentPage === 'seller-listings' ? activeItem : navItem}>Manage Listings</a></li>
                    <li><a href="#" onClick={() => onNavigate('seller-orders')} className={currentPage === 'seller-orders' ? activeItem : navItem}>Manage Orders</a></li>
                </ul>
            </nav>
        </aside>
    );
};

export default FarmerSidebar;