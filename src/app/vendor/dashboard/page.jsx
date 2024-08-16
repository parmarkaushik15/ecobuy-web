import React from 'react';

// components
import Dashboard from 'src/components/_admin/dashboard';

// Meta information
export const metadata = {
  title: 'Ecobuy - Dashboard',
  description: 'Welcome to the Ecobuy Dashboard. Manage your e-commerce operations with ease.',
  applicationName: 'Ecobuy Dashboard',
  authors: 'Ecobuy',
  keywords: 'dashboard, e-commerce, management, Ecobuy',
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
