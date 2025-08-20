'use server';
// react
import React from 'react';
// mui
import { Typography, Grid, Box, Stack, Container } from '@mui/material';

// component
import CategoryCard from 'src/components/cards/category';

// api
import * as api from 'src/services';

export default async function Categories() {
  const data = await api.getAllCategoriesByUser();

  // Sort categories by ranking and _id
  const categories = (data?.data || []).sort((a, b) => {
    if (a.ranking === b.ranking) {
      return a._id.localeCompare(b._id);
    }
    return a.ranking - b.ranking;
  });

  return (
    <Container maxWidth="xl">
      <Stack
        direction={'column'}
        sx={{
          gap: 3,
          mt: 5
        }}
      >
        <Box>
          <Typography variant="h2" color="text.primary" textAlign="center">
            Categories
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Explore a wide range of premium categories curated just for you.
          </Typography>
        </Box>
        <Box>
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            {categories.map((inner) => (
              <React.Fragment key={inner._id}>
                <Grid item lg={2} md={3} sm={4} xs={4}>
                  <CategoryCard category={inner} isLoading={false} />
                </Grid>
              </React.Fragment>
            ))}
            {!categories.length && (
              <Typography variant="h3" color="error.main" textAlign="center">
                Categories not found
              </Typography>
            )}
          </Grid>
        </Box>
      </Stack>
    </Container>
  );
}
