// D:\workspace\perfumes-wala\perfume-wala-web\src\app\AnalyticsWrapper.jsx
'use client';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { GoogleAnalytics } from '@next/third-parties/google';
import { useAppSettings } from 'src/hooks/useAppSettings';

export default function AnalyticsWrapper({ children }) {
  const { settings, loading } = useAppSettings();
  const pathname = usePathname();

  useEffect(() => {
    // console.log('useEffect triggered - Loading:', loading, 'GA ID:', settings?.googleAnalytics);

    if (loading || !settings?.googleAnalytics || typeof window.gtag !== 'function') {
      console.log('Skipping gtag - Conditions not met');
      return;
    }

    const handleRouteChange = () => {
      const pageTitle = document.title || 'Untitled Page';
      console.log('Tracking page:', pathname, 'Title:', pageTitle);

      window.gtag('config', settings.googleAnalytics, {
        page_path: pathname,
        page_title: pageTitle
      });
    };

    // Use a longer delay to ensure title is updated
    const timer = setTimeout(handleRouteChange, 500); // Increased to 500ms

    return () => clearTimeout(timer);
  }, [pathname, settings?.googleAnalytics, loading]);

  if (loading) {
    console.log('Rendering children only - Still loading');
    return <>{children}</>;
  }

  return (
    <>
      {settings?.googleAnalytics ? (
        <GoogleAnalytics gaId={settings.googleAnalytics} />
      ) : (
        console.log('No GA ID available')
      )}
      {children}
    </>
  );
}
