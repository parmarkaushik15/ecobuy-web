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
  const [open, setOpen] = useState(false);
  const [id, setId] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [rows, setRows] = useState([]);

  const { isLoading } = useQuery(['user-fingerprints', user?._id], () => api.getFingerprint(user._id), {
    enabled: !!user?._id,
    onSuccess: (res) => setRows(res.data || []),
    onError: (err) => toast.error(err.response?.data?.message || 'Something went wrong!')
  });

  const handleClickOpen = (rowId, blocked) => () => {
    setId(rowId);
    setIsBlocked(blocked);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const handleUpdateRow = (rowId, newBlocked) => {
    setRows((prev) => prev.map((r) => (r._id === rowId ? { ...r, isBlock: newBlocked } : r)));
  };

  const tableData = { data: rows, page: 1, totalPages: 1 };

  return (
    <>
      <Dialog onClose={handleClose} open={open} maxWidth="xs">
        <BlockDialog onClose={handleClose} id={id} currentBlock={isBlocked} onUpdateRow={handleUpdateRow} />
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
