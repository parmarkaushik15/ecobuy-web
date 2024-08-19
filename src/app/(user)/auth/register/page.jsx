// guard
import GuestGuard from 'src/guards/guest';
// mui
import { Card, Container, Typography } from '@mui/material';
// components
import RegisterMain from 'src/components/_main/auth/register';

// Meta information
export const metadata = {
  title: 'Create Your Ecobuy Account | Join Us for Exclusive Deals and Seamless Shopping',
  description:
    'Register with Ecobuy today to unlock a world of exclusive deals, personalized recommendations, and secure transactions. Join our community for a seamless shopping experience. Sign up now and elevate your online shopping journey!',
  applicationName: 'Ecobuy',
  authors: 'Ecobuy',
  keywords: 'ecommerce, Ecobuy, Commerce, Register Ecobuy, RegisterFrom Ecobuy'
};

export default async function Register() {
  return (
    <>
      <GuestGuard>
        <Container maxWidth="sm">
          <Card
            sx={{
              maxWidth: 560,
              m: 'auto',
              my: '80px',
              flexDirection: 'column',
              justifyContent: 'center',
              borderRadius: '0px',
              boxShadow: 'unset',
              p: 3
            }}
          >
            <Typography variant="h4" component="h1" gutterBottom textAlign="center">
              Sign up
            </Typography>
            <Typography color="text.secondary" mb={5} textAlign="center">
              Create your account
            </Typography>
            <RegisterMain />
          </Card>
        </Container>
      </GuestGuard>
    </>
  );
}
