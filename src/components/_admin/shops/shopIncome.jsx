'use client';
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';
import { format } from 'date-fns';

// api
import * as api from 'src/services';
import { useQuery, useQueryClient } from 'react-query';

// mui
import { Button, Grid, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';

// components
import Table from 'src/components/table/table';
import IncomeList from 'src/components/table/rows/income';
import ReportStatusDialog from 'src/components/dialog/ReportStatusDialog';

// utils
import { fDateShort } from 'src/utils/formatTime';
import { fCurrency } from 'src/utils/formatNumber';

const TABLE_HEAD = [
  { id: 'items', label: 'Sale', alignRight: false, sort: true },
  { id: 'total', label: 'Total', alignRight: false, sort: true },
  { id: 'earning', label: 'Total Income', alignRight: false, sort: true },
  { id: 'commission', label: 'Commission', alignRight: false, sort: true },
  { id: 'status', label: 'Report Status', alignRight: false, sort: true },
  { id: 'paymentStatus', label: 'Payment Status', alignRight: false, sort: true },
  { id: 'createdAt', label: 'Created', alignRight: false },
  { id: '', label: 'Actions', alignRight: true }
];

ShopIcomeList.propTypes = {
  vendorId: PropTypes.string.isRequired,
  isVendor: PropTypes.bool
};

export default function ShopIcomeList({ vendorId, isVendor }) {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page') || 1;
  const [activeTab, setActiveTab] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [dialogData, setDialogData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const queryClient = useQueryClient();

  // Fetch monthly report data
  const { data: monthlyData, isLoading: monthlyLoading } = useQuery(
    ['monthly-report', vendorId, selectedMonth],
    () => api.getMonthlyReport({ vendorId, month: selectedMonth }),
    {
      enabled: !!vendorId,
      onError: (err) => toast.error(err.response?.data?.message || 'Failed to fetch monthly report')
    }
  );

  // Fetch yearly report data
  const { data: yearlyData, isLoading: yearlyLoading } = useQuery(
    ['yearly-report', vendorId, pageParam],
    () => api.getYearlyReport({ vendorId, page: pageParam }),
    {
      enabled: !!vendorId && activeTab === 'yearly',
      onError: (err) => toast.error(err.response?.data?.message || 'Failed to fetch yearly report')
    }
  );

  // Extract available months and years
  const availableMonths = useMemo(() => {
    const months = new Set();
    (monthlyData || []).forEach((item) => {
      const date = new Date(item.month);
      const monthStr = format(date, 'yyyy-MM');
      months.add(monthStr);
    });
    return Array.from(months).sort();
  }, [monthlyData]);

  const availableYears = useMemo(() => {
    const years = new Set();
    (yearlyData?.data || []).forEach((item) => {
      const date = new Date(item.month);
      years.add(date.getFullYear().toString());
    });
    return Array.from(years).sort();
  }, [yearlyData]);

  // Filter table data based on selection
  const filteredData = useMemo(() => {
    let data = activeTab === 'monthly' ? monthlyData || [] : yearlyData?.data || [];
    if (activeTab === 'monthly' && selectedMonth) {
      data = data.filter((item) => format(new Date(item.month), 'yyyy-MM') === selectedMonth);
    }
    if (activeTab === 'yearly' && selectedYear) {
      data = data.filter((item) => new Date(item.month).getFullYear().toString() === selectedYear);
    }
    return {
      data: data.map((item) => ({
        ...item,
        orders: { length: item.totalOrders },
        total: item.totalAmount,
        totalIncome: item.totalAmount,
        totalCommission: item.commissionAmount,
        date: item.month
      })),
      page: activeTab === 'yearly' ? yearlyData?.page || 1 : 1,
      totalPages: activeTab === 'yearly' ? yearlyData?.totalPages || 1 : 1
    };
  }, [monthlyData, yearlyData, activeTab, selectedMonth, selectedYear]);

  // CSV download function
  const downloadCSV = async () => {
    setIsDownloading(true);
    try {
      let data;
      let filename;
      if (activeTab === 'monthly') {
        const month = selectedMonth || format(new Date(), 'yyyy-MM');
        data = await api.getMonthlyReport({ vendorId, month });
        filename = `report_monthly_${month}.csv`;
      } else {
        data = (await api.getYearlyReport({ vendorId, page: 1, limit: 10 }))?.data || [];
        filename = `report_yearly_${selectedYear || new Date().getFullYear()}.csv`;
      }

      const csvRows = [];
      const headers = [
        'Shop Title',
        'Total Orders',
        'Total Amount',
        'Commission %',
        'Commission Amount',
        'Report Status',
        'Payment Status',
        'Month',
        'Created At',
        'Updated At'
      ];
      csvRows.push(headers.join(','));

      data.forEach((item) => {
        const row = [
          `"${item.shopTitle}"`,
          item.totalOrders,
          fCurrency(item.totalAmount),
          item.commissionPer,
          fCurrency(item.commissionAmount),
          item.status,
          item.paymentStatus,
          format(new Date(item.month), 'yyyy-MM'),
          fDateShort(item.createdAt),
          fDateShort(item.updatedAt)
        ];
        csvRows.push(row.join(','));
      });

      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('href', url);
      a.setAttribute('download', filename);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to download report');
    } finally {
      setIsDownloading(false);
    }
  };

  // Refetch both monthly and yearly data
  const refetchData = () => {
    queryClient.invalidateQueries(['monthly-report', vendorId, selectedMonth]);
    queryClient.invalidateQueries(['yearly-report', vendorId, pageParam]);
  };

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" color="text.primary" my={2}>
          Income Report
        </Typography>

        <Grid item xs={12} md={6}>
          <Grid container spacing={1} alignItems="center" justifyContent="flex-end">
            <Grid item>
              <Typography variant="body2" color="text.secondary" my={2}>
                Download Reports
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant={activeTab === 'monthly' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => setActiveTab('monthly')}
              >
                Monthly
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant={activeTab === 'yearly' ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => setActiveTab('yearly')}
              >
                Yearly
              </Button>
            </Grid>
            <Grid item>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="month-select-label">{activeTab === 'monthly' ? 'Month' : 'Year'}</InputLabel>
                <Select
                  labelId="month-select-label"
                  value={activeTab === 'monthly' ? selectedMonth : selectedYear}
                  label={activeTab === 'monthly' ? 'Month' : 'Year'}
                  onChange={(e) =>
                    activeTab === 'monthly' ? setSelectedMonth(e.target.value) : setSelectedYear(e.target.value)
                  }
                  disabled={monthlyLoading || yearlyLoading}
                >
                  <MenuItem value="">All</MenuItem>
                  {(activeTab === 'monthly' ? availableMonths : availableYears).map((option) => (
                    <MenuItem key={option} value={option}>
                      {activeTab === 'monthly' ? format(new Date(`${option}-01`), 'MMMM yyyy') : option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <LoadingButton
                variant="contained"
                color="primary"
                onClick={downloadCSV}
                loading={isDownloading}
                disabled={
                  monthlyLoading ||
                  yearlyLoading ||
                  (!selectedMonth && activeTab === 'monthly' && !selectedYear && activeTab === 'yearly')
                }
              >
                Download
              </LoadingButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Table
        headData={TABLE_HEAD}
        data={filteredData}
        isLoading={monthlyLoading || yearlyLoading}
        row={IncomeList}
        handleClickOpen={(v) => setDialogData({ reportId: v._id, status: v.status })}
        isVendor={isVendor}
      />

      <ReportStatusDialog
        open={Boolean(dialogData)}
        handleClose={() => setDialogData(null)}
        reportId={dialogData?.reportId || ''}
        currentStatus={dialogData?.status || ''}
        refetch={refetchData}
      />
    </>
  );
}
