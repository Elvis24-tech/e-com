
import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import Button from '../common/Button';

const Cart = ({ isOpen, onClose, onNavigate }) => {
    const { items, removeFromCart, checkout, totalPrice, itemCount } = useCart();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCheckout = async () => {
        setLoading(true);
        setError('');
        try {
            await checkout();
            alert('Order placed successfully!');
            onClose();
            onNavigate('my-orders');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-lg z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex flex-col h-full">
                <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="text-xl font-semibold">Shopping Cart ({itemCount})</h2>
                    <button onClick={onClose} className="text-2xl">&times;</button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        items.map(item => (
                            <div key={item.id} className="flex items-center justify-between mb-4 border-b pb-2">
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-gray-600">Qty: {item.quantity} @ Ksh {parseFloat(item.price).toLocaleString()}</p>
                                </div>
                                <div className="flex items-center">
                                    <p className="font-bold mr-4">Ksh {(item.price * item.quantity).toLocaleString()}</p>
                                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">Remove</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="p-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Subtotal:</span>
                        <span className="text-lg font-bold">Ksh {totalPrice.toLocaleString()}</span>
                    </div>
                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                    <Button onClick={handleCheckout} disabled={items.length === 0 || loading} loading={loading} className="w-full">
                        Proceed to Checkout
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Cart;

