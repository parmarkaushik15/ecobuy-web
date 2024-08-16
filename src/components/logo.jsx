import PropTypes from 'prop-types';
import { useRouter } from 'next-nprogress-bar';
import Image from 'next/image';
import logoImage from '../../public/images/EcoBuy-Transparent-logo.png';
// mui
import { Box } from '@mui/material';

export const Logo = () => {
  const { push } = useRouter();
  return (
    <Box
      sx={{
        cursor: 'pointer',

        img: {
          width: 100,
          height: 'auto'
        }
      }}
      onClick={() => push('/')}
    >
      <Image draggable="false" src={logoImage} alt="banner-1" static sizes="100px" objectFit="cover" />
    </Box>
  );
};

Logo.propTypes = {
  sx: PropTypes.object,
  isMobile: PropTypes.bool
};
export default Logo;
