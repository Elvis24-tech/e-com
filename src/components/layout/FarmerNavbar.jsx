
import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const FarmerNavbar = ({ onNavigate }) => {
    const { user, logout } = useAuth();
    return (
        <header className="bg-white text-gray-800 shadow-md p-4 flex justify-between items-center border-b">
            <h1 className="text-xl font-bold">Seller Dashboard</h1>
            <div>
                <span>Welcome, {user.username}</span>
                <button onClick={() => { logout(); onNavigate('seller-auth'); }} className="ml-4 text-blue-600 hover:underline">Logout</button>
            </div>
        </header>
    );
};

export default FarmerNavbar;

