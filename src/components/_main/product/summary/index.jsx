'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, WhatsappShareButton } from 'next-share';
import { useRouter } from 'next-nprogress-bar';
import PropTypes from 'prop-types';
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
  Tooltip,
  Grid,
  Card,
  alpha,
  Divider
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

// formik
import { useFormik, Form, FormikProvider, useField } from 'formik';
// redux
import { useDispatch, useSelector } from 'src/redux/store';
// redux
import { setWishlist } from 'src/redux/slices/wishlist';
import { addCart, setShippingDetails } from 'src/redux/slices/product';
// api
import * as api from 'src/services';
import { useMutation, useQuery } from 'react-query';
// styles
import RootStyled from './styled';
// components
import ColorPreview from 'src/components/colorPreview';
import SizePreview from 'src/components/sizePicker';
// hooks
import { useCurrencyConvert } from 'src/hooks/convertCurrency';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import { addCompareProduct, removeCompareProduct } from '../../../../redux/slices/compare';
// icons
import { IoIosAdd, IoIosRemove } from 'react-icons/io';
import { IoLogoWhatsapp } from 'react-icons/io5';
import { FaFacebook } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FaLinkedin } from 'react-icons/fa';
import { MdContentCopy } from 'react-icons/md';
import { LiaShippingFastSolid } from 'react-icons/lia';
import { MdLockOutline } from 'react-icons/md';
import { FaRegStar } from 'react-icons/fa';
import { TbMessage } from 'react-icons/tb';
import { MdOutlineShoppingBasket } from 'react-icons/md';
import { FiShoppingCart } from 'react-icons/fi';
import { IoBagCheckOutline } from 'react-icons/io5';
import { FaRegHeart } from 'react-icons/fa';
import { GoGitCompare } from 'react-icons/go';

ProductDetailsSumary.propTypes = {
  product: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  totalRating: PropTypes.number.isRequired,
  brand: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
  onClickWishList: PropTypes.func.isRequired,
  wishlist: PropTypes.array.isRequired,
  shippingCost: PropTypes.number,
  isFreeShipping: PropTypes.bool
};

// Incrementer Component (unchanged)
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

// Main Component
export default function ProductDetailsSumary({ ...props }) {
  const { data: pageContextData, isLoading: loadingContext } = useQuery(['get-products-page-context'], () => {
    return api.getProductPageContext();
  });

  const content = pageContextData?.data?.content || {};

  const shippingData = [
    { icon: <LiaShippingFastSolid size={20} />, name: content?.shippingTitle || 'Worldwide shipping' },
    { icon: <MdLockOutline size={20} />, name: content?.securePaymentTitle || 'Secure payment' },
    { icon: <FaRegStar size={20} />, name: content?.warrentyTitle || '2 years full warranty' }
  ];

  const { product, isLoading, totalRating, brand, category, id, shippingCost, isFreeShipping } = props;
  const cCurrency = useCurrencyConvert();
  const fCurrency = useCurrencyFormatter();
  const { isAuthenticated } = useSelector(({ user }) => user);
  const { products: compareProducts } = useSelector(({ compare }) => compare);
  const { wishlist } = useSelector(({ wishlist }) => wishlist);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [color, setColor] = useState(0);
  const [size, setSize] = useState(0);
  const router = useRouter();
  const dispatch = useDispatch();
  const { checkout } = useSelector(({ product }) => product);

  // Dispatch shipping details to Redux on mount
  useEffect(() => {
    if (shippingCost !== undefined && isFreeShipping !== undefined) {
      dispatch(setShippingDetails({ shippingCost, isFreeShipping }));
    }
  }, [dispatch, shippingCost, isFreeShipping]);

  // State for selected variant price
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variant?.[0] || { price: product?.price, priceSale: product?.priceSale }
  );

  useEffect(() => {
    setIsClient(true);
    // Set initial variant based on the first size
    if (product?.variant?.length > 0) {
      setSelectedVariant(product.variant[0]);
      console.log('Initial selectedVariant:', product.variant[0]);
    }
  }, [product]);

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

  // Wishlist Mutation
  const { mutate: mutateWishlist } = useMutation(api.updateWishlist, {
    onSuccess: (data) => {
      toast.success(data.message);
      setLoading(false);
      dispatch(setWishlist(data.data));
      trackGAEvent(data.data.includes(product._id) ? 'add_to_wishlist' : 'remove_from_wishlist');
    },
    onError: (err) => {
      setLoading(false);
      const message = JSON.stringify(err?.response?.data?.message);
      toast.error(message);
    }
  });

  const onClickWishList = async (event) => {
    if (!isAuthenticated) {
      event.stopPropagation();
      router.push('/auth/login');
    } else {
      event.stopPropagation();
      setLoading(true);
      mutateWishlist(id);
    }
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
            dispatch(addCart(cartItem));
            setFieldValue('quantity', 1);
            trackGAEvent('add_to_cart', {
              quantity: values.quantity,
              value: (selectedVariant.priceSale || selectedVariant.price) * values.quantity
            });
          }
          setSubmitting(false);
          trackGAEvent('purchase', {
            value: (selectedVariant.priceSale || selectedVariant.price) * values.quantity,
            transaction_id: `T_${Date.now()}`
          });
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
      dispatch(addCart(cartItem));
      setFieldValue('quantity', 1);
      trackGAEvent('add_to_cart', {
        quantity: values.quantity,
        value: (selectedVariant.priceSale || selectedVariant.price) * values.quantity
      });
      toast.success('Added to cart');
    }
  };

  const onAddCompare = (event) => {
    if (!isAuthenticated) {
      event.stopPropagation();
      router.push('/auth/login');
    } else {
      event.stopPropagation();
      dispatch(addCompareProduct(product));
      trackGAEvent('add_to_compare');
    }
  };

  const onRemoveCompare = (event) => {
    event.stopPropagation();
    dispatch(removeCompareProduct(product?._id));
    trackGAEvent('remove_from_compare');
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
          <Grid container spacing={2}>
            <Grid item xs={12} md={7}>
              <Card sx={{ p: 2, height: '100%', border: '1px solid #f0f0f0', boxShadow: 'none' }} className="card-main">
                <Typography noWrap variant="h4" paragraph className="heading">
                  {product?.name}
                </Typography>
                <Stack spacing={1} mt={1} mb={3}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                    <Stack direction="row" alignItems="center" className="rating-wrapper" spacing={1}>
                      <Rating value={totalRating} precision={0.1} size="small" readOnly />
                      <Typography variant="subtitle2" color="text.secondary">
                        ({totalRating?.toFixed(1)})
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
                      <TbMessage size={18} />
                      <Typography variant="subtitle2" color="text.secondary">
                        {product?.reviews?.length || 0}{' '}
                        <span>{Number(product?.reviews?.length) > 1 ? 'Reviews' : 'Review'}</span>
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
                      <MdOutlineShoppingBasket size={18} />
                      <Typography variant="subtitle2" color="text.secondary">
                        {product?.sold || 0} sold
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1} mt={1.5}>
                    <Typography variant="subtitle1">Brand:</Typography>
                    <Typography variant="subtitle1" color="text.secondary" fontWeight={400}>
                      {brand?.name || 'Perfumeswale'}
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="subtitle1">Category:</Typography>
                    <Typography variant="subtitle1" color="text.secondary" fontWeight={400}>
                      {category?.name || 'Perfumeswale'}
                    </Typography>
                  </Stack>
                  {selectedVariant.price > selectedVariant.priceSale && (
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="subtitle1">Discount:</Typography>
                      <Typography variant="subtitle1" color="text.secondary" fontWeight={400} className="text-discount">
                        {fCurrency(cCurrency(selectedVariant.price - selectedVariant.priceSale))}
                        {
                          <span>
                            ({(100 - (selectedVariant.priceSale / selectedVariant.price) * 100).toFixed(0)}% Discount)
                          </span>
                        }
                      </Typography>
                    </Stack>
                  )}
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
                {console.log('Product Details:', product)}
                <Typography variant="subtitle1">Description:</Typography>
                <div
                  style={{
                    maxHeight: '200px',
                    overflowY: 'auto',
                    padding: '8px',
                    borderRadius: '5px'
                  }}
                >
                  <Typography variant="body1">{product?.description || 'No description available'}</Typography>
                </div>
              </Card>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card sx={{ p: 2, position: 'sticky', top: 156, boxShadow: 'none' }}>
                <Typography variant="h4" className="text-price">
                  {fCurrency(cCurrency(selectedVariant.priceSale || selectedVariant.price))}
                  {selectedVariant.price <= selectedVariant.priceSale ? null : (
                    <Typography component="span" className="old-price" color="text.secondary">
                      {fCurrency(cCurrency(selectedVariant.price))}
                    </Typography>
                  )}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1} className="incrementer-wrapper" my={2}>
                  {isLoading ? (
                    <Box sx={{ float: 'right' }}>
                      <Skeleton variant="rounded" width={120} height={40} />
                    </Box>
                  ) : (
                    <div>
                      <Incrementer name="quantity" available={product?.available || 0} />
                      {touched.quantity && errors.quantity && (
                        <FormHelperText error>{touched.quantity && errors.quantity}</FormHelperText>
                      )}
                    </div>
                  )}
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    fontWeight={400}
                    sx={{ span: { color: 'error.main' } }}
                  >
                    {product?.available > 0 ? `${product?.available} Items` : <span>Out of stock</span>}
                  </Typography>
                </Stack>
                <Stack spacing={1} className="contained-buttons" mb={2}>
                  <Button
                    fullWidth
                    disabled={isMaxQuantity || isLoading || product?.available < 1}
                    type="button"
                    color="primary"
                    variant="text"
                    onClick={handleAddCart}
                    startIcon={<FiShoppingCart />}
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
                    Add to Cart
                  </Button>
                  <Button
                    disabled={isLoading || product?.available < 1}
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<IoBagCheckOutline />}
                    sx={{
                      py: 1.5,
                      background: 'linear-gradient(90deg, #008b8b, #00a3a3)',
                      ':hover': {
                        background: 'linear-gradient(90deg, #007b7b, #008b8b)',
                        boxShadow: '0 4px 12px rgba(0, 139, 139, 0.3)'
                      },
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 4px rgba(0, 139, 139, 0.2)'
                    }}
                  >
                    Buy Now
                  </Button>
                  {wishlist?.filter((v) => v === product?._id).length > 0 ? (
                    <LoadingButton
                      fullWidth
                      loading={loading}
                      onClick={onClickWishList}
                      type="button"
                      color="secondary"
                      variant="contained"
                      startIcon={<FaRegHeart />}
                      sx={{
                        py: 1.5,
                        background: 'linear-gradient(90deg, #ff6b6b, #ff8787)',
                        ':hover': {
                          background: 'linear-gradient(90deg, #ff5252, #ff6b6b)',
                          boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Remove from Wishlist
                    </LoadingButton>
                  ) : (
                    <LoadingButton
                      fullWidth
                      loading={loading}
                      onClick={onClickWishList}
                      type="button"
                      color="secondary"
                      variant="contained"
                      startIcon={<FaRegHeart />}
                      sx={{
                        py: 1.5,
                        background: 'linear-gradient(90deg, #f783ac, #f8a5c2)',
                        ':hover': {
                          background: 'linear-gradient(90deg, #f06595, #f783ac)',
                          boxShadow: '0 4px 12px rgba(247, 131, 172, 0.3)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Add to Wishlist
                    </LoadingButton>
                  )}
                  {compareProducts?.filter((v) => v._id === product._id).length > 0 ? (
                    <Button
                      startIcon={<GoGitCompare />}
                      fullWidth
                      onClick={onRemoveCompare}
                      type="button"
                      color="error"
                      variant="contained"
                      sx={{
                        py: 1.5,
                        background: 'linear-gradient(90deg, #ff8787, #fa5252)',
                        ':hover': {
                          background: 'linear-gradient(90deg, #fa5252, #f03e3e)',
                          boxShadow: '0 4px 12px rgba(250, 82, 82, 0.3)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Remove from Compare
                    </Button>
                  ) : (
                    <Button
                      startIcon={<GoGitCompare />}
                      fullWidth
                      onClick={onAddCompare}
                      type="button"
                      color="error"
                      variant="contained"
                      sx={{
                        py: 1.5,
                        background: 'linear-gradient(90deg, #74b9ff, #339af0)',
                        ':hover': {
                          background: 'linear-gradient(90deg, #339af0, #228be6)',
                          boxShadow: '0 4px 12px rgba(51, 154, 240, 0.3)'
                        },
                        transition: 'all 0.3s ease'
                      }}
                    >
                      Add to Compare
                    </Button>
                  )}
                  <Stack direction="row" spacing={0.5} justifyContent="center">
                    <Tooltip title="Copy Product URL">
                      <IconButton
                        aria-label="copy"
                        onClick={() => {
                          navigator.clipboard.writeText(window?.location.href);
                          toast.success('Link copied.');
                        }}
                        sx={{
                          color: 'grey.700',
                          ':hover': {
                            color: 'primary.main',
                            background: (theme) => alpha(theme.palette.primary.main, 0.1)
                          }
                        }}
                      >
                        <MdContentCopy size={24} />
                      </IconButton>
                    </Tooltip>
                    {isClient && (
                      <>
                        <Tooltip title="Share on WhatsApp">
                          <WhatsappShareButton url={window?.location.href || ''}>
                            <IconButton
                              sx={{
                                color: '#42BC50',
                                ':hover': { background: 'rgba(66, 188, 80, 0.1)' }
                              }}
                              aria-label="whatsapp"
                            >
                              <IoLogoWhatsapp size={24} />
                            </IconButton>
                          </WhatsappShareButton>
                        </Tooltip>
                        <Tooltip title="Share on Facebook">
                          <FacebookShareButton url={window?.location.href || ''}>
                            <IconButton
                              sx={{
                                color: '#1373EC',
                                ':hover': { background: 'rgba(19, 115, 236, 0.1)' }
                              }}
                              aria-label="facebook"
                            >
                              <FaFacebook size={24} />
                            </IconButton>
                          </FacebookShareButton>
                        </Tooltip>
                        <Tooltip title="Share on Twitter">
                          <TwitterShareButton url={window?.location.href || ''}>
                            <IconButton
                              sx={{
                                color: 'text.primary',
                                ':hover': { background: 'rgba(29, 161, 242, 0.1)' }
                              }}
                              aria-label="twitter"
                            >
                              <FaXTwitter size={24} />
                            </IconButton>
                          </TwitterShareButton>
                        </Tooltip>
                        <Tooltip title="Share on LinkedIn">
                          <LinkedinShareButton url={window?.location.href || ''}>
                            <IconButton
                              sx={{
                                color: '#0962B7',
                                ':hover': { background: 'rgba(9, 98, 183, 0.1)' }
                              }}
                              aria-label="linkedin"
                            >
                              <FaLinkedin size={24} />
                            </IconButton>
                          </LinkedinShareButton>
                        </Tooltip>
                      </>
                    )}
                  </Stack>
                </Stack>
                <Divider />
                {shippingData.map((item, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    my={1}
                    sx={{ color: 'text.secondary' }}
                  >
                    {item.icon}
                    <Typography variant="subtitle2" color="text.secondary">
                      {item.name}
                    </Typography>
                  </Stack>
                ))}
              </Card>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </RootStyled>
  );
}
