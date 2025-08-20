'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import NextLink from 'next/link';
import { useRouter } from 'next-nprogress-bar';
import { FaBlog, FaQuestionCircle, FaPhoneAlt, FaStore } from 'react-icons/fa';
import { IoIosGitCompare } from 'react-icons/io';
import { MdOutlineLocalShipping } from 'react-icons/md';

// MUI Imports
import { alpha, useMediaQuery } from '@mui/material';
import {
  AppBar,
  Container,
  Divider,
  IconButton,
  Link,
  Menu,
  MenuItem,
  ListItemIcon,
  Skeleton,
  Stack,
  Toolbar,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

// API
import * as api from 'src/services';

// Components
import Logo from 'src/components/logo';

// Dynamic Imports
const FacebookIcon = dynamic(() => import('src/components/Icons/FacebookIcon'), {
  loading: () => <Skeleton variant="circular" width={16} height={16} />
});
const TwitterIcon = dynamic(() => import('src/components/Icons/TwitterIcon'), {
  loading: () => <Skeleton variant="circular" width={16} height={16} />
});
const InstagramIcon = dynamic(() => import('src/components/Icons/InstagramIcon'), {
  loading: () => <Skeleton variant="circular" width={16} height={16} />
});
const MobileBar = dynamic(() => import('src/layout/_main/mobileBar'));
const UserSelect = dynamic(() => import('src/components/select/userSelect'), {
  ssr: false,
  loading: () => <Skeleton variant="circular" width={40} height={40} />
});
const WishlistPopover = dynamic(() => import('src/components/popover/wislist'), {
  loading: () => <Skeleton variant="circular" width={40} height={40} />
});
const CartWidget = dynamic(() => import('src/components/cartWidget'), {
  loading: () => <Skeleton variant="circular" width={40} height={40} />
});
const Search = dynamic(() => import('src/components/dialog/search'), {
  ssr: false,
  loading: () => <Skeleton variant="rounded" width={300} height={40} />
});
const LanguageSelect = dynamic(() => import('src/components/languageSelect'), {
  ssr: false,
  loading: () => <Skeleton variant="circular" width={16} height={16} />
});
const SettingMode = dynamic(() => import('src/components/settings/themeModeSetting'), {
  loading: () => <Skeleton variant="circular" width={16} height={16} />
});

// Styled Menu
const RootStyled = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '10px',
    marginTop: theme.spacing(1),
    minWidth: 200,
    color: theme.palette.text.primary,
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '8px 0'
    },
    '& .MuiMenuItem-root': {
      padding: theme.spacing(1, 2),
      '&:hover': {
        backgroundColor: theme.palette.action.hover
      },
      '& .MuiListItemIcon-root': {
        minWidth: 30,
        color: theme.palette.text.secondary
      }
    }
  }
}));

export default function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { checkout } = useSelector((state) => state.product);
  const { products: compareProducts } = useSelector((state) => state.compare);
  const isMobile = useMediaQuery('(max-width:768px)');
  const router = useRouter();

  const [setting, setSetting] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    getSettingDetail();
  }, []);

  const getSettingDetail = async () => {
    try {
      const response = await api.getSetting();
      if (response.data.length !== 0) {
        setSetting(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleMenuItemClick = (path) => {
    router.push(path);
    handleMenuClose();
  };

  const sellerLink = isAuthenticated ? '/create-shop' : '/auth/register?redirect=/create-shop';

  return (
    <>
      <AppBar
        sx={{
          boxShadow: 'none',
          position: 'sticky',
          top: 0,
          zIndex: 999,
          bgcolor: (theme) => alpha(theme.palette.background.paper, 1),
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          display: { md: 'block', xs: 'none' },
          borderRadius: '0px',
          width: '100%'
        }}
      >
        <Container
          maxWidth="xl"
          sx={{
            position: 'relative', // Stabilize container
            width: '100%',
            mx: 'auto', // Center it properly
            '& .toolbar': {
              backdropFilter: 'blur(6px)',
              borderRadius: '0px',
              bgcolor: (theme) => alpha(theme.palette.background.paper, 1),
              px: 3,
              py: 1.5,
              width: '100%',
              minWidth: 0,
              height: '10px'
            }
          }}
        >
          <Toolbar
            disableGutters
            className="toolbar"
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexShrink: 0
            }}
          >
            <Stack direction="row" alignItems="center" spacing={3} sx={{ flexShrink: 0, minWidth: 0 }}>
              <Logo logo={setting?.logo?.url} />
              <Search />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={3} sx={{ flexShrink: 0, minWidth: 0 }}>
              <UserSelect />
              <Divider orientation="vertical" flexItem />
              <WishlistPopover />
              <CartWidget checkout={checkout} />
              <Divider orientation="vertical" flexItem />
              <Link
                component={NextLink}
                href={sellerLink}
                sx={{ color: 'text.primary', fontSize: 14, whiteSpace: 'nowrap' }}
              >
                Become a seller
              </Link>
              <Divider orientation="vertical" flexItem />
              <IconButton onClick={handleMenuOpen} size="small">
                <MoreVertIcon />
              </IconButton>
            </Stack>
          </Toolbar>

          <RootStyled
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            disableScrollLock // Prevents layout shift
          >
            <MenuItem onClick={() => handleMenuItemClick('/blogs')}>
              <ListItemIcon>
                <FaBlog size={18} />
              </ListItemIcon>
              <Typography variant="body2">Blogs</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('/faq')}>
              <ListItemIcon>
                <FaQuestionCircle size={18} />
              </ListItemIcon>
              <Typography variant="body2">FAQ</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('/contact')}>
              <ListItemIcon>
                <FaPhoneAlt size={18} />
              </ListItemIcon>
              <Typography variant="body2">Contact</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('/track-order')}>
              <ListItemIcon>
                <MdOutlineLocalShipping size={20} />
              </ListItemIcon>
              <Typography variant="body2">Track Order</Typography>
            </MenuItem>
            <Divider />
            <MenuItem>
              <Stack direction="row" spacing={1}>
                <LanguageSelect />
                <SettingMode />
                <FacebookIcon />
                <InstagramIcon />
                <TwitterIcon />
              </Stack>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => handleMenuItemClick('/compare')}>
              <ListItemIcon>
                <IoIosGitCompare size={18} />
              </ListItemIcon>
              <Typography variant="body2">Compare ({compareProducts?.length || 0})</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick(sellerLink)}>
              <ListItemIcon>
                <FaStore size={18} />
              </ListItemIcon>
              <Typography variant="body2">Become a seller</Typography>
            </MenuItem>
          </RootStyled>
        </Container>
      </AppBar>
      {isMobile && <MobileBar />}
    </>
  );
}
