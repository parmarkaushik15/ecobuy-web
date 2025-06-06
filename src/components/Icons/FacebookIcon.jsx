import React from 'react';
// redux

// icons
import { IoLogoFacebook } from 'react-icons/io5';

// mui
import { IconButton } from '@mui/material';
export default function facebookIcon({ isAdmin }) {
  return (
    <IconButton name="setting-mode" size="medium" color={isAdmin ? 'default' : 'primary'}>
      <IoLogoFacebook size={16} />
    </IconButton>
  );
}
