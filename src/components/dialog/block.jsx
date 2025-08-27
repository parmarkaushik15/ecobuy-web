import React from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
// mui
import { DialogTitle, DialogContent, DialogContentText, DialogActions, Button, alpha, Box } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// icons
import { IoWarning } from 'react-icons/io5';
// api
import * as api from 'src/services';
import { useMutation } from 'react-query';

BlockDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  currentBlock: PropTypes.bool.isRequired,
  onUpdateRow: PropTypes.func.isRequired
};

export default function BlockDialog({ onClose, id, currentBlock, onUpdateRow }) {
  const endPoint = currentBlock ? 'unblockFingerprint' : 'blockFingerprint';

  const { isLoading, mutate } = useMutation(() => api[endPoint](id), {
    onMutate: async () => {
      onUpdateRow(id, !currentBlock);
    },
    onSuccess: () => {
      toast.success(currentBlock ? 'IP unblocked' : 'IP blocked');
      onClose();
    },
    onError: (err) => {
      onUpdateRow(id, currentBlock);
      toast.error(err.response?.data?.message || 'Something went wrong!');
    }
  });

  const handleToggle = () => mutate();

  const actionText = currentBlock ? 'Unblock' : 'Block';
  const color = currentBlock ? 'success' : 'error';
  const message = `Are you sure you want to ${actionText.toLowerCase()} this IP?`;

  return (
    <>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
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
        Warning
      </DialogTitle>
      <DialogContent sx={{ pb: '16px !important' }}>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ pt: '8px !important' }}>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton variant="contained" loading={isLoading} onClick={handleToggle} color={color}>
          {actionText}
        </LoadingButton>
      </DialogActions>
    </>
  );
}
