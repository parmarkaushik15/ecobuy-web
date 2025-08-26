'use client';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
// components
import Table from 'src/components/table/table';
import LastLoginRow from 'src/components/table/rows/lastLoginRow';
import { Dialog } from '@mui/material';
import BlockDialog from 'src/components/dialog/block';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';

const TABLE_HEAD = [
  { id: 'ip', label: 'IP', alignRight: false },
  { id: 'city', label: 'City', alignRight: false },
  { id: 'region', label: 'Region', alignRight: false },
  { id: 'country', label: 'Country', alignRight: false },
  { id: 'blocked', label: 'Blocked', alignRight: false },
  { id: '', label: 'Actions', alignRight: true }
];

export default function LastLogins() {
  const { user } = useSelector((state) => state.user);
  const [apicall, setApicall] = useState(false);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);

  const { data, isLoading } = useQuery(['user-fingerprints', apicall, user?._id], () => api.getFingerprint(user._id), {
    enabled: !!user?._id,
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong!')
  });

  const handleClickOpen = (userId, blocked) => () => {
    setId(userId); // Use userId instead of fingerprint ID
    setIsBlocked(blocked);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Wrap the data to match the expected shape for Table component
  const tableData = {
    data: data?.data || [],
    page: 1,
    totalPages: 1
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open} maxWidth={'xs'}>
        <BlockDialog
          onClose={handleClose}
          id={id}
          currentBlock={isBlocked}
          apicall={setApicall}
          type={isBlocked ? 'IP unblocked' : 'IP blocked'}
        />
      </Dialog>
      <Table
        headData={TABLE_HEAD}
        data={tableData}
        isLoading={isLoading}
        row={LastLoginRow}
        handleClickOpen={handleClickOpen}
      />
    </>
  );
}
