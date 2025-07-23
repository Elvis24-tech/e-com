// src/pages/SellerDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnimalCard from '../components/common/AnimalCard'; // Reusing AnimalCard for list view
import { fetchFarmerAnimals, fetchFarmerSales } from '../api/apiService'; // Corrected import
import Spinner from '../components/common/Spinner'; // Assuming Spinner component exists

function SellerDashboardPage() {
  const [animals, setAnimals] = useState([]);
  const [sales, setSales] = useState([]);
  const [loadingAnimals, setLoadingAnimals] = useState(true);
  const [loadingSales, setLoadingSales] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Seller'; // Get seller's username for greeting

  useEffect(() => {
    const loadSellerData = async () => {
      try {
        // Fetch the seller's listed animals
        const animalsResponse = await fetchFarmerAnimals();
        setAnimals(animalsResponse.data);
        setLoadingAnimals(false);

        // Fetch the seller's sales data
        const salesResponse = await fetchFarmerSales();
        setSales(salesResponse.data);
        setLoadingSales(false);

      } catch (err) {
        setError('Failed to load seller data.');
        console.error('Error loading seller data:', err);
        setLoadingAnimals(false); // Stop loading even if there's an error
        setLoadingSales(false);
      }
    };
    loadSellerData();
  }, []);

  // Calculate total sales amount for the dashboard summary
  const totalSalesAmount = sales.reduce((sum, sale) => sum + (sale.total_amount || 0), 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Seller Dashboard</h1>
      <p className="text-xl text-center mb-8 text-gray-600">Welcome, <span className="font-semibold">{username}</span>! Manage your listings and track your sales.</p>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-lg shadow-xl text-center border border-gray-200">
          <h3 className="text-xl font-semibold text-green-600">My Animals Listed</h3>
          <p className="text-4xl font-bold text-gray-800">{animals.length}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-xl text-center border border-gray-200">
          <h3 className="text-xl font-semibold text-blue-600">Total Sales Revenue</h3>
          <p className="text-4xl font-bold text-gray-800">Ksh {totalSalesAmount.toFixed(2)}</p>
        </div>
        {/* Add more stats like pending payouts, new inquiries, etc. */}
      </div>

      {/* My Animals Section */}
      <div className="bg-white p-6 rounded-lg shadow-xl mb-8 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">My Animals</h2>
          <Link to="/animals/new" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300">
            Add New Animal
          </Link>
        </div>
        {loadingAnimals && <div className="text-center py-4"><Spinner /> Loading your animals...</div>}
        {error && <p className="text-center py-4 text-red-500">{error}</p>}
        {!loadingAnimals && !error && animals.length === 0 && (
          <p className="text-center py-4 text-gray-500">You haven't listed any animals yet. Click "Add New Animal" to start!</p>
        )}
        {!loadingAnimals && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {animals.map(animal => (
              <div key={animal.id} className="relative">
                <AnimalCard animal={animal} />
                {/* Action buttons for Seller */}
                <div className="absolute bottom-2 right-2 flex space-x-2">
                  <button onClick={() => navigate(`/animals/edit/${animal.id}`)} className="bg-yellow-500 hover:bg-yellow-600 text-white text-xs py-1 px-2 rounded-md shadow-md transition duration-300">Edit</button>
                  {/* Add a delete button with a confirmation modal for safety */}
                  <button onClick={() => deleteAnimal(animal.id)} className="bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2 rounded-md shadow-md transition duration-300">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Sales Section */}
      <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Recent Sales</h2>
        {loadingSales && <p className="text-center py-4 text-gray-500">Loading sales...</p>}
        {error && <p className="text-center py-4 text-red-500">{error}</p>}
        {!loadingSales && !error && sales.length === 0 && (
          <p className="text-center py-4 text-gray-500">No sales recorded yet.</p>
        )}
        {!loadingSales && !error && (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="relative px-4 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sales.map(sale => (
                  <tr key={sale.id} className="hover:bg-gray-50 transition duration-200">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.id}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{sale.animal_name || 'N/A'}</td> {/* Assuming backend returns these fields */}
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{sale.buyer_username || 'N/A'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold capitalize">
                      {/* Dynamic status badge with color coding */}
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        sale.status === 'PAID' ? 'bg-green-100 text-green-800' :
                        sale.status === 'CONFIRMED' ? 'bg-yellow-100 text-yellow-800' :
                        sale.status === 'PENDING' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800' // Default for unknown or failed
                      }`}>
                        {sale.status?.toLowerCase() || 'unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-800">Ksh {sale.total_amount?.toFixed(2)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-right">
                      <Link to={`/orders/${sale.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default SellerDashboardPage;