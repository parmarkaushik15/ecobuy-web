'use client'; // Convert to client component for useEffect
import { useEffect } from 'react';
// mui
import { Box, Container } from '@mui/material';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import ProductList from 'src/components/_main/products';
import Head from 'next/head';

export default function Listing() {
  const pageTitle = 'Products | Perfumeswale';

  useEffect(() => {
    document.title = pageTitle; // Force title update
  }, []);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Box>
        <Box sx={{ bgcolor: 'background.default' }}>
          <HeaderBreadcrumbs
            heading="Products"
            links={[
              {
                name: 'Home',
                href: '/'
              },
              {
                name: 'Products'
              }
            ]}
          />
          <Container maxWidth="xl">
            <ProductList />
          </Container>
        </Box>
      </Box>
    </>
  );
}
