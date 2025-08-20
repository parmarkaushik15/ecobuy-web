'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
// mui
import { Grid, Dialog, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
// components
import DetailsSkeleton from 'src/components/skeletons/productDetail';
import ProductDetailsSumaryMobile from '../_main/product/mobileSummary';
import ProductDetailsCarousel from 'src/components/carousels/customPaginationSilder';

ProductDetailsDialog.propTypes = {
  slug: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};

export default function ProductDetailsDialog(props) {
  const { onClose, open, slug } = props;

  const { data: productData, isLoading: isProductLoading } = useQuery(['product', slug], () =>
    api.getProductBySlug(slug)
  );
  const {
    data: settingsData,
    isLoading: isSettingsLoading,
    isError: isSettingsError,
    refetch: refetchSettings
  } = useQuery(['settings'], () => api.getSetting(), {
    retry: 2, // Retry up to 2 times on failure
    onError: (error) => {
      console.error('Error fetching settings:', error);
    }
  });

  // Default values if API fails
  const shippingCost = settingsData?.data?.[0]?.shippingCost ?? 0;
  const isFreeShipping = settingsData?.data?.[0]?.isFreeShipping ?? true;

  // Debug log for settings data
  console.log('ProductDetailsDialog - Settings Data:', {
    settingsData,
    shippingCost,
    isFreeShipping,
    isSettingsLoading,
    isSettingsError
  });

  // Retry fetching settings if data is missing
  React.useEffect(() => {
    if (!settingsData && !isSettingsLoading && isSettingsError) {
      console.warn('Settings data missing, retrying...');
      refetchSettings();
    }
  }, [settingsData, isSettingsLoading, isSettingsError, refetchSettings]);

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="md">
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
          zIndex: 1
        }}
      >
        <CloseIcon />
      </IconButton>
      {isProductLoading || isSettingsLoading ? (
        <DetailsSkeleton isPopup />
      ) : (
        <Grid container spacing={2} justifyContent="center" sx={{ p: 3 }}>
          <Grid item xs={12} md={6} lg={6}>
            <ProductDetailsCarousel slug={slug} product={productData?.data} data={productData?.data} />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <ProductDetailsSumaryMobile
              id={productData?.data?._id}
              product={productData?.data}
              brand={productData?.brand}
              category={productData?.category}
              totalRating={productData?.totalRating}
              totalReviews={productData?.totalReviews}
              shippingCost={shippingCost}
              isFreeShipping={isFreeShipping}
            />
          </Grid>
        </Grid>
      )}
    </Dialog>
  );
}
