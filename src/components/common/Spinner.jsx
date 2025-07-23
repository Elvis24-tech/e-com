import React from 'react';

const Spinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-6 w-6 border-4 border-t-blue-500 border-solid border-white"></div>
    </div>
  );
};

export default Spinner;