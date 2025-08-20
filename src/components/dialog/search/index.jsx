import * as React from 'react';
// Icons
import { IoSearch } from 'react-icons/io5';
// MUI
import { Dialog, Stack, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
// Components
import Search from './search';
import './index.css';

export default function SimpleDialogDemo() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Stack
        className="Search-field"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        onClick={handleClickOpen}
        sx={{
          p: 1,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 10,
          width: 300,
          height: 40,
          cursor: 'pointer'
        }}
      >
        <Typography variant="body1" color="text.secondary" ml={2}>
          Search...
        </Typography>
        <IconButton onClick={handleClickOpen} name="search" color="primary">
          <IoSearch />
        </IconButton>
      </Stack>

      <Dialog
        open={open}
        onClose={handleClose}
        disableScrollLock // Prevent MUI from locking scroll
      >
        <Search onClose={handleClose} />
      </Dialog>
    </>
  );
}
