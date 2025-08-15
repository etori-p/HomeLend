// app/profile/page.jsx
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { FaSpinner, FaUserCircle, FaCalendarAlt, FaCamera, FaSave, FaTimesCircle, FaEdit, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

// Simple Spinner Component
const Spinner = ({ size = 'w-5 h-5', color = 'text-white' }) => (
  <FaSpinner className={`${size} ${color} animate-spin`} />
);

export default function ProfilePage() {
  const { data: session, status: sessionStatus, update: updateSession } = useSession();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    emailAddress: '',
    image: '',
    dateOfBirth: '',
    lastNamesUpdate: null, // Store the timestamp for name updates
  });
  const [initialUserData, setInitialUserData] = useState(null); 
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false); 
  const [showStatusScreen, setShowStatusScreen] = useState(false); 
  const [isSuccessStatus, setIsSuccessStatus] = useState(false); 
  const [statusMessage, setStatusMessage] = useState(''); 

  // Function to fetch user data from your API
  const fetchUserData = useCallback(async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    if (sessionStatus === 'authenticated' && session?.user?.email) {
      try {
        const res = await fetch('/api/user/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch profile data.');
        }

        const data = await res.json();
        const fetchedData = {
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          emailAddress: data.emailAddress || '',
          image: data.image || '',
          dateOfBirth: data.dateOfBirth || '', // YYYY-MM-DD format
          lastNamesUpdate: data.lastNamesUpdate ? new Date(data.lastNamesUpdate) : null,
        };
        setUserData(fetchedData);
        setInitialUserData(fetchedData); // Save initial data for reset
        setPreviewImage(data.image || '');
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message || 'Could not load profile data.');
      } finally {
        setLoading(false);
      }
    } else if (sessionStatus !== 'loading') {
      setLoading(false);
      setError('You must be logged in to view your profile.');
    }
  }, [sessionStatus, session?.user?.email]);

  // Fetch data on component mount and when session status changes
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Handle input changes for all editable fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Client-side validation for date of birth (18+ years)
  const validateDateOfBirth = (dobString) => {
    if (!dobString) {
      return 'Date of Birth is required.';
    }
    const dob = new Date(dobString);
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

    if (dob > eighteenYearsAgo) {
      return 'You must be at least 18 years old.';
    }
    return '';
  };

  // Check if names can be edited (more than 3 months since last update)
  const canEditNames = useMemo(() => {
    if (!userData.lastNamesUpdate) {
      return true; 
    }
    const threeMonthsInMs = 3 * 30 * 24 * 60 * 60 * 1000; // Approximate 3 months
    const timeSinceLastUpdate = Date.now() - userData.lastNamesUpdate.getTime();
    return timeSinceLastUpdate >= threeMonthsInMs;
  }, [userData.lastNamesUpdate]);

  // Handle file input change for profile picture
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setPreviewImage(userData.image || '');
    }
  };

  // Handle removing the selected new image
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewImage(userData.image || '');
  };

  // Handle form submission for updating profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit triggered!'); 
    setSubmitting(true);
    setError('');
    setSuccess('');
    setValidationErrors({}); 
    setShowStatusScreen(false); 

    if (sessionStatus !== 'authenticated') {
      setError('You must be logged in to update your profile.');
      setSubmitting(false);
      return;
    }

    // Client-side validation for date of birth
    const dobError = validateDateOfBirth(userData.dateOfBirth);
    if (dobError) {
      setValidationErrors({ dateOfBirth: dobError });
      setSubmitting(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('firstName', userData.firstName);
    formDataToSend.append('lastName', userData.lastName);
    formDataToSend.append('dateOfBirth', userData.dateOfBirth);

    if (selectedFile) {
      formDataToSend.append('profileImage', selectedFile);
    }

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        body: formDataToSend,
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.errors) {
          setValidationErrors(errorData.errors);
        }
        throw new Error(errorData.message || 'Failed to update profile.');
      }

      const updatedProfileData = await res.json();
      setUserData(updatedProfileData.user);
      setInitialUserData(updatedProfileData.user); 
      setPreviewImage(updatedProfileData.user.image || '');
      setSelectedFile(null);

      await updateSession(); 

      setSuccess('Profile updated successfully!');
      setStatusMessage('Profile updated successfully!');
      setIsSuccessStatus(true);
      setShowStatusScreen(true); 

      setTimeout(() => {
        setShowStatusScreen(false); 
        setIsEditing(false);
      }, 3000); 
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'An unexpected error occurred during update.');
      setStatusMessage(err.message || 'An unexpected error occurred during update.');
      setIsSuccessStatus(false);
      setShowStatusScreen(true); 

      setTimeout(() => {
        setShowStatusScreen(false);
        // Optionally, stay in edit mode on failure or revert based on UX preference
      }, 3000); 
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditClick = () => {
    console.log('Edit button clicked! Entering edit mode.'); 
    setIsEditing(true);
    setSuccess(''); 
    setError('');
    setValidationErrors({});
  };

  const handleCancelEdit = () => {
    console.log('Cancel button clicked! Exiting edit mode.');
    setIsEditing(false);
    setUserData(initialUserData); 
    setPreviewImage(initialUserData.image || ''); 
    setSelectedFile(null); 
    setError(''); 
    setSuccess('');
    setValidationErrors({});
  };


  if (sessionStatus === 'loading' || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)]">
        <Spinner size="w-16 h-16" color="text-blue-500" />
        <h2 className="text-2xl font-semibold text-gray-700 mt-4">Loading Profile...</h2>
      </div>
    );
  }

  if (error && sessionStatus === 'unauthenticated') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] text-red-600">
        <FaTimesCircle className="w-12 h-12 mb-4" />
        <p className="text-xl">{error}</p>
        <p className="text-md text-gray-600 mt-2">Please log in to view your profile.</p>
      </div>
    );
  }

  if (!userData.emailAddress && !loading && !error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] text-red-600">
        <FaTimesCircle className="w-12 h-12 mb-4" />
        <p className="text-xl">Profile data could not be loaded.</p>
        <p className="text-md text-gray-600 mt-2">Please ensure your account exists and try again.</p>
      </div>
    );
  }

  // Determine if the form is valid for submission
  const isFormValid = Object.keys(validationErrors).length === 0 && !submitting;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg rounded-lg my-12 relative">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Your Profile</h1>

      {/* Overlay Status Screen */}
      {showStatusScreen && (
        <div className="absolute inset-0 bg-white flex flex-col items-center justify-center rounded-lg z-20 transition-opacity duration-300">
          {isSuccessStatus ? (
            <FaCheckCircle className="text-green-500 text-6xl mb-4" />
          ) : (
            <FaTimesCircle className="text-red-500 text-6xl mb-4" />
          )}
          <p className={`text-xl font-semibold ${isSuccessStatus ? 'text-green-700' : 'text-red-700'} text-center`}>
            {statusMessage}
          </p>
        </div>
      )}

      {/* Profile Content (hidden when status screen is active) */}
      <div className={showStatusScreen ? 'opacity-0 pointer-events-none' : 'opacity-100'}>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-200 shadow-md flex items-center justify-center bg-gray-100">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-gray-400 w-24 h-24" />
              )}
              {isEditing && (
                <>
                  <label htmlFor="profileImageInput" className="absolute bottom-2 right-5 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-lg">
                    <FaCamera className="w-4 h-4" />
                    <input
                      id="profileImageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      aria-label="Remove selected image"
                    >
                      <FaTimesCircle className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </div>
            <p className="text-gray-600 text-sm">
              {isEditing ? 'Click the camera icon to change your profile picture.' : 'Your profile picture.'}
            </p>
          </div>

          {/* User Info (Conditional Read-only/Editable) */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={userData.firstName}
              onChange={handleChange}
              readOnly={!isEditing || !canEditNames} 
              className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${!isEditing || !canEditNames ? 'bg-gray-50 cursor-not-allowed' : 'border-gray-300'}`}
            />
            {!canEditNames && isEditing && (
              <p className="text-orange-600 text-xs mt-1 flex items-center">
                <FaExclamationTriangle className="mr-1" /> Names can only be updated once every 3 months.
              </p>
            )}
            {validationErrors.firstName && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.firstName}</p>
            )}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={userData.lastName}
              onChange={handleChange}
              readOnly={!isEditing || !canEditNames} 
              className={`mt-1 block w-full border rounded-md shadow-sm p-2 ${!isEditing || !canEditNames ? 'bg-gray-50 cursor-not-allowed' : 'border-gray-300'}`}
            />
            {validationErrors.lastName && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.lastName}</p>
            )}
          </div>
          <div>
            <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              id="emailAddress"
              name="emailAddress"
              value={userData.emailAddress}
              readOnly // Always read-only
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-50 cursor-not-allowed"
            />
          </div>

          {/* Date of Birth Input */}
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <div className="relative mt-1">
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={userData.dateOfBirth}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`block w-full border rounded-md shadow-sm p-2 pr-10 ${!isEditing ? 'bg-gray-50 cursor-not-allowed' : (validationErrors.dateOfBirth ? 'border-red-500' : 'border-gray-300')}`}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FaCalendarAlt className="text-gray-400" />
              </div>
            </div>
            {validationErrors.dateOfBirth && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.dateOfBirth}</p>
            )}
          </div>

          {/* Action Buttons (only visible in edit mode) */}
          {isEditing && (
            <div className="flex justify-center gap-4 mt-8">
              <button
                type="submit" 
                disabled={submitting || !isFormValid}
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:bg-green-400 font-semibold flex items-center justify-center transition-colors duration-200"
              >
                {submitting ? <Spinner /> : <FaSave className="mr-2" />}
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button" 
                onClick={handleCancelEdit}
                disabled={submitting}
                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-400 disabled:opacity-50 font-semibold transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
        {/* The Edit Profile button OUTSIDE the form */}
        {!isEditing && (
          <div className="flex justify-center mt-8"> 
            <button
              type="button" 
              onClick={handleEditClick}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-semibold flex items-center justify-center transition-colors duration-200"
            >
              <FaEdit className="mr-2" /> Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
