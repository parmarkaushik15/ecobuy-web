// react
import React from 'react';
import { useRouter } from 'next-nprogress-bar';
import PropTypes from 'prop-types';

// mui
import { IconButton, Stack, Badge } from '@mui/material';
import { IoMdHeartEmpty } from 'react-icons/io';
import { useSelector } from 'react-redux';

WishlistPopover.propTypes = {
  isAuth: PropTypes.bool.isRequired
};

// ----------------------------------------------------------------------
export default function WishlistPopover() {
  const router = useRouter();

  const { wishlist } = useSelector(({ wishlist }) => wishlist);
  const { isAuthenticated } = useSelector(({ user }) => user);

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        width="auto"
        sx={{ cursor: 'pointer' }}
        onClick={() => {
          if (!isAuthenticated) {
            router.push('/auth/login');
          } else {
            router.push('/profile/wishlist');
          }
        }}
        spacing={1}
      >
        <Badge badgeContent={wishlist?.length} color="primary">
          <IconButton
            name="wishlist"
            color="primary"
            disableRipple
            onClick={() => {
              if (!isAuthenticated) {
                router.push('/auth/login');
              } else {
                router.push('/profile/wishlist');
              }
            }}
          >
            <IoMdHeartEmpty />
          </IconButton>
        </Badge>
      </Stack>
    </>
  );
}
