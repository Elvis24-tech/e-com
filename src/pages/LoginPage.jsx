// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, fetchUserRole } from '../api/apiService'; // Corrected import
import Input from '../components/common/Input';       // Assuming styled Input component
import Button from '../components/common/Button';     // Assuming styled Button component
import Spinner from '../components/common/Spinner';   // Assuming Spinner component exists

const LoginPage = ({ setUserRole }) => { // setUserRole is passed from App.js to update global state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Basic validation
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      // Call the loginUser API function
      const response = await loginUser({ username, password });
      // loginUser should have already fetched and stored role/username in localStorage and updated context
      const role = localStorage.getItem('userRole'); 
      setUserRole(role); // Update App's global state

      // Redirect based on role
      if (role === 'FARMER') {
        navigate('/seller-dashboard');
      } else { // Default redirect for BUYER or if role is unknown/null
        navigate('/buyer-dashboard');
      }

    } catch (err) {
      // Handle API errors
      if (err.response && err.response.status === 401) {
        setError('Invalid username or password.');
      } else if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail); // Display backend's specific error message
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Login error:', err.response || err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100 py-16 px-4">
      <div className="bg-white p-10 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Login to Your Farmart Account</h2>
        {error && <p className="text-red-600 bg-red-100 border border-red-400 p-3 rounded-md text-center mb-5 font-semibold">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <Input 
              name="username" 
              label="Username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} // Directly update state for simple inputs
              placeholder="Username" 
              required 
            />
          </div>
          <div>
            <Input 
              name="password" 
              type="password" 
              label="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Password" 
              required 
            />
          </div>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={loading || !username || !password} // Disable if fields are empty or loading
            className="w-full flex justify-center py-3 px-4 rounded-lg shadow-md transition duration-300"
          >
            {loading ? <Spinner /> : 'Sign In'}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;