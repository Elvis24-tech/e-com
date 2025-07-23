// src/pages/OrderDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrderDetails, initiateMpesaPayment, fetchUserRole } from '../api/apiService'; // Corrected import
import Spinner from '../components/common/Spinner'; // Assuming Spinner component exists

function OrderDetailPage() {
  const { id } = useParams(); // Get order ID from URL parameters
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [paymentError, setPaymentError] = useState('');

  const userRole = localStorage.getItem('userRole');
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchOrderDetails(id);
        setOrder(response.data);
      } catch (err) {
        setError('Could not load order details.');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [id]); // Re-fetch if the order ID in the URL changes

  const handleInitiatePayment = async () => {
    if (!accessToken) { // Check if user is logged in
      alert('Please login to make a purchase.');
      navigate('/login');
      return;
    }
    if (!paymentPhone) {
      setPaymentError('Please enter your phone number to proceed.');
      return;
    }

    setPaymentMessage('');
    setPaymentError('');

    try {
      // --- IMPORTANT: Proper Order Creation Flow ---
      // This example assumes the order already exists and is confirmed.
      // If your backend flow is to create the order right before payment, adjust this.
      
      // Check order status before allowing payment
      if (!order || order.status !== 'CONFIRMED') {
         setPaymentError(`Cannot pay for order in status: ${order?.status || 'unknown'}`);
         return;
      }
      
      // Call the backend API to initiate M-Pesa payment
      const response = await initiateMpesaPayment(order.id, paymentPhone); // Use order.id and phone number

      // Handle response from backend
      if (response.data && response.data.message) {
        setPaymentMessage(response.data.message);
      } else {
        setPaymentMessage('Payment initiated. Please check your phone for the M-Pesa prompt.');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        let detail = '';
        if (err.response.data.error) detail += err.response.data.error + ' ';
        if (err.response.data.detail) detail += err.response.data.detail;
        setPaymentError(detail || 'Payment initiation failed. Please check details or try again.');
      } else {
        setPaymentError('Payment initiation failed. Please check details or try again.');
      }
      console.error('M-Pesa payment error:', err.response || err);
    }
  };

  if (loading) return <div className="text-center p-8"><Spinner /> Loading order details...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!order) return <div className="text-center p-8 text-gray-500">Order not found.</div>;

  // Helper to style status badges
  const getStatusClass = (status) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'CONFIRMED': return 'bg-yellow-100 text-yellow-800';
      case 'PENDING': return 'bg-blue-100 text-blue-800';
      default: return 'bg-red-100 text-red-800'; // Default for unknown or failed
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Order Details</h1>
      <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200">
        {/* Order Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b pb-4">
          <div>
            <p className="text-lg font-semibold text-gray-700">Order ID: <span className="font-normal">{order.id}</span></p>
            <p className="text-sm text-gray-500">Date: {new Date(order.created_at).toLocaleString()}</p>
          </div>
          {/* Status Badge */}
          <div className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${getStatusClass(order.status)}`}>
            {order.status?.toLowerCase() || 'unknown'}
          </div>
        </div>

        {/* Order Items List */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Items</h2>
          {order.items && order.items.length > 0 ? (
            <ul className="space-y-4">
              {order.items.map(item => (
                <li key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-100 shadow-sm">
                  <div className="flex items-center flex-grow">
                    {/* Placeholder for animal image */}
                    <div className="w-16 h-16 bg-gray-200 rounded-md mr-4 flex-shrink-0 object-cover"></div> 
                    <div className="flex-grow">
                      <p className="font-medium text-gray-800">{item.animal.name}</p>
                      <p className="text-sm text-gray-600">x {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-medium text-gray-900">Ksh {(item.animal.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No items in this order.</p>
          )}
        </div>

        {/* Order Summary and Payment Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Total Amount */}
          <div className="text-xl font-bold text-gray-800">
            Total Amount: <span className="text-blue-600">Ksh {order.total_amount?.toFixed(2)}</span>
          </div>

          {/* Payment Section (Buyer Only, if order is CONFIRMED and not PAID) */}
          {userRole === 'BUYER' && order.status === 'CONFIRMED' && (
            <div className="w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-200 pl-0 md:pl-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Make Payment</h3>
              {paymentMessage && <p className="text-green-600 mb-3 font-medium">{paymentMessage}</p>}
              {paymentError && <p className="text-red-600 mb-3 font-medium">{paymentError}</p>}
              <form onSubmit={(e) => { e.preventDefault(); handleInitiatePayment(); }}>
                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-1">Phone Number</label>
                  <input
                    type="text"
                    id="phoneNumber"
                    value={paymentPhone}
                    onChange={(e) => setPaymentPhone(e.target.value)}
                    placeholder="e.g., 2547XXXXXXXX"
                    className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300"
                >
                  Initiate M-Pesa
                </button>
              </form>
            </div>
          )}
          {/* Message if order cannot be paid yet */}
          {userRole === 'BUYER' && order.status !== 'CONFIRMED' && (
            <div className="text-center mt-4">
              <p className="text-gray-600">Order status is '{order.status}'. Payment can only be made when confirmed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;