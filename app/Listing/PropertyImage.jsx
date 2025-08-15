'use client'; 

import React from 'react';

/** PropertyImage component to display property images with error handling.
 * @param {object} props - The component props.
 * @param {string} props.src - The source URL of the image.
 * @param {string} props.alt - The alt text for the image.
 * @param {string} [props.className] - Optional CSS classes for the image.
 */
export default function PropertyImage({ src, alt, className }) {
  const handleImageError = (e) => {
    // Fallback to a placeholder image if the original image fails to load
    e.target.onerror = null; 
    e.target.src = 'https://placehold.co/600x400/E0E0E0/333333?text=Image+Error';
  };

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      onError={handleImageError} 
    />
  )};