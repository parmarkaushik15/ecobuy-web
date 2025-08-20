'use client';
import React, { useEffect } from 'react';

// mui
import { useTheme } from '@mui/material';

// components
import ShopDetailCover from 'src/components/_admin/shops/shopDetailCover';
import ShopDetail from 'src/components/_admin/shops/shopDetail';
import ShopIcomeList from 'src/components/_admin/shops/shopIncome';

// icons
import { FaGifts } from 'react-icons/fa6';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { TbChartArrowsVertical } from 'react-icons/tb';
import { FaWallet } from 'react-icons/fa6';

// api
import * as api from 'src/services';
import { useQuery } from 'react-query';
import Head from 'next/head';

export default function Page() {
  const theme = useTheme();
  const pageTitle = 'Shops-Vendor | Perfumeswale';
  const vendorId = JSON.parse(JSON.parse(localStorage.getItem('redux-user')).user)?._id;

  useEffect(() => {
    document.title = pageTitle;
  }, []);

  // const { data, isLoading } = useQuery(['shop-by-vendor'], () => api.getShopDetailsByVendor());
  const { data, isLoading } = useQuery(['shop-by-vendor', vendorId], () => api.getAllVendorDetails({ vendorId }));

  const dataMain = [
    {
      name: 'Total Income',
      items: data?.data?.overallData?.totalEarnings,
      color: theme.palette.error.main,
      icon: <FaWallet size={30} />
    },
    {
      name: 'Total Commission',
      items: data?.data?.overallData?.totalCommission,
      color: theme.palette.success.main,
      icon: <TbChartArrowsVertical size={30} />
    },
    {
      name: 'Total Orders',
      items: data?.data?.overallData?.totalOrders,
      color: theme.palette.secondary.main,
      icon: <HiOutlineClipboardList size={30} />
    },
    {
      name: 'Total Products',
      items: data?.data?.overallData?.totalProducts,
      color: theme.palette.primary.main,
      icon: <FaGifts size={30} />
    }
  ];
  console.log('dataMain', data);
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <div>
        <ShopDetailCover data={data?.data?.shop} isLoading={isLoading} />
        <ShopDetail data={dataMain} isLoading={isLoading} />
        {console.log('vendorId:', vendorId)}
        <ShopIcomeList vendorId={vendorId} isVendor onUpdatePayment={() => console.log('clicked')} count={0} />
      </div>
    </>
  );
}
