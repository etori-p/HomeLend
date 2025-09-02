// app/Listing/page.jsx
import React from 'react';
import Link from 'next/link';
import { FaMapMarkerAlt, FaBed, FaBath, FaVectorSquare, FaStar } from 'react-icons/fa';
import HouseListFilters from '@/app/Listing/HouseListFilters';
import PropertyImage from '@/app/Listing/PropertyImage';
import FavoriteButton from '@/app/components/common/FavoriteButton';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

export const metadata = {
  title: 'All Properties | HomeLend',
  description: 'Browse all properties for rent, including apartments, houses, and studios. Use our powerful search and filter tools to find your perfect home in any neighborhood.',
  openGraph: {
    title: 'All Properties | HomeLend',
    description: 'Find your next rental home with HomeLend. Search and filter through a wide variety of properties available across multiple locations.',
    url: 'https://homelend.co.ke/Listing',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1512917772847-f823297a7a6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80',
        width: 800,
        height: 600,
        alt: 'A collection of rental properties',
      },
    ],
  },
};

async function getAllHouseData() {
  const res = await fetch('/api/list', {
    next: { revalidate: 300 }
  });

  if (!res.ok) {
    console.error('Failed to fetch all house data for HouseList Page:', await res.text());
    return [];
  }

  return res.json();
}

async function getUserFavoriteIds(session) {
  if (!session || !session.user || !session.user.email) {
    return new Set();
  }
  try {
    const res = await fetch('/api/user/favorites', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Failed to fetch user favorite IDs on server:', await res.text());
      return new Set();
    }
    const favorites = await res.json();
    return new Set(favorites.map(fav => fav._id));
  } catch (error) {
    console.error('Error fetching user favorite IDs on server:', error);
    return new Set();
  }
}

export default async function HouseListPage({ searchParams }) {
  const session = await getServerSession(authOptions);
  const userFavoriteIds = await getUserFavoriteIds(session);
  const allHouseListings = await getAllHouseData();
  const searchTerm = searchParams.search || '';
  const propertyTypeFilter = searchParams.propertyType || 'Any';
  const bedroomsFilter = searchParams.bedrooms || 'Any';
  const minPrice = searchParams.minPrice || '';
  const maxPrice = searchParams.maxPrice || '';
  const locationFilter = searchParams.location || '';
  
  const filteredListings = allHouseListings.filter(Listing => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const matchesSearchTerm = searchTerm ? (
      Listing.propertyname.toLowerCase().includes(lowercasedSearchTerm) ||
      Listing.location.toLowerCase().includes(lowercasedSearchTerm) ||
      (Listing.propertytype && Listing.propertytype.toLowerCase().includes(lowercasedSearchTerm)) ||
      (Listing.description && Listing.description.toLowerCase().includes(lowercasedSearchTerm)) ||
      // Corrected: Convert numerical features to strings for searching
      (Listing.features?.bedrooms && String(Listing.features.bedrooms).includes(lowercasedSearchTerm)) ||
      (Listing.features?.bathrooms && String(Listing.features.bathrooms).includes(lowercasedSearchTerm)) ||
      (Listing.features?.size && String(Listing.features.size).toLowerCase().includes(lowercasedSearchTerm))
    ) : true;
    
    const matchesLocation = locationFilter ? Listing.location.toLowerCase().includes(locationFilter.toLowerCase()) : true;
    const matchesPropertyType = propertyTypeFilter === 'Any' ? true : Listing.propertytype === propertyTypeFilter;
    const matchesBedrooms = bedroomsFilter === 'Any' ? true : (
      bedroomsFilter === '4+' ? parseInt(Listing.features?.bedrooms) >= 4 : parseInt(Listing.features?.bedrooms) === parseInt(bedroomsFilter)
    );
    
    const propertyPriceNum = parseFloat(Listing.price.replace(/[^0-9.-]+/g, ""));
    const matchesMinPrice = minPrice ? propertyPriceNum >= parseFloat(minPrice) : true;
    const matchesMaxPrice = maxPrice ? propertyPriceNum <= parseFloat(maxPrice) : true;
    
    return matchesSearchTerm && matchesPropertyType && matchesBedrooms && matchesMinPrice && matchesMaxPrice && matchesLocation;
  });
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">All Properties</h1>
      <HouseListFilters initialSearchParams={searchParams} />
      {filteredListings.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No properties found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.map((post) => {
            const postCreationDate = new Date(post.createdAt);
            const isNew = (Date.now() - postCreationDate.getTime()) < (4 * 24 * 60 * 60 * 1000); // 4 days
            const featuresObj = post.features;
            
            return (
              <div key={post._id} className="property-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 ease-in-out">
                <div className="relative h-48 overflow-hidden">
                  <PropertyImage
                    className="absolute inset-0 h-full w-full object-cover"
                    src={Array.isArray(post.img) && post.img.length > 0 ? post.img[0] : 'https://placehold.co/600x400/E0E0E0/333333?text=No+Image'}
                    alt={post.propertyname}
                  />
                  {/* Favorite Button (Client Component) */}
                  <FavoriteButton
                    postId={post._id.toString()}
                    initialIsFavorited={userFavoriteIds.has(post._id.toString())}
                  />
                  {/* Featured Tag - Top-right */}
                  {post.isFeatured && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center">
                      <FaStar className="inline-block mr-1" /> Featured
                    </div>
                  )}
                  {/* New Tag - Positioned to avoid conflict if both New and Featured */}
                  {isNew && !post.isFeatured && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                      New
                    </div>
                  )}
                  {isNew && post.isFeatured && (
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
                    <div className="text-blue-500 font-bold text-lg">{post.price}</div>
                  </div>
                  <div className="mt-3 text-sm text-gray-500">
                    <p className="flex items-center flex-wrap">
                      <strong>Features:</strong>
                      {featuresObj?.bedrooms && (
                        <span className="flex items-center ml-2">
                          <FaBed className="text-blue-400 mr-1" /> {featuresObj.bedrooms}
                        </span>
                      )}
                      {featuresObj?.bathrooms && (
                        <span className="flex items-center ml-2">
                          <FaBath className="text-blue-400 mr-1" /> {featuresObj.bathrooms}
                        </span>
                      )}
                      {featuresObj?.size && (
                        <span className="flex items-center ml-2">
                          <FaVectorSquare className="text-blue-400 mr-1" /> {featuresObj.size}
                        </span>
                      )}
                      {!featuresObj?.bedrooms && !featuresObj?.bathrooms && !featuresObj?.size && (
                        <span className="ml-2">Not specified</span>
                      )}
                    </p>
                  </div>
                  {/* Link to detail page using propertyname */}
                  <Link href={`/Listing/${encodeURIComponent(post.propertyname)}`} passHref>
                    <button className="mt-4 w-full bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 rounded-md text-sm font-medium transition duration-300 cursor-pointer">
                      {post.viewdetails || 'View Details'}
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

