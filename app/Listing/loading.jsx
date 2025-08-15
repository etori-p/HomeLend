import React from 'react';
import { FaSpinner } from 'react-icons/fa'; 

export default function HouseListLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] bg-white">
      <FaSpinner className="animate-spin text-blue-500 w-16 h-16" />
      <h2 className="text-3xl font-semibold text-gray-700 mt-6">Loading Properties...</h2>
    </div>
  );
}
