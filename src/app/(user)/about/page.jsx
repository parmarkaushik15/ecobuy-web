import React from 'react';

// mui
import { Container } from '@mui/material';

// component import
import AboutUs from 'src/components/_main/about';
import WhyUs from 'src/components/_main/home/whyUs';
// Next.js dynamic import
import dynamic from 'next/dynamic';

// skeleton component import
import HeaderBreadcrumbsSkeleton from 'src/components/skeletons/breadcrumbs';
const Testimonials = dynamic(() => import('src/components/_main/home/testimonials'));
const HeaderBreadcrumbs = dynamic(() => import('src/components/headerBreadcrumbs'), {
  loading: () => <HeaderBreadcrumbsSkeleton />
});

export default function Page() {
  return (
    <>
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
        <AboutUs />
      </Container>
      <Testimonials />
      <Container maxWidth="xl" style={{ marginTop: 50 }}>
        <WhyUs />
      </Container>
    </>
  );
}
