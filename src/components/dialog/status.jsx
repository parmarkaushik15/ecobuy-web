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

StatusDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  status: PropTypes.string,
  refetch: PropTypes.func,
  endPoint: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  deleteMessage: PropTypes.string.isRequired
};

export default function StatusDialog({ onClose, id, status, refetch, endPoint, type, deleteMessage }) {
  const { isLoading, mutate } = useMutation(api[endPoint], {
    onSuccess: () => {
      toast.success(type); 
      refetch();
      onClose();
    },
    onError: (err) => {
      toast.error(err.response.data.message);
    }
  });
  const handleDelete = () => {
    mutate({
      slug:id,
      status
    });
  };
  return (
    <>
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
        Warning
      </DialogTitle>
      <DialogContent sx={{ pb: '16px !important' }}>
        <DialogContentText> 
          {deleteMessage}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ pt: '8px !important' }}>
        <Button onClick={onClose}> cancel </Button>
        <LoadingButton variant="contained" loading={isLoading} onClick={handleDelete} color="error">
          Submit
        </LoadingButton>
      </DialogActions>
    </>
  );
}
