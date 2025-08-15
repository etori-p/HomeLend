import React from 'react';

export const metadata = {
  title: 'FAQ | HomeLend',
  description: 'Find answers to frequently asked questions about HomeLend, renting properties in Kenya, security deposits, utilities, and more.',
  openGraph: {
    title: 'HomeLend FAQ',
    description: 'Get all your questions answered about finding and renting properties on HomeLend.',
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
