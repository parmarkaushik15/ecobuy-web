import PropTypes from 'prop-types';
import { useRouter } from 'next-nprogress-bar';
import Image from 'next/image';
import logoImage from '../../public/images/EcoBuy-Transparent-logo.png';
// mui
import { Box } from '@mui/material';

export const Logo = ({ logo }) => {
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
      {logo ? (
        <Image
          width={100}
          height={100}
          draggable="false"
          src={process.env.IMAGE_BASE == 'LOCAL' ? `${process.env.IMAGE_URL}${logo}` : logo}
          alt="banner-1"
          static
          sizes="100px"
          objectFit="cover"
        />
      ) : (
        <Image draggable="false" src={logoImage} alt="banner-1" static sizes="100px" objectFit="cover" />
      )}
    </Box>
  );
};

Logo.propTypes = {
  sx: PropTypes.object,
  isMobile: PropTypes.bool
};
export default Logo;
