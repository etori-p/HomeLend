'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import LoadingOverlay from './LoadingOverlay';

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