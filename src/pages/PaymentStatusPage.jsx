// src/pages/PaymentStatusPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Assuming you might need to fetch order details again to show the final status
//import { fetchOrderDetails } from '../api/apiService'; 
import Spinner from '../components/common/Spinner'; // Assuming Spinner component exists

function PaymentStatusPage() {
  const location = useLocation(); // Hook to access URL query parameters (e.g., ?status=success&message=...)
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState('Processing your payment status...');
  const [statusType, setStatusType] = useState('info'); // 'info', 'success', 'error'

  useEffect(() => {
    // Parse query parameters from the URL
    const params = new URLSearchParams(location.search);
    const message = params.get('message') || 'An unexpected status occurred.';
    const status = params.get('status') || 'info'; // Default status type

    setStatusMessage(message);
    setStatusType(status);

    // Automatically redirect after a delay based on the status
    const timer = setTimeout(() => {
      if (status === 'success') {
        navigate('/buyer-dashboard'); // Go to buyer dashboard on success
      } else {
        navigate('/orders'); // Go back to orders list on failure or info
      }
    }, 6000); // Redirect after 6 seconds

    // Cleanup the timer when the component unmounts to prevent memory leaks
    return () => clearTimeout(timer); 
  }, [location.search, navigate]); // Dependencies for the effect

  // Helper function to apply Tailwind CSS classes based on the status type for visual feedback
  const getStatusClasses = () => {
    switch (statusType) {
      case 'success':
        return 'text-green-700 border-green-400 bg-green-50'; // Green styles for success
      case 'error':
        return 'text-red-700 border-red-400 bg-red-50';       // Red styles for errors
      case 'info':
      default:
        return 'text-blue-700 border-blue-400 bg-blue-50';     // Blue styles for general info
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-16 px-4">
      <div className={`max-w-md w-full p-8 border-l-4 rounded-lg shadow-xl text-center ${getStatusClasses()}`}>
        {/* Display appropriate heading based on status type */}
        {statusType === 'success' && <h1 className="text-4xl font-extrabold mb-4 text-green-700">Success!</h1>}
        {statusType === 'error' && <h1 className="text-4xl font-extrabold mb-4 text-red-700">Operation Failed</h1>}
        {statusType === 'info' && <h1 className="text-4xl font-extrabold mb-4 text-blue-700">Processing...</h1>}
        
        <p className="text-xl mb-6">{statusMessage}</p>
        
        {/* Action buttons based on status */}
        {statusType === 'success' && (
          <button onClick={() => navigate('/buyer-dashboard')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 mr-3">
            Go to My Orders
          </button>
        )}
        {/* Show back button if not success (e.g., error or info) */}
        {statusType !== 'success' && (
          <button onClick={() => navigate('/orders')} className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-6 rounded-lg shadow-md transition duration-300">
            Back to Orders
          </button>
        )}
      </div>
    </div>
  );
}

export default PaymentStatusPage;