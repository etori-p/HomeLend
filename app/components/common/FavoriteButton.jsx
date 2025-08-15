// app/components/common/FavoriteButton.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';
import { useSession } from 'next-auth/react';

/**
 * Client-side component for a favorite button.
 * It handles toggling a post's favorite status for the logged-in user.
 *
 * @param {object} props - The component props.
 * @param {string} props.postId - The ID of the house post.
 * @param {boolean} props.initialIsFavorited - Initial favorite status from the server.
 */
export default function FavoriteButton({ postId, initialIsFavorited }) {
  const { data: session, status: sessionStatus } = useSession();
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);

  // Update internal state if initialIsFavorited prop changes (e.g., on re-render from server)
  useEffect(() => {
    setIsFavorited(initialIsFavorited);
  }, [initialIsFavorited]);

  const handleToggleFavorite = async () => {
    if (sessionStatus !== 'authenticated') {
      alert('You must be logged in to favorite properties.'); // Use a custom modal in production
      return;
    }

    // Optimistic update
    setIsFavorited(prev => !prev);

    try {
      const res = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId }),
      });

      if (!res.ok) {
        // Revert optimistic update if API call fails
        setIsFavorited(prev => !prev);
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update favorite status.');
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      alert('Failed to update favorite status. Please try again.'); // Use a custom modal
    }
  };

  if (sessionStatus === 'loading') {
    return null; // Don't render button until session status is known
  }

  // Only show the button if the user is authenticated
  if (sessionStatus !== 'authenticated') {
    return null;
  }

  return (
    <button
      onClick={handleToggleFavorite}
      className={`absolute top-2 left-2 p-1 rounded-full shadow-md transition-colors duration-200
        ${isFavorited ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <FaHeart className="text-lg" />
    </button>
  );
}