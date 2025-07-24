import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
                <h3 className="text-xl font-semibold mb-4">{title}</h3>
                {children}
            </div>
        </div>
    );
};

export default Modal;

