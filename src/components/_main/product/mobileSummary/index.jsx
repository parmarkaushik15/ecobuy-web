'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next-nprogress-bar';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, WhatsappShareButton } from 'next-share';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { sendGAEvent } from '@next/third-parties/google';
// mui
import {
  Box,
  Stack,
  Button,
  IconButton,
  Typography,
  FormHelperText,
  Skeleton,
  Rating,
  useMediaQuery
} from '@mui/material';
// icons
import { IoIosAdd, IoIosRemove } from 'react-icons/io';
import { IoLogoWhatsapp } from 'react-icons/io5';
import { FaFacebook } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FaLinkedin } from 'react-icons/fa';
import { MdContentCopy } from 'react-icons/md';
// formik
import { useFormik, Form, FormikProvider, useField } from 'formik';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
import { addCart, setShippingDetails } from 'src/redux/slices/product';
// components
import ColorPreview from 'src/components/colorPreview';
import SizePreview from 'src/components/sizePicker';
import { fCurrency } from 'src/utils/formatNumber';
import { useCurrencyConvert } from 'src/hooks/convertCurrency';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import RootStyled from './styled';

ProductDetailsSumaryMobile.propTypes = {
  product: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  totalReviews: PropTypes.number.isRequired,
  totalRating: PropTypes.number.isRequired,
  brand: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
  shippingCost: PropTypes.number,
  isFreeShipping: PropTypes.bool
};

const Incrementer = ({ ...props }) => {
  const { available } = props;
  const [field, , helpers] = useField(props);
  const { value } = field;
  const { setValue } = helpers;

  const incrementQuantity = () => {
    setValue(value + 1);
  };
  const decrementQuantity = () => {
    setValue(value - 1);
  };

  return (
    <Box className="incrementer">
      <IconButton size="small" color="inherit" disabled={value <= 1} onClick={decrementQuantity}>
        <IoIosRemove />
      </IconButton>
      <Typography variant="body2" component="span" className="text">
        {value}
      </Typography>
      <IconButton size="small" color="inherit" disabled={value >= available} onClick={incrementQuantity}>
        <IoIosAdd />
      </IconButton>
    </Box>
  );
};
Incrementer.propTypes = {
  available: PropTypes.number.isRequired
};

export default function ProductDetailsSumaryMobile({ ...props }) {
  const { product, isLoading, totalReviews, totalRating, brand, category, shippingCost, isFreeShipping } = props;
  const [isClient, setIsClient] = useState(false);
  const [color, setColor] = useState(0);
  const [size, setSize] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variant?.[0] || { price: product?.price, priceSale: product?.priceSale }
  );
  const router = useRouter();
  const dispatch = useDispatch();
  const { checkout } = useSelector(({ product }) => product);
  const { isAuthenticated } = useSelector(({ user }) => user);
  const [isLoaded, setLoaded] = useState(false);
  const cCurrency = useCurrencyConvert();
  const fCurrency = useCurrencyFormatter();
  const isMobile = useMediaQuery('(max-width:768px)');

  useEffect(() => {
    setIsClient(true);
    setLoaded(true);
    // Set initial variant based on the first size
    if (product?.variant?.length > 0) {
      setSelectedVariant(product.variant[0]);
      console.log('Initial selectedVariant:', product.variant[0]);
    }
  }, [product]);

  // Dispatch shipping details when buttons are clicked
  const handleShippingDetails = () => {
    const finalShippingCost = shippingCost ?? 0;
    const finalIsFreeShipping = isFreeShipping ?? true;
    if (shippingCost === undefined || isFreeShipping === undefined) {
      console.warn('Shipping details missing, using defaults:', { finalShippingCost, finalIsFreeShipping });
      toast.error('Failed to load shipping details, using default values.');
    }
    dispatch(setShippingDetails({ shippingCost: finalShippingCost, isFreeShipping: finalIsFreeShipping }));
    console.log('Dispatched shipping details:', {
      shippingCost: finalShippingCost,
      isFreeShipping: finalIsFreeShipping
    });
  };

  const isMaxQuantity =
    !isLoading &&
    checkout.cart.filter((item) => item._id === product?._id).map((item) => item.quantity)[0] >= product?.available;

  // GA4 Event Helper Function
  const trackGAEvent = (eventName, params = {}) => {
    const baseParams = {
      item_id: product._id,
      item_name: product.name,
      price: selectedVariant.priceSale || selectedVariant.price,
      currency: 'USD',
      quantity: params.quantity || 1
    };
    sendGAEvent('event', eventName, { ...baseParams, ...params });
    console.log(`GA4 Event: ${eventName}`, { ...baseParams, ...params });
  };

  const onAddCart = (param) => {
    handleShippingDetails(); // Dispatch shipping details
    toast.success('Added to cart');
    dispatch(addCart(param));
    trackGAEvent('add_to_cart', {
      quantity: param.quantity,
      value: (param.priceSale || param.price) * param.quantity
    });
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      pid: product?._id,
      cover: product?.cover,
      quantity: 1
    },
    onSubmit: async (values, { setSubmitting }) => {
      if (!isAuthenticated) {
        setSubmitting(false);
        router.push('/auth/login');
      } else {
        try {
          const alreadyProduct = !isLoading && checkout.cart.filter((item) => item.pid === values.pid);
          if (!Boolean(alreadyProduct.length)) {
            const colorSelected = product?.colors?.[color] || '';
            const sizeSelected = product?.variant?.[size]?.size || '';
            const cartItem = {
              pid: product._id,
              sku: product.sku,
              name: product.name,
              color: colorSelected,
              size: sizeSelected,
              shop: product.shop,
              image: product?.image?.url || product?.images?.[0]?.url || '',
              quantity: values.quantity,
              price: selectedVariant.price,
              priceSale: selectedVariant.priceSale || selectedVariant.price,
              subtotal: (selectedVariant.priceSale || selectedVariant.price) * values.quantity,
              available: product.available
            };
            console.log('Dispatching to cart (Buy Now):', cartItem);
            handleShippingDetails(); // Dispatch shipping details
            dispatch(addCart(cartItem));
            setFieldValue('quantity', 1);
            trackGAEvent('add_to_cart', {
              quantity: values.quantity,
              value: (selectedVariant.priceSale || selectedVariant.price) * values.quantity
            });
            trackGAEvent('purchase', {
              value: (selectedVariant.priceSale || selectedVariant.price) * values.quantity,
              transaction_id: `T_${Date.now()}`
            });
          }
          setSubmitting(false);
          router.push('/cart');
        } catch (error) {
          setSubmitting(false);
          toast.error('Failed to add to cart');
        }
      }
    }
  });

  const { values, touched, errors, setFieldValue, handleSubmit } = formik;

  const handleAddCart = (event) => {
    if (!isAuthenticated) {
      event.stopPropagation();
      router.push('/auth/login');
    } else {
      const colorSelected = product?.colors?.[color] || '';
      const sizeSelected = product?.variant?.[size]?.size || '';
      const cartItem = {
        pid: product._id,
        sku: product.sku,
        name: product.name,
        color: colorSelected,
        size: sizeSelected,
        shop: product.shop,
        image: product?.image?.url || product?.images?.[0]?.url || '',
        quantity: values.quantity,
        price: selectedVariant.price,
        priceSale: selectedVariant.priceSale || selectedVariant.price,
        subtotal: (selectedVariant.priceSale || selectedVariant.price) * values.quantity,
        available: product.available
      };
      console.log('Dispatching to cart (Add to Cart):', cartItem);
      onAddCart(cartItem);
      setFieldValue('quantity', 1);
    }
  };

  // Handle Size Change
  const handleSizeChange = (newSizeIndex) => {
    setSize(newSizeIndex);
    const selectedSize = product?.variant?.[newSizeIndex]?.size;
    const selectedVariantData = product?.variant?.find((v) => v.size === selectedSize) || {
      price: product.price,
      priceSale: product.priceSale
    };
    setSelectedVariant(selectedVariantData);
    console.log('Size changed:', { newSizeIndex, selectedSize, selectedVariantData });
  };

  return (
    <RootStyled>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Typography noWrap variant="h4" paragraph className="heading">
            {product?.name}
          </Typography>
          <Stack direction="row" alignItems="center" className="rating-wrapper" spacing={1}>
            <Rating value={totalRating} precision={0.1} size="small" readOnly />
            <Typography variant="body1" color="primary">
              {totalReviews} <span>{Number(totalReviews) > 1 ? 'Reviews' : 'Review'}</span>
            </Typography>
            <Typography variant="h4" className="text-price">
              {fCurrency(cCurrency(selectedVariant.priceSale || selectedVariant.price))}
              {selectedVariant.price <= selectedVariant.priceSale ? null : (
                <Box component="span" className="old-price">
                  {!isLoading && isLoaded && fCurrency(cCurrency(selectedVariant.price))}
                </Box>
              )}
            </Typography>
          </Stack>
          <Stack spacing={1} my={3}>
            <Stack direction="row" alignItems="center" spacing={1} mt={1.5}>
              <Typography variant="subtitle1">Brand:</Typography>
              <Typography variant="subtitle1" color="text.secondary" fontWeight={400}>
                {brand?.name || 'Commercehope'}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1">Category:</Typography>
              <Typography variant="subtitle1" color="text.secondary" fontWeight={400}>
                {category?.name || 'Commercehope'}
              </Typography>
            </Stack>
            {selectedVariant.price > selectedVariant.priceSale && (
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle1">Discount:</Typography>
                <Typography variant="subtitle1" color="text.secondary" fontWeight={400} className="text-discount">
                  {!isLoading && isLoaded && fCurrency(cCurrency(selectedVariant.price - selectedVariant.priceSale))}
                  {
                    <span>
                      ({(100 - (selectedVariant.priceSale / selectedVariant.price) * 100).toFixed(0)}% Discount)
                    </span>
                  }
                </Typography>
              </Stack>
            )}
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="subtitle1">Available:</Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                fontWeight={400}
                sx={{
                  span: {
                    color: 'error.main'
                  }
                }}
              >
                {product?.available > 0 ? `${product?.available} Items` : <span>Out of stock</span>}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2} pt={1}>
              <Typography variant="subtitle1">Color:</Typography>
              <ColorPreview color={color} setColor={setColor} colors={product?.colors || []} isDetail />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2} pt={1}>
              <Typography variant="subtitle1">Options:</Typography>
              <SizePreview
                size={size}
                setSize={handleSizeChange}
                sizes={product?.variant?.map((v) => v.size) || []}
                isDetail
              />
            </Stack>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={2} className="incrementer-wrapper">
            <Typography variant="subtitle1">Quantity:</Typography>
            {isLoading ? (
              <Box sx={{ float: 'right' }}>
                <Skeleton variant="rounded" width={120} height={40} />
              </Box>
            ) : (
              <div>
                <Incrementer name="quantity" available={product?.available} />
                {touched.quantity && errors.quantity && (
                  <FormHelperText error>{touched.quantity && errors.quantity}</FormHelperText>
                )}
              </div>
            )}
          </Stack>
          <Stack spacing={2} className="detail-actions-wrapper">
            <Stack spacing={2} direction={{ xs: 'row', sm: 'row' }} className="contained-buttons">
              <Button
                fullWidth
                disabled={isMaxQuantity || isLoading || product?.available < 1}
                size={isMobile ? 'medium' : 'large'}
                type="button"
                color="primary"
                variant="contained"
                onClick={handleAddCart}
                className="cart-button"
              >
                Add to Cart
              </Button>
              <Button
                disabled={isLoading || product?.available < 1}
                fullWidth
                size={isMobile ? 'medium' : 'large'}
                type="submit"
                variant="contained"
                color="secondary"
                sx={{
                  background: 'linear-gradient(90deg, #d4af37 0%, #f1c40f 100%)',
                  color: '#000',
                  fontWeight: 600,
                  borderRadius: '8px',
                  py: 1.5,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  ':hover': {
                    background: 'linear-gradient(90deg, #f1c40f 0%, #d4af37 100%)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                  },
                  ':disabled': {
                    background: '#e0e0e0',
                    color: '#888',
                    boxShadow: 'none'
                  }
                }}
              >
                Buy Now
              </Button>
            </Stack>
            <Stack direction="row" justifyContent="center">
              <Stack direction="row" spacing={0.5}>
                <IconButton
                  aria-label="copy"
                  onClick={() => {
                    navigator.clipboard.writeText(window?.location.href);
                    toast.success('Link copied.');
                  }}
                >
                  <MdContentCopy size={24} />
                </IconButton>
                {isClient && (
                  <>
                    <WhatsappShareButton url={window?.location.href || ''}>
                      <IconButton sx={{ color: '#42BC50' }} aria-label="whatsapp">
                        <IoLogoWhatsapp size={24} />
                      </IconButton>
                    </WhatsappShareButton>
                    <FacebookShareButton url={window?.location.href || ''}>
                      <IconButton sx={{ color: '#1373EC' }} aria-label="facebook">
                        <FaFacebook size={24} />
                      </IconButton>
                    </FacebookShareButton>
                    <TwitterShareButton url={window?.location.href || ''}>
                      <IconButton sx={{ color: 'text.primary' }} aria-label="twitter">
                        <FaXTwitter size={24} />
                      </IconButton>
                    </TwitterShareButton>
                    <LinkedinShareButton url={window?.location.href || ''}>
                      <IconButton sx={{ color: '#0962B7' }} aria-label="linkedin">
                        <FaLinkedin size={24} />
                      </IconButton>
                    </LinkedinShareButton>
                  </>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Form>
      </FormikProvider>
    </RootStyled>
  );
}
