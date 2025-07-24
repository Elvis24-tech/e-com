
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../api/client';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const FarmerListingsPage = () => {
    const { user, tokens } = useAuth();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [newAnimalData, setNewAnimalData] = useState({
        name: '', animal_type: 'COW', breed: '', age: '', price: '', description: '', quantity: 1, image: null
    });

    const fetchListings = async () => {
        try {
            setLoading(true);
            const allAnimals = await apiClient.get('/api/animals/', tokens.access);
            const myListings = allAnimals.filter(animal => animal.farmer === user.id);
            setListings(myListings);
        } catch (err) {
            setError('Failed to fetch listings.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, []);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewAnimalData({ name: '', animal_type: 'COW', breed: '', age: '', price: '', description: '', quantity: 1, image: null });
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setNewAnimalData(prev => ({ ...prev, image: files[0] }));
        } else {
            setNewAnimalData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        Object.entries(newAnimalData).forEach(([key, value]) => {
            if (value !== null) {
                formData.append(key, value);
            }
        });

        try {
            await apiClient.postWithFile('/api/animals/', formData, tokens.access);
            handleCloseModal();
            fetchListings(); // Refresh the list
        } catch (err) {
            setError('Failed to create listing. Please check your input.');
        }
    };
    
    const handleDelete = async (animalId) => {
        if (window.confirm('Are you sure you want to delete this listing?')) {
            try {
                await apiClient.delete(`/api/animals/${animalId}/`, tokens.access);
                fetchListings(); // Refresh the list
            } catch (err) {
                setError('Failed to delete listing.');
            }
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Manage Listings</h1>
                <Button onClick={handleOpenModal} variant="secondary">Add New Animal</Button>
            </div>

            {loading && <Spinner />}
            {error && <p className="text-red-500 bg-red-100 p-3 rounded">{error}</p>}
            
            {!loading && listings.length === 0 && (
                <p>You have not listed any animals for sale yet.</p>
            )}

            {!loading && listings.length > 0 && (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {listings.map(animal => (
                                <tr key={animal.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{animal.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{animal.animal_type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{animal.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">Ksh {parseFloat(animal.price).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Button onClick={() => handleDelete(animal.id)} variant="danger">Delete</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Add New Animal Listing">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="name" value={newAnimalData.name} onChange={handleChange} placeholder="Animal Name (e.g., Bessie)" required className="w-full p-2 border rounded" />
                    <select name="animal_type" value={newAnimalData.animal_type} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="COW">Cow</option>
                        <option value="GOAT">Goat</option>
                        <option value="SHEEP">Sheep</option>
                        <option value="CHICKEN">Chicken</option>
                        <option value="PIG">Pig</option>
                    </select>
                    <input name="breed" value={newAnimalData.breed} onChange={handleChange} placeholder="Breed (e.g., Friesian)" required className="w-full p-2 border rounded" />
                    <input name="age" type="number" value={newAnimalData.age} onChange={handleChange} placeholder="Age in months" required className="w-full p-2 border rounded" />
                    <input name="price" type="number" step="0.01" value={newAnimalData.price} onChange={handleChange} placeholder="Price (Ksh)" required className="w-full p-2 border rounded" />
                    <input name="quantity" type="number" value={newAnimalData.quantity} onChange={handleChange} placeholder="Available Quantity" required className="w-full p-2 border rounded" />
                    <textarea name="description" value={newAnimalData.description} onChange={handleChange} placeholder="Description" required className="w-full p-2 border rounded"></textarea>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image</label>
                        <input name="image" type="file" onChange={handleChange} accept="image/*" className="w-full p-2 border rounded" />
                    </div>
                    <Button type="submit" variant="secondary" className="w-full">Create Listing</Button>
                </form>
            </Modal>
        </div>
    );
};

export default FarmerListingsPage;


