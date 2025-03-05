'use client';
import React, { useEffect, useState } from 'react';
import NextLink from 'next/link';

// mui
import { alpha, useTheme } from '@mui/material/styles';
import { Typography, Container, Stack, Box, IconButton, Grid, Link, Fab, Divider } from '@mui/material';

// components
import NewsLetter from './newsletter';
import Logo from 'src/components/logo';

// icons
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { MdOutlineLocationOn } from 'react-icons/md';
import { FiMail } from 'react-icons/fi';
import { MdOutlineCall } from 'react-icons/md';
import * as api from 'src/services';

const MAIN_LINKS = [
  {
    heading: 'Resources',
    listText1: 'Contact us',
    listLink1: '/contact',
    listText2: 'Products',
    listLink2: '/products',
    listText3: 'Blogs',
    listLink3: '/blogs',
    listText4: 'Compaigns',
    listLink4: '/compaigns'
  },
  {
    heading: 'About us',
    listText1: 'About us',
    listLink1: '/about',
    listText2: 'Privacy policy',
    listLink2: '/privacy-policy',
    listText3: 'Term and conditions',
    listLink3: '/terms-and-conditions',
    listText4: 'Refund policy',
    listLink4: '/refund-return-policy',
    listText5: 'FAQs',
    listLink5: '/faq'
  }
];

export default function Footer() {
  const [setting, setSetting] = useState({});
  useEffect(() => {
    getSettingDetail();
  }, []);

  const getSettingDetail = async () => {
    try {
      const response = await api.getSetting();
      if (response.data.length != 0) {
        setSetting(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching advertise images:', error);
    }
  };
  const theme = useTheme();
  return (
    <Box
      sx={{
        bgcolor: (theme) => alpha(theme.palette.info.light, 0.1),
        py: 4,
        mt: 7,
        overflow: 'hidden',
        position: 'relative',

        display: {
          md: 'block',
          xs: 'none'
        }
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item md={3}>
            <Stack spacing={3}>
              <Logo logo={setting?.logo?.url} />
               
              <Stack>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton
                    sx={{
                      svg: {
                        color: theme.palette.primary.main
                      }
                    }}
                  >
                    <MdOutlineLocationOn />
                  </IconButton>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    component={NextLink}
                    href={`/`}
                    sx={{
                      ':hover': {
                        color: theme.palette.primary.main
                      }
                    }}
                  >
                    {setting?.address}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton
                    sx={{
                      svg: {
                        color: theme.palette.primary.main
                      }
                    }}
                  >
                    <FiMail fontSize={20} />
                  </IconButton>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    component={NextLink}
                    href={`/`}
                    sx={{
                      ':hover': {
                        color: theme.palette.primary.main
                      }
                    }}
                  >
                    {setting?.email}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton
                    sx={{
                      svg: {
                        color: theme.palette.primary.main
                      }
                    }}
                  >
                    <MdOutlineCall />
                  </IconButton>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    component={NextLink}
                    href={`/`}
                    sx={{
                      ':hover': {
                        color: theme.palette.primary.main
                      }
                    }}
                  >
                    {setting?.phone}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Grid>
          {MAIN_LINKS.map((item, idx) => (
            <Grid item md={2} key={idx}>
              <Stack spacing={3}>
                <Typography variant="h4" color="text.primary">
                  {item.heading}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  <Link
                    href={`${item.listLink1}`}
                    component={NextLink}
                    underline="none"
                    sx={{
                      color: 'text.secondary',
                      transition: '0.3s ease-in-out',
                      ':hover': {
                        color: theme.palette.primary.main,
                        transform: 'translateX(10px)'
                      }
                    }}
                  >
                    {item.listText1}
                  </Link>
                  <Link
                    href={`${item.listLink2}`}
                    component={NextLink}
                    underline="none"
                    sx={{
                      color: 'text.secondary',
                      transition: '0.3s ease-in-out',
                      ':hover': {
                        color: theme.palette.primary.main,
                        transform: 'translateX(10px)'
                      }
                    }}
                  >
                    {item.listText2}
                  </Link>
                  <Link
                    href={`${item.listLink3}`}
                    component={NextLink}
                    underline="none"
                    sx={{
                      color: 'text.secondary',
                      transition: '0.3s ease-in-out',
                      ':hover': {
                        color: theme.palette.primary.main,
                        transform: 'translateX(10px)'
                      }
                    }}
                  >
                    {item.listText3}
                  </Link>
                  <Link
                    href={`${item.listLink4}`}
                    component={NextLink}
                    underline="none"
                    sx={{
                      color: 'text.secondary',
                      transition: '0.3s ease-in-out',
                      ':hover': {
                        color: theme.palette.primary.main,
                        transform: 'translateX(10px)'
                      }
                    }}
                  >
                    {item.listText4}
                  </Link>
                  <Link
                    href={`${item.listLink5}`}
                    component={NextLink}
                    underline="none"
                    sx={{
                      color: 'text.secondary',
                      transition: '0.3s ease-in-out',
                      ':hover': {
                        color: theme.palette.primary.main,
                        transform: 'translateX(10px)'
                      }
                    }}
                  >
                    {item.listText5}
                  </Link>
                </Box>
              </Stack>
            </Grid>
          ))}

          <Grid item md={5}>
            <Stack spacing={3}>
              <Typography variant="h4" color="text.primary">
                Join a Newsletter
              </Typography>
              <NewsLetter />

              <Stack direction="row" alignItems="center" spacing={2}>
                <Fab
                  size="small"
                  color="primary"
                  component={NextLink}
                  href={setting?.facebookLink || '#'}
                  sx={{
                    zIndex: 1
                  }}
                >
                  <FaFacebookF size={18} />
                </Fab>
                <Fab
                  size="small"
                  color="primary"
                  component={NextLink}
                  href={setting?.instaLink || '#'}
                  sx={{
                    zIndex: 1
                  }}
                >
                  <FaInstagram size={18} />
                </Fab>
                <Fab
                  size="small"
                  color="primary"
                  component={NextLink}
                  href="https://www.linkedin.com"
                  sx={{
                    zIndex: 1
                  }}
                >
                  <FaLinkedinIn size={18} />
                </Fab>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Typography variant="body1" color="text.primary" textAlign="center">
          {setting?.footerTagline}
        </Typography>
      </Container>
    </Box>
  );
}

// components/Footer.js

// 'use client';
// import { Box, Container, Grid, Typography, TextField, Button } from '@mui/material';
// import Link from 'next/link';
// import Logo from 'src/components/logo';
// import { FaFacebookF } from 'react-icons/fa';
// import { FaTwitter } from 'react-icons/fa';
// import { FaInstagram } from 'react-icons/fa';
// import { FaYoutube } from 'react-icons/fa';
// import { FaPinterestP } from 'react-icons/fa';
// import './index.css';

// const Footer = () => {
//   return (
//     <Box sx={{ backgroundColor: '#f2f2f2', color: 'black', py: 5 }}>
//       <Container maxWidth="xl">
//         <Grid container spacing={4}>
//           <Grid item xs={12} md={3}>
//             <Typography gutterBottom>
//               <Logo />
//             </Typography>
//             <Typography variant="body2" gutterBottom>
//               F-7,Satyam Plaza, Ankur Chokadi, New India Colony, Nikol, Ahmedabad, Gujarat 382345
//               <br />
//               <br />
//             </Typography>
//             <Typography variant="body2">info@Ecobuy.com</Typography>
//             <Typography variant="body2">
//               <i className="fa fa-phone" /> +91 9106559673
//             </Typography>
//             <br />
//             <Typography variant="body2">
//               <FaFacebookF />
//               &nbsp; &nbsp; &nbsp;
//               <FaTwitter />
//               &nbsp; &nbsp; &nbsp;
//               <FaInstagram />
//               &nbsp; &nbsp; &nbsp;
//               <FaYoutube />
//               &nbsp; &nbsp; &nbsp;
//               <FaPinterestP />
//             </Typography>
//           </Grid>
//           <Grid item xs={12} md={3}>
//             <Typography variant="h6" gutterBottom>
//               Company
//             </Typography>
//             <br />
//             <Typography variant="body2"> About Us </Typography>
//             <br />
//             <Typography variant="body2"> Careers</Typography>
//             <br />
//             <Typography variant="body2"> Affiliates</Typography>
//             <br />
//             <Typography variant="body2"> Blog</Typography>
//             <br />
//             <Typography variant="body2"> Contact Us</Typography>
//             <br />
//           </Grid>
//           <Grid item xs={12} md={3}>
//             <Typography variant="h6" gutterBottom>
//               Shops
//             </Typography>
//             <br />
//             <Typography variant="body2"> New Arrivals </Typography>
//             <br />
//             <Typography variant="body2"> Accessories</Typography>
//             <br />
//             <Typography variant="body2"> Men</Typography>
//             <br />
//             <Typography variant="body2"> Women</Typography>
//             <br />
//             <Typography variant="body2"> Shop All</Typography>
//             <br />
//           </Grid>
//           <Grid item xs={12} md={3}>
//             <Typography variant="h6" gutterBottom>
//               Help
//             </Typography>
//             <br />
//             <Typography variant="body2"> Customer Service </Typography>
//             <br />
//             <Typography variant="body2"> My Account</Typography>
//             <br />
//             <Typography variant="body2"> Find a Store</Typography>
//             <br />
//             <Typography variant="body2"> Legal & Privacy</Typography>
//             <br />
//             <Typography variant="body2"> Contact</Typography>
//             <br />
//           </Grid>
//           {/* <Grid item xs={12} md={3}>
//             <Typography variant="h6" gutterBottom>
//               Lastest News
//             </Typography>
//             <Typography variant="body2">
//               <strong>July 18, 2018</strong>
//               <br />
//               Lorem Ipsum is simply dummy text of the printing.
//             </Typography>
//             <Typography variant="body2" sx={{ mt: 2 }}>
//               <strong>July 28, 2018</strong>
//               <br />
//               Lorem Ipsum is simply dummy text of the printing
//             </Typography>
//           </Grid> */}
//           <Grid item xs={12} md={3} className="subscribe-field">
//             <Typography variant="h6" gutterBottom>
//               Subscribe
//             </Typography>
//             <br />
//             <Typography variant="body2" gutterBottom>
//               Be the first person to get the latest news about friends, promotions and much more!
//             </Typography>
//             <Box sx={{ display: 'flex', marginTop: '5px' }}>
//               <TextField variant="outlined" placeholder="Your email address" size="small" sx={{ bgcolor: 'white' }} />
//               <Button variant="contained" color="primary" sx={{ borderRadius: '0 0 0 0' }}>
//                 Send
//               </Button>
//             </Box>
//           </Grid>
//         </Grid>

//         {/* <Box sx={{ borderTop: '1px solid #555', mt: 4, pt: 2, textAlign: 'center', display: 'flex' }}>
//           <Typography variant="body2">&copy; 2024</Typography>
//           <Box sx={{ mt: 1 }}>
//             <Link href="/terms" passHref>
//               <Typography variant="body2" component="a" sx={{ color: 'inherit', textDecoration: 'none', mx: 1 }}>
//                 Terms & Conditions
//               </Typography>
//             </Link>
//             -
//             <Link href="/privacy" passHref>
//               <Typography variant="body2" component="a" sx={{ color: 'inherit', textDecoration: 'none', mx: 1 }}>
//                 Privacy Policy
//               </Typography>
//             </Link>
//           </Box>
//         </Box> */}
//       </Container>
//     </Box>
//   );
// };

// export default Footer;
