
import React from 'react';
import Spinner from './Spinner';

const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false, loading = false, className = '' }) => {
    const baseStyles = 'font-bold py-2 px-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center';
    
    const variants = {
        primary: 'bg-green-600 text-white hover:bg-green-700',
        secondary: 'bg-blue-600 text-white hover:bg-blue-700',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        ghost: 'bg-transparent text-gray-600 hover:bg-gray-200',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {loading ? <Spinner size="sm" /> : children}
        </button>
    );
};

export default Button;

