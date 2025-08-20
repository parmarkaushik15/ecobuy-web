'use client';
import React from 'react';
import { Popover, Typography, Stack, Link as MuiLink } from '@mui/material';
import NextLink from 'next/link';

export default function MenuDesktopPopover({ isOpen, onClose, anchorEl, data, isLoading }) {
  return (
    <Popover
      open={isOpen}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{
        '& .MuiPaper-root': {
          mt: 1,
          p: 1,
          bgcolor: '#fff',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          minWidth: 200
        }
      }}
    >
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : data?.length > 0 ? (
        <Stack spacing={0.5}>
          {data.map((subCategory) => (
            <MuiLink
              key={subCategory.slug}
              component={NextLink}
              href={`/products/${subCategory.slug}`}
              sx={{
                color: 'text.primary',
                textDecoration: 'none',
                padding: '4px 8px',
                '&:hover': { color: '#2874f0', backgroundColor: '#f5f5f5' }
              }}
            >
              <Typography variant="body2">{subCategory.name}</Typography>
            </MuiLink>
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" sx={{ p: 1 }}>
          No subcategories available
        </Typography>
      )}
    </Popover>
  );
}
