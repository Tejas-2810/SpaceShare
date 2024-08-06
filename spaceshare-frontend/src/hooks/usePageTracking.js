// src/hooks/usePageTracking.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    window.gtag('config', 'G-72QDP0PQDM', {
      page_path: location.pathname + location.search,
    });
  }, [location]);
}

export default usePageTracking;
