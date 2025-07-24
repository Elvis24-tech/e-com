
import React from 'react';

const FarmerSidebar = ({ onNavigate, currentPath }) => {
    const handleNav = (e, path) => {
        e.preventDefault();
        onNavigate(path);
    };

    const navItem = (path) => `block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 hover:text-white ${currentPath === path ? 'bg-blue-700 text-white font-bold' : ''}`;
    
    return (
        <aside className="w-64 bg-gray-50 text-gray-800 h-screen p-4 border-r flex-shrink-0">
             <a href="/seller" onClick={(e) => handleNav(e, '/seller')} className="text-2xl font-bold text-center py-4 border-b block">
                <span className="text-blue-600">Seller</span> Central
            </a>
            <nav className="mt-6">
                <ul>
                    <li><a href="/seller/dashboard" onClick={(e) => handleNav(e, '/seller/dashboard')} className={navItem('/seller/dashboard')}>Dashboard</a></li>
                    <li><a href="/seller/listings" onClick={(e) => handleNav(e, '/seller/listings')} className={navItem('/seller/listings')}>Manage Listings</a></li>
                    <li><a href="/seller/orders" onClick={(e) => handleNav(e, '/seller/orders')} className={navItem('/seller/orders')}>Manage Orders</a></li>
                    <li><a href="/seller/contact" onClick={(e) => handleNav(e, '/seller/contact')} className={navItem('/seller/contact')}>Contact Us</a></li>
                </ul>
            </nav>
        </aside>
    );
};

export default FarmerSidebar;

