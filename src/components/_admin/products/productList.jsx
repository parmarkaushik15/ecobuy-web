'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';

// mui
import { Dialog, Stack } from '@mui/material';
import DeleteDialog from 'src/components/dialog/delete';
// components
import Table from 'src/components/table/table';
import Product from 'src/components/table/rows/product';
import StatusDialog from 'src/components/dialog/status';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';

const TABLE_HEAD = [
  { id: 'name', label: 'Product', alignRight: false, sort: true },
  { id: 'createdAt', label: 'Date', alignRight: false, sort: true },
  { id: 'inventoryType', label: 'Status', alignRight: false, sort: false },
  { id: 'rating', label: 'Rating', alignRight: false, sort: true },
  { id: 'price', label: 'Price', alignRight: false, sort: true },
  { id: 'approvalStatus', label: 'Approval Status', alignRight: false, sort: true },
  { id: 'viewStatus', label: 'Status', alignRight: false, sort: true },
  { id: '', label: 'Actions', alignRight: true }
];
export default function AdminProducts({ isVendor }) {
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [apicall, setApicall] = useState(false);
  const [id, setId] = useState(null);
  const [statusOpen, setStatusOpen] = useState(false);

  const [status, setStatus] = useState('');

  const { data: categories } = useQuery('getAllCategories', api.getAllCategories);
  const { data: shops } = useQuery('getAllShops', api.getAllShopsByAdmin);
  const { data: brands } = useQuery('getAllBrandsByAdmin', api.getAllBrandsByAdmin);

  const { data, isLoading, refetch } = useQuery(
    ['admin-products', apicall, searchParams.toString()],
    () => api[isVendor ? 'getVendorProducts' : 'getProductsByAdmin'](searchParams.toString()),
    {
      onError: (err) => toast.error(err.response.data.message || 'Something went wrong!')
    }
  );

  const handleClickOpen = (prop, type) => {
    console.log('type=', type);
    setId(prop);
    if (type === 'delete') {
      setOpen(true);
    } else if (type === 'deactive' || type === 'active') {
      setStatus(type);
      setStatusOpen(true);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleStatusClose = () => {
    setStatusOpen(false);
  };

  return (
    <>
      <Dialog onClose={handleClose} open={open} maxWidth={'xs'}>
        <DeleteDialog
          onClose={handleClose}
          id={id}
          apicall={setApicall}
          endPoint={isVendor ? 'deleteVendorProduct' : 'deleteProductByAdmin'}
          type={'Product deleted'}
          deleteMessage={
            'Are you really sure you want to remove this product? Just making sure before we go ahead with it.'
          }
        />
      </Dialog>
      <Dialog onClose={handleStatusClose} open={statusOpen} maxWidth={'xs'}>
        <StatusDialog
          onClose={handleStatusClose}
          id={id}
          status={status}
          refetch={refetch}
          endPoint="statusVendorByAdmin"
          type={'Product status updatd'}
          deleteMessage={'Are you sure you want to update status?'}
        />
      </Dialog>
      <Table
        headData={TABLE_HEAD}
        data={data}
        isLoading={isLoading}
        row={Product}
        handleClickOpen={handleClickOpen}
        brands={isVendor ? [] : brands}
        categories={isVendor ? [] : categories}
        isVendor={isVendor}
        filters={
          isVendor
            ? [
                {
                  name: 'Category',
                  param: 'category',
                  data: categories
                },
                {
                  name: 'Brand',
                  param: 'brand',
                  data: brands
                }
              ]
            : [
                {
                  name: 'Shop',
                  param: 'shop',
                  data: shops
                },
                {
                  name: 'Category',
                  param: 'category',
                  data: categories
                },
                {
                  name: 'Brand',
                  param: 'brand',
                  data: brands
                }
              ]
        }
        isSearch
      />
    </>
  );
}
AdminProducts.propTypes = {
  brands: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  isVendor: PropTypes.boolean
};
