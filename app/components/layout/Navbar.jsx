'use client';

import React, { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

// Dynamically import LoginModal and SignupModal with SSR disabled
const LoginModal = dynamic(() => import('@/app/components/auth/LoginModal'), { ssr: false });
const SignupModal = dynamic(() => import('@/app/components/auth/SignupModal'), { ssr: false });

// Helper component for the user dropdown menu
const UserDropdown = ({ user, signOut }) => {
  // State to manage the visibility of the dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Function to get initials for avatar
  const getUserInitials = (name) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar button to toggle dropdown */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform duration-300 transform hover:scale-105"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-bold text-lg">
            {getUserInitials(user.name || user.email)}
          </div>
        )}
      </button>

      {/* Dropdown menu content */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-900 truncate">
              Hi, {user.name?.split(' ')[0] || user.email?.split('@')[0]}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <div className="py-1">
            <Link
              href="/favorites"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
            >
              {/* Favorites Icon (Heart) */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-red-500"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
              Favorites
            </Link>
            <Link
              href="/settings"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
            >
              {/* Settings Icon (Gear) */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-gray-500"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              Settings
            </Link>
            <button
              onClick={() => {
                setDropdownOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
            >
              {/* Logout Icon (Sign-out) */}
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-gray-500"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for the mobile menu
const MobileMenu = ({ user, handleScroll, openLogin, isMobileMenuOpen, setIsMobileMenuOpen, signOut }) => {
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

  // Function to get initials for avatar
  const getUserInitials = (name) => {
    if (!name) return '';
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };

  return (
    <div id="mobileMenu" className={`fixed inset-0 z-40 bg-white transform transition-transform duration-300 sm:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="h-16 flex items-center justify-end px-4">
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(false)}
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
        >
          {/* Close Icon (X) */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
        </button>
      </div>

      {/* Conditional rendering for authenticated vs. guest user */}
      {user ? (
        <div className="pt-2 pb-3">
          <div className="flex items-center px-4 py-2 border-b border-gray-200">
            {user.image ? (
              <Image
                src={user.image}
                alt="User Avatar"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover mr-3"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-blue-800 font-bold text-xl mr-3">
                {getUserInitials(user.name || user.email)}
              </div>
            )}
            <div className="flex-1">
              <span className="block text-base font-bold text-gray-900 truncate">
                Hi, {user.name?.split(' ')[0] || user.email?.split('@')[0]}
              </span>
              <span className="block text-sm text-gray-500 font-medium truncate">
                {user.email}
              </span>
            </div>
            <button
              onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
              className="p-2 rounded-full hover:bg-gray-100 transition-transform duration-300"
            >
              {/* Chevron Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-500 ${isMobileDropdownOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          </div>

          {isMobileDropdownOpen && (
            <div className="py-2 border-b border-gray-200">
              <Link
                href="/favorites"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-4 py-2 text-base font-semibold text-gray-700 hover:bg-blue-100"
              >
                {/* Favorites Icon (Heart) */}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-red-500"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                Favorites
              </Link>
              <Link
                href="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-4 py-2 text-base font-semibold text-gray-700 hover:bg-blue-100"
              >
                {/* Settings Icon (Gear) */}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-gray-500"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                Settings
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="flex items-center w-full text-left px-4 py-2 text-base font-semibold text-gray-700 hover:bg-blue-100"
              >
                {/* Logout Icon (Sign-out) */}
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-gray-500"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                Logout
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
  );
};

export default function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                <a href="#search" onClick={(e) => handleScroll(e, 'search')} className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-150">
                  Search
                </a>
                <a href="#about" onClick={(e) => handleScroll(e, 'about')} className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-150">
                  About
                </a>
                <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-150">
                  Contact
                </a>
              </div>
            </div>

            {/* Right side: Login button or User Avatar */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {user ? (
                <UserDropdown user={user} signOut={signOut} />
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
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  // Close Icon (X)
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                ) : (
                  // Hamburger Icon
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu content */}
        <MobileMenu
          user={user}
          handleScroll={handleScroll}
          openLogin={openLogin}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          signOut={signOut}
        />
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
