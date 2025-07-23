// src/pages/AnimalDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAnimalDetail, initiateMpesaPayment, fetchUserRole } from '../api/apiService'; // Corrected imports
import Spinner from '../components/common/Spinner'; // Assuming Spinner component exists
import Button from '../components/common/Button';   // Assuming Button component exists

function AnimalDetailPage() {
  const { id } = useParams(); // Get animal ID from URL parameters
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentPhone, setPaymentPhone] = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [paymentError, setPaymentError] = useState('');

  const userRole = localStorage.getItem('userRole');
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  useEffect(() => {
    const loadAnimal = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchAnimalDetail(id); // Use imported API function
        setAnimal(response.data);
      } catch (err) {
        setError('Could not load animal details.');
        console.error('Error fetching animal:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAnimal();
  }, [id]); // Re-fetch if the animal ID in the URL changes

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
      // --- IMPORTANT: Implement Proper Order Creation Flow ---
      // This example assumes the order already exists and is confirmed.
      // If your backend flow is to create the order right before payment, adjust this.
      
      // Check order status before allowing payment
      if (!animal || animal.is_sold) { // Cannot pay if animal is sold or not loaded
        setPaymentError('Cannot initiate payment for this animal.');
        return;
      }
      if (userRole === 'FARMER') { // Farmers cannot buy their own animals
         setPaymentError('Sellers cannot purchase their own animals.');
         return;
      }

      // Simulate order creation before payment (replace with actual API call)
      const response = await axios.post('https://farmart-end.onrender.com/api/orders/', { // Replace with your actual createOrder API
        items: [{ animal_id: animal.id, quantity: 1, price: animal.price }], // Placeholder item structure
      }, { headers: getAuthHeaders() }); // Authenticated request

      const orderId = response.data.id; // Assuming your backend returns the created order ID

      // Now, initiate M-Pesa payment for the created order
      const paymentResponse = await initiateMpesaPayment(orderId, paymentPhone);

      if (paymentResponse.data && paymentResponse.data.message) {
        setPaymentMessage(paymentResponse.data.message);
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

  if (loading) return <div className="text-center p-8"><Spinner /> Loading animal details...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!animal) return <div className="text-center p-8 text-gray-500">Animal not found.</div>;

  const imageUrl = animal.image ? animal.image : '/images/placeholder_animal.png';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Animal Details</h1>
      <div className="bg-white p-8 rounded-lg shadow-xl border border-gray-200 flex flex-col lg:flex-row gap-8">
        {/* Animal Image */}
        <div className="lg:w-1/2">
          <img
            src={imageUrl}
            alt={animal.name || 'Farm Animal'}
            className="w-full h-auto max-h-96 object-cover rounded-lg shadow-lg"
            onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder_animal.png'; }} // Fallback on image load error
          />
        </div>

        {/* Animal Details and Actions */}
        <div className="lg:w-1/2">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4">{animal.name}</h2>
          <p className="text-gray-600 text-lg mb-2">Type: {animal.animal_type}</p>
          <p className="text-gray-600 text-lg mb-2">Breed: {animal.breed}</p>
          <p className="text-gray-800 font-bold text-2xl mt-3">Ksh {animal.price}</p>

          {animal.farmer_name && (
            <p className="text-sm text-gray-500 mt-4">Listed by: {animal.farmer_name}</p>
          )}
          <p className="text-gray-700 text-md mt-4">{animal.description}</p>

          {/* Buyer Actions */}
          {userRole === 'BUYER' && !animal.is_sold && ( // Show purchase options only to buyers if not sold
            <div className="mt-8 pt-4 border-t border-gray-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Purchase Options</h3>
              {paymentMessage && <p className="text-green-600 mb-4">{paymentMessage}</p>}
              {paymentError && <p className="text-red-600 mb-4">{paymentError}</p>}
              <form onSubmit={(e) => { e.preventDefault(); handleInitiatePayment(); }}>
                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-1">Phone Number for M-Pesa</label>
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
                  Initiate M-Pesa Payment
                </button>
              </form>
            </div>
          )}
          {/* Message if animal is sold */}
          {animal.is_sold && (
            <div className="mt-8 pt-4 border-t border-gray-200 text-center">
              <p className="text-xl font-semibold text-gray-700">This animal has been sold.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnimalDetailPage;