import PropTypes from 'prop-types';
import { useRouter } from 'next-nprogress-bar';
import Image from 'next/image';
import logoImage from '../../public/images/Perfumeswale-Transparent-logo.png';
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
          height: '56px !important'
        }
      }}
      onClick={() => push('/')}
    >
      {logo ? (
        <img
          width={100}
          height={56}
          draggable="false"
          src={process.env.IMAGE_BASE == 'LOCAL' ? `${process.env.IMAGE_URL}${logo}` : logo}
          alt="banner-1"
          sizes="100px"
          className="logo"
          style={{
            height: '56px !important'
          }}
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
