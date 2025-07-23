// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
// *** IMPORTANT: Ensure apiService.js exports functions directly ***
import { loginUser, registerUser, fetchUserRole, logoutUser } from '../api/apiService'; 

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the Provider component
const AuthProvider = ({ children }) => {
    // State to hold user information (username, role)
    const [user, setUser] = useState(null); 
    // State to manage the initial loading of authentication status
    const [loading, setLoading] = useState(true); 

    // Effect hook to initialize authentication state when the app loads
    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('accessToken'); // Check for stored access token
            if (token) {
                try {
                    // Fetch user details (including role and username) from backend
                    // This requires a '/users/me/' endpoint in your Django backend
                    const role = await fetchUserRole(token); // Fetch user role using API service
                    const username = localStorage.getItem('username'); // Get username from storage
                    
                    // Set the user state if details are found
                    setUser({ username: username, role: role }); 
                } catch (error) {
                    console.error("Token invalid or fetch failed, logging out:", error);
                    // Clear authentication info if session is invalid (e.g., expired token)
                    logoutUser(); 
                    setUser(null); // Ensure user state is cleared
                }
            }
            setLoading(false); // Indicate that the initial auth check is complete
        };
        initializeAuth();
    }, []); // Empty dependency array means this effect runs only once when the component mounts

    // Login function: calls the API service, sets user state and local storage
    const login = async (credentials) => {
        const response = await loginUser(credentials); // Call the API service function
        const role = localStorage.getItem('userRole'); // Get the role from storage (set by loginUser)
        setUser({ username: credentials.username, role: role }); // Set user state with username and role
        // Redirection logic is handled by the component that calls login (e.g., LoginPage)
    };

    // Signup function: calls the API service to register a user
    const signup = async (userData) => {
        await registerUser(userData); // Call the API service function
        // Redirection after signup is handled in the SignupPage component
    };

    // Logout function: clears tokens and user info, then reloads the page
    const logout = () => {
        logoutUser(); // Use the imported logout function
        setUser(null); // Clear user state
    };

    // Context value to be provided to consuming components
    const value = {
        user, // User object containing username and role
        loading, // Loading state for initial auth check
        login,
        signup,
        logout,
        isAuthenticated: !!localStorage.getItem('accessToken'), // Helper to check if user is authenticated
        userRole: user ? user.role : null, // Get role from user state, or null if not logged in
    };

    // Render children only after loading is complete to avoid showing partial state
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// 3. Create the custom hook to consume the context
const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        // Throw an error if useAuth is called outside of an AuthProvider
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// 4. Export the provider and the hook
export { AuthProvider, useAuth };