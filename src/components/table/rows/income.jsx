import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next-nprogress-bar';

// mui
import { useTheme } from '@mui/material/styles';
import { TableRow, Skeleton, TableCell, Stack, IconButton, Tooltip } from '@mui/material';

// components
import Label from 'src/components/label';

// utils
import { fCurrency } from 'src/utils/formatNumber';
import { fDateShort } from 'src/utils/formatTime';

// icons
import { MdEdit } from 'react-icons/md';
import { IoEye } from 'react-icons/io5';

IncomeList.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    shopTitle: PropTypes.string,
    totalOrders: PropTypes.number,
    totalAmount: PropTypes.number,
    commissionPer: PropTypes.string,
    commissionAmount: PropTypes.number,
    status: PropTypes.string,
    paymentStatus: PropTypes.string,
    month: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    orders: PropTypes.shape({
      length: PropTypes.number
    }),
    total: PropTypes.number,
    totalIncome: PropTypes.number,
    totalCommission: PropTypes.number,
    date: PropTypes.string
  }).isRequired,
  handleClickOpen: PropTypes.func,
  isVendor: PropTypes.bool
};

export default function IncomeList({ isLoading, row, handleClickOpen, isVendor }) {
  const theme = useTheme();
  const router = useRouter();

  return (
    <TableRow hover key={row?._id}>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : row.totalOrders || 0}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : fCurrency(row.totalAmount)}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : fCurrency(row.totalAmount)}</TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : fCurrency(row.commissionAmount)}</TableCell>
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={
              (row.status === 'approved' && 'success') ||
              (row.status === 'pending' && 'info') ||
              (row.status === 'rejected' && 'error') ||
              'error'
            }
          >
            {row.status}
          </Label>
        )}
      </TableCell>
      <TableCell>
        {isLoading ? (
          <Skeleton variant="text" />
        ) : (
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={
              (row.paymentStatus === 'done' && 'success') ||
              (row.paymentStatus === 'pending' && 'info') ||
              (row.paymentStatus === 'failed' && 'error') ||
              'error'
            }
          >
            {row.paymentStatus}
          </Label>
        )}
      </TableCell>
      <TableCell>{isLoading ? <Skeleton variant="text" /> : fDateShort(row.month).slice(3)}</TableCell>
      <TableCell align="right">
        <Stack direction="row" justifyContent="flex-end">
          {isLoading ? (
            <Skeleton variant="circular" width={34} height={34} sx={{ mr: 1 }} />
          ) : (
            isVendor && (
              <Tooltip title="Edit Status">
                <IconButton onClick={() => handleClickOpen(row)}>
                  <MdEdit />
                </IconButton>
              </Tooltip>
            )
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
}
