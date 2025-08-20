'use client';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from 'react-query';

// mui
import {
  Card,
  Stack,
  Typography,
  Box,
  FormHelperText,
  Grid,
  Skeleton,
  Button,
  Select,
  MenuItem,
  TextField,
  InputLabel,
  FormControl,
  Alert
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { styled } from '@mui/material/styles';

// api
import * as api from 'src/services';

// Mock role check (replace with actual auth logic)
const userRole = 'vendor'; // Possible values: 'admin', 'vendor', 'user'

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  lineHeight: 2.5,
  borderRadius: 0,
  boxShadow: 'none'
}));

StatusUpdateForm.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  oid: PropTypes.string.isRequired,
  isVendor: PropTypes.bool
};

// Simplified list of all possible statuses
// const allowedStatuses = [
//   'pending',
//   'approve',
//   'reject',
//   'on the way',
//   'canceled',
//   'ready to ship',
//   'delivered',
//   'returned'
// ];

const statusTransitions = {
  pending: ['approve', 'reject', 'failed'],
  approve: ['ready to ship'],
  'ready to ship': ['on the way'],
  'on the way': ['delivered'],
  delivered: [],
  reject: [],
  failed: []
};

// Transition rules for filtering dropdown
// const allowedTransitions = {
//   pending: ['approve', 'reject', 'on the way', 'canceled'],
//   'on the way': ['ready to ship', 'delivered', 'returned', 'canceled'],
//   delivered: ['returned']
// };

export default function StatusUpdateForm({ isLoading, oid, isVendor }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isShipmentCreated, setIsShipmentCreated] = useState(false); // New state for shipment success
  const queryClient = useQueryClient();

  // Hide form for non-admin/vendor users
  if (!['admin', 'vendor'].includes(userRole) || !isVendor) {
    return null;
  }
  // Fetch order details to get razorpayStatus
  const { data: orderData, isLoading: orderLoading } = useQuery(
    ['order-by-admin', oid],
    () => api.getOrderByAdmin(oid),
    {
      enabled: !!oid,
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Failed to fetch order details');
      }
    }
  );

  // Fetch status history
  const { data: statusHistory, isLoading: historyLoading } = useQuery(
    ['order-status-history', oid],
    () => api.getOrderStatusHistory({ orderId: oid }),
    {
      enabled: !!oid,
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Failed to fetch status history');
      }
    }
  );

  const currentStatus = statusHistory?.currentStatus?.toLowerCase() || 'pending';
  const razorpayStatus = orderData?.data?.razorpayStatus?.toLowerCase();
  const paymentMethod = orderData?.data?.paymentMethod?.toLowerCase();
  const isPaymentFailed = paymentMethod === 'razorpay' && razorpayStatus !== 'verified';

  // Mutation for updating status
  const { mutate: updateStatus, isLoading: updateLoading } = useMutation(
    (values) => api.updateVendorOrderStatus({ orderId: oid, ...values }),
    {
      onSuccess: () => {
        toast.success('Status updated successfully!');
        setIsEditing(false);
        queryClient.invalidateQueries(['order-status-history', oid]);
        queryClient.invalidateQueries(['order-by-admin', oid]);
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Failed to update status');
      }
    }
  );

  // Mutation for canceling order (reject/canceled)
  const { mutate: cancelOrder, isLoading: cancelLoading } = useMutation(
    (values) => api.cancelOrder({ order_id: oid, cancelReason: values.notes }),
    {
      onSuccess: () => {
        toast.success('Order canceled/rejected successfully!');
        setIsEditing(false);
        queryClient.invalidateQueries(['order-status-history', oid]);
        queryClient.invalidateQueries(['order-by-admin', oid]);
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Failed to cancel order');
      }
    }
  );

  // Mutation for creating shipment
  const { mutate: createShipment, isLoading: shipmentLoading } = useMutation(
    () => api.createShipment({ order_id: oid }),
    {
      onSuccess: () => {
        toast.success('Shipment created successfully!');
        setIsShipmentCreated(true); // Mark shipment as created
        queryClient.invalidateQueries(['order-status-history', oid]);
        queryClient.invalidateQueries(['order-by-admin', oid]);
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Failed to create shipment');
      }
    }
  );

  const StatusUpdateSchema = Yup.object().shape({
    status: Yup.string().required('Status is required'),
    notes: Yup.string().when('status', {
      is: (status) => ['reject', 'canceled', 'failed'].includes(status),
      then: (schema) => schema.required('Reason is required for rejection, cancellation, or failure'),
      otherwise: (schema) => schema.required('Notes are required for status change')
    })
  });

  const formik = useFormik({
    initialValues: {
      status: isPaymentFailed ? 'failed' : currentStatus,
      notes: statusHistory?.notes || ''
    },
    enableReinitialize: true,
    validationSchema: StatusUpdateSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (['reject', 'canceled'].includes(values.status)) {
          cancelOrder(values);
        } else {
          updateStatus(values);
        }
        resetForm();
      } catch (error) {
        console.error('Form submission error:', error);
        toast.error('Form submission failed');
      }
    }
  });

  const { errors, touched, values, handleSubmit, getFieldProps, isSubmitting } = formik;

  // // Get allowed statuses for dropdown
  // // const availableStatuses = allowedTransitions[currentStatus] || [];
  // const availableStatuses = statusTransitions[currentStatus] || [];
  // // Disable form if status is 'reject'
  // const isFormDisabled = ['reject', 'delivered'].includes(currentStatus);

  // Set available statuses based on razorpayStatus
  const availableStatuses = isPaymentFailed ? ['failed'] : statusTransitions[currentStatus] || [];

  // Disable form if status is 'reject', 'delivered', or 'failed'
  const isFormDisabled = ['reject', 'delivered', 'failed'].includes(currentStatus);

  return (
    <Box mt={2}>
      {isLoading || historyLoading || orderLoading ? (
        <Skeleton
          variant="rectangular"
          width="100%"
          height={200}
          sx={{
            borderRadius: '0px'
          }}
        />
      ) : (
        <Card sx={{ p: 3, borderRadius: 0, boxShadow: 'none' }}>
          {isPaymentFailed && (
            <Alert
              severity="error"
              sx={{
                mb: 2,
                backgroundColor: 'rgba(248, 215, 218, 0.75)',
                color: '#721c24',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)'
              }}
            >
              Payment status is failed, so you can only select failed status.
            </Alert>
          )}

          {currentStatus === 'ready to ship' && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Before updating the status, please press the <strong>Create Shipment</strong> button.
            </Alert>
          )}

          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <LabelStyle>Update Order Status</LabelStyle>
            <Stack direction="row" spacing={2}>
              {currentStatus === 'ready to ship' && (
                <LoadingButton
                  variant="contained"
                  size="samall"
                  onClick={() => createShipment()}
                  loading={shipmentLoading}
                  disabled={isEditing || updateLoading || cancelLoading || isShipmentCreated}
                >
                  Create Shipment
                </LoadingButton>
              )}

              {!isFormDisabled && (
                <Button
                  variant="contained"
                  size="samall"
                  onClick={() => setIsEditing(!isEditing)}
                  disabled={updateLoading || cancelLoading || shipmentLoading}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              )}
            </Stack>
          </Stack>
          <FormikProvider value={formik}>
            <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <LabelStyle component="label" htmlFor="Status">
                    Status
                  </LabelStyle>
                  <FormControl
                    fullWidth
                    error={Boolean(touched.status && errors.status)}
                    disabled={!isEditing || isFormDisabled}
                  >
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select labelId="status-label" id="status" {...getFieldProps('status')} label="Status">
                      {availableStatuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.status && errors.status && <FormHelperText>{errors.status}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <div>
                    <LabelStyle component="label" htmlFor="notes">
                      {['reject', 'canceled', 'failed'].includes(values.status) ? 'Reason' : 'Notes'}
                    </LabelStyle>
                    <TextField
                      fullWidth
                      id="notes"
                      {...getFieldProps('notes')}
                      error={Boolean(touched.notes && errors.notes)}
                      helperText={touched.notes && errors.notes}
                      disabled={!isEditing || isFormDisabled}
                    />
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="flex-end" spacing={2}>
                    {isEditing && !isFormDisabled && (
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        size="samall"
                        loading={isSubmitting || updateLoading || cancelLoading}
                      >
                        Save
                      </LoadingButton>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Form>
          </FormikProvider>
        </Card>
      )}
    </Box>
  );
}
