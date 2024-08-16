//
'use client';
import PropTypes from 'prop-types';
import Image from 'next/image';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function BlurImage({ src, alt, blurDataURL, sizes, ...props }) {
  const isDesktop = useMediaQuery('(min-width:600px)');

  return (
    <>
      {blurDataURL ? (
        <Image
          sizes={isDesktop ? '14vw' : '50vw'}
          src={src}
          alt={alt}
          placeholder="blur"
          blurDataURL={blurDataURL}
          {...props}
        />
      ) : (
        <Image sizes={isDesktop ? '14vw' : '50vw'} src={src} alt={alt} {...props} />
      )}
    </>
  );
}

BlurImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  blurDataURL: PropTypes.string.isRequired,
  static: PropTypes.bool,
  sizes: PropTypes.string
};
