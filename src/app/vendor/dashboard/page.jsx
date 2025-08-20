import React from 'react';

// components
import Dashboard from 'src/components/_admin/dashboard';

// Meta information
export const metadata = {
  title: 'Dashboard-Vendor | Perfumeswale',
  description: 'Welcome to the Perfumeswale Dashboard. Manage your e-commerce operations with ease.',
  applicationName: 'Perfumeswale Dashboard',
  authors: 'Perfumeswale',
  keywords: 'dashboard, e-commerce, management, Perfumeswale',
  icons: {
    icon: '/favicon.png'
  }
};

export default function page() {
  return (
    <>
      <Dashboard isVendor />
    </>
  );
}
