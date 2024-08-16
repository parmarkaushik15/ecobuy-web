import React from 'react';

// mui
// import { Container } from '@mui/material';
import { Box, Container, TextField, Typography, Button } from '@mui/material';

// component import
// Next.js dynamic import
import dynamic from 'next/dynamic';

// skeleton component import
import HeaderBreadcrumbsSkeleton from 'src/components/skeletons/breadcrumbs';
const HeaderBreadcrumbs = dynamic(() => import('src/components/headerBreadcrumbs'), {
  loading: () => <HeaderBreadcrumbsSkeleton />
});

export default function Page() {
  return (
    <>
      <HeaderBreadcrumbs
        heading="Track Order"
        links={[
          {
            name: 'Home',
            href: '/'
          },
          {
            name: 'Track Order'
          }
        ]}
      />
      <Container maxWidth="xl">
        <Typography sx={{ mb: 5, textAlign: 'center' }}>
          To track your order please enter your Order ID in the box below and press the "Track" button. This was given
          to you on your receipt and in the confirmation email you should have received.
        </Typography>
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <TextField label="Order ID" variant="outlined" fullWidth sx={{ maxWidth: '400px', mb: 2 }} />
          <TextField label="Billing email" variant="outlined" fullWidth sx={{ maxWidth: '400px', mb: 4 }} />
          <Button variant="contained" color="primary" sx={{ width: '150px !important', backgroundColor: 'primary' }}>
            TRACK
          </Button>
        </Box>
      </Container>
    </>
  );
}
