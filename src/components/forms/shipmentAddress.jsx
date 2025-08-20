'use client';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
// mui
import { Stack, TextField, Card, CardHeader, Typography, Button } from '@mui/material';
// countries
import countries from '../_main/checkout/countries.json';
// MapPickerDialog
import MapPickerDialog from './mapPickerDialog';

export default function ShipmentCheckoutForm({
  getFieldProps,
  touched,
  errors,
  isLoading,
  setFieldValue,
  googleMapApiKey,
  formik // Add formik prop to access validateForm
}) {
  const [openMapDialog, setOpenMapDialog] = useState(false);

  const handleSelectLocation = async (location) => {
    if (location) {
      // Update all shippingAddress fields
      await setFieldValue('shippingAddress.address', location.address || '');
      await setFieldValue('shippingAddress.city', location.city || '');
      await setFieldValue('shippingAddress.state', location.state || '');
      await setFieldValue('shippingAddress.zip', location.zip || '');
      await setFieldValue('shippingAddress.country', location.country || 'India');
      await setFieldValue('shippingAddress.firstName', formik.values.shippingAddress.firstName || '');
      await setFieldValue('shippingAddress.lastName', formik.values.shippingAddress.lastName || '');

      // Force form validation
      formik.validateForm().then((errors) => {
        console.log('Validation after map selection:', errors);
      });
    }
    setOpenMapDialog(false);
  };

  return (
    <>
      <MapPickerDialog
        open={openMapDialog}
        onClose={() => setOpenMapDialog(false)}
        googleMapApiKey={googleMapApiKey}
        onSelectLocation={handleSelectLocation}
        isLoading={isLoading}
      />
      <Card sx={{ mt: 2, borderRadius: '8px', boxShadow: 'unset' }}>
        <CardHeader title={<Typography variant="h4">Ship to a different address</Typography>} />
        <Stack spacing={{ xs: 2, sm: 3 }} p={3} mt={1}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Stack spacing={0.5} width={1}>
              <Typography variant="overline" color="text.primary" htmlFor="firstName" component={'label'}>
                First Name
              </Typography>
              <TextField
                fullWidth
                {...getFieldProps('shippingAddress.firstName')}
                error={Boolean(touched?.shippingAddress?.firstName && errors?.shippingAddress?.firstName)}
                helperText={touched?.shippingAddress?.firstName && errors?.shippingAddress?.firstName}
                type="text"
                disabled={isLoading}
              />
            </Stack>
            <Stack spacing={0.5} width={1}>
              <Typography variant="overline" color="text.primary" htmlFor="lastName" component={'label'}>
                Last Name
              </Typography>
              <TextField
                fullWidth
                {...getFieldProps('shippingAddress.lastName')}
                error={Boolean(touched?.shippingAddress?.lastName && errors?.shippingAddress?.lastName)}
                helperText={touched?.shippingAddress?.lastName && errors?.shippingAddress?.lastName}
                type="text"
                disabled={isLoading}
              />
            </Stack>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'flex-end' }}>
            <Stack spacing={0.5} width={1}>
              <Typography variant="overline" color="text.primary" htmlFor="address" component={'label'}>
                Address
              </Typography>
              <TextField
                fullWidth
                {...getFieldProps('shippingAddress.address')}
                error={Boolean(touched?.shippingAddress?.address && errors?.shippingAddress?.address)}
                helperText={touched?.shippingAddress?.address && errors?.shippingAddress?.address}
                disabled={isLoading}
                onChange={(e) => {
                  setFieldValue('shippingAddress.address', e.target.value);
                  formik.validateForm(); // Trigger validation on change
                }}
              />
            </Stack>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => setOpenMapDialog(true)}
              disabled={isLoading || !googleMapApiKey}
              sx={{
                height: { xs: '48px', sm: '57px' },
                width: { xs: '100%', sm: 'auto' },
                '&:hover': {
                  color: 'common.white'
                }
              }}
            >
              Map
            </Button>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Stack spacing={0.5} width={1}>
              <Typography variant="overline" color="text.primary" htmlFor="city" component={'label'}>
                Town City
              </Typography>
              <TextField
                fullWidth
                {...getFieldProps('shippingAddress.city')}
                error={Boolean(touched?.shippingAddress?.city && errors?.shippingAddress?.city)}
                helperText={touched?.shippingAddress?.city && errors?.shippingAddress?.city}
                disabled={isLoading}
                onChange={(e) => {
                  setFieldValue('shippingAddress.city', e.target.value);
                  formik.validateForm(); // Trigger validation on change
                }}
              />
            </Stack>
            <Stack spacing={0.5} width={1}>
              <Typography variant="overline" color="text.primary" htmlFor="state" component={'label'}>
                State
              </Typography>
              <TextField
                fullWidth
                {...getFieldProps('shippingAddress.state')}
                error={Boolean(touched?.shippingAddress?.state && errors?.shippingAddress?.state)}
                helperText={touched?.shippingAddress?.state && errors?.shippingAddress?.state}
                disabled={isLoading}
                onChange={(e) => {
                  setFieldValue('shippingAddress.state', e.target.value);
                  formik.validateForm(); // Trigger validation on change
                }}
              />
            </Stack>
            <Stack spacing={0.5} width={1}>
              <Typography variant="overline" color="text.primary" htmlFor="zip" component={'label'}>
                Zip/Postal Code
              </Typography>
              <TextField
                fullWidth
                {...getFieldProps('shippingAddress.zip')}
                error={Boolean(touched?.shippingAddress?.zip && errors?.shippingAddress?.zip)}
                helperText={touched?.shippingAddress?.zip && errors?.shippingAddress?.zip}
                type="number"
                disabled={isLoading}
                onChange={(e) => {
                  setFieldValue('shippingAddress.zip', e.target.value);
                  formik.validateForm(); // Trigger validation on change
                }}
              />
            </Stack>
          </Stack>
          <Stack spacing={0.5} width={1}>
            <Typography variant="overline" color="text.primary" htmlFor="country" component={'label'}>
              Country
            </Typography>
            <TextField
              select
              fullWidth
              placeholder="Country"
              {...getFieldProps('shippingAddress.country')}
              SelectProps={{ native: true }}
              error={Boolean(touched?.shippingAddress?.country && errors?.shippingAddress?.country)}
              helperText={touched?.shippingAddress?.country && errors?.shippingAddress?.country}
              disabled={isLoading}
              onChange={(e) => {
                setFieldValue('shippingAddress.country', e.target.value);
                formik.validateForm(); // Trigger validation on change
              }}
            >
              {countries.map((option) => (
                <option key={option.code} value={option.label}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Stack>
        </Stack>
      </Card>
    </>
  );
}

ShipmentCheckoutForm.propTypes = {
  getFieldProps: PropTypes.func.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  googleMapApiKey: PropTypes.string,
  formik: PropTypes.object.isRequired // Add formik prop type
};
