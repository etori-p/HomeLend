//app/components/layout/MainContentWrapper.jsx
// This component wraps the main content of the application, providing a loading overlay during initial data fetching.
'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import LoadingOverlay from './LoadingOverlay';

/**
 * @param {object} props 
 * @param {React.ReactNode} props.children 
 */
const MainContentWrapper = ({ children }) => {
  const { status } = useSession(); 
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  useEffect(() => {
    if (status !== 'loading') {
      setIsInitialLoadComplete(true);
    }
  }, [status]); 

  if (!isInitialLoadComplete) {
    return <LoadingOverlay />;
  }

  return <main>{children}</main>;
};

export default MainContentWrapper;