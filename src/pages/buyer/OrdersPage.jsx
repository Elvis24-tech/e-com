
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../api/client';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';

const BuyerOrdersPage = ({ onNavigate }) => {
    const { user, tokens } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [paymentError, setPaymentError] = useState('');

    useEffect(() => {
        apiClient.get('/api/orders/', tokens.access)
            .then(data => setOrders(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [tokens]);

    const handlePayClick = (order) => {
        setSelectedOrder(order);
        setPhoneNumber(user?.phone_number || '254');
        setPaymentError('');
        setIsModalOpen(true);
    };

    const handlePaymentSubmit = async () => {
        setPaymentError('');
        if (!phoneNumber || !phoneNumber.startsWith('254')) {
            setPaymentError("Phone number must start with 254.");
            return;
        }
        if (!selectedOrder) return;

        try {
            await apiClient.post('/api/make-payment/', { order_id: selectedOrder.id, phone_number: phoneNumber }, tokens.access);
            alert("Payment initiated! Check your phone for M-Pesa prompt.");
            setIsModalOpen(false);
        } catch (err) {
            alert("Failed to initiate payment.");
        }
    };

    if (loading) return <Spinner fullScreen />;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Orders</h1>
                <Button onClick={() => onNavigate('home')} variant="ghost">← Back to Shop</Button>
            </div>
            <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
                {orders.length === 0 ? <p>You have no orders.</p> : orders.map(order => (
                    <div key={order.id} className="border-b last:border-b-0 pb-4 mb-4 flex justify-between items-center">
                        <div>
                            <p><strong>Order ID:</strong> #{order.id}</p>
                            <p><strong>Status:</strong> <span className="font-semibold">{order.status}</span></p>
                            <p><strong>Total:</strong> Ksh {parseFloat(order.total_price).toLocaleString()}</p>
                        </div>
                        {order.status === 'CONFIRMED' && (
                           <Button onClick={() => handlePayClick(order)} variant="secondary">Pay with M-Pesa</Button>
                        )}
                    </div>
                ))}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="M-Pesa Payment">
                <p>Pay for Order #{selectedOrder?.id} (Ksh {parseFloat(selectedOrder?.total_price || 0).toLocaleString()})</p>
                <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="M-Pesa Phone Number" className="w-full mt-4 px-4 py-2 border rounded-md"/>
                {paymentError && <p className="text-red-500 text-sm mt-2">{paymentError}</p>}
                <Button onClick={handlePaymentSubmit} className="w-full mt-4">Initiate Payment</Button>
            </Modal>
        </div>
    );
};

export default BuyerOrdersPage;
