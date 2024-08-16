import React from 'react';

// mui
import { Typography, Grid, Box, Stack, Container } from '@mui/material';

// components
import ShopCard from 'src/components/cards/shop';

// api
import * as api from 'src/services';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
export default async function ShopComponent() {
  const data = await api.getShops();

  return (
    <>
      <HeaderBreadcrumbs
        heading="Shops"
        links={[
          {
            name: 'Home',
            href: '/'
          },
          {
            name: 'Shops'
          }
        ]}
      />

      <Container maxWidth="xl">
        <Stack
          direction={'column'}
          sx={{
            gap: 3,
            mt: 5
          }}
        >
          <Box>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              {(data?.data).map((inner) => (
                <React.Fragment key={Math.random()}>
                  <Grid item lg={4} md={6} sm={6} xs={12}>
                    <ShopCard shop={inner} isLoading={false} />
                  </Grid>
                </React.Fragment>
              ))}
              {!Boolean(data?.data.length) && (
                <Typography variant="h3" color="error.main" textAlign="center">
                  Shop not found
                </Typography>
              )}
            </Grid>
          </Box>
        </Stack>
      </Container>
    </>
  );
}
