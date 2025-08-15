// app/resetpassword/[token]/page.jsx
'use client';

import React, { useState } from 'react';
import { FaLock, FaSpinner, FaTimes } from 'react-icons/fa';
import { useRouter, useParams } from 'next/navigation';
import LoginModal from '../../components/auth/LoginModal'; 

const Spinner = ({ size = 'w-5 h-5', color = 'text-white' }) => (
  <FaSpinner className={`${size} ${color} animate-spin`} />
);

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = useParams();

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmNewPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (formData.newPassword !== formData.confirmNewPassword) {
      setLoading(false);
      setMessage('New password and confirmation do not match.');
      setIsSuccess(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setLoading(false);
      setMessage('New password must be at least 6 characters long.');
      setIsSuccess(false);
      return;
    }

    try {
      const res = await fetch('/api/user/settings/resetpassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword: formData.newPassword }),
      });

      const contentType = res.headers.get('content-type');
      let data = {};
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
      } else {
        data.message = res.statusText || 'An unexpected error occurred.';
      }

      setMessage(data.message);

      if (res.ok) {
        setIsSuccess(true);
        
        setIsLoginModalOpen(true);
      } else {
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Password reset failed:', error);
      setMessage('An unexpected error occurred. Please try again.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsLoginModalOpen(false);
    // Optional: redirect to home or login page after closing the modal
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="flex flex-col items-center">
          <FaLock className="text-4xl text-blue-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 text-center">Set a New Password</h2>
          <p className="mt-2 text-center text-gray-500">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              id="confirmNewPassword"
              name="confirmNewPassword"
              type="password"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {message && (
            <div className={`text-sm p-3 rounded-md ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Spinner /> : 'Reset Password'}
          </button>
        </form>
      </div>
      {/* Conditionally render the LoginModal */}
      {isLoginModalOpen && (
        <LoginModal isOpen={isLoginModalOpen} onClose={handleModalClose} />
      )}
    </div>
  );
}
