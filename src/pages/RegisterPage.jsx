// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/apiService'; // Corrected import
import Input from '../components/common/Input';       // Assuming styled Input component
import Button from '../components/common/Button';     // Assuming styled Button component
import Spinner from '../components/common/Spinner';   // Assuming Spinner component exists

const SignupPage = () => {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        re_password: '', // Corrected state key to match backend expectation
        user_type: 'BUYER', // Default role
    });
    const [errors, setErrors] = useState({}); // State to hold form validation errors
    const [loading, setLoading] = useState(false); // State for loading spinner

    const navigate = useNavigate(); // Hook for navigation

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value })); // Update the specific field in userData state
        
        // Clear the specific error for this field when the user starts typing in it
        if (errors[name]) {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }
        // Also clear general errors if the user starts typing after seeing them
        if (errors.general) {
             setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors.general;
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Clear all previous errors before a new submission attempt
        setLoading(true); // Activate loading spinner

        // --- Client-side validation ---
        if (!userData.username || !userData.email || !userData.password || !userData.re_password) {
            setError('Please fill in all required fields.');
            setLoading(false); // Stop loading if validation fails
            return;
        }
        if (userData.password !== userData.re_password) { // Password confirmation check
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }
        if (userData.password.length < 6) { // Basic password strength check
            setError('Password must be at least 6 characters long.');
            setLoading(false);
            return;
        }

        try {
            await registerUser({ // Call the signup API function
                username: userData.username,
                email: userData.email,
                password: userData.password,
                re_password: userData.re_password, // Ensure this field name matches backend expectation
                user_type: userData.user_type,    // Include the selected user type
            });
            
            alert('Registration successful! Please log in.');
            navigate('/login'); // Redirect to the login page on success

        } catch (err) {
            if (err.response && err.response.data) {
                const backendErrors = err.response.data;
                const formattedErrors = {};
                
                // Iterate over backend errors and format them for display
                for (const key in backendErrors) {
                    const errorValue = backendErrors[key];
                    if (Array.isArray(errorValue)) {
                        formattedErrors[key] = errorValue.join(' ');
                    } else {
                        formattedErrors[key] = errorValue;
                    }
                }
                
                // Handle 'non_field_errors' specially, mapping them to a general error
                if (formattedErrors.non_field_errors) {
                    formattedErrors.general = formattedErrors.non_field_errors;
                    delete formattedErrors.non_field_errors;
                }
                setErrors(formattedErrors); // Update the form errors state
            } else {
                // Handle network errors or issues where no response data is available
                setErrors({ general: 'An unexpected error occurred. Please check your connection or try again.' });
            }
            console.error('Signup Error:', err.response || err); // Log the error for debugging
        } finally {
            setLoading(false); // Always reset loading state
        }
    };

    return (
        <div className="flex justify-center items-center mt-10">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-xl border border-gray-200">
                <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Create Your Farmart Account</h2>
                
                {/* Display general errors */}
                {errors.general && (
                    <p className="text-red-600 bg-red-100 border border-red-400 p-3 rounded-md text-center font-semibold mb-5">
                        {errors.general}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Username Input */}
                    <div>
                        <Input 
                            name="username" 
                            label="Username" 
                            value={userData.username} 
                            onChange={handleChange} 
                            error={errors.username} // Pass specific error from state
                        />
                    </div>
                    
                    {/* Email Input */}
                    <div>
                        <Input 
                            name="email" 
                            type="email" 
                            label="Email" 
                            value={userData.email} 
                            onChange={handleChange} 
                            error={errors.email} // Pass specific error
                        />
                    </div>
                    
                    {/* Password Input */}
                    <div>
                        <Input 
                            name="password" 
                            type="password" 
                            label="Password" 
                            value={userData.password} 
                            onChange={handleChange} 
                            error={errors.password} // Pass specific error
                        />
                    </div>
                    
                    {/* Confirm Password Input */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="re_password">Confirm Password</label>
                        <input
                            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            id="re_password" // Ensure ID matches name and state key
                            type="password"
                            placeholder="Confirm Password"
                            value={userData.re_password} // Correctly uses state value
                            onChange={handleChange} // Uses the general handler, which clears errors
                            required
                        />
                        {/* Specific error for password mismatch */}
                        {errors.re_password && <p className="text-red-500 text-xs mt-1">{errors.re_password}</p>}
                    </div>
                    
                    {/* Role Selection */}
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">I am a:</label>
                        <div className="flex justify-around items-center">
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    className="h-4 w-4 text-blue-600 accent-blue-600"
                                    name="user_type" // Name must match the state key
                                    value="BUYER"
                                    checked={userData.user_type === 'BUYER'}
                                    onChange={handleChange} // Handler correctly updates userData.user_type
                                />
                                <span className="ml-2 text-gray-700 font-medium">Buyer</span>
                            </label>
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    className="h-4 w-4 text-green-600 accent-green-600"
                                    name="user_type" // Name must match the state key
                                    value="FARMER"
                                    checked={userData.user_type === 'FARMER'}
                                    onChange={handleChange} // Handler correctly updates userData.user_type
                                />
                                <span className="ml-2 text-gray-700 font-medium">Seller</span>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button 
                        type="submit" 
                        variant="primary" 
                        disabled={loading} // Button is disabled while loading
                        className="w-full flex justify-center py-3 px-4 rounded-lg shadow-md transition duration-300"
                    >
                        {loading ? <Spinner /> : 'Register'} {/* Show spinner or text based on loading state */}
                    </Button>
                </form>
                
                {/* Link to Login */}
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