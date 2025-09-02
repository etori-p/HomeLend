// app/Listing/[propertyname]/page.jsx

import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import PropertyDetailClient from './PropertyDetailClient';

async function getSingleHouseData(propertyname) {
  const decodedPropertyName = decodeURIComponent(propertyname);
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/list/${encodeURIComponent(decodedPropertyName)}`, {
    cache: 'no-store'
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to fetch property: ${res.statusText}`);
  }

  return res.json();
}

export default async function PropertyDetailPage({ params }) {
  const { propertyname } = params;

  //Check if the user is logged in
  const session = await getServerSession(authOptions);
  if (!session) {
    // If not logged in, redirect to login
    redirect('/api/auth/login?callbackUrl=/Listing/' + propertyname);
  }

  const post = await getSingleHouseData(propertyname);

  return <PropertyDetailClient post={post} session={session} />;
}
