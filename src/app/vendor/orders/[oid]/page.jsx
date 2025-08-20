'use client';
import React from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// mui
import { Container, Grid, Box } from '@mui/material';

// components
import OrderDetails from 'src/components/_main/orders/orderDetails';
import TableCard from 'src/components/table/order';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import StatusUpdateForm from 'src/components/forms/statusUpdate';

// api
import * as api from 'src/services';
import { useQuery } from 'react-query';

Page.propTypes = {
  params: PropTypes.shape({
    oid: PropTypes.string.isRequired
  }).isRequired
};

export default function Page({ params }) {
  const { data, isLoading } = useQuery(['order-by-admin', params.oid], () => api.getOrderByAdmin(params.oid), {
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Something went wrong!');
    }
  });

  const { data: settingsData, isLoading: settingsLoading } = useQuery(['admin-settings'], api.getSetting, {
    onError: (err) => {
      toast.error('Failed to load app settings');
    }
  });
  return (
    <Box>
      <HeaderBreadcrumbs
        admin
        links={[
          {
            name: 'Dashboard',
            href: '/dashboard'
          },
          {
            name: 'Orders',
            href: '/vendor/orders'
          },
          {
            name: 'Order details',
            href: ''
          }
        ]}
      />
      <Container maxWidth="xl">
        <Grid container direction={{ xs: 'row', md: 'row-reverse' }} spacing={2}>
          <Grid item xs={12} md={4}>
            <OrderDetails
              data={data?.data}
              isLoading={isLoading}
              currency={'₹'}
              isVendor
              settings={settingsData?.data}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <TableCard data={data?.data} isLoading={isLoading} />
            <StatusUpdateForm isLoading={isLoading} oid={params.oid} isVendor />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
