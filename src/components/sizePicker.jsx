import React, { useState } from 'react';
import PropTypes from 'prop-types';

// mui
import { Stack, Button, Zoom, Skeleton } from '@mui/material';

// icons
import { MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft } from 'react-icons/md';

SizePreview.propTypes = {
  sizes: PropTypes.array.isRequired,
  size: PropTypes.number.isRequired,
  setSize: PropTypes.func.isRequired,
  isDetail: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired
};

export default function SizePreview({ sizes, size, setSize, isDetail, loading }) {
  const [sizeCount, setSizeCount] = useState(0);

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        // Enable horizontal scrolling on mobile for detail view
        flexWrap: isDetail ? 'nowrap' : 'wrap',
        overflowX: isDetail ? 'auto' : 'visible',
        whiteSpace: 'nowrap', // Prevent wrapping in detail view
        scrollbarWidth: isDetail ? 'thin' : 'none', // Firefox
        '&::-webkit-scrollbar': isDetail ? { height: '8px' } : { display: 'none' }, // Chrome
        '&::-webkit-scrollbar-thumb': isDetail
          ? {
              backgroundColor: 'grey.400',
              borderRadius: '4px'
            }
          : {},
        button: {
          mr: 0.5,
          flexShrink: 0 // Prevent buttons from shrinking
        },
        // Ensure container doesn't overflow parent
        maxWidth: '100%',
        pb: isDetail ? 1 : 0 // Add padding for scrollbar visibility
      }}
    >
      {!isDetail && sizes?.length > 6 && (
        <Zoom in={sizeCount > 0}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => {
              if (sizeCount > 0) {
                setSizeCount(sizeCount - 1);
              }
            }}
            sx={{
              minHeight: 24,
              minWidth: 25,
              height: '24px !important',
              p: 0.2,
              color: 'text.primary !important',
              display: sizeCount === 0 && 'none',
              borderWidth: 0
            }}
            disabled={sizeCount === 0}
          >
            <MdKeyboardDoubleArrowLeft size={20} />
          </Button>
        </Zoom>
      )}

      {loading
        ? Array.from(new Array(4)).map((_, i) => (
            <Skeleton key={i} variant="rounded" width={25} height={24} sx={{ mr: 0.5 }} />
          ))
        : sizes?.slice(isDetail ? 0 : sizeCount * 6, isDetail ? sizes.length : 6 * (sizeCount + 1)).map((v, i) => (
            <Button
              key={v}
              size="small"
              variant={size === i ? 'contained' : 'outlined'}
              color={size === i ? 'primary' : 'inherit'}
              onClick={() => setSize(i)}
              sx={{
                minHeight: 24,
                minWidth: 25,
                height: '24px !important',
                px: 0.6,
                py: 0.2,
                borderWidth: 1,
                textTransform: 'uppercase',
                fontSize: size === i ? 14 : 12,
                borderWidth: 0
              }}
            >
              {v}
            </Button>
          ))}

      {!isDetail && sizes?.length > 6 && (
        <Zoom in={6 * (sizeCount + 1) < sizes?.length}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => {
              if (6 * (sizeCount + 1) < sizes?.length) {
                setSizeCount(sizeCount + 1);
              }
            }}
            sx={{
              minHeight: 24,
              minWidth: 25,
              borderWidth: 0,
              height: '24px !important',
              color: 'text.primary !important',
              p: 0.2
            }}
          >
            <MdKeyboardDoubleArrowRight size={20} />
          </Button>
        </Zoom>
      )}
    </Stack>
  );
}
