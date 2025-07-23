// src/pages/BuyerDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserOrders } from '../api/apiService'; // Corrected import for API call
import Spinner from '../components/common/Spinner'; // Assuming Spinner component exists

function BuyerDashboardPage() {
  const [orders, setOrders] = useState([]); // State to hold the buyer's orders
  const [loading, setLoading] = useState(true); // Loading state for fetching orders
  const [error, setError] = useState(null);     // State to hold any errors

  const userRole = localStorage.getItem('userRole'); // Get user role for conditional rendering
  const username = localStorage.getItem('username') || 'User'; // Get username for greeting

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchUserOrders(); // Fetch orders using the API service
        setOrders(response.data);
      } catch (err) {
        setError('Failed to load your orders.'); // Set error message if fetching fails
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false); // Stop loading once data is fetched or an error occurs
      }
    };
    loadOrders();
  }, []); // This effect runs only once when the component mounts

  // Helper to format dates for consistent display (e.g., 20-Jul-2025)
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'; // Return N/A if date is not available
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };
  
  // Helper to get a summary of items in an order
  const getOrderSummary = (order) => {
    if (!order.items || order.items.length === 0) return 'No items';
    if (order.items.length === 1) return `${order.items[0].quantity}x ${order.items[0].animal.name}`;
    return `${order.items.length} items in order`;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 capitalize">Buyer Dashboard</h1>
      <p className="text-xl text-center mb-8 text-gray-600">Welcome, <span className="font-semibold">{username}</span>! Here's your order activity.</p>

      {/* Quick Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-lg shadow-xl text-center border-l-4 border-blue-500">
          <h3 className="text-xl font-semibold text-blue-600">Total Orders</h3>
          <p className="text-4xl font-bold text-gray-800">{orders.length}</p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-xl text-center border-l-4 border-green-500">
          <h3 className="text-xl font-semibold text-green-600">Total Spent</h3>
          <p className="text-4xl font-bold text-gray-800">
            Ksh {orders.reduce((sum, order) => sum + (order.total_amount || 0), 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-5 rounded-lg shadow-xl text-center border-l-4 border-purple-500">
          <h3 className="text-xl font-semibold text-purple-600">Pending Payments</h3>
          <p className="text-4xl font-bold text-gray-800">{orders.filter(o => o.status === 'PENDING').length}</p>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white p-6 rounded-lg shadow-xl border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Recent Orders</h2>
        {loading && <div className="text-center py-4"><Spinner /> Loading orders...</div>}
        {error && <p className="text-center py-4 text-red-500">{error}</p>}
        {!loading && !error && orders.length === 0 && (
          <p className="text-center py-4 text-gray-500">You haven't placed any orders yet. <Link to="/animals" className="text-blue-600 hover:underline">Browse animals to start!</Link></p>
        )}
        {!loading && !error && (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="relative px-4 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition duration-200">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{getOrderSummary(order)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold capitalize">
                      {/* Dynamic status badge with color coding */}
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                        order.status === 'CONFIRMED' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'PENDING' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800' // Default for unknown or failed
                      }`}>
                        {order.status?.toLowerCase() || 'unknown'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-800">Ksh {order.total_amount?.toFixed(2)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(order.created_at)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-right">
                      <Link to={`/orders/${order.id}`} className="text-blue-600 hover:text-blue-800 hover:underline">View</Link>
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

export default BuyerDashboardPage;