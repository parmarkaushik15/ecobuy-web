'use client';
import PropTypes from 'prop-types';
import Link from 'next/link';
import React, { useCallback, useState } from 'react';
// MUI
import { Typography, CardActionArea, Card, Box, Skeleton, Stack, Menu } from '@mui/material';
import { styled } from '@mui/material/styles';
// Icons
import { FaAngleDown } from 'react-icons/fa6'; // For dropdown arrow
// Components
import Image from 'src/components/blurImage';
import MenuDesktopList from 'src/components/lists/menuDesktopList'; // Reuse for subcategories
// API
import { useQuery } from 'react-query';
import * as api from 'src/services';

// Styled Menu for professional look
const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 4,
    marginTop: theme.spacing(1),
    minWidth: 200,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    '& .MuiMenu-list': {
      padding: '4px 0'
    }
  }
}));

export default function CategoriesCard({ ...props }) {
  const { category, isLoading } = props;
  const baseUrl = '/products/';
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const anchorRef = React.useRef(null);
  let hoverTimeout = null;

  // Fetch all categories with subcategories
  const { data: allCategories, isLoading: isCategoriesLoading } = useQuery(
    ['get-categories-all'],
    () => api.getAllCategories(),
    {
      select: (data) => data?.data
    }
  );

  // Find the current category in the allCategories data to get subcategories
  const categoryWithSub = allCategories?.find((cat) => cat.slug === category?.slug) || category;

  // Debounced open handler to prevent flickering
  const handleOpen = useCallback(
    (event) => {
      if (categoryWithSub?.subCategories?.length > 0 && !isLoading && !isCategoriesLoading) {
        clearTimeout(hoverTimeout);
        setAnchorEl(event.currentTarget);
        hoverTimeout = setTimeout(() => {
          setOpen(true);
        }, 150); // Slight delay for smooth hover
      }
    },
    [categoryWithSub?.subCategories?.length, isLoading, isCategoriesLoading]
  );

  // Debounced close handler
  const handleClose = useCallback(() => {
    clearTimeout(hoverTimeout);
    hoverTimeout = setTimeout(() => {
      setOpen(false);
      setAnchorEl(null);
    }, 200); // Delay to allow moving to dropdown
  }, []);

  return (
    <Stack
      spacing={1}
      alignItems="center"
      ref={anchorRef}
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      sx={{ position: 'relative' }}
    >
      <Card
        sx={{
          borderRadius: '20%',
          borderWidth: '2px !important',
          transform: 'scale(1.0)',
          transition: 'all 0.2s ease-in-out',
          width: { xs: 45, md: 87.5 },
          height: { xs: 45, md: 87.5 },
          border: isLoading && 'none !important',
          boxShadow: 'unset',
          '&:hover': {
            color: '#000',
            borderColor: (theme) => theme.palette.primary.main + '!important',
            transform: 'scale(1.05)'
          },
          '& .image-wrapper': {
            position: 'relative',
            width: '100%',
            img: {
              borderRadius: '20%'
            },
            '&:after': {
              content: `""`,
              display: 'block',
              paddingBottom: '100%'
            }
          }
        }}
      >
        {isLoading ? (
          <Skeleton
            variant="circular"
            sx={{
              position: 'absolute',
              height: '100%',
              width: '100%'
            }}
          />
        ) : (
          <CardActionArea
            className="card-action-area"
            component={Link}
            href={{
              pathname: `${baseUrl}${category?.slug}`
            }}
          >
            <Box p={0.4} sx={{ bgcolor: (theme) => theme.palette.background.default }}>
              <Box className="image-wrapper">
                <Image
                  alt="category"
                  src={
                    process.env.IMAGE_BASE === 'LOCAL'
                      ? `${process.env.IMAGE_URL}${category?.cover?.url}`
                      : category?.cover?.url
                  }
                  layout="fill"
                  objectFit="cover"
                  static
                  draggable="false"
                  quality={5}
                  sizes={'50vw'}
                />
              </Box>
            </Box>
          </CardActionArea>
        )}
      </Card>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography
          {...(!isLoading && {
            component: Link,
            href: baseUrl + category.slug
          })}
          color="text.primary"
          variant="h6"
          textAlign="center"
          noWrap
          className="title"
          sx={{ py: 0.5, textTransform: 'capitalize', position: 'relative' }}
        >
          {isLoading ? <Skeleton variant="text" width={100} /> : category?.name}
        </Typography>
        {categoryWithSub?.subCategories?.length > 0 && (
          <FaAngleDown
            size={14}
            className="arrow-icon"
            style={{
              marginLeft: 4,
              transition: 'transform 0.2s ease-in-out',
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          />
        )}
      </Box>
      {categoryWithSub?.subCategories?.length > 0 && (
        <StyledMenu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          disableScrollLock
          MenuListProps={{
            onMouseEnter: () => clearTimeout(hoverTimeout), // Keep open when hovering over menu
            onMouseLeave: handleClose // Close when leaving menu
          }}
        >
          <MenuDesktopList parent={categoryWithSub} isLoading={isCategoriesLoading} onClose={handleClose} />
        </StyledMenu>
      )}
    </Stack>
  );
}

CategoriesCard.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  category: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    cover: PropTypes.shape({
      url: PropTypes.string.isRequired,
      blurDataURL: PropTypes.string.isRequired
    }),
    name: PropTypes.string.isRequired,
    subCategories: PropTypes.array
  }).isRequired
};
