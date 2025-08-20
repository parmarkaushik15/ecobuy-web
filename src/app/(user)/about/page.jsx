'use client';
import React, { useEffect } from 'react';
import Head from 'next/head';
// mui
import { Container } from '@mui/material';

// component import
import AboutUs from 'src/components/_main/about';
import WhyUs from 'src/components/_main/home/whyUs';
import * as api from 'src/services';
import { useQuery } from 'react-query';

// Next.js dynamic import
import dynamic from 'next/dynamic';

// skeleton component import
import HeaderBreadcrumbsSkeleton from 'src/components/skeletons/breadcrumbs';
const Testimonials = dynamic(() => import('src/components/_main/home/testimonials'));
const HeaderBreadcrumbs = dynamic(() => import('src/components/headerBreadcrumbs'), {
  loading: () => <HeaderBreadcrumbsSkeleton />
});

export default function Page() {
  const { data, isLoading } = useQuery(['about-cms'], () => api.getCmsBySlug('about-us'));
  const pageTitle = 'About Us | Perfumeswale';
  useEffect(() => {
    document.title = pageTitle; // Force title update
  }, []);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <HeaderBreadcrumbs
        heading="About Us"
        links={[
          {
            name: 'Home',
            href: '/'
          },
          {
            name: 'About us'
          }
        ]}
      />
      <Container maxWidth="xl">
        <AboutUs data={data} isLoading={isLoading} />
      </Container>
      <Testimonials />
      <Container maxWidth="xl" style={{ marginTop: 50 }}>
        <WhyUs />
      </Container>
    </>
  );
}
