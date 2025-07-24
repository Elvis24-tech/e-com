
import React from 'react';
import Button from '../../components/common/Button';

const LandingPage = ({ onNavigate }) => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-5xl font-bold mb-2"><span className="text-green-600">Farm</span>art</h1>
        <p className="text-xl text-gray-600 mb-10">Your Portal to Quality Livestock</p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">Shop for Livestock</h2>
                <p className="text-gray-500 mb-4">Browse and buy from trusted farmers.</p>
                <Button onClick={() => onNavigate('home')} variant="primary" className="px-10">
                    Go Shopping
                </Button>
            </div>
            <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2">Sell Your Livestock</h2>
                <p className="text-gray-500 mb-4">Join our platform and reach more buyers.</p>
                <Button onClick={() => onNavigate('seller-auth')} variant="secondary" className="px-10">
                    Seller Central
                </Button>
            </div>
        </div>
    </div>
);

export default LandingPage;

