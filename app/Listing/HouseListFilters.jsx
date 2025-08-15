// app/Listing/HouseListFilters.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';

/**
 * HouseListFilters component allows users to filter properties based on search criteria.
 * @param {object} props - Component props.
 * @param {object} props.initialSearchParams - The initial search parameters from the URL.
 */
export default function HouseListFilters({ initialSearchParams }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize states from initialSearchParams, prioritizing 'search' over 'location' for the input field.
  const [searchTerm, setSearchTerm] = useState(initialSearchParams.search || initialSearchParams.location || '');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState(initialSearchParams.propertyType || 'Any');
  const [bedroomsFilter, setBedroomsFilter] = useState(initialSearchParams.bedrooms || 'Any');
  const [minPrice, setMinPrice] = useState(initialSearchParams.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(initialSearchParams.maxPrice || '');

  // A new state to manage a flag for the first render
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Debounce effect to update URL search parameters
  useEffect(() => {
    // Only run this debounce logic after the initial load
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      // Always remove the old `location` parameter when building a new URL
      current.delete('location');

      // Set or delete search parameters based on state values
      if (searchTerm) {
        current.set('search', searchTerm);
      } else {
        current.delete('search');
      }

      if (propertyTypeFilter !== 'Any') {
        current.set('propertyType', propertyTypeFilter);
      } else {
        current.delete('propertyType');
      }

      if (bedroomsFilter !== 'Any') {
        current.set('bedrooms', bedroomsFilter);
      } else {
        current.delete('bedrooms');
      }

      if (minPrice) {
        current.set('minPrice', minPrice);
      } else {
        current.delete('minPrice');
      }

      if (maxPrice) {
        current.set('maxPrice', maxPrice);
      } else {
        current.delete('maxPrice');
      }

      // Construct the new URL path with updated search parameters
      const query = current.toString();
      // Ensure the path is `/Listing` not `/?...` as the page is named Listing
      const newPath = query ? `/Listing?${query}` : '/Listing';

      // Update the router with the new path
      router.replace(newPath);

    }, 500);

    // Cleanup function to clear the timeout if the component unmounts or dependencies change
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, propertyTypeFilter, bedroomsFilter, minPrice, maxPrice, router, searchParams]);


  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filter Properties</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Bar */}
        <div className="relative col-span-full">
          <input
            type="text"
            placeholder="Search by name, location, type, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Property Type Filter */}
        <div>
          <label htmlFor="propertyType" className="sr-only">Property Type</label>
          <select
            id="propertyType"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={propertyTypeFilter}
            onChange={(e) => setPropertyTypeFilter(e.target.value)}
          >
            <option value="Any">Any Type</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Studio">Studio</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>

        {/* Bedrooms Filter */}
        <div>
          <label htmlFor="bedrooms" className="sr-only">Bedrooms</label>
          <select
            id="bedrooms"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={bedroomsFilter}
            onChange={(e) => setBedroomsFilter(e.target.value)}
          >
            <option value="Any">Any Bedrooms</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4+">4+</option>
          </select>
        </div>

        {/* Min Price */}
        <div>
          <label htmlFor="minPrice" className="sr-only">Min Price</label>
          <input
            type="number"
            id="minPrice"
            placeholder="Min Price (KSh)"
            className="mt-1 p-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>

        {/* Max Price */}
        <div>
          <label htmlFor="maxPrice" className="sr-only">Max Price</label>
          <input
            type="number"
            id="maxPrice"
            placeholder="Max Price (KSh)"
            className="mt-1 p-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}