import React from 'react';
// redux
import { useDispatch, useSelector } from 'react-redux';
import { setThemeMode } from 'src/redux/slices/settings';

// icons
import { IoSunny } from 'react-icons/io5';
import { IoMoonOutline } from 'react-icons/io5';
// mui
import { IconButton } from '@mui/material';
export default function SettingMode({ isAdmin }) {
  const { themeMode } = useSelector(({ settings }) => settings);
  const dispatch = useDispatch();
  return (
    <IconButton
      name="setting-mode"
      onClick={() => dispatch(setThemeMode(themeMode === 'light' ? 'dark' : 'light'))}
      size="medium"
      color={isAdmin ? 'default' : 'primary'}
    >
      {themeMode === 'dark' ? <IoSunny size={16} /> : <IoMoonOutline size={16} />}
    </IconButton>
  );
}
