'use client';
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';

// mui
import { Container } from '@mui/material';

// component
import ContactUs from 'src/components/_main/contactUs';

import HeaderBreadcrumbsSkeleton from 'src/components/skeletons/breadcrumbs';
import Head from 'next/head';
// skeleton

const HeaderBreadcrumbs = dynamic(() => import('src/components/headerBreadcrumbs'), {
  loading: () => <HeaderBreadcrumbsSkeleton />
});

export default function Page() {
  const pageTitle = 'Contact Us | Perfumeswale';
  useEffect(() => {
    document.title = pageTitle; // Force title update
  }, []);
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <HeaderBreadcrumbs
        heading="Contact Us"
        links={[
          {
            name: 'Home',
            href: '/'
          },
          {
            name: 'Contact us'
          }
        ]}
      />
      <Container maxWidth="xl">
        <ContactUs />
      </Container>
    </>
  );
}
