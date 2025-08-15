'use client';

import { useState, useEffect } from 'react';
import { signIn } from "next-auth/react";
import { FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; 

const Spinner = () => <FaSpinner className="animate-spin text-white" />;

const LoginModal = ({ isOpen, onClose, onSwitchToSignup }) => {
  if (!isOpen) return null;

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showStatusScreen, setShowStatusScreen] = useState(false); 
  const [isSuccessStatus, setIsSuccessStatus] = useState(false); 

  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);

  const [formData, setFormData] = useState({
    emailAddress: '',
    password: '',
    remeberMe: false, 
  });

  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('rememberedEmail');
      if (savedEmail) {
        setFormData(prevData => ({
          ...prevData,
          emailAddress: savedEmail,
          remeberMe: true,
        }));
      }
    } catch (e) {
      console.error("Failed to load email from local storage:", e);
    }
  }, []);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setEmailLoading(true);
    setShowStatusScreen(false);

    try {
      const result = await signIn('credentials', {
        email: formData.emailAddress,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setIsSuccessStatus(false);
        setShowStatusScreen(true);
      } else if (result?.ok) {
        
        if (formData.remeberMe) {
          localStorage.setItem('rememberedEmail', formData.emailAddress);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        setSuccessMessage('Login successful! Welcome back.');
        setIsSuccessStatus(true);
        setShowStatusScreen(true);
        setTimeout(() => {
          setShowStatusScreen(false);
          onClose();
          
          setFormData(prevData => ({
            ...prevData,
            password: '',
            remeberMe: false,
          }));
        }, 3000);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsSuccessStatus(false);
      setShowStatusScreen(true);
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto bg-gray-500/60 bg-opacity-75 flex justify-center items-center p-4">
      <div className="relative bg-blue-50 rounded-lg shadow-xl w-full max-w-lg flex flex-col h-full overflow-hidden">
        <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900">Welcome to HomeLend</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <i className="fas fa-times" />
          </button>
        </div>

        {showStatusScreen ? (
          <div className="h-screen p-6 flex-grow flex flex-col items-center justify-center text-center bg-white">
            {isSuccessStatus ? (
              <FaCheckCircle className="text-green-500 text-6xl mb-4" />
            ) : (
              <FaTimesCircle className="text-red-500 text-6xl mb-4" />
            )}
            <p className={`text-lg font-semibold ${isSuccessStatus ? 'text-green-700' : 'text-red-700'} mb-2`}>
              {isSuccessStatus ? successMessage : error}
            </p>
            {!isSuccessStatus && (
              <button
                onClick={() => setShowStatusScreen(false)}
                className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Try Again
              </button>
            )}
          </div>
        ) : (
          <div className="p-6 flex-grow overflow-y-auto">
            <p className="text-sm text-gray-500 mb-6">
              Sign in or create an account to save favorites, get alerts, and more.
            </p>

            <button
              type="button"
              onClick={() => {
                setGoogleLoading(true);
                setError('');
                setSuccessMessage('');
                signIn("google"); 
              }}
              className="w-full text-black py-2 rounded-md hover:bg-blue-300 mb-4 flex items-center justify-center border border-gray-300"
              disabled={googleLoading}
            >
              {googleLoading ? <Spinner /> : <><i className="fab fa-google mr-2"></i> Sign in with Google</>}
            </button>

            <div className="my-6 text-sm text-center text-gray-500 relative">
              <span className="bg-blue-50 px-2 relative z-10">Or continue with email</span>
              <div className="absolute inset-0 border-t border-gray-300 top-1/2 -translate-y-1/2" />
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700">Email address</label>
                <input
                  type="email"
                  id="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    id="remeberMe"
                    checked={formData.remeberMe}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Remember me
                </label>
                <a href="/forgotpassword" target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">Forgot your password?</a>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={emailLoading}
              >
                {emailLoading ? <Spinner /> : 'Sign in'}
              </button>
            </form>

            <div className="mt-6 text-sm text-center text-gray-500">
              Don't have an account?
            </div>
            <div className="mt-2">
              <button
                onClick={onSwitchToSignup}
                className="w-full border border-gray-300 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={emailLoading || googleLoading}
              >
                Sign up
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
