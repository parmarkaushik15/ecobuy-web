import React from 'react';

// mui
import { Toolbar } from '@mui/material';

// components
import Navbar from 'src/layout/_main/navbar';
import Footer from 'src/layout/_main/footer';
import Topbar from 'src/layout/_main/topbar';
import ActionBar from 'src/layout/_main/actionbar';
import CookieConsentBanner from 'src/components/CookieConsentBanner';

// Meta information
export const metadata = {
  title: 'Perfumeswale E-commerce',
  description:
    'Log in to Perfumeswale for secure access to your account. Enjoy seamless shopping, personalized experiences, and hassle-free transactions. Your trusted portal to a world of convenience awaits. Login now!',
  applicationName: 'Perfumeswale',
  authors: 'Perfumeswale',
  keywords: 'ecommerce, Perfumeswale, Commerce, Login Perfumeswale, LoginFrom Perfumeswale',
  icons: {
    icon: '/favicon.png'
  },
  openGraph: {
    images: 'https://Perfumeswale.vercel.app/opengraph-image.png?1c6a1fa20db2840f'
  }
};

export default async function RootLayout({ children }) {
  return (
    <>
      {/* <Topbar /> */}
      <Navbar />
      <ActionBar />
      {children}
      <Toolbar sx={{ display: { xs: 'block', md: 'none' } }} />
      <Footer />
      <CookieConsentBanner />
    </>
  );
}
