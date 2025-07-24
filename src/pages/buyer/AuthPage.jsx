import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';

const BuyerAuthPage = ({ onNavigate }) => {
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ phone_number: '254' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAuth = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!isLogin) {
            if (formData.password !== formData.re_password) {
                setError("Passwords do not match.");
                return;
            }
            if (!formData.phone_number || !formData.phone_number.startsWith('254')) {
                setError("Phone number must start with 254.");
                return;
            }
        }
        
        setLoading(true);
        try {
            if (isLogin) {
                await login(formData.username, formData.password);
                // THIS IS THE FIX
                onNavigate('/shop');
            } else {
                await register({ ...formData, user_type: 'BUYER' });
                alert("Registration successful! Please login.");
                setIsLogin(true);
            }
        } catch (err) {
            setError(err.data ? JSON.stringify(err.data) : err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <div className="max-w-md mx-auto my-10 bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6">{isLogin ? 'Login' : 'Create Buyer Account'}</h2>
            <form onSubmit={handleAuth} className="space-y-4">
                {error && <p className="text-red-500 text-sm bg-red-100 p-3 rounded">{error}</p>}
                <input type="text" name="username" placeholder="Username" onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
                {!isLogin && <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />}
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
                {!isLogin && <>
                    <input type="password" name="re_password" placeholder="Confirm Password" onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
                    <input type="text" name="phone_number" value={formData.phone_number} placeholder="Phone Number (e.g., 2547...)" onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
                    <input type="text" name="location" placeholder="Location" onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
                </>}
                <Button type="submit" loading={loading} disabled={loading} className="w-full">
                    {isLogin ? 'Login' : 'Register'}
                </Button>
            </form>
            <p className="text-center mt-4">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button onClick={() => setIsLogin(!isLogin)} className="text-green-600 hover:underline ml-1">
                    {isLogin ? 'Register' : 'Login'}
                </button>
            </p>
        </div>
    );
};

export default BuyerAuthPage;