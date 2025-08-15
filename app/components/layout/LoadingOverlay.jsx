'use client';

import React from 'react';
import { FaSpinner } from 'react-icons/fa'; 

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
      <FaSpinner className="animate-spin text-blue-500 w-12 h-12" />
    </div>
  );
};

export default LoadingOverlay;
