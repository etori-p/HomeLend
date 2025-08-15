// app/components/sections/Hero.jsx
"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; 

function Hero() {
  const handleScroll = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <section id="home" className="relative text-white py-40 overflow-hidden"> 
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1741991110666-88115e724741?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Modern apartment in Nairobi"
          fill 
          style={{ objectFit: 'cover' }}
          className="filter brightness-75 contrast-125" 
          priority 
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-800 via-blue-800/50 to-transparent mix-blend-multiply"></div>
        {/* Semi-transparent overlay for better text visibility */}
        <div className="absolute inset-0 bg-black opacity-20"></div> 
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <h1 className="text-4xl tracking-tight font-extrabold sm:text-5xl md:text-6xl">
              <span className="block">Find Your Perfect</span>
              <span className="block text-blue-200">Rental Home in Kenya</span>
            </h1>
            <p className="mt-3 text-base text-blue-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
              Discover apartments, houses, and studios across Kenya's best neighborhoods. Quality living starts here.
            </p>
            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link href="/Listing" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                    Browse Properties
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a href="#about" onClick={(e) => handleScroll(e, 'about')} className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900 md:py-4 md:text-lg md:px-10">
                    Learn More
                  </a>
                </div>
              </div>
            </div>
          </div>
       
          <div className="lg:col-span-6">
            {/* This column is now just an empty space or can be used for other content if needed */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;