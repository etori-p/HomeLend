'use client';

import React, { useState, useEffect } from 'react';
import { FaSpinner, FaPaperPlane, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBiHGKs6dz6MuYZQx5jYHCxPjTntmXaPCY",
    authDomain: "homelen-001.firebaseapp.com",
    projectId: "homelen-001",
    storageBucket: "homelen-001.firebasestorage.app",
    messagingSenderId: "1078230601187",
    appId: "1:1078230601187:web:5711d46c03d2ccf16da4d6",
    measurementId: "G-RYM3JSW3EQ"
};

const Newsletter = () => {
    // State for the email input
    const [email, setEmail] = useState('');
    // State for handling loading/submission status
    const [isSubmitting, setIsSubmitting] = useState(false);
    // State for user feedback messages
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    // Firebase setup state
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [firebaseReady, setFirebaseReady] = useState(false);
    
    // Global variables from the runtime environment
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
    const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : '';
    
    // --- Initialize Firebase and Authenticate ---
    useEffect(() => {
        const initFirebase = async () => {
            try {
                const app = initializeApp(firebaseConfig);
                const firestoreDb = getFirestore(app);
                const firestoreAuth = getAuth(app);

                if (initialAuthToken) {
                    await signInWithCustomToken(firestoreAuth, initialAuthToken);
                } else {
                    await signInAnonymously(firestoreAuth);
                }
                
                setDb(firestoreDb);
                setAuth(firestoreAuth);
                setFirebaseReady(true);
            } catch (error) {
                console.error("Firebase initialization or authentication failed:", error);
                setMessage('Error connecting to the service. Please try again later.');
                setMessageType('error');
            }
        };

        initFirebase();
    }, [initialAuthToken]);

    // --- Message timeout effect ---
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
                setMessageType('');
            }, 5000); // 5 seconds
            
            // Cleanup function to clear the timeout if the component unmounts
            return () => clearTimeout(timer);
        }
    }, [message]);

    // --- Form submission handler ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setMessage('');
        setMessageType('');
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage('Please enter a valid email address.');
            setMessageType('error');
            return;
        }

        if (!firebaseReady) {
            setMessage('Service not ready. Please try again.');
            setMessageType('error');
            return;
        }

        setIsSubmitting(true);

        try {
            const newslettersCollection = collection(db, `artifacts/${appId}/public/data/newsletters`);
            await addDoc(newslettersCollection, {
                email: email,
                timestamp: serverTimestamp(),
            });

            setMessage('Thank you for subscribing!');
            setMessageType('success');
            setEmail('');
            
            setIsSubmitting(false);
            
        } catch (error) {
            console.error("Error adding document to Firestore:", error);
            setMessage('Something went wrong. Please try again.');
            setMessageType('error');
            
            setIsSubmitting(false);
        }
    };

    return (
        <section className="bg-blue-700 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-7">
                        <h3 className="text-2xl font-extrabold sm:text-3xl">
                            Stay Updated
                        </h3>
                        <p className="mt-3 text-lg text-blue-100">
                            Subscribe to our newsletter for new property alerts, rental tips, and exclusive offers.
                        </p>
                    </div>
                    <div className="mt-8 lg:mt-0 lg:col-span-5">
                        <form className="sm:flex" onSubmit={handleSubmit}>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input 
                                id="email-address" 
                                name="email-address" 
                                type="email" 
                                autoComplete="email" 
                                required 
                                className="w-full px-5 py-3 border border-transparent placeholder-gray-500 bg-white focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white focus:border-white focus:bg-gray-200 focus:text-blue-700 sm:max-w-xs rounded-md" 
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isSubmitting}
                            />
                            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white disabled:bg-gray-200 disabled:text-gray-500"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-700" />
                                            Subscribing...
                                        </>
                                    ) : (
                                        <>
                                            <FaPaperPlane className="-ml-1 mr-3 h-5 w-5" />
                                            Subscribe
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                        <div className="mt-3 text-sm">
                            {message && (
                                <div className={`flex items-center space-x-2 ${messageType === 'success' ? 'text-green-200' : 'text-red-200'}`}>
                                    {messageType === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
                                    <p>{message}</p>
                                </div>
                            )}
                            <p className="text-blue-100">
                                We respect your privacy. Unsubscribe at any time.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Newsletter;
