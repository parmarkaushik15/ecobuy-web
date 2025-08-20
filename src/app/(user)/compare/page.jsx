'use client';
import React, { useEffect } from 'react';

// mui
import { Container } from '@mui/material';

// next
import dynamic from 'next/dynamic';

// components
import HeaderBreadcrumbsSkeleton from 'src/components/skeletons/breadcrumbs';
import Compare from 'src/components/_main/compare';
import Head from 'next/head';

// dynamic import
const HeaderBreadcrumbs = dynamic(() => import('src/components/headerBreadcrumbs'), {
  loading: () => <HeaderBreadcrumbsSkeleton />
});

export default function Page() {
  const pageTitle = 'Compare | Perfumeswale';
  useEffect(() => {
    document.title = pageTitle; // Force title update
  }, []);
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <HeaderBreadcrumbs
        heading="Compare"
        links={[
          {
            name: 'Home',
            href: '/'
          },
          {
            name: 'Compare'
          }
        ]}
      />
      <Container maxWidth="xl">
        <Compare />
      </Container>
    </>
  );
}
