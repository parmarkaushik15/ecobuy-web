'use client';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next-nprogress-bar';
import Image from 'next/image';
import { useSelector } from 'react-redux';
// mui
import { CardContent, Typography, Stack, Divider, Skeleton, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks components
import { useCurrencyConvert } from 'src/hooks/convertCurrency';
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
// api
import * as api from 'src/services';
import RootStyled from './styled';
// images
import paymentImg from '../../../../../public/images/payment-method.png';

PaymentSummary.propTypes = {
  loading: PropTypes.bool.isRequired
};

export default function PaymentSummary({ loading, cart }) {
  const { product } = useSelector((state) => state);
  const { subtotal, shipping, total } = product.checkout; // Removed shipping, total
  const router = useRouter();
  const isEmptyCart = cart.length === 0;
  const cCurrency = useCurrencyConvert();
  const fCurrency = useCurrencyFormatter();
  const [settings, setSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);

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

  return (
    <RootStyled>
      <CardContent sx={{ py: 2 }}>
        <Typography variant="h4" mb={1}>
          Payment Summary
        </Typography>
        <Stack spacing={0} mt={1} mb={2}>
          <Stack direction="row" alignItem="center" justifyContent="space-between" spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Subtotal:
            </Typography>
            <Typography variant="subtitle2">
              {loading || settingsLoading ? <Skeleton variant="text" width={80} /> : fCurrency(cCurrency(subtotal))}
            </Typography>
          </Stack>
          <Stack direction="row" alignItem="center" justifyContent="space-between" spacing={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Shipping:
            </Typography>
            <Typography variant="subtitle2">
              {loading || settingsLoading ? (
                <Skeleton variant="text" width={80} />
              ) : settings?.isShiprocketFlag ? (
                'Depend On Location'
              ) : !shipping ? (
                'Free'
              ) : (
                fCurrency(cCurrency(parseInt(Number(shipping) * cart.length)))
              )}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Stack direction="row" alignItem="center" justifyContent="space-between" spacing={2} mt={2}>
          <Typography variant="subtitle1">Total:</Typography>
          <Typography variant="subtitle1">
            {loading || settingsLoading ? (
              <Skeleton variant="text" width={80} />
            ) : settings?.isShiprocketFlag ? (
              fCurrency(cCurrency(subtotal))
            ) : !shipping ? (
              fCurrency(cCurrency(subtotal))
            ) : (
              fCurrency(cCurrency(subtotal + Number(shipping) * cart.length))
            )}
          </Typography>
        </Stack>
        <Box sx={{ position: 'relative', width: '100%', height: 26, mt: 2 }}>
          <Image src={paymentImg} alt="payment" fill objectFit="contain" />
        </Box>
        <Box mt={2}>
          <LoadingButton
            variant="contained"
            fullWidth
            size="large"
            sx={{
              borderRadius: '5px'
            }}
            disabled={isEmptyCart}
            loading={loading || settingsLoading}
            onClick={() => router.push('/checkout')}
          >
            Checkout
          </LoadingButton>
        </Box>
      </CardContent>
    </RootStyled>
  );
}
