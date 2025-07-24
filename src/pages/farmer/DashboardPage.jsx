
import React from 'react';

const FarmerDashboardPage = () => (
    <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-500">Total Sales</h3>
                <p className="text-4xl font-bold mt-2 text-green-600">Ksh 0</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-500">Pending Orders</h3>
                <p className="text-4xl font-bold mt-2 text-yellow-600">0</p>
            </div>
             <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-500">Active Listings</h3>
                <p className="text-4xl font-bold mt-2 text-blue-600">0</p>
            </div>
        </div>
        {/* You can add charts or recent activity here */}
    </div>
);

export default FarmerDashboardPage;