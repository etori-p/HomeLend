// app/components/sections/Neighborhoods.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaSpinner } from 'react-icons/fa';

function Neighborhoods() {
  const [allNeighborhoods, setAllNeighborhoods] = useState([]);
  const [displayedNeighborhoods, setDisplayedNeighborhoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const postsPerPage = 3;
  const refreshInterval = 5 * 60 * 1000; // 5 minutes in milliseconds

  // --- Fetching and Initializing Data ---
  useEffect(() => {
    const fetchAllNeighborhoods = async () => {
      try {
        const res = await fetch('/api/popular-neighborhoods');

        if (!res.ok) {
          throw new Error('Failed to fetch popular neighborhoods');
        }

        const data = await res.json();
        const processedData = data.map(item => {
          const standardizedLocation = item.location
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');

          return {
            ...item,
            averageRent: item.averageRent.toLocaleString('en-KE'),
            imagePath: `/images/${standardizedLocation}.png`,
          };
        });

        setAllNeighborhoods(processedData);
        setDisplayedNeighborhoods(processedData.slice(0, postsPerPage));
      } catch (err) {
        console.error("Error fetching popular neighborhoods:", err);
        setError("Could not load popular neighborhoods.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllNeighborhoods();
  }, []); // Empty dependency array ensures this runs only once on mount.

  // --- Refreshing Posts Every 5 Minutes ---
  useEffect(() => {
    // Only set up the interval if we have data
    if (allNeighborhoods.length > 0) {
      const interval = setInterval(() => {
        // Calculate the next index, looping back to the start if needed
        setCurrentIndex(prevIndex => {
          const nextIndex = prevIndex + postsPerPage;
          return nextIndex >= allNeighborhoods.length ? 0 : nextIndex;
        });
      }, refreshInterval);

      // Clean up the interval when the component unmounts
      return () => clearInterval(interval);
    }
  }, [allNeighborhoods]); // Dependency array ensures this runs when data is fetched.

  // --- Update displayed posts when currentIndex changes ---
  useEffect(() => {
    const end = currentIndex + postsPerPage;
    const newPosts = allNeighborhoods.slice(currentIndex, end);
    // If the next slice is empty, wrap around to the beginning
    setDisplayedNeighborhoods(newPosts.length > 0 ? newPosts : allNeighborhoods.slice(0, postsPerPage));
  }, [currentIndex, allNeighborhoods]);

  if (loading) {
    return (
      <section className="py-12 bg-white flex justify-center items-center">
        <FaSpinner className="animate-spin text-4xl text-blue-500" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-white text-center">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Trending Neighborhoods in Kenya
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            These are the most favorited areas by our users.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayedNeighborhoods.length > 0 ? (
            displayedNeighborhoods.map((neighborhood) => (
              <div key={neighborhood.location} className="relative overflow-hidden rounded-lg shadow-lg group">
                <div className="relative w-full h-64">
                  <Image
                    src={neighborhood.imagePath}
                    alt={neighborhood.location}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/600x400/E5E7EB/4B5563?text=Image+not+found";
                      e.target.alt = "Image not found";
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
                <div className="absolute inset-0 flex items-end p-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{neighborhood.location}</h3>
                    <p className="mt-1 text-gray-300">Average rent: KSh {neighborhood.averageRent}</p>
                    <Link
                      href={`/Listing?location=${encodeURIComponent(neighborhood.location)}`}
                      passHref
                    >
                      <button className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                        View Properties
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 text-lg">
              No popular neighborhoods to display yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Neighborhoods;