import PropTypes from 'prop-types';
// mui
import { Box, Grid } from '@mui/material';
// components
import ProductCard from 'src/components/cards/product';
import NoDataFound from 'src/illustrations/dataNotFound';

export default function ProductList({ data, isLoading, isMobile, isFirstLoadDone }) {
  const products = data?.data || [];

  // Show skeleton loader during initial loading or when no products are available yet
  const showSkeleton = isLoading && !isFirstLoadDone;
  const showNoData = isFirstLoadDone && !isLoading && products.length === 0;

  return (
    <Box my={3}>
      <Grid container spacing={isMobile ? 1 : 2}>
        {showSkeleton ? (
          Array.from({ length: 8 }).map((_, index) => (
            <Grid key={index} item lg={3} md={3} sm={6} xs={12} sx={{ transition: 'all 0.3s ease-in-out' }}>
              <ProductCard product={null} loading={true} isMobile={isMobile} />
            </Grid>
          ))
        ) : showNoData ? (
          <Grid item xs={12}>
            <NoDataFound />
          </Grid>
        ) : (
          products.map((product) => (
            <Grid
              key={product.id || Math.random()} // Prefer product.id to avoid duplicate keys
              item
              lg={3}
              md={3}
              sm={6}
              xs={12}
              sx={{ transition: 'all 0.3s ease-in-out' }}
            >
              <ProductCard product={product} loading={false} isMobile={isMobile} />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}

// add propTypes
ProductList.propTypes = {
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isMobile: PropTypes.bool.isRequired,
  isFirstLoadDone: PropTypes.bool.isRequired
};
