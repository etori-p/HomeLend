// app/favorites/page.jsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaSpinner, FaHeart, FaMapMarkerAlt, FaBed, FaBath, FaVectorSquare, FaTimesCircle } from 'react-icons/fa';
import PropertyImage from '@/app/Listing/PropertyImage'; 


const Spinner = ({ size = 'w-5 h-5', color = 'text-blue-500' }) => (
  <FaSpinner className={`${size} ${color} animate-spin`} />
);

export default function FavoritesPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [favoritePosts, setFavoritePosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFavoritePosts = useCallback(async () => {
    setLoading(true);
    setError('');
    if (sessionStatus === 'authenticated') {
      try {
        const res = await fetch('/api/user/favorites', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch favorite posts.');
        }

        const data = await res.json();
        // Sort posts by their creation date for a timeline effect (most recent first)
        const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setFavoritePosts(sortedPosts);
      } catch (err) {
        console.error('Error fetching favorite posts:', err);
        setError(err.message || 'Could not load your favorite properties.');
      } finally {
        setLoading(false);
      }
    } else if (sessionStatus !== 'loading') {
      setLoading(false);
      setError('You must be logged in to view your favorites.');
    }
  }, [sessionStatus]);

  useEffect(() => {
    fetchFavoritePosts();
  }, [fetchFavoritePosts]);

  // Function to handle removing a post from favorites directly from this page
  const handleRemoveFavorite = async (postId) => {
    if (sessionStatus !== 'authenticated') {
      setError('You must be logged in to modify favorites.');
      return;
    }
    setLoading(true); // Show loading while updating
    try {
      const res = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to remove from favorites.');
      }

      // After successful removal, refetch the list to update UI
      await fetchFavoritePosts();
      // You could also optimistically update the state:
      setFavoritePosts(prev => prev.filter(post => post._id !== postId));
    } catch (err) {
      console.error('Error removing favorite:', err);
      setError(err.message || 'An error occurred while removing favorite.');
    } finally {
      setLoading(false);
    }
  };


  if (sessionStatus === 'loading' || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)]">
        <Spinner size="w-16 h-16" color="text-blue-500" />
        <h2 className="text-2xl font-semibold text-gray-700 mt-4">Loading Favorites...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] text-red-600">
        <FaTimesCircle className="w-12 h-12 mb-4" />
        <p className="text-xl">{error}</p>
        {sessionStatus === 'unauthenticated' && (
          <p className="text-md text-gray-600 mt-2">Please log in to view your favorites.</p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg my-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Your Favorite Properties</h1>

      {favoritePosts.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">You haven't favorited any properties yet.</p>
      ) : (
        <div className="space-y-8">
          {favoritePosts.map((post) => (
            <div key={post._id} className="relative flex flex-col md:flex-row bg-blue-50 rounded-lg shadow-md overflow-hidden">
              {/* Timeline Indicator (Optional, for visual flair) */}
              <div className="absolute left-4 top-0 bottom-0 w-1 bg-blue-300 hidden md:block"></div>
              <div className="absolute left-3 top-4 w-3 h-3 bg-blue-500 rounded-full hidden md:block z-10"></div>

              <div className="md:w-1/3 h-48 md:h-auto relative">
                <PropertyImage
                  className="absolute inset-0 h-full w-full object-cover"
                  src={Array.isArray(post.img) && post.img.length > 0 ? post.img[0] : 'https://placehold.co/600x400/E0E0E0/333333?text=No+Image'}
                  alt={post.propertyname}
                />
              </div>
              <div className="md:w-2/3 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold text-gray-900">{post.propertyname}</h2>
                    <button
                      onClick={() => handleRemoveFavorite(post._id)}
                      className="text-red-500 hover:text-red-700 transition-colors duration-200"
                      aria-label="Remove from favorites"
                    >
                      <FaHeart className="text-2xl" /> {/* Filled heart to indicate it's favorited */}
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    <FaMapMarkerAlt className="inline-block text-blue-500 mr-1" /> {post.location}
                  </p>
                  <p className="text-blue-600 font-bold text-xl mb-3">{post.price}</p>
                  <div className="text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-2">
                    {post.features?.bedrooms && (
                      <span className="flex items-center">
                        <FaBed className="text-blue-400 mr-1" /> {post.features.bedrooms}
                      </span>
                    )}
                    {post.features?.bathrooms && (
                      <span className="flex items-center">
                        <FaBath className="text-blue-400 mr-1" /> {post.features.bathrooms}
                      </span>
                    )}
                    {post.features?.size && (
                      <span className="flex items-center">
                        <FaVectorSquare className="text-blue-400 mr-1" /> {post.features.size}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm mt-3 line-clamp-3">{post.description}</p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Favorited on: {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <Link href={`/Listing/${encodeURIComponent(post.propertyname)}`} passHref>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
