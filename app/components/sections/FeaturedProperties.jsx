// app/components/sections/FeaturedProperties.jsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FaHeart, FaMapMarkerAlt, FaBed, FaBath, FaVectorSquare, FaSpinner, FaStar } from 'react-icons/fa'; 
import { useSession } from 'next-auth/react';
import PropertyImage from '@/app/Listing/PropertyImage';

// Simple Spinner Component
const Spinner = ({ size = 'w-5 h-5', color = 'text-blue-500' }) => (
  <FaSpinner className={`${size} ${color} animate-spin`} />
);

// Function to randomly select N unique items from an array
function getRandomUniqueItems(arr, numItems) {
  if (numItems >= arr.length) {
    return [...arr];
  }
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numItems);
}

export default function FeaturedProperties() {
  const { data: session, status: sessionStatus } = useSession();
  const [allPosts, setAllPosts] = useState([]);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userFavorites, setUserFavorites] = useState(new Set()); // Store user's favorite post IDs

  const FOUR_DAYS_IN_MS = 4 * 24 * 60 * 60 * 1000;
  const NUMBER_OF_FEATURED_TO_SHOW = 3; // Define how many featured properties you want

  // Function to fetch all house data
  const fetchAllHouseData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch all properties first
      const allRes = await fetch('http://localhost:3000/api/list');
      if (!allRes.ok) {
        throw new Error('Failed to fetch all house data.');
      }
      const allData = await allRes.json();
      setAllPosts(allData);

      let currentSelected = [];

      // 2. Prioritize fetching truly featured properties
      const featuredRes = await fetch('http://localhost:3000/api/list?featured=true');
      let featuredData = [];
      if (featuredRes.ok) {
        featuredData = await featuredRes.json();
        // Take up to NUMBER_OF_FEATURED_TO_SHOW featured properties
        currentSelected = getRandomUniqueItems(featuredData, NUMBER_OF_FEATURED_TO_SHOW);
      } else {
        console.warn('Could not fetch explicitly featured properties. Falling back to all posts.');
      }

      // 3. If not enough featured properties, fill with other random posts
      if (currentSelected.length < NUMBER_OF_FEATURED_TO_SHOW) {
        // Filter out already selected featured posts from allData
        const remainingPosts = allData.filter(
          (post) => !currentSelected.some((selected) => selected._id === post._id)
        );
        const additionalPosts = getRandomUniqueItems(
          remainingPosts,
          NUMBER_OF_FEATURED_TO_SHOW - currentSelected.length
        );
        currentSelected = [...currentSelected, ...additionalPosts];
      }

      // Ensure we don't show more than NUMBER_OF_FEATURED_TO_SHOW
      setSelectedPosts(currentSelected.slice(0, NUMBER_OF_FEATURED_TO_SHOW));

    } catch (err) {
      console.error('Error fetching featured properties:', err);
      setError(err.message || 'Could not load featured properties.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Function to fetch user's favorite post IDs
  const fetchUserFavorites = useCallback(async () => {
    if (sessionStatus === 'authenticated') {
      try {
        const res = await fetch('/api/user/favorites', { method: 'GET' });
        if (res.ok) {
          const favorites = await res.json();
          setUserFavorites(new Set(favorites.map(fav => fav._id)));
        } else {
          console.error('Failed to fetch user favorites:', await res.text());
        }
      } catch (err) {
        console.error('Error fetching user favorites:', err);
      }
    } else {
      setUserFavorites(new Set()); 
    }
  }, [sessionStatus]);


  // Initial data fetch and favorite fetch
  useEffect(() => {
    fetchAllHouseData();
  }, [fetchAllHouseData]);

  useEffect(() => {
    fetchUserFavorites();
  }, [fetchUserFavorites, sessionStatus]); 

  // Handle toggling favorite status
  const handleToggleFavorite = async (postId) => {
    if (sessionStatus !== 'authenticated') {
      alert('You must be logged in to favorite properties.'); 
      return;
    }

    const isCurrentlyFavorited = userFavorites.has(postId);
    // Optimistic update
    setUserFavorites(prev => {
      const newFavorites = new Set(prev);
      if (isCurrentlyFavorited) {
        newFavorites.delete(postId);
      } else {
        newFavorites.add(postId);
      }
      return newFavorites;
    });

    try {
      const res = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });

      if (!res.ok) {
        // Revert optimistic update if API call fails
        setUserFavorites(prev => {
          const newFavorites = new Set(prev);
          if (isCurrentlyFavorited) { // If it was favorited, add it back
            newFavorites.add(postId);
          } else { // If it was not favorited, remove it
            newFavorites.delete(postId);
          }
          return newFavorites;
        });
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update favorite status.');
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      alert('Failed to update favorite status. Please try again.');
    }
  };


  if (loading) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
            Featured Properties
          </h2>
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <Spinner size="w-16 h-16" color="text-blue-500" />
            <p className="text-xl text-gray-600 mt-4">Loading featured properties...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
            Featured Properties
          </h2>
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Featured Properties
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Handpicked selections in Nairobi's most desirable neighborhoods
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {selectedPosts.length === 0 ? (
            <p className="text-center text-gray-600 col-span-full">No featured properties available at the moment. Check back soon!</p>
          ) : (
            selectedPosts.map((post) => {
              const featuresObj = post.features;
              const displayImage = Array.isArray(post.img) && post.img.length > 0
                ? post.img[0]
                : 'https://placehold.co/600x400/E0E0E0/333333?text=No+Image';

              const postCreationDate = new Date(post.createdAt);
              const isNew = (Date.now() - postCreationDate.getTime()) < FOUR_DAYS_IN_MS;
              const isFavorited = userFavorites.has(post._id); // Check if post is favorited by user

              return (
                <div key={post._id} className="property-card bg-white rounded-lg overflow-hidden shadow-md transition duration-300 ease-in-out">
                  <div className="relative h-48 overflow-hidden">
                    <PropertyImage
                      className="absolute inset-0 h-full w-full object-cover"
                      src={displayImage}
                      alt={post.propertyname}
                    />
                    {/* Like/Favorite Button - Always top-left */}
                    {sessionStatus === 'authenticated' && (
                      <button
                        onClick={() => handleToggleFavorite(post._id)}
                        className={`absolute top-2 left-2 p-2 rounded-full shadow-md transition-colors duration-200
                          ${isFavorited ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                        aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                      >
                        <FaHeart className="text-lg" />
                      </button>
                    )}

                    {/* Featured Tag - Top-right */}
                    {post.isFeatured && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center">
                        <FaStar className="inline-block mr-1" /> Featured
                      </div>
                    )}

                    {/* New Tag - Positioned to avoid conflict if both New and Featured */}
                    {isNew && !post.isFeatured && ( // Only show 'New' if not already 'Featured'
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                        New
                      </div>
                    )}
                    {isNew && post.isFeatured && ( // If both, show 'New' slightly offset
                      <div className="absolute top-2 right-[90px] bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                        New
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{post.propertyname}</h3>
                        <p className="text-gray-600 text-sm">
                          <FaMapMarkerAlt className="inline-block text-blue-500 mr-1" /> {post.location}
                        </p>
                      </div>
                      <div className="text-blue-500 font-bold">{post.price}</div>
                    </div>
                    <div className="mt-3 text-sm text-gray-500">
                      <p className="flex items-center flex-wrap">
                        <strong>Features:</strong>
                        {featuresObj
                          ? (
                            <>
                              {featuresObj.bedrooms && (
                                <span className="flex items-center ml-2">
                                  <FaBed className="text-blue-400 mr-1"/> {featuresObj.bedrooms}
                                </span>
                              )}
                              {featuresObj.bathrooms && (
                                <span className="flex items-center ml-2">
                                  <FaBath className="text-blue-400 mr-1"/> {featuresObj.bathrooms}
                                </span>
                              )}
                              {featuresObj.size && (
                                <span className="flex items-center ml-2">
                                  <FaVectorSquare className="text-blue-400 mr-1"/> {featuresObj.size}
                                </span>
                              )}
                            </>
                          )
                          : <span className="ml-2">Not specified</span>}
                      </p>
                    </div>
                    {/* Link to detail page using propertyname */}
                    <Link href={`/Listing/${encodeURIComponent(post.propertyname)}`} passHref>
                      <button className="mt-4 w-full bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 rounded-md text-sm font-medium transition duration-300 cusor-pointer">
                        {post.viewdetails || 'View Details'}
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-10 text-center">
          <Link href="/Listing" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            View All Properties
            <i className="fas fa-arrow-right ml-2"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
