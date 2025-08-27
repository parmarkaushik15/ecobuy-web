import React from 'react';
import PropTypes from 'prop-types';
// mui
import { TableRow, TableCell, Skeleton, IconButton } from '@mui/material';
// components
import Label from 'src/components/label';
// icons
import { IoShield } from 'react-icons/io5';

LastLoginRow.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  row: PropTypes.shape({
    _id: PropTypes.string,
    userId: PropTypes.string,
    ipGeolocation: PropTypes.shape({
      query: PropTypes.string,
      city: PropTypes.string,
      regionName: PropTypes.string,
      country: PropTypes.string
    }),
    isBlock: PropTypes.bool
  }),
  handleClickOpen: PropTypes.func.isRequired
};

export default function LastLoginRow({ isLoading, row, handleClickOpen }) {
  console.log('rowwwwwwwwwwww', row);
  if (isLoading || !row) {
    return (
      <TableRow hover>
        <TableCell>
          <Skeleton variant="text" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" />
        </TableCell>
        <TableCell align="right">
          <Skeleton variant="circular" width={34} height={34} />
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow hover key={row._id}>
      <TableCell>{row.ipGeolocation?.query || '-'}</TableCell>
      <TableCell>{row.ipGeolocation?.city || '-'}</TableCell>
      <TableCell>{row.ipGeolocation?.regionName || '-'}</TableCell>
      <TableCell>{row.ipGeolocation?.country || '-'}</TableCell>
      <TableCell>
        <Label color={row.isBlock ? 'error' : 'success'}>{row.isBlock ? 'Yes' : 'No'}</Label>
      </TableCell>
      <TableCell align="right">
        <IconButton onClick={handleClickOpen(row._id, row.isBlock)}>
          <IoShield />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
