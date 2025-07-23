// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/apiService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

const SignupPage = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    re_password: '',
    user_type: 'BUYER',
    phone_number: '',
    location: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (errors.general) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.general;
        return newErrors;
      });
    }
  };

  const setError = (message) => {
    setErrors({ general: message });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    const requiredFields = ['username', 'email', 'password', 're_password', 'phone_number', 'location'];

    for (const field of requiredFields) {
      if (!userData[field]) {
        setError('Please fill in all required fields.');
        setLoading(false);
        return;
      }
    }

    if (userData.password !== userData.re_password) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await registerUser({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        re_password: userData.re_password,
        user_type: userData.user_type,
        phone_number: userData.phone_number,
        location: userData.location,
      });

      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      const backendErrors = err.response?.data || {};
      const formattedErrors = {};

      for (const key in backendErrors) {
        const value = backendErrors[key];
        formattedErrors[key] = Array.isArray(value) ? value.join(' ') : value;
      }

      if (formattedErrors.non_field_errors) {
        formattedErrors.general = formattedErrors.non_field_errors;
        delete formattedErrors.non_field_errors;
      }

      setErrors(formattedErrors);
      console.error('Signup Error:', err.response || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-xl border border-gray-200">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Create Your Farmart Account</h2>

        {errors.general && (
          <p className="text-red-600 bg-red-100 border border-red-400 p-3 rounded-md text-center font-semibold mb-5">
            {errors.general}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input name="username" label="Username" value={userData.username} onChange={handleChange} error={errors.username} required />
          <Input name="email" type="email" label="Email" value={userData.email} onChange={handleChange} error={errors.email} required />
          <Input name="phone_number" label="Phone Number" value={userData.phone_number} onChange={handleChange} error={errors.phone_number} required />
          <Input name="location" label="Location" value={userData.location} onChange={handleChange} error={errors.location} required />
          <Input name="password" type="password" label="Password" value={userData.password} onChange={handleChange} error={errors.password} required />
          <Input name="re_password" type="password" label="Confirm Password" value={userData.re_password} onChange={handleChange} error={errors.re_password} required />

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">I am a:</label>
            <div className="flex justify-around items-center">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  className="h-4 w-4 text-blue-600 accent-blue-600"
                  name="user_type"
                  value="BUYER"
                  checked={userData.user_type === 'BUYER'}
                  onChange={handleChange}
                />
                <span className="ml-2 text-gray-700 font-medium">Buyer</span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  className="h-4 w-4 text-green-600 accent-green-600"
                  name="user_type"
                  value="FARMER"
                  checked={userData.user_type === 'FARMER'}
                  onChange={handleChange}
                />
                <span className="ml-2 text-gray-700 font-medium">Seller</span>
              </label>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 rounded-lg shadow-md transition duration-300"
          >
            {loading ? <Spinner /> : 'Register'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
