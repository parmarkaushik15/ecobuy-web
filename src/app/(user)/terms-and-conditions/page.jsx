'use client';
import React from 'react';

// MUI
import { Container, Grid, Skeleton, Typography, Box } from '@mui/material';

// Components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import * as api from 'src/services';
import { useQuery } from 'react-query';

const TermsAndConditions = () => {
  const { data, isLoading } = useQuery(['about-cms'], () => api.getCmsBySlug('terms-and-conditions'));

  // Simulate content structure with multiple paragraphs
  const renderContentSkeletons = () => {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {[...Array(8)].map((_, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            {index % 3 === 0 ? <Skeleton variant="rectangular" width="60%" height={40} sx={{ mb: 1 }} /> : null}
            <Skeleton variant="text" width="100%" height={24} />
            <Skeleton variant="text" width="100%" height={24} />
            <Skeleton variant="text" width="80%" height={24} />
          </Box>
        ))}
      </Container>
    );
  };
  return (
    <>
      <HeaderBreadcrumbs
        heading="Terms and conditions"
        links={[
          {
            name: 'Home',
            href: '/'
          },
          {
            name: 'Terms and conditions'
          }
        ]}
      />

      {isLoading ? (
        <>{renderContentSkeletons()}</>
      ) : (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <div dangerouslySetInnerHTML={{ __html: data?.data?.content }} />
        </Container>
      )}
    </>
  );
};

export default TermsAndConditions;
