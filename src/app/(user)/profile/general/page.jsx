import React from 'react';

// mui
import { Container } from '@mui/material';

// next
import dynamic from 'next/dynamic';

// components
import Breadcrumbs from 'src/components/skeletons/breadcrumbs';
import GeneralSkeleton from 'src/components/_main/skeletons/profile/general';

// dynamic import
const AccountGeneral = dynamic(() => import('src/components/_main/profile/edit/accountGeneral'), {
  loading: () => <GeneralSkeleton />
});
const HeaderBreadcrumbs = dynamic(() => import('src/components/headerBreadcrumbs'), {
  loading: () => <Breadcrumbs />
});

// Meta information
export const metadata = {
  title: 'Ecobuy - Your Gateway to Seamless Shopping and Secure Transactions',
  applicationName: 'Ecobuy',
  authors: 'Ecobuy'
};

export default function General() {
  return (
    <>
      <HeaderBreadcrumbs
        heading="General"
        links={[
          {
            name: 'Home',
            href: '/'
          },
          {
            name: 'Profile',
            href: '/profile/general'
          },
          {
            name: 'General'
          }
        ]}
      />
      <Container>
        <AccountGeneral />
      </Container>
    </>
  );
}
