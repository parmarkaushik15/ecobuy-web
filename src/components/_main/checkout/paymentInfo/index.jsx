'use client';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// mui
import { Card, CardContent, Typography, Stack, Divider, TextField, Button, Skeleton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hook
import { useCurrencyConvert } from 'src/hooks/convertCurrency';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
// api
import * as api from 'src/services';
import { useMutation } from 'react-query';

PaymentInfo.propTypes = {
  setCouponCode: PropTypes.func.isRequired,
  setTotal: PropTypes.func.isRequired,
  zipCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  cart: PropTypes.array,
  setDynamicShipping: PropTypes.func,
  setIsShippingApplied: PropTypes.func.isRequired
};

function isExpired(expirationDate) {
  const currentDateTime = new Date();
  return currentDateTime >= new Date(expirationDate);
}

export default function PaymentInfo({
  setCouponCode,
  setTotal,
  zipCode,
  cart,
  setDynamicShipping,
  setIsShippingApplied
}) {
  const { product } = useSelector((state) => state);
  const { subtotal, shipping, total } = product.checkout;
  const [code, setCode] = useState('');
  const [zip, setZip] = useState(zipCode ? String(zipCode) : '');
  const [lastFetchedZip, setLastFetchedZip] = useState(''); // Track last fetched zip to prevent redundant API calls
  const cCurrency = useCurrencyConvert();
  const fCurrency = useCurrencyFormatter();
  const [discountPrice, setDiscountPrice] = useState(null);
  const [appliedDiscount, setDiscount] = useState(null);
  const [appliedCode, setAppliedCode] = useState(null);
  const [dynamicShipping, setLocalDynamicShipping] = useState(null);
  const [settings, setSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [isShippingAppliedLocal, setIsShippingAppliedLocal] = useState(false);

  useEffect(() => {
    const zipString = zipCode ? String(zipCode).trim() : '';
    setZip(zipString);
    if (zipString !== zip && isShippingAppliedLocal) {
      setLocalDynamicShipping(null);
      setDynamicShipping(null);
      setIsShippingAppliedLocal(false);
      setIsShippingApplied(false);
      setLastFetchedZip('');
      const newTotal = discountPrice !== null ? discountPrice - (dynamicShipping || 0) : subtotal;
      setDiscountPrice(discountPrice !== null ? newTotal : null);
      setTotal(newTotal);
    }
  }, [zipCode, zip, discountPrice, subtotal, setTotal, setDynamicShipping]);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await api.getSetting();
        setSettings(response.data[0]);
        setSettingsLoading(false);
      } catch (error) {
        console.error('Error fetching settings:', error);
        setSettingsLoading(false);
      }
    }
    fetchSettings();
  }, []);

  // Automatically fetch shipping price when zipCode changes and is valid
  useEffect(() => {
    const zipString = zipCode ? String(zipCode).trim() : '';
    if (
      settings?.isShiprocketFlag &&
      zipString &&
      /^\d{6}$/.test(zipString) &&
      !isShippingAppliedLocal &&
      zipString !== lastFetchedZip
    ) {
      const productIds = cart.map((item) => item.pid);
      fetchShippingPrice({
        deliveryPostcode: zipString,
        productId: productIds
      });
    } else if (settings?.isShiprocketFlag && zipString && !/^\d{6}$/.test(zipString)) {
      // toast.error('Please enter a valid 6-digit postal code');
      setLocalDynamicShipping(null);
      setDynamicShipping(null);
      setIsShippingAppliedLocal(false);
      setIsShippingApplied(false);
      setLastFetchedZip('');
      const newTotal = discountPrice !== null ? discountPrice - (dynamicShipping || 0) : subtotal;
      setDiscountPrice(discountPrice !== null ? newTotal : null);
      setTotal(newTotal);
    }
  }, [zipCode, settings, cart, isShippingAppliedLocal, lastFetchedZip]);

  // Calculate shipping cost
  const getShippingCost = () => {
    if (settings?.isShiprocketFlag) {
      return dynamicShipping || 0;
    }
    return shipping ? Number(shipping) * cart.length : 0;
  };

  // Calculate total amount
  const getTotalAmount = () => {
    const shippingCost = getShippingCost();
    if (discountPrice !== null) {
      return discountPrice; // Includes discount and shipping
    }
    return subtotal + shippingCost;
  };

  const { mutate: applyCoupon, isLoading: couponLoading } = useMutation(api.applyCouponCode, {
    onSuccess: ({ data }) => {
      const expired = isExpired(data.expire);
      if (expired) {
        toast.error('Coupon code is expired!');
        return;
      }

      let discount = 0;
      let discountedTotal = subtotal;

      if (data.type === 'percent') {
        const percentLess = data.discount;
        discount = (percentLess / 100) * subtotal;
        discountedTotal = subtotal - discount;
      } else {
        discount = data.discount;
        discountedTotal = subtotal - discount;
      }

      // Ensure discounted total is not negative
      if (discountedTotal < 0) {
        toast.error('Discount cannot exceed subtotal');
        return;
      }

      const shippingCost = getShippingCost();
      const finalTotal = discountedTotal + (settings?.isShiprocketFlag ? dynamicShipping || 0 : shippingCost);

      setCouponCode(code);
      setDiscount(discount);
      setDiscountPrice(finalTotal);
      setTotal(finalTotal);
      setAppliedCode(code);
      toast.success(`Coupon code applied. You saved ${fCurrency(cCurrency(discount))}`);
    },
    onError: () => {
      toast.error('Coupon code is not valid');
    }
  });

  const { mutate: fetchShippingPrice, isLoading: shippingLoading } = useMutation(api.getShipmentPrice, {
    onSuccess: ({ shipmentDetails }) => {
      const shippingCharge = shipmentDetails[0]?.shippingCharge;
      if (shippingCharge) {
        setLocalDynamicShipping(shippingCharge);
        setDynamicShipping(shippingCharge);
        setIsShippingAppliedLocal(true);
        setIsShippingApplied(true); // Update parent state
        setLastFetchedZip(zipCode ? String(zipCode).trim() : '');
        const newTotal = (discountPrice !== null ? discountPrice - (dynamicShipping || 0) : subtotal) + shippingCharge;
        setTotal(newTotal);
        setDiscountPrice(newTotal);
        toast.success(`Shipping cost updated: ${fCurrency(cCurrency(shippingCharge))}`);
      } else {
        toast.error('Unable to fetch shipping price');
        setIsShippingAppliedLocal(false);
        setIsShippingApplied(false);
      }
    },
    onError: () => {
      toast.error('Failed to fetch shipping price');
      setIsShippingAppliedLocal(false);
      setIsShippingApplied(false);
    }
  });

  const onApplyCoupon = () => {
    if (code.length > 3) {
      applyCoupon(code);
    } else {
      toast.error('Enter valid coupon code.');
    }
  };

  const onRemoveCoupon = () => {
    const shippingCost = getShippingCost();
    setCode('');
    setDiscount(null);
    setDiscountPrice(null);
    setAppliedCode(null);
    setTotal(subtotal + shippingCost);
    setCouponCode(null);
    toast.success('Coupon code removed.');
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent sx={{ py: 2 }}>
        <Typography variant="h4" mb={1}>
          Payment Summary
        </Typography>

        <Stack spacing={0} mt={1} mb={2} gap={1}>
          <Stack direction="row" alignItem="center" justifyContent="space-between" spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Subtotal:
            </Typography>
            <Typography variant="subtitle2">{fCurrency(cCurrency(subtotal))}</Typography>
          </Stack>
          <Stack direction="row" alignItem="center" justifyContent="space-between" spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Discount:
            </Typography>
            <Typography variant="subtitle2">-{fCurrency(cCurrency(appliedDiscount || 0))}</Typography>
          </Stack>
          <Stack direction="row" alignItem="center" justifyContent="space-between" spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Shipping:
            </Typography>
            <Typography variant="subtitle2">
              {settingsLoading ? (
                <Skeleton variant="text" width={80} />
              ) : settings?.isShiprocketFlag ? (
                dynamicShipping !== null && isShippingAppliedLocal ? (
                  fCurrency(cCurrency(dynamicShipping))
                ) : (
                  'Depend On Location'
                )
              ) : !shipping ? (
                'Free'
              ) : (
                fCurrency(cCurrency(Number(shipping) * cart.length))
              )}
            </Typography>
          </Stack>

          <Stack direction={'row'} gap={1} mt={2}>
            <TextField
              id="coupon-field"
              fullWidth
              placeholder="Enter coupon code"
              size="small"
              value={code}
              disabled={Boolean(appliedCode)}
              onChange={(e) => setCode(e.target.value)}
            />
            <LoadingButton
              loading={couponLoading}
              onClick={onApplyCoupon}
              variant="contained"
              color="primary"
              disabled={Boolean(appliedCode) || code.length < 4}
            >
              {appliedCode ? 'Applied' : 'Apply'}
            </LoadingButton>
          </Stack>
          {appliedCode && (
            <Button onClick={onRemoveCoupon} variant="text" color="error" sx={{ mt: 1 }}>
              Remove Coupon
            </Button>
          )}
        </Stack>
        <Divider />
        <Stack direction="row" alignItem="center" justifyContent="space-between" spacing={2} mt={2}>
          <Typography variant="subtitle1">Total:</Typography>
          <Typography variant="subtitle1">
            {settingsLoading ? <Skeleton variant="text" width={80} /> : fCurrency(cCurrency(getTotalAmount()))}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
