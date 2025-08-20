'use client';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import toast from 'react-hot-toast';

import CancelReturnDialog from 'src/components/dialog/CancelReturnDialog';
import OrderPDF from './orderPdf';

// mui
import LoadingButton from '@mui/lab/LoadingButton';
import { PDFDownloadLink } from '@react-pdf/renderer';
import {
  Typography,
  Card,
  CardContent,
  Stack,
  Fab,
  Grid,
  Skeleton,
  Tooltip,
  Box,
  useTheme,
  Button
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/lab';
import { IoPersonSharp } from 'react-icons/io5';
import { HiCurrencyDollar } from 'react-icons/hi2';
import {
  ShoppingCart as ShoppingCartIcon,
  AssignmentTurnedIn as ProcessedIcon,
  LocalShipping as ShippedIcon,
  DeliveryDining as OutForDeliveryIcon,
  CheckCircle as DeliveredIcon,
  Cancel as CancelIcon,
  Replay as ReturnIcon,
  CheckCircleOutline as ApproveIcon,
  Block as RejectIcon
} from '@mui/icons-material';

import { MdInventory } from 'react-icons/md';
import { MdOutlineFileDownload } from 'react-icons/md';

// hooks
import { useCurrencyFormatter } from 'src/hooks/formatCurrency';
import RootStyled from './styled';
import PropTypes from 'prop-types';
// api
import * as api from 'src/services';

Details.propTypes = {
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isVendor: PropTypes.bool,
  isAdmin: PropTypes.bool,
  settings: PropTypes.object
};

const statusIcons = {
  pending: <ShoppingCartIcon />,
  approve: <ApproveIcon />,
  reject: <RejectIcon />,
  'on the way': <OutForDeliveryIcon />,
  'ready to ship': <ShippedIcon />,
  delivered: <DeliveredIcon />,
  canceled: <CancelIcon />,
  returned: <ReturnIcon />,
  failed: <CancelIcon />
};

export default function Details({ data, isLoading, isVendor = false, isAdmin = false, settings }) {
  const user = data?.user;
  const fCurrency = useCurrencyFormatter(data?.currency);
  const theme = useTheme();

  // Fetch status history
  const { data: statusHistory, isLoading: historyLoading } = useQuery(
    ['order-status-history', data?._id],
    () => api.getOrderStatusHistory({ orderId: data._id }),
    {
      enabled: !!data?._id,
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Failed to fetch status history');
      }
    }
  );

  const currentStatus = statusHistory?.currentStatus?.toLowerCase() || 'pending';
  const canCancel = ['pending', 'approve', 'ready to ship', 'on the way'].includes(currentStatus);
  const canReturn = currentStatus === 'delivered';
  const isFailed = currentStatus === 'failed';
  const showActionButton = !isVendor && !isAdmin && (canCancel || canReturn || isFailed);
  const showDownloadButton = statusHistory?.currentStatus?.toLowerCase() === 'delivered';

  // Add state for dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState('cancel');

  // Build timeline data
  const timelineData = [];

  // Add initial pending status (assuming order starts as pending)
  if (data?.createdAt) {
    timelineData.push({
      status: 'pending',
      description: 'Order placed',
      notes: '',
      date: new Date(data.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }),
      icon: statusIcons.pending,
      isCurrent: currentStatus === 'pending' // Set isCurrent based on currentStatus
    });
  }

  // Add historical statuses from statusHistory (in reverse order as API returns newest first)
  // Update the historical statuses section
  if (statusHistory?.statusHistory?.length) {
    statusHistory.statusHistory
      .slice()
      .reverse()
      .forEach((item) => {
        // For cancelled/returned status, we need to add both previous and current status
        if (item.updateOrderStatus === 'canceled' || item.updateOrderStatus === 'returned') {
          // Add the previous status first - use updateNotes for its notes
          timelineData.push({
            status: item.previousStatus,
            description: item.previousStatus.charAt(0).toUpperCase() + item.previousStatus.slice(1).replace(/_/g, ' '),
            notes: statusHistory.updateNotes || 'No notes provided', // Use updateNotes here
            date: new Date(item.changedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric'
            }),
            icon: statusIcons[item.previousStatus] || <ShoppingCartIcon />,
            isCurrent: false // Previous status is not current
          });

          // Then add the cancelled/returned status
          let notes =
            item.updateOrderStatus === 'canceled'
              ? statusHistory.cancelReason || 'No cancellation reason provided'
              : statusHistory.returnReason || 'No return reason provided';

          timelineData.push({
            status: item.updateOrderStatus,
            description:
              item.updateOrderStatus.charAt(0).toUpperCase() + item.updateOrderStatus.slice(1).replace(/_/g, ' '),
            notes: notes,
            date: new Date(item.changedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric'
            }),
            icon: statusIcons[item.updateOrderStatus] || <ShoppingCartIcon />,
            isCurrent: currentStatus === item.updateOrderStatus // Set isCurrent based on currentStatus
          });
        } else {
          // Normal status transition
          timelineData.push({
            status: item.updateOrderStatus,
            description:
              item.updateOrderStatus.charAt(0).toUpperCase() + item.updateOrderStatus.slice(1).replace(/_/g, ' '),
            notes: item.previousNotes || 'No notes provided',
            date: new Date(item.changedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric'
            }),
            icon: statusIcons[item.updateOrderStatus] || <ShoppingCartIcon />,
            isCurrent: currentStatus === item.updateOrderStatus // Set isCurrent based on currentStatus
          });
        }
      });
  }

  // Add current status (updateOrderStatus) if not already included
  if (
    statusHistory?.updateOrderStatus &&
    !timelineData.some((item) => item.status === statusHistory.updateOrderStatus)
  ) {
    let notes = statusHistory.updateNotes || 'No notes provided';

    if (statusHistory.updateOrderStatus === 'canceled' && statusHistory?.cancelReason) {
      notes = statusHistory.cancelReason;
    } else if (statusHistory.updateOrderStatus === 'returned' && statusHistory?.returnReason) {
      notes = statusHistory.returnReason;
    }

    timelineData.push({
      status: statusHistory.updateOrderStatus,
      description:
        statusHistory.updateOrderStatus.charAt(0).toUpperCase() +
        statusHistory.updateOrderStatus.slice(1).replace(/_/g, ' '),
      notes: notes,
      date: new Date(statusHistory.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }),
      icon: statusIcons[statusHistory.updateOrderStatus] || <ShoppingCartIcon />,
      isCurrent: true // This is the current status
    });
  }

  return (
    <RootStyled>
      <Grid spacing={2} container>
        <Grid item xs={12} md={12}>
          <Card className="detail-card">
            <CardContent className="detail-card-content">
              {/* Customer Details Section */}
              <Stack spacing={2} direction="row" justifyContent="flex-start" alignItems="center">
                {isLoading ? (
                  <>
                    <Skeleton variant="rectangular" width={50} height={50} />
                    <Skeleton variant="text" width={150} />
                  </>
                ) : (
                  <>
                    <Fab className="detail-card-btn" variant="contained" color="primary">
                      <IoPersonSharp size={25} />
                    </Fab>
                    <Typography variant="h6">Customer Details</Typography>
                  </>
                )}
              </Stack>
              <Stack spacing={isLoading ? 0 : 1} mt={3}>
                {isLoading ? (
                  <>
                    <Skeleton variant="text" width={200} />
                    <Skeleton variant="text" width={200} />
                    <Skeleton variant="text" width={200} />
                    <Skeleton variant="text" width={200} />
                  </>
                ) : (
                  <>
                    <Typography variant="body2" className="card-text">
                      <strong>Name</strong>: {user?.firstName + ' ' + user?.lastName}
                    </Typography>
                    <Typography variant="body2" className="card-text">
                      <strong>Phone</strong>: {user?.phone}
                    </Typography>
                    <Typography variant="body2" className="card-text email-heading">
                      <strong>Email</strong>: {user?.email}
                    </Typography>
                    <Typography variant="body2" className="card-text">
                      <strong>Address</strong>: {user?.address} {user?.zip}, {user?.city} {user?.state}, {user?.country}
                    </Typography>
                  </>
                )}
              </Stack>
              <Stack mt={2} />
              {/* Payment Method Section */}
              <Stack spacing={2} direction="row" justifyContent="flex-start" alignItems="center">
                {isLoading ? (
                  <>
                    <Skeleton variant="rectangular" width={50} height={50} />
                    <Skeleton variant="text" width={150} />
                  </>
                ) : (
                  <>
                    <Fab className="detail-card-btn" variant="contained" color="primary">
                      <HiCurrencyDollar size={40} />
                    </Fab>
                    <Typography variant="h6">Payment Method</Typography>
                  </>
                )}
              </Stack>
              <Stack spacing={isLoading ? 0 : 1} mt={3}>
                {isLoading ? (
                  <>
                    <Skeleton variant="text" width={200} />
                    <Skeleton variant="text" width={200} />
                    <Skeleton variant="text" width={200} />
                    <Skeleton variant="text" width={200} />
                  </>
                ) : (
                  <>
                    <Typography variant="body2" className="card-text">
                      <strong>Method</strong>:{' '}
                      {data?.paymentMethod === 'COD'
                        ? 'Cash On Delivery'
                        : data?.paymentMethod === 'PAYPAL'
                          ? 'PAYPAL'
                          : data?.paymentMethod === 'RAZORPAY'
                            ? 'Razorpay'
                            : data?.paymentMethod === 'PHONEPE'
                              ? 'Phone Pay'
                              : data?.paymentMethod === 'STRIPE'
                                ? 'Stripe'
                                : 'Credit Card'}
                    </Typography>
                    {data?.paymentId && (
                      <Typography variant="body2" className="card-text">
                        <strong>Payment ID</strong>: {data?.paymentId}
                      </Typography>
                    )}
                    <Typography variant="body2" className="card-text" textTransform="capitalize">
                      <strong>Status</strong>:{' '}
                      {data?.paymentMethod === 'COD'
                        ? statusHistory?.currentStatus === 'delivered'
                          ? 'Done'
                          : 'Pending'
                        : data?.paymentMethod === 'PAYPAL'
                          ? 'Done'
                          : data?.paymentMethod === 'RAZORPAY'
                            ? 'Done'
                            : data?.paymentMethod === 'PHONEPE'
                              ? 'Done'
                              : data?.paymentMethod === 'STRIPE'
                                ? 'Done'
                                : 'Done'}
                    </Typography>
                    <Typography variant="body2" className="card-text" textTransform="capitalize">
                      <strong>Shipping Fee</strong>: {fCurrency(data?.shipping * data?.conversionRate)}
                    </Typography>
                    {isVendor && (settings?.[0]?.isFreeShipping || settings?.[0]?.isShiprocketFlag) && (
                      <Typography variant="body2" className="card-text" textTransform="capitalize">
                        <strong>Shiprocket Shipping Fee</strong>: {fCurrency(data?.dbShipping)}
                      </Typography>
                    )}
                    {console.log('settings', settings?.[0])}
                    <Box sx={{ position: 'relative', mt: 2 }}>
                      <Typography variant="body2" className="card-text">
                        <strong>Order Date</strong>:{' '}
                        {data?.createdAt &&
                          new Date(data?.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric'
                          })}
                      </Typography>

                      {showDownloadButton && (
                        <PDFDownloadLink
                          document={<OrderPDF data={data} statusHistory={statusHistory} />}
                          fileName={`INVOICE-${data?._id}`}
                          style={{ textDecoration: 'none' }}
                        >
                          {({ loading }) => (
                            <Tooltip title="Download Invoice">
                              <LoadingButton
                                className="action-button"
                                loading={loading}
                                variant="contained"
                                loadingPosition="start"
                                startIcon={<MdOutlineFileDownload />}
                                color="info"
                                sx={{ mt: 2 }}
                              >
                                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                                  Download Invoice
                                </Box>
                              </LoadingButton>
                            </Tooltip>
                          )}
                        </PDFDownloadLink>
                      )}
                    </Box>
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* Products Status Card with Timeline */}
          <Card className="detail-card">
            <CardContent className="detail-card-content">
              <Stack spacing={2} direction="row" justifyContent="flex-start" alignItems="center">
                {isLoading ? (
                  <>
                    <Skeleton variant="rectangular" width={50} height={50} />
                    <Skeleton variant="text" width={150} />
                  </>
                ) : (
                  <>
                    <Fab className="detail-card-btn" variant="contained" color="primary">
                      <MdInventory size={40} />
                    </Fab>
                    <Typography variant="h6">Products Status</Typography>
                  </>
                )}
              </Stack>
              <Stack mt={3}>
                <Box sx={{ position: 'relative', minHeight: 200 }}>
                  {isLoading || historyLoading ? (
                    <>
                      <Skeleton variant="text" width="100%" height={60} />
                      <Skeleton variant="text" width="100%" height={60} />
                      <Skeleton variant="text" width="100%" height={60} />
                      <Skeleton variant="text" width="100%" height={60} />
                    </>
                  ) : (
                    //
                    <>
                      <Timeline className="timeline">
                        {timelineData.map((item, index) => (
                          <TimelineItem key={item.status + index}>
                            <TimelineOppositeContent className="timeline-opposite">
                              <Typography variant="body2">{item.date}</Typography>
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                              <Tooltip
                                title={
                                  <React.Fragment>
                                    <Typography color="inherit">
                                      {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace(/_/g, ' ')}
                                    </Typography>
                                    <em>{item.notes}</em>
                                  </React.Fragment>
                                }
                                placement="top"
                              >
                                <TimelineDot className={`timeline-dot ${item.isCurrent ? 'current-status' : ''}`}>
                                  {item.icon}
                                </TimelineDot>
                              </Tooltip>
                              {index < timelineData.length - 1 && <TimelineConnector className="timeline-connector" />}
                            </TimelineSeparator>
                            <TimelineContent>
                              <Typography variant="h6" component="span" className="card-text">
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1).replace(/_/g, ' ')}
                              </Typography>
                              <Typography variant="body2" className="card-text">
                                {item.description}
                              </Typography>
                            </TimelineContent>
                          </TimelineItem>
                        ))}
                      </Timeline>
                      {showActionButton && (
                        <Tooltip
                          title={isFailed ? 'Resolve Failed Order' : canCancel ? 'Cancel Order' : 'Return Order'}
                        >
                          <Button
                            variant="contained"
                            color="error"
                            className="action-button"
                            onClick={() => {
                              setDialogAction(isFailed ? 'resolve' : canCancel ? 'cancel' : 'return');
                              setDialogOpen(true);
                            }}
                          >
                            {isFailed ? 'Resolve Failed Order' : canCancel ? 'Cancel' : 'Return'}
                          </Button>
                        </Tooltip>
                      )}
                      <CancelReturnDialog
                        open={dialogOpen}
                        onClose={() => setDialogOpen(false)}
                        orderId={data?._id}
                        action={dialogAction}
                        statusHistoryKey={['order-status-history', data?._id]}
                      />
                    </>
                  )}
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </RootStyled>
  );
}
