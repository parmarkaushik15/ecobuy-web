import React from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
// mui
import {
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  Typography,
  TextField,
  Stack
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useMutation } from 'react-query';
import * as api from 'src/services';
import { IoInformationCircleOutline, IoWarning } from 'react-icons/io5';
import { IoIosWarning } from 'react-icons/io';

StockDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  refetch: PropTypes.func,
  endPoint: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  deleteMessage: PropTypes.string,
  row: PropTypes.shape({
    available: PropTypes.number,
    slug: PropTypes.string.isRequired
  }).isRequired
};

export default function StockDialog({ onClose, id, refetch, endPoint, type, row }) {
  console.log('row===', row);
  const [newStock, setNewStock] = React.useState('0');
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

  const handleSubmit = () => {
    mutate({
      slug: id,
      qty: Number(newStock)
    });
  };

  return (
    <>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant="h5" component="div" sx={{ display: 'flex' }}>
          <IoIosWarning size={30} style={{ marginRight: '8px' }} /> {/* Increased icon size */}
          Stock Update
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="body1" color="text.secondary">
              Current Stock:
            </Typography>
            <Typography variant="h6" color="text.primary">
              {row?.available}
              {console.log('Row Dilog', row)}
              {console.log('Row av', row?.available)}
              {console.log('Row type', row?.type)}
            </Typography>
          </Box>

          <Box>
            <TextField
              fullWidth
              label="Enter New Stock"
              type="number"
              variant="outlined"
              value={newStock}
              onChange={(e) => setNewStock(e.target.value)}
              inputProps={{ min: 0 }}
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} variant="outlined" sx={{ minWidth: 100 }}>
          Cancel
        </Button>
        <LoadingButton variant="contained" loading={isLoading} onClick={handleSubmit} sx={{ minWidth: 100 }}>
          Update
        </LoadingButton>
      </DialogActions>
    </>
  );
}
