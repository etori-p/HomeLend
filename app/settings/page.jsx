// app/settings/page.jsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { FaSpinner, FaEnvelope, FaLock, FaTrash, FaCheckCircle, FaTimesCircle, FaBell, FaSave } from 'react-icons/fa';

// Simple Spinner Component
const Spinner = ({ size = 'w-5 h-5', color = 'text-white' }) => (
  <FaSpinner className={`${size} ${color} animate-spin`} />
);

export default function SettingsPage() {
  const { data: session, status: sessionStatus } = useSession();

  // Newsletter State
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(true);
  const [newsletterError, setNewsletterError] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState('');

  // Password Reset State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Account Deletion State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');

  // --- Fetch Newsletter Status ---
  const fetchNewsletterStatus = useCallback(async () => {
    setNewsletterLoading(true);
    setNewsletterError('');
    if (sessionStatus === 'authenticated') {
      try {
        const res = await fetch('/api/user/settings/newsletter', { method: 'GET' });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch newsletter status.');
        }
        const data = await res.json();
        setIsSubscribed(data.isSubscribed);
      } catch (err) {
        console.error('Error fetching newsletter status:', err);
        setNewsletterError(err.message || 'Could not load newsletter status.');
      } finally {
        setNewsletterLoading(false);
      }
    } else if (sessionStatus !== 'loading') {
      setNewsletterLoading(false);
      setNewsletterError('Please log in to manage newsletter settings.');
    }
  }, [sessionStatus]);

  useEffect(() => {
    fetchNewsletterStatus();
  }, [fetchNewsletterStatus]);

  // --- Handle Newsletter Toggle ---
  const handleNewsletterToggle = async () => {
    if (sessionStatus !== 'authenticated') {
      setNewsletterError('You must be logged in to change subscription.');
      return;
    }
    setNewsletterLoading(true);
    setNewsletterError('');
    setNewsletterSuccess('');
    try {
      const res = await fetch('/api/user/settings/newsletter', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isSubscribed: !isSubscribed }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update subscription.');
      }

      const data = await res.json();
      setIsSubscribed(data.isSubscribed);
      setNewsletterSuccess('Newsletter subscription updated successfully!');
    } catch (err) {
      console.error('Error updating newsletter:', err);
      setNewsletterError(err.message || 'Failed to update newsletter subscription.');
    } finally {
      setNewsletterLoading(false);
    }
  };

  // --- Handle Password Form Changes ---
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  // --- Handle Password Reset Submit ---
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess('');

    if (sessionStatus !== 'authenticated') {
      setPasswordError('You must be logged in to reset your password.');
      setPasswordLoading(false);
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError('New password and confirmation do not match.');
      setPasswordLoading(false);
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      setPasswordLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/user/settings/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordForm),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to reset password.');
      }

      setPasswordSuccess('Password reset successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      }); // Clear form
    } catch (err) {
      console.error('Error resetting password:', err);
      setPasswordError(err.message || 'An error occurred during password reset.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // --- Handle Account Deletion ---
  const handleDeleteAccount = async () => {
    if (sessionStatus !== 'authenticated') {
      setDeleteError('You must be logged in to delete your account.');
      return;
    }

    // Show confirmation modal first
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    setShowDeleteConfirm(false); // Close modal
    setDeleteLoading(true);
    setDeleteError('');
    setDeleteSuccess('');

    try {
      const res = await fetch('/api/user/settings/account', {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to delete account.');
      }

      setDeleteSuccess('Account deleted successfully! Redirecting...');
      // After successful deletion, log out the user and redirect
      await signOut({ callbackUrl: '/' });
    } catch (err) {
      console.error('Error deleting account:', err);
      setDeleteError(err.message || 'An error occurred during account deletion.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  if (sessionStatus === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)]">
        <Spinner size="w-16 h-16" color="text-blue-500" />
        <h2 className="text-2xl font-semibold text-gray-700 mt-4">Loading Settings...</h2>
      </div>
    );
  }

  if (sessionStatus === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] text-red-600">
        <FaTimesCircle className="w-12 h-12 mb-4" />
        <p className="text-xl">You must be logged in to manage your settings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg my-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Account Settings</h1>

      {/* Newsletter Subscription */}
      <div className="mb-8 p-6 border border-gray-200 rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaBell className="mr-2 text-blue-500" /> Newsletter Subscription
        </h2>
        {newsletterLoading ? (
          <p className="text-gray-600 flex items-center"><Spinner size="w-4 h-4" color="text-gray-600" /> <span className="ml-2">Loading status...</span></p>
        ) : newsletterError ? (
          <p className="text-red-500">{newsletterError}</p>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-gray-700 text-lg">Receive email updates:</span>
              <label htmlFor="newsletterToggle" className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="newsletterToggle"
                  className="sr-only peer"
                  checked={isSubscribed}
                  onChange={handleNewsletterToggle}
                  disabled={newsletterLoading}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-sm font-medium text-gray-900">{isSubscribed ? 'Subscribed' : 'Unsubscribed'}</span>
              </label>
            </div>
            {newsletterSuccess && (
              <p className="text-green-600 text-sm mt-2">{newsletterSuccess}</p>
            )}
          </>
        )}
      </div>

      {/* Reset Password */}
      <div className="mb-8 p-6 border border-gray-200 rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaLock className="mr-2 text-blue-500" /> Reset Password
        </h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={passwordForm.confirmNewPassword}
              onChange={handlePasswordChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}
          {passwordSuccess && (
            <p className="text-green-600 text-sm">{passwordSuccess}</p>
          )}
          <button
            type="submit"
            disabled={passwordLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 font-semibold flex items-center justify-center transition-colors duration-200"
          >
            {passwordLoading ? <Spinner /> : <FaSave className="mr-2" />}
            {passwordLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>

      {/* Delete Account */}
      <div className="p-6 border border-red-200 bg-red-50 rounded-lg">
        <h2 className="text-2xl font-semibold text-red-800 mb-4 flex items-center">
          <FaTrash className="mr-2 text-red-500" /> Delete Account
        </h2>
        <p className="text-red-700 mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        {deleteError && (
          <p className="text-red-500 text-sm mb-2">{deleteError}</p>
        )}
        {deleteSuccess && (
          <p className="text-green-600 text-sm mb-2">{deleteSuccess}</p>
        )}
        <button
          onClick={handleDeleteAccount}
          disabled={deleteLoading}
          className="bg-red-600 text-white py-2 px-6 rounded-md hover:bg-red-700 disabled:bg-red-400 font-semibold flex items-center justify-center transition-colors duration-200"
        >
          {deleteLoading ? <Spinner /> : <FaTrash className="mr-2" />}
          {deleteLoading ? 'Deleting...' : 'Delete My Account'}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-red-500 text-white rounded-t-lg">
              <h3 className="text-lg font-bold flex items-center">
                <FaExclamationTriangle className="mr-2 text-xl" /> Confirm Deletion
              </h3>
              <button onClick={cancelDelete} className="text-white hover:text-gray-100">
                <FaTimesCircle className="text-xl" />
              </button>
            </div>
            <div className="p-6 text-center">
              <p className="text-gray-700 text-md mb-6">Are you absolutely sure you want to delete your account? This action is irreversible.</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={confirmDelete}
                  className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={cancelDelete}
                  className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
