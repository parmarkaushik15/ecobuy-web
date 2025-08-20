import React, { useState } from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';

// mui
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  alpha
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

// icons
import { IoWarning } from 'react-icons/io5';

// api
import * as api from 'src/services';
import { useMutation } from 'react-query';

ReportStatusDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  reportId: PropTypes.string.isRequired,
  currentStatus: PropTypes.string,
  refetch: PropTypes.func.isRequired
};

export default function ReportStatusDialog({ open, handleClose, reportId, currentStatus, refetch }) {
  const [status, setStatus] = useState(currentStatus || 'approved');

  const { isLoading, mutate } = useMutation(api.updateReportStatus, {
    onSuccess: () => {
      toast.success('Report status updated successfully');
      refetch();
      handleClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update report status');
    }
  });

  const handleSubmit = () => {
    mutate({ reportId, status });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 1
        }}
      >
        <Box
          sx={{
            height: 40,
            width: 40,
            bgcolor: (theme) => alpha(theme.palette.warning.main, 0.2),
            borderRadius: '50px',
            color: (theme) => theme.palette.warning.main,
            mr: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <IoWarning size={24} />
        </Box>
        Update Report Status
      </DialogTitle>
      <DialogContent sx={{ pb: '16px !important' }}>
        <DialogContentText sx={{ mb: 2 }}>
          Select the new status for the report. This action will update the report status in the system.
        </DialogContentText>
        <FormControl fullWidth>
          <InputLabel id="status-select-label">Status</InputLabel>
          <Select
            labelId="status-select-label"
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value)}
            disabled={isLoading}
          >
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ pt: '8px !important' }}>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <LoadingButton variant="contained" color="primary" onClick={handleSubmit} loading={isLoading}>
          Submit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
