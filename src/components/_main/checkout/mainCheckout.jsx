'use client';
import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { sendGAEvent } from '@next/third-parties/google';
import { useRouter } from 'next-nprogress-bar';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from 'react-query';
import { toast } from 'react-hot-toast';
import { sum } from 'lodash';
// mui
import {
  Box,
  Card,
  CardContent,
  Collapse,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Typography,
  Checkbox,
  FormControlLabel,
  Button
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
// yup
import * as Yup from 'yup';
// formik
import { useFormik, Form, FormikProvider } from 'formik';
// api
import * as api from 'src/services';
// stripe
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
// Components
import { resetCart, getCart } from 'src/redux/slices/product';
import { setLogin } from 'src/redux/slices/user';
import PayPalPaymentMethod from 'src/components/paypal/paypal';
import countries from './countries.json';
import CheckoutGuestFormSkeleton from '../skeletons/checkout/checkoutForm';
import PaymentInfoSkeleton from '../skeletons/checkout/paymentInfo';
import PaymentMethodCardSkeleton from '../skeletons/checkout/paymentMethod';
import CardItemSekelton from '../skeletons/checkout/cartItems';
// hooks
import { useCurrencyConvert } from 'src/hooks/convertCurrency';
// paypal
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import StripeCheckout from './stripeCheckout';
import { IoCloseCircleOutline } from 'react-icons/io5';
import Script from 'next/script';

// dynamic components
const CheckoutForm = dynamic(() => import('src/components/forms/checkout'), {
  loading: () => <CheckoutGuestFormSkeleton />
});
const ShipmentCheckoutForm = dynamic(() => import('src/components/forms/shipmentAddress'), {
  loading: () => <CheckoutGuestFormSkeleton />
});
const PaymentInfo = dynamic(() => import('src/components/_main/checkout/paymentInfo'), {
  loading: () => <PaymentInfoSkeleton />
});
const PaymentMethodCard = dynamic(() => import('src/components/_main/checkout/paymentMethod'), {
  loading: () => <PaymentMethodCardSkeleton />
});
const CartItemsCard = dynamic(() => import('src/components/cards/cartItems'), {
  loading: () => <CardItemSekelton />
});

const initial = {
  'client-id': process.env.PAYPAL_CLIENT_ID,
  'disable-funding': 'paylater',
  vault: 'true',
  intent: 'capture'
};

const CheckoutMain = () => {
  const [phonePeObj, setPhonePeObj] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);
  const [initialOptions, setInitialOptions] = useState(initial);
  const [googleMapApiKey, setGoogleMapApiKey] = useState(null); // New state for Google Maps API key
  const router = useRouter();
  const childRef = useRef(null);
  const cCurrency = useCurrencyConvert();
  const dispatch = useDispatch();
  const { currency, rate } = useSelector(({ settings }) => settings);
  const { checkout } = useSelector(({ product }) => product);
  const { user: userData } = useSelector(({ user }) => user);
  const { cart, total } = checkout;
  const [paymentMethod, setPaymentMethod] = useState('');
  const [checked, setChecked] = React.useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [dynamicShipping, setDynamicShipping] = useState(null);
  const [settings, setSettings] = useState(null);
  const [isProcessing, setProcessingTo] = useState(false);
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false); // New state for order submission
  const [isShippingApplied, setIsShippingApplied] = useState(false); // New state for shipping applied
  const [paymentGateway, setPaymentGateway] = useState([]);

  const handleChangeShipping = (event) => {
    setChecked(event.target.checked);
  };

  const handleCheckboxChange = (event) => {
    setIsAccepted(event.target.checked);
  };

  const [couponCode, setCouponCode] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);
  const [totalWithDiscount, setTotalWithDiscount] = useState(null);

  // GA4 Event Helper Function
  const trackGAEvent = (eventName, params = {}) => {
    sendGAEvent('event', eventName, params);
    console.log(`GA4 Event: ${eventName}`, params); // Debug log
  };

  const { mutate, isLoading } = useMutation('order', api.placeOrder, {
    onSuccess: (data) => {
      toast.success('Order placed!');
      setProcessingTo(false);
      setIsOrderSubmitted(true); // Mark order as submitted
      if (userData?._id) {
        const profileData = {};
        const fieldsToUpdate = {
          address: values.address,
          city: values.city,
          state: values.state,
          country: values.country,
          zip: values.zip,
          phone: values.phone
          // firstName: values.firstName,
          // lastName: values.lastName
        };

        // Only add fields to profileData if they are missing or empty in userData
        Object.keys(fieldsToUpdate).forEach((field) => {
          if (!userData[field] || userData[field] === '') {
            profileData[field] = fieldsToUpdate[field];
          }
        });

        // Only update profile if there are missing fields to update
        if (Object.keys(profileData).length > 0) {
          updateProfileMutate(profileData);
        }
      }

      router.push('/profile/orders');
      dispatch(resetCart());
    },
    onError: (err) => {
      toast.error(err.response.data.message || 'Something went wrong');
      setProcessingTo(false);
    }
  });

  const { mutate: updateProfileMutate } = useMutation(api.updateProfile, {
    onSuccess: (res) => {
      dispatch(setLogin(res.data));
      console.log('Profile updated successfully with missing fields');
    },
    onError: (err) => {
      console.error('Profile update failed:', err);
    }
  });

  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    getSettingDetail();
  }, []);

  const getSettingDetail = async () => {
    try {
      const response = await api.getSetting();
      if (response.data[0]?.googleMapApiKey) {
        setGoogleMapApiKey(response.data[0].googleMapApiKey); // Store Google Maps API key
      }
      setSettings(response.data[0]);
      if (response.pg) {
        const pg = JSON.parse(atob(response.pg));
        setPaymentGateway(pg);
        // Set default payment method
        const defaultMethod =
          pg.find((item) => item.pgConstant === 'COD') || pg.find((item) => item.pgConstant === 'RAZORPAY') || pg[0];
        if (defaultMethod) {
          setPaymentMethod(defaultMethod.pgConstant);
        }
        const stripe = pg.find((item) => item.pgConstant === 'STRIPE');
        if (stripe) {
          setStripePromise(loadStripe(stripe.apiKey));
        }
        const phonepe = pg.find((item) => item.pgConstant === 'PHONEPE');
        if (phonepe) {
          if (typeof window !== 'undefined' && !window.PhonePe) {
            const script = document.createElement('script');
            script.src = 'https://mercury.phonepe.com/web/bundle/checkout.js';
            script.async = true;
            script.onload = () => {
              console.log('script is loaded');
            };
            script.onerror = () => console.error('Failed to load PhonePe SDK');
            document.body.appendChild(script);
          }
        }
        const razorpay = pg.find((item) => item.pgConstant === 'RAZORPAY');
        console.log('razorpay config:', razorpay);
        if (razorpay) {
          if (typeof window !== 'undefined' && !window.Razorpay) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => {
              console.log('Razorpay script loaded');
            };
            script.onerror = () => console.error('Failed to load Razorpay SDK');
            document.body.appendChild(script);
          }
        }
        const paypal = pg.find((item) => item.pgConstant === 'PAYPAL');
        if (paypal) {
          initial['client-id'] = paypal.apiKey;
          setInitialOptions(initial);
        }
      }
    } catch (error) {
      console.error('Error fetching payment gateway settings:', error);
    }
  };

  const { mutate: getCartMutate } = useMutation(api.getCart, {
    onSuccess: (res) => {
      setLoading(false);
    },
    onError: (err) => {
      const message = JSON.stringify(
        err.response.data.message ? err.response.data.message : JSON.stringify(err.response.data.message)
      );
      setLoading(false);
      toast.error(message ? JSON.parse(message) : 'Something went wrong!');
    }
  });

  React.useEffect(() => {
    formik.validateForm();
    if (cart.length < 1) {
      router.push('/');
    } else {
      setLoading(true);
      getCartMutate(cart);
    }
  }, []);

  const NewAddressSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    phone: Yup.string().required('Phone is required'),
    email: Yup.string().email('Enter email Valid').required('Email is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    country: Yup.string().required('Country is required'),
    zip: Yup.string()
      .required('Postal is required')
      .matches(/^\d{6}$/, 'Postal code must be exactly 6 digits'),
    shippingAddress: checked
      ? Yup.object().shape({
          firstName: Yup.string().required('First name is required'),
          lastName: Yup.string().required('Last name is required'),
          address: Yup.string().required('Address is required'),
          city: Yup.string().required('City is required'),
          state: Yup.string().required('State is required'),
          country: Yup.string().required('Country is required'),
          zip: Yup.string()
            .required('Postal is required')
            .matches(/^\d{6}$/, 'Postal code must be exactly 6 digits')
        })
      : Yup.string().nullable().notRequired()
  });

  const formik = useFormik({
    initialValues: {
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      phone: userData?.phone || '',
      email: userData?.email || '',
      address: userData?.address || '',
      city: userData?.city || '',
      state: userData?.state || '',
      country: userData?.country || 'India',
      zip: userData?.zip || '',
      note: '',
      ...(checked && {
        shippingAddress: {
          firstName: '',
          lastName: '',
          address: '',
          city: '',
          state: '',
          country: 'India',
          zip: ''
        }
      })
    },
    enableReinitialize: true,
    validationSchema: NewAddressSchema,
    onSubmit: async (values) => {
      if (!isAccepted) {
        toast.error('Please accept terms and conditions');
        return;
      }
      const items = cart.map(({ ...others }) => others);
      const totalItems = sum(items.map((item) => item.quantity));

      const computedShipping = settings?.isShiprocketFlag
        ? dynamicShipping || 0
        : Number(checkout.shipping) * cart.length;

      const data = {
        paymentMethod: paymentMethod,
        items: items,
        user: values,
        totalItems,
        couponCode,
        currency,
        conversionRate: rate,
        shipping: computedShipping
      };

      // Track Place Order event
      trackGAEvent('begin_checkout', {
        items: items.map((item) => ({
          item_id: item.pid,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        value: cCurrency(totalWithDiscount || (settings?.isShiprocketFlag ? subtotal + (dynamicShipping || 0) : total)),
        currency: currency,
        coupon: couponCode || undefined
      });

      if (data.paymentMethod === 'STRIPE') {
        childRef.current?.onSubmit(data);
      } else if (data.paymentMethod === 'PHONEPE') {
        onPhonePeSubmit(data);
      } else if (data.paymentMethod === 'RAZORPAY') {
        onRazorpaySubmit(data);
      } else {
        mutate(data);
      }
    }
  });

  const { errors, values, touched, handleSubmit, getFieldProps, isValid, setFieldValue } = formik;
  const [redirectUrl, setRedirectUrl] = useState('');
  const [open, setOpen] = useState(false);

  const handleTransactionCallback = async (response) => {
    if (response === 'USER_CANCEL') {
      setProcessingTo(false); // Reset loading state on cancel
      toast.error('Payment canceled by user');
    } else if (response === 'CONCLUDED') {
      let dataObj = localStorage.getItem('dataObj');
      if (dataObj) {
        dataObj = JSON.parse(atob(dataObj));
      }
      setProcessingTo(true);
      const result = await api.phonePePaymentStatus(dataObj?.merchantTransactionId);
      if (result.data.data.code === 'PAYMENT_SUCCESS') {
        const obj = {
          ...dataObj,
          paymentId: result.data.data.data.transactionId
        };
        mutate(obj);
      }
      console.log(result);
    }
  };

  const onPhonePeSubmit = async ({ ...data }) => {
    setProcessingTo(true);
    try {
      const result = await api.phonePePaymentIntents(
        cCurrency(
          totalWithDiscount ||
            (settings?.isShiprocketFlag
              ? checkout.subtotal + (dynamicShipping || 0)
              : checkout.subtotal + Number(checkout.shipping) * cart.length)
        ),
        currency,
        data.phone,
        userData?._id
      );
      const redirectUrl = result.data.data.instrumentResponse?.redirectInfo?.url;
      const obj = {
        ...data,
        merchantTransactionId: result.data.data.merchantTransactionId
      };
      localStorage.setItem('dataObj', btoa(JSON.stringify(obj)));
      setPhonePeObj(obj);
      if (redirectUrl) {
        if (typeof window !== 'undefined' && window.PhonePeCheckout) {
          try {
            window.PhonePeCheckout.transact({
              tokenUrl: redirectUrl,
              callback: handleTransactionCallback,
              type: 'IFRAME'
            });
          } catch (error) {
            console.error('PhonePe Payment Error:', error);
            setProcessingTo(false); // Reset on error
          }
        } else {
          console.error('PhonePe SDK not loaded');
          setProcessingTo(false); // Reset if SDK fails
        }
      }
    } catch (e) {
      console.log(e.response.data);
      setProcessingTo(false); // Reset on catch
    }
  };

  // const onRazorpaySubmit = async ({ ...data }) => {
  //   setProcessingTo(true);
  //   try {
  //     const amount = Math.round(cCurrency(totalWithDiscount || checkout.total)); // In rupees
  //     const receipt = `receipt#${Date.now()}`; // Dynamic receipt
  //     const result = await api.razorpayCreateOrder(amount, currency, receipt);
  //     console.log('Razorpay createOrder response:', result);
  //     const orderId = result.id;
  //     const razorpay = paymentGateway.find((item) => item.pgConstant === 'RAZORPAY');
  //     if (!razorpay || !razorpay.apiKey) {
  //       throw new Error('Razorpay configuration or API key not found');
  //     }
  //     console.log('razorpay config:', razorpay);
  //     const options = {
  //       key: razorpay.apiKey,
  //       amount: amount,
  //       currency: currency,
  //       name: 'Perfumeswala',
  //       description: 'Payment for order',
  //       order_id: orderId,
  //       handler: async (response) => {
  //         const placeOrderObj = {
  //           paymentMethod: 'RAZORPAY',
  //           items: data.items,
  //           user: data.user,
  //           totalItems: data.totalItems,
  //           couponCode: data.couponCode,
  //           currency: data.currency,
  //           conversionRate: data.conversionRate,
  //           shipping: data.shipping,
  //           paymentId: response.razorpay_payment_id,
  //           razorpaySignature: response.razorpay_signature
  //         };
  //         try {
  //           const orderResponse = await api.placeOrder(placeOrderObj);
  //           await api.verifyRazorpayPayment({
  //             razorpay_payment_id: response.razorpay_payment_id,
  //             razorpay_order_id: response.razorpay_order_id,
  //             razorpay_signature: response.razorpay_signature
  //           });
  //           mutate(placeOrderObj);
  //         } catch (error) {
  //           console.error('Razorpay Verification or Order Error:', error);
  //           toast.error(error.response?.data?.message || 'Failed to verify payment');
  //           setProcessingTo(false);
  //         }
  //       },
  //       prefill: {
  //         name: `${values.firstName} ${values.lastName}`,
  //         email: values.email,
  //         contact: values.phone
  //       },
  //       theme: {
  //         color: '#3399CC'
  //       },
  //       modal: {
  //         ondismiss: () => {
  //           console.log('Razorpay modal dismissed');
  //           setProcessingTo(false);
  //         }
  //       }
  //     };
  //     if (typeof window !== 'undefined' && window.Razorpay) {
  //       const rzp = new window.Razorpay(options);
  //       rzp.on('payment.failed', (response) => {
  //         console.error('Razorpay Payment Error:', response.error);
  //         toast.error(response.error.description || 'Payment failed');
  //         setProcessingTo(false);
  //       });
  //       rzp.open();
  //     } else {
  //       throw new Error('Razorpay SDK not loaded');
  //     }
  //   } catch (e) {
  //     console.error('Razorpay Payment Error:', {
  //       message: e.message,
  //       stack: e.stack
  //     });
  //     toast.error(e.message || 'Failed to initiate Razorpay payment');
  //     setProcessingTo(false);
  //   }
  // };

  const onRazorpaySubmit = async ({ ...data }) => {
    setProcessingTo(true);
    try {
      const amount = Math.round(
        cCurrency(
          totalWithDiscount ||
            (settings?.isShiprocketFlag
              ? checkout.subtotal + (dynamicShipping || 0)
              : checkout.subtotal + Number(checkout.shipping) * cart.length)
        )
      );
      const receipt = `receipt#${Date.now()}`; // Dynamic receipt
      const result = await api.razorpayCreateOrder(amount, currency, receipt);
      console.log('Razorpay createOrder response:', result);
      const orderId = result.id;
      const razorpay = paymentGateway.find((item) => item.pgConstant === 'RAZORPAY');
      if (!razorpay || !razorpay.apiKey) {
        throw new Error('Razorpay configuration or API key not found');
      }
      console.log('razorpay config:', razorpay);
      const options = {
        key: razorpay.apiKey,
        amount: amount,
        currency: currency,
        name: 'Perfumeswala',
        description: 'Payment for order',
        order_id: orderId,
        handler: async (response) => {
          const placeOrderObj = {
            paymentMethod: 'RAZORPAY',
            items: data.items,
            user: data.user,
            totalItems: data.totalItems,
            couponCode: data.couponCode,
            currency: data.currency,
            conversionRate: data.conversionRate,
            shipping: data.shipping,
            paymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          };
          try {
            const orderResponse = await api.placeOrder(placeOrderObj);
            await api.verifyRazorpayPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            });
            // Directly handle success without calling mutate
            toast.success('Order placed!');
            setIsOrderSubmitted(true); // Mark order as submitted
            router.push('/profile/orders');
            dispatch(resetCart());
          } catch (error) {
            console.error('Razorpay Verification or Order Error:', error);
            toast.error(error.response?.data?.message || 'Failed to verify payment');
            setProcessingTo(false);
          }
        },
        prefill: {
          name: `${values.firstName} ${values.lastName}`,
          email: values.email,
          contact: values.phone
        },
        theme: {
          color: '#3399CC'
        },
        modal: {
          ondismiss: () => {
            console.log('Razorpay modal dismissed');
            setProcessingTo(false);
          }
        }
      };
      if (typeof window !== 'undefined' && window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response) => {
          console.error('Razorpay Payment Error:', response.error);
          toast.error(response.error.description || 'Payment failed');
          setProcessingTo(false);
        });
        rzp.open();
      } else {
        throw new Error('Razorpay SDK not loaded');
      }
    } catch (e) {
      console.error('Razorpay Payment Error:', {
        message: e.message,
        stack: e.stack
      });
      toast.error(e.message || 'Failed to initiate Razorpay payment');
      setProcessingTo(false);
    }
  };

  const onSuccessPaypal = async (paymentId) => {
    const items = cart.map(({ ...others }) => others);
    const totalItems = sum(items.map((item) => item.quantity));
    const data = {
      paymentMethod: 'PAYPAL',
      items: items,
      user: values,
      totalItems,
      couponCode,
      shipping: settings?.isShiprocketFlag ? dynamicShipping || 0 : checkout.shipping
    };

    mutate({
      ...data,
      paymentId: paymentId
    });
  };

  const onClose = () => {
    setOpen(false);
    setProcessingTo(false); // Reset loading state when dialog is closed
  };

  return (
    <FormikProvider value={formik}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <IconButton onClick={onClose} style={{ position: 'absolute', top: 10, right: 10 }}>
          <IoCloseCircleOutline />
        </IconButton>
        <DialogContent style={{ padding: 0 }}>
          {redirectUrl ? (
            <iframe src={redirectUrl} width="100%" height="600px" style={{ border: 'none' }} title="Redirect Page" />
          ) : (
            <p>Loading...</p>
          )}
        </DialogContent>
      </Dialog>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Box py={5}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <CheckoutForm
                getFieldProps={getFieldProps}
                touched={touched}
                errors={errors}
                values={values}
                handleChangeShipping={handleChangeShipping}
                checked={checked}
                isLoading={isLoading}
                setFieldValue={setFieldValue}
                googleMapApiKey={googleMapApiKey} // Pass Google Maps API key
              />
              <Collapse in={checked}>
                <ShipmentCheckoutForm
                  getFieldProps={getFieldProps}
                  touched={touched}
                  errors={errors}
                  isLoading={isLoading}
                  setFieldValue={setFieldValue}
                  googleMapApiKey={googleMapApiKey}
                  formik={formik} // Pass formik object
                />
              </Collapse>
            </Grid>
            <Grid item xs={12} md={4}>
              <CartItemsCard cart={cart} loading={loading} />
              <PaymentInfo
                loading={loading}
                setCouponCode={setCouponCode}
                setTotal={(v) => setTotalWithDiscount(v)}
                zipCode={checked ? values.shippingAddress?.zip : values.zip}
                cart={cart}
                setDynamicShipping={setDynamicShipping}
                setIsShippingApplied={setIsShippingApplied} // Pass callback
              />
              <PaymentMethodCard
                paymentGateway={paymentGateway}
                loading={loading}
                value={paymentMethod}
                setValue={setPaymentMethod}
                error={checkoutError}
                setGateway={(item) => {
                  console.log(item);
                }}
              />
              <br />

              <Collapse in={paymentMethod === 'STRIPE'}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" color="text.secondary" mt={1} mb={1}>
                      Credit Card
                    </Typography>
                    <Elements stripe={stripePromise}>
                      <StripeCheckout
                        totalWithDiscount={totalWithDiscount}
                        checkout={{
                          ...checkout,
                          shipping: settings?.isShiprocketFlag
                            ? dynamicShipping || 0
                            : checkout.subtotal + Number(checkout.shipping) * cart.length
                        }}
                        ref={childRef}
                        error={checkoutError}
                        setCheckoutError={setCheckoutError}
                        mutate={mutate}
                        values={values}
                        couponCode={couponCode}
                        currency={currency}
                        setProcessingTo={setProcessingTo}
                      />
                    </Elements>
                  </CardContent>
                </Card>
              </Collapse>

              <Collapse in={paymentMethod === 'PAYPAL'}>
                <PayPalScriptProvider options={initialOptions}>
                  <PayPalPaymentMethod
                    onSuccess={onSuccessPaypal}
                    values={values}
                    total={cCurrency(
                      totalWithDiscount ||
                        (settings?.isShiprocketFlag
                          ? checkout.subtotal + (dynamicShipping || 0)
                          : checkout.subtotal + Number(checkout.shipping) * cart.length)
                    )}
                    isValid={isValid}
                    formik={formik}
                    couponCode={couponCode}
                    currency={currency}
                  />
                </PayPalScriptProvider>
              </Collapse>

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left', mt: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Terms and Conditions
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, textAlign: 'left' }}>
                  Please read and accept our terms and conditions before placing your order.
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isAccepted}
                      onChange={handleCheckboxChange}
                      color="secondary"
                      disabled={isProcessing || isOrderSubmitted}
                    />
                  }
                  label="I agree to the Terms and Conditions"
                />
              </Box>

              <LoadingButton
                variant="contained"
                fullWidth
                size="large"
                type="submit"
                disabled={
                  !isValid || isLoading || isProcessing || loading || !isAccepted || isOrderSubmitted || !paymentMethod
                }
                loading={isLoading || isProcessing || loading}
              >
                {isOrderSubmitted ? 'Your Order is Placed' : 'Place Order'}
              </LoadingButton>
            </Grid>
          </Grid>
        </Box>
      </Form>
    </FormikProvider>
  );
};

export default CheckoutMain;
