'use client';
import React from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import * as api from 'src/services';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Box,
  alpha
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { IoWarning } from 'react-icons/io5';

CancelReturnDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  orderId: PropTypes.string.isRequired,
  action: PropTypes.oneOf(['cancel', 'return', 'resolve']).isRequired,
  statusHistoryKey: PropTypes.array.isRequired
};

export default function CancelReturnDialog({ open, onClose, orderId, action, statusHistoryKey }) {
  const queryClient = useQueryClient();
  const [reason, setReason] = React.useState('');
  const isCancel = action === 'cancel';
  const isResolve = action === 'resolve';
  const isReturn = action === 'return';
  const title = isCancel ? 'Cancel Order' : isResolve ? 'Resolve Failed Order' : 'Return Order';
  const message = isCancel
    ? 'Are you sure you want to cancel this order? Please provide a reason for cancellation.'
    : isResolve
      ? 'Your order has failed. You can either re-order with Cash on Delivery (COD) or cancel the order. Please provide a reason if canceling.'
      : 'Are you sure you want to return this order? Please provide a reason for the return.';
  const buttonText = isCancel ? 'Cancel Order' : isResolve ? 'Cancel Order' : 'Request Return';

  const { isLoading: isCancelLoading, mutate: cancelMutate } = useMutation(api.cancelOrder, {
    onSuccess: () => {
      toast.success('Order canceled successfully');
      queryClient.invalidateQueries(statusHistoryKey);
      setReason('');
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    }
  });

  const { isLoading: isReturnLoading, mutate: returnMutate } = useMutation(api.returnOrder, {
    onSuccess: () => {
      toast.success('Return request submitted successfully');
      queryClient.invalidateQueries(statusHistoryKey);
      setReason('');
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to submit return request');
    }
  });

  const { isLoading: isReorderLoading, mutate: reorderMutate } = useMutation(api.reOrder, {
    onSuccess: (data) => {
      toast.success('Reorder placed successfully');
      queryClient.invalidateQueries(statusHistoryKey);
      setReason('');
      onClose();
      window.location.href = `/order/${data.newOrderId}`; // Redirect to new order page
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to reorder');
    }
  });

  const handleCancelSubmit = () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason');
      return;
    }
    cancelMutate({ orderId, cancelReason: reason });
  };

  const handleReturnSubmit = () => {
    if (!reason.trim()) {
      toast.error('Please provide a reason');
      return;
    }
    returnMutate({ orderId, reason: reason });
  };

  const handleReorderSubmit = () => {
    reorderMutate({ previousOrderId: orderId });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box
          sx={{
            height: 40,
            width: 40,
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.2),
            borderRadius: '50px',
            color: (theme) => theme.palette.error.main,
            mr: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <IoWarning size={24} />
        </Box>
        {title}
      </DialogTitle>
      <DialogContent sx={{ pb: '16px !important' }}>
        <DialogContentText sx={{ mb: 2 }}>{message}</DialogContentText>
        {(isCancel || isReturn || isResolve) && (
          <TextField
            fullWidth
            label={isReturn ? 'Return Reason' : 'Cancellation Reason'}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            multiline
            rows={3}
            error={!reason.trim() && (isCancelLoading || isReturnLoading)}
            helperText={!reason.trim() && (isCancelLoading || isReturnLoading) ? 'Reason is required' : ''}
          />
        )}
      </DialogContent>
      <DialogActions sx={{ pt: '8px !important' }}>
        <Button onClick={onClose}>Close</Button>
        {isResolve && (
          <LoadingButton variant="contained" color="primary" loading={isReorderLoading} onClick={handleReorderSubmit}>
            Re-Order with COD
          </LoadingButton>
        )}
        {isReturn ? (
          <LoadingButton
            variant="contained"
            color="error"
            loading={isReturnLoading}
            onClick={handleReturnSubmit}
            disabled={!reason.trim()}
          >
            {buttonText}
          </LoadingButton>
        ) : (
          (isCancel || isResolve) && (
            <LoadingButton
              variant="contained"
              color="error"
              loading={isCancelLoading}
              onClick={handleCancelSubmit}
              disabled={!reason.trim()}
            >
              {buttonText}
            </LoadingButton>
          )
        )}
      </DialogActions>
    </Dialog>
  );
}
