import React from 'react';
// guard
import AuthGuard from 'src/guards/auth';
// mui
import { Box } from '@mui/material';
//  components
import OTPMain from 'src/components/_main/auth/otp';

// Meta information
export const metadata = {
  title: 'Verify Your Email with Ecobuy | Confirm Your Account for Secure Shopping',
  description:
    'Complete the email verification process at Ecobuy to ensure a secure and personalized shopping experience. Confirm your account and gain access to exclusive features. Shop confidently with a verified email. Verify now!',
  applicationName: 'Ecobuy',
  authors: 'Ecobuy',
  keywords: 'ecommerce, Ecobuy, Commerce, VerifyEmail Ecobuy, VerifyEmail Page Ecobuy'
};
export default async function VerifyOTP() {
  return (
    <>
      <AuthGuard>
        <Box className="auth-pages">
          <OTPMain />
        </Box>
      </AuthGuard>
    </>
  );
}
