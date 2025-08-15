// app/rental-guide/layout.jsx
import React from 'react';

export const metadata = {
  title: 'Rental Guide | HomeLend',
  description: 'Your comprehensive guide to renting a house in Kenya. Learn about the process from finding a home to moving in.',
};

export default function RentalGuideLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}
