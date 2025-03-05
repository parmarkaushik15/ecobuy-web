import React from 'react';

// mui
import { Toolbar } from '@mui/material';

// components
import Navbar from 'src/layout/_main/navbar';
import Footer from 'src/layout/_main/footer';
import Topbar from 'src/layout/_main/topbar';
import ActionBar from 'src/layout/_main/actionbar';

// Meta information
export const metadata = {
  title: 'Ecobuy E-commerce',
  description:
    'Log in to Ecobuy for secure access to your account. Enjoy seamless shopping, personalized experiences, and hassle-free transactions. Your trusted portal to a world of convenience awaits. Login now!',
  applicationName: 'Ecobuy',
  authors: 'Ecobuy',
  keywords: 'ecommerce, Ecobuy, Commerce, Login Ecobuy, LoginFrom Ecobuy',
  icons: {
    icon: '/favicon.png'
  },
  openGraph: {
    images: 'https://Ecobuy.vercel.app/opengraph-image.png?1c6a1fa20db2840f'
  }
};

export default async function RootLayout({ children }) {
  return (
    <>
      <Topbar />
      <Navbar />
      <ActionBar />
      {children}
      <Toolbar sx={{ display: { xs: 'block', md: 'none' } }} />
      <Footer />
    </>
  );
}
