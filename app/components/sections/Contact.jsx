// app/contact/page.jsx
'use client'; 

import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaFacebookF, FaInstagram, FaLinkedinIn, FaSpinner } from 'react-icons/fa';
import { PiXLogoDuotone } from "react-icons/pi";


const Spinner = ({ size = 'w-5 h-5', color = 'text-white' }) => (
  <FaSpinner className={`${size} ${color} animate-spin`} />
);

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
    setSuccessMessage('');
    setErrorMessage('');

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Please fill in all required fields (Name, Email, Message).');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to send message.');
      }

      setSuccessMessage('Your message has been sent successfully! We will get back to you soon.');
      setFormData({ // Reset form
        name: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (err) {
      console.error('Contact form submission error:', err);
      setErrorMessage(err.message || 'There was an error sending your message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Contact Us
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Have questions? We're here to help with all your rental needs.
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {/* Contact Form */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Get in Touch</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone (Optional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              {successMessage && (
                <p className="text-green-600 bg-green-100 p-3 rounded-md">{successMessage}</p>
              )}
              {errorMessage && (
                <p className="text-red-600 bg-red-100 p-3 rounded-md">{errorMessage}</p>
              )}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Spinner /> : 'Send Message'}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FaMapMarkerAlt className="h-6 w-6 text-blue-500" /> 
                </div>
                <div className="ml-3 text-base text-gray-500">
                  <p>Ushuru Pension Plaza, 5th Floor</p>
                  <p>Loita Street, Nairobi CBD</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FaPhoneAlt className="h-6 w-6 text-blue-500" /> 
                </div>
                <div className="ml-3 text-base text-gray-500">
                  <p>+254 700 123 456</p>
                  <p>+254 20 987 6543</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FaEnvelope className="h-6 w-6 text-blue-500" /> 
                </div>
                <div className="ml-3 text-base text-gray-500">
                  <p>info@homelend.co.ke</p>
                  <p>support@homelend.co.ke</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FaClock className="h-6 w-6 text-blue-500" /> 
                </div>
                <div className="ml-3 text-base text-gray-500">
                  <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                  <p>Saturday: 9:00 AM - 2:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-500">
                  <FaFacebookF className="text-xl" /> 
                </a>
                <a href="#" className="text-gray-400 hover:text-black-800">
                  <PiXLogoDuotone className="text-xl" /> 
                </a>
                <a href="#" className="text-gray-400 hover:text-pink-600">
                  <FaInstagram className="text-xl" /> 
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600">
                  <FaLinkedinIn className="text-xl" /> 
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
