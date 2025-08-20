'use client';
import React, { useEffect, useState } from 'react';
import { Typography, Grid, Box, Stack, Container } from '@mui/material';
import ShopCard from 'src/components/cards/shop';
import * as api from 'src/services';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import Head from 'next/head'; // Make sure this is imported
import { useQuery } from 'react-query';

export default function ShopComponent() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  const pageTitle = 'Shops | Perfumeswale';
  const { data: pageContextData, isLoading: loadingContext } = useQuery(['get-products-page-context'], () => {
    return api.getShopsPageContext();
  });

  const content = pageContextData?.data?.content || {};
  useEffect(() => {
    document.title = pageTitle;

    const fetchShops = async () => {
      try {
        const data = await api.getShops();
        setShops(data?.data || []);
      } catch (error) {
        console.error('Error fetching shops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <HeaderBreadcrumbs heading="Shops" links={[{ name: 'Home', href: '/' }, { name: 'Shops' }]} />
      <Container maxWidth="xl">
        <Stack direction="column" sx={{ gap: 3, mt: 5 }}>
          <Box>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              {shops.map((shop) => (
                <Grid item lg={3} md={4} sm={6} xs={12} key={shop._id}>
                  <ShopCard shop={shop} isLoading={false} />
                </Grid>
              ))}
              {!loading && !Boolean(shops.length) && (
                <Typography variant="h3" color="error.main" textAlign="center">
                  {content?.shopNoDataTitle || 'Shop not found'}
                </Typography>
              )}
            </Grid>
          </Box>
        </Stack>
      </Container>
    </>
  );
}
