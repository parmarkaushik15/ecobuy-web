'use client';
import React from 'react';
// material ui
import { Box, Grid, Stack, Typography, useTheme, alpha } from '@mui/material';
import Image from 'next/image';
// images

import AdidasImage from '../../../../public/images/Adidas-transparent001.png';
import NikeImage from '../../../../public/images/Nike-transparent001.png';
import AppleImage from '../../../../public/images/Apple-transparent002.png';

// components
import bgImage from '../../../../public/images/about-banner-image.jpg';
import team from '../../../../public/images/about-banner-image.jpg';
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

export default function Index() {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          mt: 3,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          py: 6,
          height: '700px'
          // display: { xs: 'none', md: 'block' }
        }}
      >
        <Image priority src={bgImage} alt="centered-banner" layout="fill" objectFit="cover" static draggable="false" />
      </Box>
      {/* <Box sx={{ my: 8 }}>
        <Grid container spacing={3} mt={{ md: 0.1, xs: 0 }}>
          <Grid item md={6} xs={12}>
            <Stack direction="row" spacing={3} mt={5}>
              <Box sx={{ position: 'relative', width: '100%', height: 418, borderRadius: 4, overflow: 'hidden' }}>
                <Image src={AboutImage} alt="" fill placeholder="blur" objectFit="cover" />
              </Box>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 418,
                  borderRadius: 4,
                  overflow: 'hidden',
                  transform: 'translateY(-40px)'
                }}
              >
                <Image src={AboutImage2} alt="" fill placeholder="blur" objectFit="cover" />
              </Box>
            </Stack>
          </Grid>*/}
      <Grid item md={6} xs={12} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* <Typography variant="h6" fontSize="16px" textTransform="uppercase" color="primary">
          Who We Are?
        </Typography>
        <Typography variant="h2" fontWeight={800}>
          Eco Buy: Blending Sustainability with Style, Offering Sustainable Shopping and Hassle-Free Eco-Conscious
          Choices.
        </Typography>
        <Typography variant="body1" fontWeight={400} color="text.secondary" mt={2}>
          Welcome to Eco Buy, where sustainability meets style! Our mission is to provide you with eco-conscious
          products that not only enhance your lifestyle but also contribute positively to our planet. At Eco Buy, we
          believe in making sustainable shopping accessible and hassle-free, empowering you to make choices that align
          with your values.
        </Typography> */}
        <Typography variant="h6" fontSize="16px" textTransform="uppercase" color="primary" mt={2}>
          Our Story
        </Typography>
        <Typography variant="body1" fontWeight={400} color="text.secondary" mt={2}>
          Eco Buy was founded with a simple yet powerful idea: to create a marketplace that offers a curated selection
          of high-quality, sustainable products. We understand the challenges of finding eco-friendly options that are
          both functional and fashionable. That's why we are committed to sourcing products that are not only kind to
          the environment but also meet the highest standards of quality and design.
        </Typography>
        <Typography variant="h6" fontSize="16px" textTransform="uppercase" color="primary" mt={2}>
          Our Mission
        </Typography>
        <Typography variant="body1" fontWeight={400} color="text.secondary" mt={2}>
          Sustainability is at the heart of everything we do. We carefully select our products based on their
          environmental impact, ensuring that they are made from sustainable materials, ethically produced, and designed
          to last. Our goal is to reduce waste and promote a circular economy, encouraging a lifestyle that is both
          stylish and sustainable.
        </Typography>
        <Typography variant="h6" fontSize="16px" textTransform="uppercase" color="primary" mt={2}>
          OUR VISION
        </Typography>
        <Typography variant="body1" fontWeight={400} color="text.secondary" mt={2}>
          Eco Buy offers a wide range of products, from everyday essentials to unique items that add a touch of elegance
          to your home and wardrobe. Whether you're looking for eco-friendly household goods, stylish apparel, or
          innovative gadgets, we've got you covered. Our collection is constantly evolving, reflecting the latest in
          sustainable innovations and trends.
        </Typography>
        <Grid container spacing={3} mt={3}>
          <Grid item md={6} xs={12}>
            <Box sx={{ position: 'relative', width: 400, height: 400, marginLeft: '-25px', marginTop: '20px' }}>
              <Image
                className="company-image"
                src={team}
                alt="Company Image"
                layout="responsive"
                width={400}
                height={400}
              />
            </Box>
          </Grid>
          <Grid item md={6} xs={12}>
            <Typography variant="h6" fontSize="16px" textTransform="uppercase" color="primary" mt={2}>
              The Company
            </Typography>
            <Typography variant="body1" fontWeight={400} color="text.secondary" mt={2}>
              Eco-Conscious Choices: Our products are selected with the planet in mind, ensuring that you can shop with
              confidence. Quality and Style: We believe that sustainability doesn't mean sacrificing style. Our products
              are designed to be both beautiful and functional. Hassle-Free Shopping: Enjoy a seamless shopping
              experience with detailed product information, easy navigation, and customer support dedicated to helping
              you find the perfect eco-friendly options. Join us in our journey towards a more sustainable future. At
              Eco Buy, we believe that every choice matters, and together, we can make a difference. Shop with us today
              and discover how easy it is to blend sustainability with style! Eco-Conscious Choices: Our products are
              selected with the planet in mind, ensuring that you can shop with confidence. Quality and Style: We
              believe that sustainability doesn't mean sacrificing style. Our products are designed to be both beautiful
              and functional. Hassle-Free Shopping: Enjoy a seamless shopping experience with detailed product
              information, easy navigation, and customer support dedicated to helping you find the perfect eco-friendly
              options. Join us in our journey towards a more sustainable future. At Eco Buy, we believe that every
              choice matters, and together, we can make a difference. Shop with us today and discover how easy it is to
              blend sustainability with style!
            </Typography>
          </Grid>
        </Grid>
        {/* <Grid>
          <Typography variant="h6" fontSize="16px" textTransform="uppercase" color="primary" mt={2}>
            THE COMPANY
          </Typography>
          <Typography variant="body1" fontWeight={400} color="text.secondary" mt={2}>
            Eco-Conscious Choices: Our products are selected with the planet in mind, ensuring that you can shop with
            confidence. Quality and Style: We believe that sustainability doesn't mean sacrificing style. Our products
            are designed to be both beautiful and functional. Hassle-Free Shopping: Enjoy a seamless shopping experience
            with detailed product information, easy navigation, and customer support dedicated to helping you find the
            perfect eco-friendly options. Join us in our journey towards a more sustainable future. At Eco Buy, we
            believe that every choice matters, and together, we can make a difference. Shop with us today and discover
            how easy it is to blend sustainability with style!
          </Typography>
        </Grid> */}
      </Grid>
      {/* </Grid> */}
      {/* <Box sx={{ marginTop: 5 }}>
        <Typography variant="h3" fontWeight={700} textAlign="center">
          Our Services
        </Typography>
        <Typography
          variant="body1"
          fontWeight={400}
          color="text.secondary"
          sx={{ maxWidth: 350, textAlign: 'center', mx: 'auto' }}
        >
          Customer service should not be a department. It should be the entire company.
        </Typography>
      </Box> */}
      {/* </Box>  */}
      <Box sx={{ marginY: { md: 10, sm: 8, xs: 5 } }}>
        <Typography variant="h3" color="primary" fontWeight={700} textAlign="center">
          Company Partners
        </Typography>
        <Grid container spacing={3} mt={{ md: 0.1, xs: 0 }}>
          {Data.map((item, idx) => (
            <Grid item md={4} sm={6} xs={12} key={Math.random()}>
              <Stack
                textAlign="center"
                sx={{ border: `1px solid ${theme.palette.divider}`, borderRadius: '5px', p: 2 }}
                key={idx}
              >
                {/* <Typography variant="h3" color="text.secondary">
                  {item.range}
                </Typography>
                <Typography variant="h3" color="text.primary">
                  {item.name}
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight={400}
                  color="text.secondary"
                  sx={{ maxWidth: 350, textAlign: 'center', mx: 'auto' }}
                >
                  {item.description}
                </Typography> */}

                <Box sx={{ position: 'relative', width: '50%', height: 200, marginTop: 2 }}>
                  <Image src={item.image} alt={item.name} layout="fill" objectFit="cover" />
                </Box>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Box>
      {/* <Box sx={{ paddingBottom: 10 }}>
        <Typography variant="h3" fontWeight={700} textAlign="center">
          Our Team
        </Typography>
        <Typography
          variant="body1"
          fontWeight={400}
          color="text.secondary"
          sx={{ maxWidth: 350, textAlign: 'center', mx: 'auto' }}
        >
          Meet out expert team members.
        </Typography>
        <Grid container spacing={3} mt={5}>
          {[1, 2, 3, 4].map((index) => (
            <Grid item md={3} sm={2} xs={6} key={index}>
              <Team />
            </Grid>
          ))}
        </Grid>
      </Box> */}
    </>
  );
}
