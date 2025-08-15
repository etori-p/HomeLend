import React from 'react';

export const metadata = {
  title: 'Moving Checklist | HomeLend',
  description: 'A comprehensive moving checklist to help you plan and execute your move smoothly with HomeLend.',
  openGraph: {
    title: 'HomeLend moving checklist',
    description: 'Plan your move with our detailed moving checklist. Ensure you don\'t forget any important steps.',
    url: 'https://homelend.co.ke/faq', // Replace with your domain and path
    images: [
      {
        url: 'https://images.unsplash.com/photo-1549247774-c2c31e40003b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80', // Replace with your image URL
      },
    ],
  },
};

export default function RentalGuideLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}
