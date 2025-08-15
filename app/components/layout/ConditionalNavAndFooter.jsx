'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * A client-side component that conditionally renders the Navbar and Footer.
 * It uses the `usePathname` hook to determine the current page URL.
 * It hides the Navbar and Footer for the specific `/rental-guide` page.
 */
export default function ConditionalNavAndFooter({ children }) {
  
  const pathname = usePathname();
  const showNavAndFooter = pathname !== '/rental-guide' && pathname !== '/faq' && pathname !== '/moving-checklist' && pathname !== '/tos'
    && pathname !== '/privacy-policy' && pathname !== '/cookie-policy';
   

  return (
    <>
      {showNavAndFooter && <Navbar />}
      {children}
      {showNavAndFooter && <Footer />}
    </>
  );
}