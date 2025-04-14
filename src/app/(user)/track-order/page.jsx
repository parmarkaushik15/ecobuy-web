'use client';
import React, { useState } from 'react';
// mui
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import * as api from 'src/services';
import { useRouter } from 'next-nprogress-bar';
// components

export default function TrackOrder() {
  const router = useRouter();
  const [trackNo, setTrackNo] = useState('');
  const trackOrder = async () => {
    if (trackNo) {
      const response = await api.getOrderInfo(trackNo);
      if (response.success) {
        router.push(`order/${response.data}`);
      } else {
        toast.error('No order found');
      }
    } else {
      toast.error('Please enter order no');
    }
  };
  return (
    <Container maxWidth="xl">
      <Typography sx={{ mb: 5, mt: 5, textAlign: 'center' }}>
        To track your order please enter your Order ID in the box below and press the "Track" button. This was given to
        you on your receipt and in the confirmation email you should have received.
      </Typography>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <TextField
          value={trackNo}
          label="Order ID"
          variant="outlined"
          fullWidth
          sx={{ maxWidth: '400px', mb: 2 }}
          onChange={(e) => {
            setTrackNo(e.target.value);
          }}
        />
        <Button
          onClick={trackOrder}
          variant="contained"
          color="primary"
          sx={{ width: '150px !important', backgroundColor: 'primary' }}
        >
          TRACK
        </Button>
      </Box>
    </Container>
  );
}
