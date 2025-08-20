'use client';
import React from 'react';
// material ui
import { Container } from '@mui/material';
// images

import AdidasImage from '../../../../public/images/Adidas-transparent001.png';
import NikeImage from '../../../../public/images/Nike-transparent001.png';
import AppleImage from '../../../../public/images/Apple-transparent002.png';

// components
import './About.css';

const Data = [
  {
    image: AppleImage,
    alt: 'apple-icon'
  },
  {
    image: AdidasImage,
    alt: 'adidas-icon'
  },
  {
    image: NikeImage,
    alt: 'nike-icon'
  }
];

export default function Index({ data }) {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <div dangerouslySetInnerHTML={{ __html: data?.data?.content }} />
    </Container>
  );
}
