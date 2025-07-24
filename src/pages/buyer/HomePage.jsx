
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../api/client';
import AnimalCard from '../../components/buyer/AnimalCard';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';

const BuyerHomePage = ({ onNavigate }) => {
    const { isAuthenticated, tokens } = useAuth();
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            apiClient.get('/api/animals/', tokens.access)
                .then(data => setAnimals(data))
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [isAuthenticated, tokens]);

    if (!isAuthenticated) {
        return (
            <div className="text-center p-10 bg-white max-w-2xl mx-auto my-10 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome!</h2>
                <p className="text-gray-600 mb-6">Please log in to browse our full selection of livestock.</p>
                <Button onClick={() => onNavigate('auth')}>Login to Shop</Button>
            </div>
        );
    }

    if (loading) return <Spinner fullScreen />;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Featured Livestock</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {animals.map(animal => <AnimalCard key={animal.id} animal={animal} />)}
            </div>
        </div>
    );
};

export default BuyerHomePage;

