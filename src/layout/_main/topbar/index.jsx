'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { useSelector } from 'react-redux';
import './index.css';

// mui
import { Toolbar, Container, Stack, useTheme, Link, Divider, Skeleton } from '@mui/material';

const LanguageSelect = dynamic(() => import('src/components/languageSelect'), {
  ssr: false,
  loading: () => <Skeleton variant="circular" width={16} height={16} />
});
const SettingMode = dynamic(() => import('src/components/settings/themeModeSetting'), {
  loading: () => <Skeleton variant="circular" width={16} height={16} />
});
const FacebookIcon = dynamic(() => import('src/components/Icons/FacebookIcon'), {
  loading: () => <Skeleton variant="circular" width={16} height={16} />
});
const TwitterIcon = dynamic(() => import('src/components/Icons/TwitterIcon'), {
  loading: () => <Skeleton variant="circular" width={16} height={16} />
});
const InstagramIcon = dynamic(() => import('src/components/Icons/InstagramIcon'), {
  loading: () => <Skeleton variant="circular" width={16} height={16} />
});

export default function UserTopbar() {
  const theme = useTheme();
  const { user, isAuthenticated } = useSelector(({ user }) => user);
  const { products: compareProducts } = useSelector(({ compare }) => compare);
  return (
    <Container maxWidth="xl">
      <Toolbar
        sx={{
          minHeight: `36px !important`,
          background: theme.palette.background.default,
          justifyContent: 'space-between',
          display: { xs: 'none', md: 'flex' },
          position: 'static',
          zIndex: 999,
          width: '100%',
          px: '0px!important'
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Link
            className="nav-items"
            component={NextLink}
            href={'/blogs'}
            sx={{ color: 'text.primary', fontSize: 14, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            Blogs
          </Link>
          <Link
            className="nav-items"
            component={NextLink}
            href={'/faq'}
            sx={{ color: 'text.primary', fontSize: 14, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            FAQ
          </Link>
          <Link
            className="nav-items"
            component={NextLink}
            href={'/contact'}
            sx={{ color: 'text.primary', fontSize: 14, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            Contact
          </Link>
          <Link
            className="nav-items"
            component={NextLink}
            href={'/track-order'}
            sx={{ color: 'text.primary', fontSize: 14, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            Track Order
          </Link>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <FacebookIcon />
          <InstagramIcon />
          <TwitterIcon />
          <Divider orientation="vertical" flexItem />
          <LanguageSelect />
          <SettingMode />
          <Divider orientation="vertical" flexItem />

          <>
            <Link component={NextLink} href="/compare" sx={{ color: 'text.primary', fontSize: 14 }}>
              Compare ({compareProducts?.length || 0})
            </Link>
          </>
          {isAuthenticated ? (
            user.role === 'user' && (
              <>
                <Divider orientation="vertical" flexItem />
                <Link
                  component={NextLink}
                  href={isAuthenticated ? '/create-shop' : '/auth/register?redirect=/create-shop'}
                  sx={{ color: 'text.primary', fontSize: 14 }}
                >
                  Become a seller
                </Link>
              </>
            )
          ) : (
            <>
              <Divider orientation="vertical" flexItem />
              <Link
                component={NextLink}
                href={isAuthenticated ? '/create-shop' : '/auth/register?redirect=/create-shop'}
                sx={{ color: 'text.primary', fontSize: 14 }}
              >
                Become a seller
              </Link>
            </>
          )}
        </Stack>
      </Toolbar>
    </Container>
  );
}
