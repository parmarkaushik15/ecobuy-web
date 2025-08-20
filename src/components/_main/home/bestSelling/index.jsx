'use client';
import React from 'react';
import NextLink from 'next/link';

// mui
import { Typography, Box, Stack, Button, Skeleton } from '@mui/material';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
// components
import ProductsCarousel from 'src/components/carousels/gridSlider';
// icons
import { IoIosArrowForward } from 'react-icons/io';

export default function Featured() {
  const { data, isLoading } = useQuery(['get-best-products'], () => api.getBestSellingProducts());

  const { data: pageContextData, isLoading: loadingContext } = useQuery(['get-home-page-context'], () => {
    return api.getHomePageContext();
  });

  const content = pageContextData?.data?.content || {};

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        textAlign={{ xs: 'center', md: 'left' }}
      >
        <Box
          sx={{
            width: '100%'
          }}
        >
          {loadingContext ? (
            <>
              <Typography variant="h3" color="primary" mt={{ xs: 4, md: 8 }}>
                <Skeleton variant="text" width={200} height={40} />
              </Typography>
              <Skeleton variant="text" width={300} height={24} />
            </>
          ) : (
            <>
              <Typography variant="h3" color="primary" mt={{ xs: 4, md: 8 }}>
                {content?.bestSellingProductsTitle || 'Best Selling Products'}
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={{ xs: 3, md: 5 }}>
                {content?.bestSellingProductsSubTitle || 'Special products in this month'}
              </Typography>
            </>
          )}
        </Box>
        {loadingContext ? (
          <Skeleton variant="text" width={100} height={40} />
        ) : (
          <Button
            variant="text"
            color="primary"
            size="large"
            sx={{
              alignItems: 'center',
              textTransform: 'none',
              fontSize: '1rem',
              display: { xs: 'none', md: 'flex' },
              minWidth: 130,
              fontWeight: 500,
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline', backgroundColor: 'transparent' }
            }}
            endIcon={<IoIosArrowForward />}
            component={NextLink}
            href={`/products?top=1`}
          >
            View More
          </Button>
        )}
      </Stack>

      {!isLoading && !Boolean(data?.data.length) ? (
        <Typography variant="h3" color="error.main" textAlign="center">
          {content?.bestSellingProductsNoDataTitle || 'Products not found'}
        </Typography>
      ) : (
        <ProductsCarousel data={data?.data} isLoading={isLoading} />
      )}
      <Button
        variant="text"
        color="primary"
        size="small"
        sx={{
          borderRadius: '5px',
          mx: 'auto',
          display: { md: 'none', xs: 'flex' },
          maxWidth: '120px'
        }}
        endIcon={<IoIosArrowForward />}
        component={NextLink}
        href={`/products?top=1`}
      >
        View More
      </Button>
    </Box>
  );
}
