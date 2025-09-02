// app/Listing/[propertyname]/page.jsx

import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import PropertyDetailClient from './PropertyDetailClient';

/**
 * Generates dynamic metadata for the property detail page.
 * @param {object} props
 * @param {object} props.params
 * @returns {object} Metadata object
 */
export async function generateMetadata({ params }) {
  // Await params to ensure it's fully resolved before destructuring
  const paramsData = await params;
  const { propertyname } = paramsData;

  const post = await getSingleHouseData(propertyname);

  if (!post) {
    return {
      title: 'Property Not Found | HomeLend',
      description: 'The property you are looking for does not exist.',
    };
  }

  const title = `${post.propertyname} for rent in ${post.location} | ${post.price}`;
  const description = post.description || `View features and details of this amazing property located in ${post.location}. It includes ${post.features.bedrooms} bedrooms, ${post.features.bathrooms} bathrooms, and is available for ${post.price}.`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      images: [
        {
          url: Array.isArray(post.img) && post.img.length > 0 ? post.img[0] : 'https://placehold.co/600x400/E0E0E0/333333?text=No+Image',
          width: 600,
          height: 400,
          alt: post.propertyname,
        }
      ],
    },
  };
}

/**
 * Fetches data for a single property from the API.
 * @param {string} propertyname The name of the property from the URL.
 * @returns {Promise<object | null>} The property data or null if not found.
 */
async function getSingleHouseData(propertyname) {
  // Decode the propertyname to handle spaces correctly
  const decodedPropertyName = decodeURIComponent(propertyname);
  const baseUrl = process.env.VERCEL_URL `https://${process.env.VERCEL_URL}`;   
  const res = await fetch(`${baseUrl}/api/list/${encodeURIComponent(decodedPropertyName)}`, {
    cache: 'no-store'
  });

  if (!res.ok) {
    if (res.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch property: ${res.statusText}`);
  }

  return res.json();
}

/**
 * Renders the property detail page.
 * @param {object} props
 * @param {object} props.params
 * @returns {JSX.Element} The property detail page component.
 */
export default async function PropertyDetailPage({ params }) {
  // Await params to ensure it's fully resolved before destructuring
  const paramsData = await params;
  const { propertyname } = paramsData;

  const post = await getSingleHouseData(propertyname);
  const session = await getServerSession(authOptions);

  return <PropertyDetailClient post={post} session={session} />;
}
