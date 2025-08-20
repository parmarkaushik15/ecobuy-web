'use client';
import React from 'react';
import NextLink from 'next/link';
import { useQuery } from 'react-query';
import { Stack, Typography, Box, Link, Grid, IconButton, Skeleton } from '@mui/material';
import { MdEmail } from 'react-icons/md';
import { PiPhoneCall } from 'react-icons/pi';
import ContactUs from 'src/components/forms/contact';
import RootStyled from './styled';
import * as api from 'src/services';

// Default values for content
const DEFAULTS = {
  title: 'Best Your Website',
  subtitle:
    'We are here to help you with any questions or concerns you may have. Feel free to reach out to us through the contact form or the provided contact details.',
  email: 'sales.Perfumeswale@gmail.com',
  phone: '+91 937-666-6903',
  mapUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.2177880661196!2d72.49340847592061!3d22.987392419123623!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e8576d6b1fc4d%3A0xa934c2512a328e09!2sSarkhej%2C%20Ahmedabad%2C%20Gujarat%20382010!5e0!3m2!1sen!2sin!4v1718707456200!5m2!1sen!2sin'
};

// Reusable ContactItem component
const ContactItem = ({ icon: Icon, title, value, href, isLoading }) => (
  <Stack spacing={2} direction="row" alignItems="center">
    {isLoading ? (
      <>
        <Skeleton variant="circular" width={40} height={40} />
        <Box>
          <Skeleton variant="text" width={100} />
          <Skeleton variant="text" width={150} />
        </Box>
      </>
    ) : (
      <>
        <IconButton sx={{ bgcolor: 'primary.light', '&:hover': { bgcolor: 'primary.main' } }} aria-label={title}>
          <Icon />
        </IconButton>
        <Box>
          <Typography variant="h6" fontSize="18px" color="text.primary">
            {title}
          </Typography>
          <Link
            href={href}
            variant="subtitle2"
            fontSize="14px"
            fontWeight={600}
            color="text.secondary"
            component={NextLink}
            underline="hover"
          >
            {value}
          </Link>
        </Box>
      </>
    )}
  </Stack>
);

const ContactPage = () => {
  const { data, isLoading, error } = useQuery('get-contactus-page-context', api.getContactusPageContext);
  const content = data?.data?.content;
  console.log('Contact Page Content:', content);
  // if (error) {
  //   return (
  //     <RootStyled>
  //       <Typography color="error" textAlign="center">
  //         Failed to load contact information. Please try again later.
  //       </Typography>
  //     </RootStyled>
  //   );
  // }

  const title = content?.contactUsTitle || DEFAULTS.title;
  const subtitle = content?.contactUsSubTitle || DEFAULTS.subtitle;
  const email = content?.contactUsEmail || DEFAULTS.email;
  const phone = content?.contactUsPhone || DEFAULTS.phone;
  const mapUrl = content?.contactUsMapUrl || DEFAULTS.mapUrl;

  return (
    <RootStyled>
      <Grid container spacing={6}>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            textAlign: { xs: 'center', md: 'left' },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Stack spacing={3}>
            {isLoading ? (
              <>
                <Skeleton variant="text" width={150} />
                <Skeleton variant="text" width={300} height={60} />
                <Skeleton variant="text" width="80%" height={80} />
              </>
            ) : (
              <>
                <Typography variant="h6" fontSize="16px" textTransform="uppercase" color="primary.main">
                  {title}
                </Typography>
                <Typography variant="h1" fontWeight={800} sx={{ my: 2 }}>
                  Get in touch{' '}
                  <Box component="span" color="primary.main">
                    Today!
                  </Box>
                </Typography>
                <Typography variant="body1" fontWeight={500} color="text.secondary">
                  {subtitle}
                </Typography>
              </>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <ContactItem
                  icon={MdEmail}
                  title="Email Address"
                  value={email}
                  href={`mailto:${email}`}
                  isLoading={isLoading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ContactItem
                  icon={PiPhoneCall}
                  title="Phone"
                  value={`+91 ${phone}`}
                  href={`tel:${phone}`}
                  isLoading={isLoading}
                />
              </Grid>
            </Grid>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          {isLoading ? <Skeleton variant="rectangular" height={400} /> : <ContactUs />}
        </Grid>
        <Grid item xs={12}>
          {isLoading ? (
            <Skeleton variant="rectangular" width="100%" height={450} />
          ) : (
            <iframe
              src={mapUrl}
              width="100%"
              height="450"
              allowFullScreen
              title="Location Map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </Grid>
      </Grid>
    </RootStyled>
  );
};

export default ContactPage;
