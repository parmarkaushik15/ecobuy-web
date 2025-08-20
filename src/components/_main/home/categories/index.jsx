'use client';
// React
import React from 'react';
import NextLink from 'next/link';
// MUI
import { Typography, Grid, Box, Stack, Paper, Button, Skeleton } from '@mui/material';
import { IoIosArrowForward } from 'react-icons/io';
// Components
import CategoryCard from 'src/components/cards/category';
// API
import * as api from 'src/services';
import { useQuery } from 'react-query';

export default function Categories() {
  const { data, isLoading } = useQuery(['get-home-categories'], () => api.getHomeCategories(), {
    select: (data) => data?.data,
    onSuccess: (categories) => {}
  });

  const { data: pageContextData, isLoading: loadingContext } = useQuery(['get-home-page-context'], () => {
    return api.getHomePageContext();
  });

  const content = pageContextData?.data?.content || {};
  const categories = (data || []).sort((a, b) => {
    // Explicitly sort by ranking, then _id for consistency
    if (a.ranking === b.ranking) {
      return a._id.localeCompare(b._id);
    }
    return a.ranking - b.ranking;
  }); // Ensure categories is sorted
  const skeletonCount = isLoading ? 8 : categories.length || 0;

  return (
    <Paper elevation={0}>
      <Stack
        direction={'column'}
        sx={{
          gap: 2,
          mt: 2,
          border: (theme) => `solid 1px ${theme.palette.divider}`,
          position: 'relative',
          zIndex: 10,
          borderRadius: '5px',
          background: (theme) => theme.palette.background.paper
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          textAlign={{ xs: 'center', md: 'left' }}
          alignItems="center"
          paddingLeft={2}
          paddingRight={2}
          paddingTop={1}
        >
          <Box>
            {loadingContext ? (
              <>
                <Skeleton variant="text" width={200} height={40} />
                <Skeleton variant="text" width={300} height={24} />
              </>
            ) : (
              <>
                <Typography variant="h4" color="primary">
                  {content?.topCategoryTitle || 'Top Categories'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {content?.topCategorySubTitle ||
                    'Explore our most popular fragrance categories tailored to every taste and mood.'}
                </Typography>
              </>
            )}
          </Box>
          {loadingContext ? (
            <Skeleton variant="rectangular" width={130} height={36} />
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
              href={`/categories`}
            >
              View More
            </Button>
          )}
        </Stack>

        <Box>
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            {(isLoading ? Array.from(new Array(skeletonCount)) : categories)?.map((inner, index) => (
              <React.Fragment key={isLoading ? index : inner?._id || index}>
                <Grid item lg={2} md={3} sm={4} xs={4} paddingBottom={2}>
                  <CategoryCard category={inner} isLoading={isLoading} />
                </Grid>
              </React.Fragment>
            ))}
            {!isLoading && !categories.length && (
              <Typography variant="h3" color="error.main" textAlign="center">
                {content?.categoryNoDataTitle || 'Categories not found'}
              </Typography>
            )}
          </Grid>
          <Button
            variant="text"
            color="primary"
            size="small"
            sx={{
              borderRadius: '5px',
              mx: 'auto',
              mt: 3,
              display: { md: 'none', xs: 'flex' },
              maxWidth: '120px'
            }}
            endIcon={<IoIosArrowForward />}
            component={NextLink}
            href={`/categories`}
          >
            View More
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
