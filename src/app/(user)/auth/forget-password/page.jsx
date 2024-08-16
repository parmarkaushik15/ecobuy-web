// guard
import GuestGuard from 'src/guards/guest';
//  components
import ForgetPasswordMain from 'src/components/_main/auth/forgetPassword';

// Meta information
export const metadata = {
  title: 'Forgot Password | Ecobuy - Reset Your Password and Regain Access',
  description:
    'Forgot your password? Reset it with Ecobuy for seamless access to your account. Regain control and enjoy hassle-free browsing, secure transactions, and personalized experiences. Get back on track with Ecobuy now!',
  applicationName: 'Ecobuy',
  authors: 'Ecobuy',
  keywords:
    'forgot password, Ecobuy, reset password, Ecobuy password recovery, password reset, password recovery, account access, regain access, secure login, secure access, hassle-free login, personalized login, password recovery tool, forgotten password'
};

export default function ForgetPassword() {
  return (
    <>
      <GuestGuard>
        <ForgetPasswordMain />
      </GuestGuard>
    </>
  );
}
