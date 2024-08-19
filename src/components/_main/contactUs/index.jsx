'use client';
import React from 'react';
import NextLink from 'next/link';
// material
import { Stack, Typography, Box, Link, Grid, IconButton } from '@mui/material';
// components
import ContactUs from 'src/components/forms/contact';
import RootStyled from './styled';

// icons
import { MdEmail } from 'react-icons/md';
import { PiPhoneCall } from 'react-icons/pi';

const index = () => {
  return (
    <RootStyled>
      <Grid container spacing={6}>
        <Grid
          item
          xs={12}
          md={6}
          textAlign={{ xs: 'center', md: 'left' }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Stack>
            <Typography variant="h6" fontSize="16px" textTransform="uppercase" color="primary">
              Best Your Website
            </Typography>
            <Typography variant="h1" fontWeight={800} sx={{ marginY: 2 }}>
              Get in touch <span>Today!</span>
            </Typography>
            <Typography variant="body1" fontWeight={500} color="text.secondary" sx={{ mb: 3 }}>
              We're here to listen, assist, and answer any questions you may have. Whether you're interested in our
              services, seeking collaborations, or simply want to connect, our team is ready to provide personalized
              support.
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={6}>
                <Stack spacing={2} direction="row" alignItems="center" className="mail-box">
                  <IconButton className="choose-btn">
                    <MdEmail />
                  </IconButton>
                  <Box textAlign="left">
                    <Typography variant="h6" fontSize="18px!important" color="text.primary">
                      Email Address
                    </Typography>
                    <Link
                      href="mailto:sales.ecobuy@gmail.com"
                      variant="subtitle2"
                      fontSize="14px"
                      fontWeight={600}
                      color="text.secondary"
                      component={NextLink}
                    >
                      sales.ecobuy@gmail.com
                    </Link>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Stack spacing={2} direction="row" alignItems="center" className="phone-box">
                  <IconButton className="choose-btn">
                    <PiPhoneCall />
                  </IconButton>
                  <Box textAlign="left">
                    <Typography variant="h6" fontSize="18px!important" color="text.primary">
                      Phone
                    </Typography>
                    <Link
                      href="tel:+919376666903"
                      variant="subtitle2"
                      fontSize="14px"
                      fontWeight={600}
                      color="text.secondary"
                      component={NextLink}
                    >
                      +91 937-666-6903
                    </Link>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <ContactUs />
        </Grid>
        <Grid item xs={12}>
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.2106511429533!2d72.66848467407584!3d23.0527375152042!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e87fceafafe9b%3A0x5362dc3698de6d7!2sCodeQuality%20Technologies!5e0!3m2!1sen!2sin!4v1723007440003!5m2!1sen!2sin"
            width="100%"
            height="450" 
            allowfullscreen=""
            title="Ecobuy"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </Grid>
      </Grid>
    </RootStyled>
  );
};

export default index;
