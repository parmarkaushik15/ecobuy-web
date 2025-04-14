'use client';
import React from 'react';
import { useRouter } from 'next-nprogress-bar';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// components
import Image from 'src/components/blurImage';
// mui
import { Typography, Box, Stack, Card, Skeleton, CardActionArea, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';

export default function Brands() {
  const { push } = useRouter();
  const { data, isLoading } = useQuery(['get-brands-products'], () => api.getHomeBrands());

  // Custom navigation buttons
  const sliderRef = React.useRef(null);

  const NextArrow = ({ onClick }) => (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        top: '40%',
        transform: 'translateY(-50%)',
        right: '-20px', // Keep slightly outside the slider
        zIndex: 10,
        background: 'white',
        boxShadow: 3,
        width: 40,
        height: 40,
        '&:hover': { background: 'white' }
      }}
    >
      <ArrowForwardIos />
    </IconButton>
  );

  const PrevArrow = ({ onClick }) => (
    <IconButton
      onClick={onClick}
      sx={{
        position: 'absolute',
        top: '40%',
        transform: 'translateY(-50%)',
        left: '-20px', // Keep slightly outside the slider
        zIndex: 10,
        background: 'white',
        boxShadow: 3,
        width: 40,
        height: 40,
        '&:hover': { background: 'white' }
      }}
    >
      <ArrowBackIos />
    </IconButton>
  );

  // Slider settings
  const settings = {
    dots: false, // Hide pagination dots
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2
        }
      }
    ]
  };

  return (
    <Box
      sx={{
        my: 6,
        display: { md: 'block', xs: 'none' },
        position: 'relative',
        maxWidth: '90%',
        margin: '0 auto'
      }}
    >
      <Typography variant="h3" color="primary" textAlign="center">
        Brands
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        textAlign="center"
        sx={{
          textTransform: 'capitalize',
          mt: 1,
          mb: 5
        }}
      >
        Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting Industry.
      </Typography>

      {isLoading ? (
        <Skeleton variant="rounded" width={80} height={80} />
      ) : Boolean(data?.data.length) ? (
        <Box sx={{ position: 'relative' }}>
          <Slider ref={sliderRef} {...settings}>
            {data?.data.map((v) => (
              <Box key={v._id} sx={{ px: 1 }}>
                <Card
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '5px',
                    position: 'relative',
                    boxShadow: 'unset',
                    mb: 3,
                    img: {
                      borderRadius: '5px',
                      objectFit: 'contain'
                    }
                  }}
                >
                  <CardActionArea onClick={() => push(`/products?brand=${v.slug}`)} sx={{ p: 1, pr: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Image
                        src={process.env.IMAGE_BASE == 'LOCAL' ? `${process.env.IMAGE_URL}${v.logo.url}` : v.logo.url}
                        alt="logo"
                        width={70}
                        height={70}
                        draggable="false"
                        placeholder="blur"
                        objectFit="cover"
                        blurDataURL={v?.logo?.blurDataURL}
                      />
                      <Stack>
                        <Typography variant="subtitle1" color="text.primary" noWrap>
                          {v.name}
                        </Typography>
                        <Typography variant="body1" noWrap>
                          {v.totalProducts + ' ' + (v.totalProducts <= 1 ? 'Product' : 'Products')}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardActionArea>
                </Card>
              </Box>
            ))}
          </Slider>
        </Box>
      ) : (
        <Typography variant="h3" color="error.main" textAlign="center">
          Brands not found
        </Typography>
      )}
    </Box>
  );
}
