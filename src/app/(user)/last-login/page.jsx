'use client';
import React from 'react';
// mui
import { Container } from '@mui/material';
// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import LastLogins from 'src/components/_main/last-login';

export default function Page() {
  return (
    <div>
      <HeaderBreadcrumbs
        heading="Last Logins"
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
            name: 'Last Logins'
          }
        ]}
      />
      <Container maxWidth="xl">
        <LastLogins />
      </Container>
    </div>
  );
}
