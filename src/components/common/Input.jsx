// src/components/common/Input.jsx
import React from 'react';

const Input = ({
  name,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  error = '',
  autoComplete = 'off',
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className="block text-gray-700 text-sm font-semibold mb-2"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className={`shadow-sm appearance-none border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 ${
          error ? 'focus:ring-red-500' : 'focus:ring-blue-500'
        } focus:border-transparent`}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;
