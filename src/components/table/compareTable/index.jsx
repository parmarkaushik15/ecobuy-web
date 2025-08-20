'use client';
import { useRouter } from 'next-nprogress-bar';
import { useSelector, useDispatch } from 'react-redux';
import { removeCompareProduct } from 'src/redux/slices/compare';
import Image from 'next/image';
import { useQuery, useQueryClient } from 'react-query';

// mui
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  TableHead,
  Box,
  Stack,
  Card,
  Rating,
  IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';

// icons
import { IoIosCloseCircle } from 'react-icons/io';

// api
import * as api from 'src/services';
// custom hooks
import { useCurrencyConvert } from 'src/hooks/convertCurrency';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';

// components
import NoDataFoundIllustration from 'src/illustrations/dataNotFound';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
    overflow: 'hidden'
  }
}));

const CompareTable = () => {
  const cCurrency = useCurrencyConvert();
  const fCurrency = useCurrencyFormatter();
  const dispatch = useDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { products: compareProducts, isLoading } = useSelector(({ compare }) => compare);

  // Use compareProducts IDs in query key to trigger refetch on change
  const compareProductIds = compareProducts
    .map((v) => v._id)
    .sort()
    .join(',');
  const { data: fetchedProducts, isFetching } = useQuery(
    ['get-compare-products', compareProductIds],
    () => api.getCompareProducts(compareProducts.map((v) => v._id)),
    {
      enabled: compareProducts.length > 0, // Only fetch if there are products
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      cacheTime: 10 * 60 * 1000, // Keep cache for 10 minutes
      onError: (error) => {
        console.error('Error fetching compare products:', error);
      }
    }
  );

  const onRemoveCompare = (productId) => (event) => {
    event.stopPropagation();
    try {
      dispatch(removeCompareProduct(productId)); // Remove .unwrap() since it's not an async thunk
      queryClient.invalidateQueries(['get-compare-products']); // Invalidate to trigger refetch
    } catch (error) {
      console.error('Error removing compare product:', error);
    }
  };

  return isLoading || isFetching ? (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Typography>Loading...</Typography>
    </Box>
  ) : fetchedProducts?.data?.length ? (
    <TableContainer component={Card}>
      <Table
        sx={{
          borderCollapse: 'separate',
          '& td, & th': {
            border: 1,
            borderColor: (theme) => theme.palette.action.hover
          }
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            {fetchedProducts?.data?.map((product) => (
              <TableCell
                key={product._id}
                align="left"
                sx={{ minWidth: 292, maxWidth: 292, cursor: 'pointer' }}
                onClick={() => router.push('/product/' + product.slug)}
              >
                <Stack sx={{ position: 'relative' }}>
                  <IconButton
                    onClick={onRemoveCompare(product._id)}
                    aria-label="Remove from compare"
                    sx={{ position: 'absolute', top: 0, right: 0, zIndex: 50 }}
                  >
                    <IoIosCloseCircle />
                  </IconButton>
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: { md: 320, sm: 170, xs: 150 },
                      borderRadius: '5px',
                      overflow: 'hidden'
                    }}
                  >
                    <Image
                      src={
                        process.env.IMAGE_BASE === 'LOCAL'
                          ? `${process.env.IMAGE_URL}${product.image.url}`
                          : product.image.url
                      }
                      alt={product.name}
                      fill
                      objectFit="cover"
                      placeholder="blur"
                      blurDataURL={product.image.blurDataURL}
                    />
                  </Box>

                  <Typography variant="subtitle1" sx={{ marginY: { md: 2, xs: 1 } }} noWrap>
                    {product.name}
                  </Typography>
                </Stack>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <StyledTableRow>
            <TableCell sx={{ minWidth: 292, maxWidth: 292, fontWeight: 600, fontSize: 16 }} component="th">
              Customer Feedback
            </TableCell>
            {fetchedProducts?.data?.map((product) => (
              <TableCell key={product._id} align="left" sx={{ fontSize: 16, color: 'text.secondary' }}>
                <Stack direction="row" alignItems="center">
                  <Rating size="small" name="read-only" precision={0.5} value={product.averageRating} readOnly />(
                  {product.averageRating || 0})
                </Stack>
              </TableCell>
            ))}
          </StyledTableRow>
          <StyledTableRow>
            <TableCell component="th" sx={{ minWidth: 292, maxWidth: 292, fontWeight: 600, fontSize: 16 }}>
              Price
            </TableCell>
            {fetchedProducts?.data?.map((product) => (
              <TableCell key={product._id} align="left" sx={{ fontWeight: 600, fontSize: 16, color: 'primary.main' }}>
                {fCurrency(cCurrency(product.priceSale))}
              </TableCell>
            ))}
          </StyledTableRow>
          <StyledTableRow>
            <TableCell component="th" sx={{ minWidth: 292, maxWidth: 292, fontWeight: 600, fontSize: 16 }}>
              Shop by
            </TableCell>
            {fetchedProducts?.data?.map((product) => (
              <TableCell key={product._id} align="left" sx={{ fontSize: 14 }}>
                {product.shopName}
              </TableCell>
            ))}
          </StyledTableRow>
          <StyledTableRow>
            <TableCell component="th" sx={{ minWidth: 292, maxWidth: 292, fontWeight: 600, fontSize: 16 }}>
              Brand
            </TableCell>
            {fetchedProducts?.data?.map((product) => (
              <TableCell key={product._id} align="left" sx={{ fontSize: 16 }}>
                {product.brandName}
              </TableCell>
            ))}
          </StyledTableRow>
          <StyledTableRow>
            <TableCell component="th" sx={{ minWidth: 292, maxWidth: 292, fontWeight: 600, fontSize: 16 }}>
              Available Stock
            </TableCell>
            {fetchedProducts?.data?.map((product) => (
              <TableCell key={product._id} align="left" sx={{ fontSize: 16, color: 'primary.main' }}>
                {product.available}
              </TableCell>
            ))}
          </StyledTableRow>
          <StyledTableRow>
            <TableCell component="th" sx={{ minWidth: 292, maxWidth: 292, fontWeight: 600, fontSize: 16 }}>
              Sizes
            </TableCell>
            {fetchedProducts?.data?.map((product) => (
              <TableCell key={product._id} align="left" sx={{ fontSize: 14 }}>
                {product.sizes.join(', ')}
              </TableCell>
            ))}
          </StyledTableRow>
          <StyledTableRow>
            <TableCell component="th" sx={{ minWidth: 292, maxWidth: 292, fontWeight: 600, fontSize: 16 }}>
              Colors
            </TableCell>
            {fetchedProducts?.data?.map((product) => (
              <TableCell key={product._id} align="left" sx={{ fontSize: 14 }}>
                {product.colors.join(', ')}
              </TableCell>
            ))}
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <NoDataFoundIllustration />
  );
};

export default CompareTable;
