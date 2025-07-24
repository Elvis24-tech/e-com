
import React from 'react';

const Spinner = ({ fullScreen = false, size = 'md' }) => {
    const sizes = {
        sm: 'h-6 w-6 border-2',
        md: 'h-16 w-16 border-4',
    };
    return (
        <div className={`flex justify-center items-center ${fullScreen ? 'h-screen' : 'h-full w-full'}`}>
            <div className={`animate-spin rounded-full border-t-4 border-b-4 border-green-600 ${sizes[size]}`}></div>
        </div>
    );
};

export default Spinner;

