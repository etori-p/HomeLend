'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; 

const Spinner = () => <FaSpinner className="animate-spin" />;

const SignupModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailAddress: '',
    password: '',
    confirmPassword: '', 
    agreeTS: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [success, setSuccess] = useState('');
  const [showStatusScreen, setShowStatusScreen] = useState(false); 
  const [isSuccessStatus, setIsSuccessStatus] = useState(false); 

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
    setSuccess('');
    setLoading(true);
    setShowStatusScreen(false); 

    if (formData.password !== formData.confirmPassword) { 
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess('Account created successfully! Redirecting to login...');
        setIsSuccessStatus(true);
        setShowStatusScreen(true); 
        setTimeout(() => {
          onSwitchToLogin(); 
          setFormData({ 
            firstName: '',
            lastName: '',
            emailAddress: '',
            password: '',
            confirmPassword: '', 
            agreeTS: false,
          });
          setLoading(false);
          setShowStatusScreen(false);
        }, 3000); 
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'An error occurred during signup.');
        setIsSuccessStatus(false);
        setShowStatusScreen(true);
        setLoading(false); 
      }
    } catch (err) {
      setError('Failed to connect to the server. Please try again.');
      setIsSuccessStatus(false);
      setShowStatusScreen(true); 
      setLoading(false);
    }
  };

  return (
    <div className="fixed z-50 inset-0 bg-gray-500/60 bg-opacity-75 flex justify-center items-center p-4">
      <div className="relative bg-blue-50 rounded-lg shadow-xl w-full max-w-lg flex flex-col h-dvh overflow-hidden">
        <div className="flex justify-between items-center p-6 pb-4 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900">Join HomeLend</h3>
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
              {isSuccessStatus ? success : error}
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
            {success && !showStatusScreen && (
              <p className="bg-green-600 text-white max-h-[90vh] text-sm px-4 py-2 rounded-md mb-4 text-center">
                {success}
              </p>
            )}
            {error && !showStatusScreen && (
              <p className="bg-red-100 text-red-700 max-h-[90vh] text-sm p-3 rounded-md mb-4">{error}</p>
            )}

            <p className="text-sm text-gray-500 mb-6">
              Create an account to save favorites, get alerts, and more.
            </p>

            <button onClick={() => signIn('google')} className="w-full text-black py-2 rounded-md hover:bg-blue-300 hover:text-white mb-4 flex items-center justify-center border border-gray-300">
              <i className="fab fa-google mr-2"></i> Sign up with Google
            </button>
            <div className="my-6 text-sm text-center text-gray-500 relative">
              <span className="bg-blue-50 px-2 relative z-10">Or sign up with email</span>
              <div className="absolute inset-0 border-t border-gray-300 top-1/2 -translate-y-1/2" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First name</label>
                  <input type="text" id="firstName" value={formData.firstName} onChange={handleChange} required className="w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last name</label>
                  <input type="text" id="lastName" value={formData.lastName} onChange={handleChange} required className="w-full border border-gray-300 rounded-md p-2" />
                </div>
              </div>
              <div>
                <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700">Email address</label>
                <input type="email" id="emailAddress" value={formData.emailAddress} onChange={handleChange} required className="w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" id="password" value={formData.password} onChange={handleChange} required className="w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full border border-gray-300 rounded-md p-2" />
              </div>
              <div className="flex items-center">
                <input id="agreeTS" type="checkbox" checked={formData.agreeTS} onChange={handleChange} required className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                <label htmlFor="agreeTS" className="ml-2 text-sm text-gray-700">
                  I agree to the <a href="/tos" target="_blank" rel="noopener noreferrer" className='cusor-pointer hover:underline'> Terms of Service </a> and <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className='cusor-pointer hover:underline'>Privacy Policy</a>
                </label>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center">
                {loading ? <Spinner /> : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-sm text-center text-gray-500">
              Already have an account?
            </div>
            <div className="mt-2">
              <button onClick={onSwitchToLogin} className="w-full border border-gray-300 py-2 rounded-md text-gray-700 hover:bg-gray-50">
                Sign in
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupModal;
