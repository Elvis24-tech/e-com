// src/pages/OrderListPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserOrders } from '../api/apiService'; // Corrected import
import Spinner from '../components/common/Spinner'; // Assuming Spinner component exists

function OrderListPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userRole = localStorage.getItem('userRole'); // Get role for context (e.g., title)

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchUserOrders(); // Use imported API function
        setOrders(response.data);
      } catch (err) {
        setError('Failed to load orders.');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  // Helper to format dates for consistent display (DD-Mon-YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
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
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 capitalize">{userRole || 'User'} Orders</h1>
      
      {loading && <div className="text-center py-8"><Spinner /> Loading orders...</div>}
      {error && <p className="text-center py-8 text-red-500">{error}</p>}
      {!loading && !error && orders.length === 0 && (
        <p className="text-center py-8 text-gray-500">No orders found. Start browsing animals to place an order!</p>
      )}
      {!loading && !error && (
        <div className="overflow-x-auto rounded-lg shadow-xl border border-gray-200">
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
  );
}

export default OrderListPage;