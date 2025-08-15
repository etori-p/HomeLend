// app/Listing/[propertyname]/PropertyDetailClient.jsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaMapMarkerAlt, FaBed, FaBath, FaVectorSquare, FaUserTie, FaEnvelope, FaPhoneAlt, FaBuilding, FaArrowLeft, FaChevronLeft, FaChevronRight, FaTimes, FaExpand } from "react-icons/fa";
import PropertyMap from "@/app/components/maps/PropertyMap"; 

export default function PropertyDetailClient({ post, session }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!post) {
    return (
      <main className="p-8 flex flex-col items-center justify-center min-h-[70vh]">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Property Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          The property you are looking for does not exist or has been removed.
        </p>
        <Link href="/Listing" className="px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          Back to all properties
        </Link>
      </main>
    );
  }

  const featuresObj = post.features;
  const images = Array.isArray(post.img) && post.img.length > 0
    ? post.img
    : ['https://placehold.co/1200x800/E0E0E0/333333?text=No+Image'];


  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const hasAgentDetails = post.agentName || post.agentContactEmail || post.agentContactPhone;

  // Split images for main display and gallery
  const mainImage = images[0];
  const otherImages = images.slice(1);

  const hasCoords = post?.coordinates?.lat && post?.coordinates?.lng;

  return (
    <main className="p-8 max-w-5xl mx-auto">
      {/* Fullscreen Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          <button onClick={closeModal} className="absolute top-4 right-4 text-white text-3xl z-50">
            <FaTimes />
          </button>
          <div className="relative h-4/5 w-4/5 flex items-center justify-center">
            {/* Prev Button */}
            <button
              onClick={prevImage}
              className="absolute left-4 z-40 text-white text-4xl p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition"
            >
              <FaChevronLeft />
            </button>
            {/* Image */}
            <Image
              src={images[currentImageIndex]}
              alt={post.propertyname}
              layout="fill"
              objectFit="contain"
              className="rounded-lg"
            />
            {/* Next Button */}
            <button
              onClick={nextImage}
              className="absolute right-4 z-40 text-white text-4xl p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-75 transition"
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Main Image Section with Navigation */}
        <div className="relative h-96 w-full">
          <Image
            src={mainImage}
            alt={post.propertyname}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>

        {/* Property Details */}
        <div className="p-6 md:p-8">
          {/* Responsive Layout for Price/Location */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{post.propertyname}</h1>
              {/* Price on mobile, below name */}
              <div className="sm:hidden text-blue-600 font-extrabold text-3xl my-2">
                {post.price}
              </div>
              <p className="text-lg text-gray-600 mt-1">
                <FaMapMarkerAlt className="text-blue-500 mr-2 inline-block" /> {post.location}
              </p>
            </div>
            {/* Price on larger screens */}
            <div className="hidden sm:block text-blue-600 font-extrabold text-3xl">
              {post.price}
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Key Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-lg text-gray-700">
              {featuresObj?.bedrooms && (
                <p className="flex items-center">
                  <FaBed className="text-blue-500 mr-3 inline-block" /> {featuresObj.bedrooms} Bedrooms
                </p>
              )}
              {featuresObj?.bathrooms && (
                <p className="flex items-center">
                  <FaBath className="text-blue-500 mr-3 inline-block" /> {featuresObj.bathrooms} Bathrooms
                </p>
              )}
              {featuresObj?.size && (
                <p className="flex items-center">
                  <FaVectorSquare className="text-blue-500 mr-3 inline-block" /> {featuresObj.size}
                </p>
              )}
            </div>
          </div>
          
          {/* --- MAP Section --- */}
          {hasCoords && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Location on Map</h2>

              <div className="bg-white rounded-lg shadow-sm">
                <PropertyMap
                  lat={post.coordinates.lat}
                  lng={post.coordinates.lng}
                  title={post.propertyname}
                />
              </div>
            </div>
          )}

          {/* Description */}
          {post.description && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Description</h2>
              <p className="text-lg text-gray-800">
                {post.description}
              </p>
            </div>
          )}

          {/* Additional Images (if any) with clickable expand buttons */}
          {otherImages.length > 0 && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {otherImages.map((imgSrc, index) => (
                  <div 
                    key={index} 
                    className="relative h-32 w-full rounded-md overflow-hidden shadow-sm cursor-pointer group" 
                    onClick={() => openModal(index + 1)} 
                  >
                    <Image
                      src={imgSrc}
                      alt={`${post.propertyname} - ${index + 2}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <FaExpand className="text-white text-xl" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agent Details Section (Conditional Rendering) */}
          {session?.user && hasAgentDetails && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Agent</h2>
              <div className="space-y-2 text-lg text-gray-700">
                {post.agentName && (
                  <p className="flex items-center">
                    <FaUserTie className="text-blue-500 mr-3 inline-block" /> {post.agentName}
                  </p>
                )}
                {post.agentContactEmail && (
                  <p className="flex items-center">
                    <FaEnvelope className="text-blue-500 mr-3 inline-block" />
                    <a href={`mailto:${post.agentContactEmail}`} className="text-blue-600 hover:underline">
                      {post.agentContactEmail}
                    </a>
                  </p>
                )}
                {post.agentContactPhone && (
                  <p className="flex items-center">
                    <FaPhoneAlt className="text-blue-500 mr-3 inline-block" />
                    <a href={`tel:${post.agentContactPhone}`} className="text-blue-600 hover:underline">
                      {post.agentContactPhone}
                    </a>
                  </p>
                )}
                {post.agentContactEmail && (
                  <p className="mt-4">
                    <Link
                      href={`/Listing?agentEmail=${encodeURIComponent(post.agentContactEmail)}`}
                      className="px-5 py-2 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition duration-300 inline-flex items-center"
                    >
                      <FaBuilding className="mr-2 inline-block" /> View Other Listings by {post.agentName || 'this agent'}
                    </Link>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Back to Properties Button (Moved to the bottom) */}
          <div className="mt-8 flex justify-center items-center border-t border-gray-200 pt-6">
            <Link href="/Listing" className="px-5 py-2 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition duration-300 inline-flex items-center">
              <FaArrowLeft className="mr-2 inline-block" /> Back to Properties
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
