import React from 'react';
import PropTypes from 'prop-types';
import './index.css';
// mui
import { Grid } from '@mui/material';
// components
import MenuDesktopList from 'src/components/lists/menuDesktopList';
import MenuPopover from 'src/components/popover/popover';
import Image from 'next/image';

export default function MenuDesktop({ ...props }) {
  const { isOpen, onClose, isLoading, data, scrollPosition } = props;

  return (
    <MenuPopover
      open={isOpen}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={{
        top: scrollPosition > 100 ? 134 : 170,
        left: 0
      }}
      isDesktop
      // sx={{
      //   display: 'block!important'
      // }}
    >
      <Grid container spacing={3} className="grid-item">
        {data?.map((parent) => {
          return (
            <Grid item lg={2} key={Math.random()} className="flex-container">
              <Image
                className="categories-image"
                src={
                  process.env.IMAGE_BASE == 'LOCAL'
                    ? `${process.env.IMAGE_URL}${parent?.cover?.url}`
                    : parent?.cover?.url
                }
                alt="category cover"
                layout="fill"
                objectFit="cover"
              />
              <MenuDesktopList parent={parent} isLoading={isLoading} onClose={onClose} />
            </Grid>
          );
        })}
      </Grid>
    </MenuPopover>
  );
}
MenuDesktop.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.array,
  scrollPosition: PropTypes.number.isRequired
};
