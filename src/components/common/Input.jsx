// src/components/common/Input.jsx
import React from 'react';

const Input = ({ name, label, value, onChange, type = 'text', placeholder, required, error }) => {
  return (
    <div>
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
        {label}
      </label>
      <input
        type={type}
        id={name}
        name={name} // Crucial for handleChange to identify the field
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`shadow-sm appearance-none border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'} focus:border-transparent`}
      />
      {/* Display specific field error if available */}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default Input;