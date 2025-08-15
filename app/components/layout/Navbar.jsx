'use client';

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';


// Dynamically import LoginModal and SignupModal with SSR disabled
const LoginModal = dynamic(() => import('@/app/components/auth/LoginModal'), { ssr: false });
const SignupModal = dynamic(() => import('@/app/components/auth/SignupModal'), { ssr: false });

function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 

  // State for the desktop user dropdown menu
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef(null);

  // New state for the mobile user dropdown menu
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

  // Get user session data
  const { data: session } = useSession();
  const user = session?.user;

  const openLogin = () => {
    setShowLogin(true);
    setShowSignup(false);
    setIsMobileMenuOpen(false);
  };

  const openSignup = () => {
    setShowSignup(true);
    setShowLogin(false);
    setIsMobileMenuOpen(false);
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  // Function to get initials for avatar
  const getUserInitials = (name) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };

  // Handle mouse entering the desktop dropdown area
  const handleMouseEnter = () => {
    clearTimeout(dropdownTimeoutRef.current);
    setDropdownOpen(true);
  };

  // Handle mouse leaving the desktop dropdown area
  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 1000);
  };

  const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    setIsMobileMenuOpen(false); 
  };

  return (
    <>
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left side: Logo and nav links */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center space-x-2">
                <Link href="/">
                  <Image
                    src="/homelend-logo.png"
                    alt="HomeLend logo"
                    width={42}
                    height={42}
                    className="object-contain"
                    priority
                  />
                </Link>
                <span className="text-xl font-bold text-gray-800">
                  <Link href="/"> HomeLend </Link>
                </span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <a href="#search" onClick={(e) => handleScroll(e, 'search')} className="nav-link border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Search
                </a>
                <a href="#about" onClick={(e) => handleScroll(e, 'about')} className="nav-link border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  About
                </a>
                <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="nav-link border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Contact
                </a>
              </div>
            </div>

            {/* Right side: Login button or User Avatar */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {user ? (
                <div
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt="User Avatar"
                      className="w-10 h-10 rounded-full cursor-pointer object-cover"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full cursor-pointer bg-blue-200 flex items-center justify-center text-blue-800 font-bold text-lg"
                    >
                      {getUserInitials(user.name || user.email)}
                    </div>
                  )}

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-blue-50 rounded-md border border-gray-200 shadow-lg z-50 p-1">
                      {/* Profile Link with Personalized Greeting and Email */}
                      <Link href="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2 text-base font-semibold text-gray-700 hover:bg-blue-100 border-b border-gray-200">
                        <i className="fas fa-user-circle mr-3 text-xl"></i>
                        <div className="flex flex-col">
                          <span>Hi, {user.name?.split(' ')[0] || user.email?.split('@')[0]}</span>
                          <span className="text-xs text-gray-500 font-normal">{user.email}</span>
                        </div>
                      </Link>
                      <Link href="/favorites" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2 text-base font-semibold text-gray-700 hover:bg-blue-100 border-b border-gray-200">
                        <i className="fa-solid fa-heart mr-3 text-lg"></i> Favorites
                      </Link>
                      <Link href="/settings" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2 text-base font-semibold text-gray-700 hover:bg-blue-100 border-b border-gray-200">
                        <i className="fas fa-cog mr-3 text-lg"></i> Settings
                      </Link>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="flex items-center w-full text-left px-4 py-2 text-base font-semibold text-gray-700 hover:bg-blue-100"
                      >
                        <i className="fas fa-sign-out-alt mr-3 text-lg"></i> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={openLogin}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300 cursor-pointer"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                  // Close the dropdown when opening the main menu
                  if(isMobileDropdownOpen) setIsMobileDropdownOpen(false);
                }}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        <div id="mobileMenu" className={`fixed inset-0 z-40 bg-white transform transition-transform duration-300 sm:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-16 flex items-center justify-end pr-4">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          {user ? (
            // Mobile menu for authenticated users
            <div className="pt-2 pb-3">
              <div className="flex items-center px-4 py-2 border-b border-gray-200">
                {user.image ? (
                  <img
                    src={user.image}
                    alt="User Avatar"
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-bold text-xl mr-3"
                  >
                    {getUserInitials(user.name || user.email)}
                  </div>
                )}
                <div className="flex-1">
                  <span className="block text-base font-bold text-gray-900">
                    Hi, {user.name?.split(' ')[0] || user.email?.split('@')[0]}
                  </span>
                  <span className="block text-sm text-gray-500 font-medium">
                    {user.email}
                  </span>
                </div>
                <button 
                  onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                  className="p-2 rounded-full hover:bg-gray-100 transition duration-150"
                >
                  <i className={`fas fa-chevron-down text-gray-500 transition-transform duration-300 ${isMobileDropdownOpen ? 'rotate-180' : ''}`}></i>
                </button>
              </div>

              {isMobileDropdownOpen && (
                <div className="py-2 border-b border-gray-200">
                  <Link href="/favorites" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-4 py-2 text-base font-semibold text-gray-700 hover:bg-blue-100">
                    <i className="fa-solid fa-heart mr-3 text-lg"></i> Favorites
                  </Link>
                  <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center px-4 py-2 text-base font-semibold text-gray-700 hover:bg-blue-100">
                    <i className="fas fa-cog mr-3 text-lg"></i> Settings
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex items-center w-full text-left px-4 py-2 text-base font-semibold text-gray-700 hover:bg-blue-100"
                  >
                    <i className="fas fa-sign-out-alt mr-3 text-lg"></i> Logout
                  </button>
                </div>
              )}
              
              <div className="py-2 space-y-1">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="nav-link border-blue-500 text-gray-900 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Home</Link>
                <a href="/#search" onClick={(e) => handleScroll(e, 'search')} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Search</a>
                <a href="/#about" onClick={(e) => handleScroll(e, 'about')} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">About</a>
                <a href="/#contact" onClick={(e) => handleScroll(e, 'contact')} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Contact</a>
              </div>
            </div>
          ) : (
            // Mobile menu for guest users (original content)
            <div className="pt-2 pb-3 space-y-1">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="nav-link border-blue-500 text-gray-900 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Home</Link>
              <a href="/#search" onClick={(e) => handleScroll(e, 'search')} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Search</a>
              <a href="/#about" onClick={(e) => handleScroll(e, 'about')} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">About</a>
              <a href="/#contact" onClick={(e) => handleScroll(e, 'contact')} className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium">Contact</a>
              <div className="mt-4 pl-3 pr-4">
                <button
                  onClick={openLogin}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-base font-medium transition duration-300"
                >
                  Login
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Modals - These will now only render on the client */}
      <LoginModal
        isOpen={showLogin}
        onClose={closeModals}
        onSwitchToSignup={openSignup}
      />
      <SignupModal
        isOpen={showSignup}
        onClose={closeModals}
        onSwitchToLogin={openLogin}
      />
    </>
  );
}

export default Navbar;
