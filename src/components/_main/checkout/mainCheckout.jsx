'use client';
import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next-nprogress-bar';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from 'react-query';
import { toast } from 'react-hot-toast';
import { sum } from 'lodash';
// mui
import { Box, Card, CardContent, Collapse, Dialog, DialogContent, Grid, IconButton, Typography } from '@mui/material';
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
// Componensts
import { resetCart, getCart } from 'src/redux/slices/product';
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
  const router = useRouter();
  const childRef = useRef(null);
  const cCurrency = useCurrencyConvert();
  const dispatch = useDispatch();
  const { currency, rate } = useSelector(({ settings }) => settings);
  const { checkout } = useSelector(({ product }) => product);
  const { user: userData } = useSelector(({ user }) => user);
  const { cart, total } = checkout;
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [checked, setChecked] = React.useState(false);

  const handleChangeShipping = (event) => {
    setChecked(event.target.checked);
  };

  const [couponCode, setCouponCode] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);
  const [isProcessing, setProcessingTo] = useState(false);

  const [totalWithDiscount, setTotalWithDiscount] = useState(null);
  const { mutate, isLoading } = useMutation('order', api.placeOrder, {
    onSuccess: (data) => {

      toast.success('Order placed!');
      setProcessingTo(false);

      router.push(`/order/${data.orderId}`);
      dispatch(resetCart());
    },
    onError: (err) => {
      toast.error(err.response.data.message || 'Something went wrong');
      setProcessingTo(false);
    }
  });

  const [loading, setLoading] = React.useState(true);

  const [paymentGateway, setPaymentGateway] = useState([]);

 


  useEffect(() => {
    getSettingDetail();
  }, []);

  const getSettingDetail = async () => {
    try {
      const response = await api.getSetting();
      if (response.pg) {
        const pg = JSON.parse(atob(response.pg));
        const stripe = pg.find((item) => item.pgConstant == "STRIPE");
        if (stripe) {
          setStripePromise(loadStripe(stripe.apiKey));
        };
        const phonepe = pg.find((item) => item.pgConstant == "PHONEPE");
        if (phonepe) {
          if (typeof window !== "undefined" && !window.PhonePe) {
            const script = document.createElement("script");
            script.src = "https://mercury.phonepe.com/web/bundle/checkout.js";
            script.async = true;
            script.onload = () => {
               console.log("script is loaded")
            };
            script.onerror = () => console.error("Failed to load PhonePe SDK");
            document.body.appendChild(script);
          } 
        };
        const paypal = pg.find((item) => item.pgConstant == "PAYPAL");
        if (paypal) {
          initial['client-id'] = paypal.apiKey;
          setInitialOptions(initial);
        };
        setPaymentGateway(pg)
      }
      console.log(response);
    } catch (error) {
      console.error('Error fetching advertise images:', error);
    }
  };

  const { mutate: getCartMutate } = useMutation(api.getCart, {
    onSuccess: (res) => {

      setLoading(false);
    },
    onError: (err) => {
      const message = JSON.stringify(err.response.data.message);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const NewAddressSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    phone: Yup.string().required('Phone is required'),
    email: Yup.string().email('Enter email Valid').required('Email is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    zip: Yup.string().required('Postal is required'),
    // shipping: Yup.boolean().required('Postal is required'),
    shippingAddress: checked
      ? Yup.object().shape({
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        phone: Yup.string().required('Phone is required'),
        email: Yup.string().email('Enter email Valid').required('Email is required'),
        address: Yup.string().required('Address is required'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        country: Yup.string().required('Country is required'),
        zip: Yup.string().required('Postal is required')
      })
      : Yup.string().nullable().notRequired()
  });

  // Define initial values
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
      const items = cart.map(({ ...others }) => others);
      const totalItems = sum(items.map((item) => item.quantity));

      const data = {
        paymentMethod: paymentMethod,
        items: items,
        user: values,
        totalItems,
        couponCode,
        currency,
        conversionRate: rate,
        shipping: process.env.SHIPPING_FEE || 0
      };
      if (data.paymentMethod === "STRIPE") {
        childRef.current?.onSubmit(data);
      } else if (data.paymentMethod === "PHONEPE") {
        onPhonePeSubmit(data);
      } else {
        mutate(data);
      }
    }
  });
  const { errors, values, touched, handleSubmit, getFieldProps, isValid } = formik;
  const [redirectUrl, setRedirectUrl] = useState("");
  const [open, setOpen] = useState(false);


  const handleTransactionCallback = async (response) => {
    if (response === "USER_CANCEL") {

    } else if (response === "CONCLUDED") { 
      let dataObj = localStorage.getItem("dataObj");
      if(dataObj) {
        dataObj = JSON.parse(atob(dataObj));
      }
      setProcessingTo(true);
      const result = await api.phonePePaymentStatus(dataObj?.merchantTransactionId);
      if(result.data.data.code === "PAYMENT_SUCCESS") {
        const obj = {
          ...dataObj,
          paymentId: result.data.data.data.transactionId
        }
        mutate(obj);
      }
      console.log(result);
    }
  };

  const onPhonePeSubmit = async ({ ...data }) => {
    setProcessingTo(true);
    try {
      const result = await api.phonePePaymentIntents(
        cCurrency(totalWithDiscount || checkout.total),
        currency,
        data.phone,
        userData?._id
      );
      const redirectUrl = result.data.data.instrumentResponse?.redirectInfo?.url;
      const obj = {
        ...data,
        merchantTransactionId: result.data.data.merchantTransactionId
      } 
      localStorage.setItem("dataObj", btoa(JSON.stringify(obj)));
      setPhonePeObj(obj);
      if (redirectUrl) {
        if (typeof window !== "undefined" && window.PhonePeCheckout) {
          try {
            window.PhonePeCheckout.transact({
              tokenUrl: redirectUrl,
              callback: handleTransactionCallback,
              type: "IFRAME",
            });
          } catch (error) {
            console.error("PhonePe Payment Error:", error);
          }
        } else {
          console.error("PhonePe SDK not loaded");
        }
      }
      console.log(redirectUrl);

     
      console.log(result);
    } catch (e) {
      console.log(e.response.data);
      setProcessingTo(false);
    }
  };

  const onSuccessPaypal = async (paymentId) => {
    const items = cart.map(({ ...others }) => others);

    const totalItems = sum(items.map((item) => item.quantity));
    const data = {
      paymentMethod: "PAYPAL",
      items: items,
      user: values,
      totalItems,
      couponCode,
      shipping: process.env.SHIPPING_FEE || 0
    };

    mutate({
      ...data,
      paymentId: paymentId
    });
  };

  const onClose = () => {
    setOpen(false);
  }

  return (
    <FormikProvider value={formik}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <IconButton
          onClick={onClose}
          style={{ position: "absolute", top: 10, right: 10 }}
        >
          <IoCloseCircleOutline />
        </IconButton>
        <DialogContent style={{ padding: 0 }}>
          {redirectUrl ? (
            <iframe
              src={redirectUrl}
              width="100%"
              height="600px"
              style={{ border: "none" }}
              title="Redirect Page"
            />
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
              />
              <Collapse in={checked}>
                <ShipmentCheckoutForm getFieldProps={getFieldProps} touched={touched} errors={errors} />
              </Collapse>
            </Grid>
            <Grid item xs={12} md={4}>
              <CartItemsCard cart={cart} loading={loading} />
              <PaymentInfo loading={loading} setCouponCode={setCouponCode} setTotal={(v) => setTotalWithDiscount(v)} />
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

              <Collapse in={paymentMethod === "STRIPE"}>

                <Card>

                  <CardContent>
                    <Typography variant="subtitle1" color="text.secondary" mt={1} mb={1}>
                      Credit Card
                    </Typography>
                    <Elements stripe={stripePromise}>
                      <StripeCheckout
                        totalWithDiscount={totalWithDiscount}
                        checkout={checkout}
                        ref={childRef}
                        error={checkoutError}
                        setCheckoutError={setCheckoutError}
                        mutate={mutate}
                        values={values}
                        couponCode={couponCode}
                        currency={currency}
                        setProcessingTo={setProcessingTo} />
                    </Elements>
                  </CardContent>
                </Card>
              </Collapse>

              <Collapse in={paymentMethod === "PAYPAL"}>
                <PayPalScriptProvider options={initialOptions}>
                  <PayPalPaymentMethod
                    onSuccess={onSuccessPaypal}
                    values={values}
                    total={cCurrency(totalWithDiscount || total)}
                    isValid={isValid}
                    formik={formik}
                    couponCode={couponCode}
                    currency={currency}
                  />
                </PayPalScriptProvider>
              </Collapse>

              <Collapse in={paymentMethod !== "PAYPAL"}>
                <LoadingButton
                  variant="contained"
                  fullWidth
                  size="large"
                  type="submit"
                  loading={isLoading || isProcessing || loading}
                >
                  Place Order
                </LoadingButton>
              </Collapse>
            </Grid>
          </Grid>
        </Box>
      </Form>
    </FormikProvider>
  );
};

export default CheckoutMain;
