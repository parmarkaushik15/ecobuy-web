'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';
// MUI
import { Avatar, IconButton, Stack, Box } from '@mui/material';
import { MdSupervisorAccount } from 'react-icons/md';
// Components
import MenuPopover from 'src/components/popover/popover';
import { PATH_PAGE } from 'src/routes/paths';
import { UserList } from 'src/components/lists';
import BlurImageAvatar from 'src/components/avatar';
// Redux
import { useSelector } from 'react-redux';

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

export default function UserSelect({ isAdmin }) {
  const { user, isAuthenticated } = useSelector(({ user }) => user);
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPath = getKeyByValue(PATH_PAGE.auth, pathname);
  const isHomePath = pathname.slice(3) === '';
  const anchorRef = React.useRef(null);
  const [openUser, setOpen] = React.useState(false);

  const handleOpenUser = () => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else {
      setOpen(true);
    }
  };
  const handleCloseUser = () => {
    setOpen(false);
  };
  const handleClickOpen = () => {
    router.push(`/auth/login${isAuthPath || isHomePath ? '' : `?redirect=${pathname}`}`);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {!isAuthenticated && !isAdmin ? (
        <Stack direction="row" gap={1}>
          <IconButton aria-label="lang-curr-select" onClick={handleClickOpen} color="primary">
            <MdSupervisorAccount />
          </IconButton>
        </Stack>
      ) : (
        <>
          {!isAuthenticated || pathname.includes('admin') || pathname.includes('vendor') ? (
            <IconButton ref={anchorRef} onClick={handleOpenUser} size="small" name="user-select">
              {user?.cover?.url ? (
                <BlurImageAvatar
                  priority
                  alt={user.firstName}
                  src={
                    process.env.IMAGE_BASE === 'LOCAL'
                      ? `${process.env.IMAGE_URL}${user?.cover?.url}`
                      : user?.cover?.url
                  }
                  layout="fill"
                  objectFit="cover"
                />
              ) : !isAuthenticated ? (
                <Avatar src="/broken-image.jpg" />
              ) : (
                <Avatar size="small">{user?.firstName?.slice(0, 1)?.toUpperCase()}</Avatar>
              )}
            </IconButton>
          ) : (
            <IconButton ref={anchorRef} onClick={handleOpenUser} size="small" name="user-select">
              {user?.cover?.url ? (
                <BlurImageAvatar
                  priority
                  alt={user.firstName}
                  src={
                    process.env.IMAGE_BASE === 'LOCAL'
                      ? `${process.env.IMAGE_URL}${user?.cover?.url}`
                      : user?.cover?.url
                  }
                  layout="fill"
                  objectFit="cover"
                />
              ) : !isAuthenticated ? (
                <Avatar src="/broken-image.jpg" />
              ) : (
                <Avatar size="small">{user?.firstName?.slice(0, 1)?.toUpperCase()}</Avatar>
              )}
            </IconButton>
          )}
          <MenuPopover
            open={openUser}
            onClose={handleCloseUser}
            anchorEl={anchorRef.current}
            disableScrollLock // Prevent scroll lock to avoid layout shift
            sx={{
              width: 300
            }}
          >
            <UserList
              openUser={openUser}
              isAuthenticated={isAuthenticated}
              user={user}
              setOpen={() => setOpen(false)}
            />
          </MenuPopover>
        </>
      )}
    </Box>
  );
}
