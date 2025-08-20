// 'use client';
// import React, { useState, useEffect } from 'react';
// // mui
// import { Box } from '@mui/material';
// // icons

// // blur image
// import banner1Img from '../../../../../public/b1.jpg';
// import banner2Img from '../../../../../public/b2.jpg';
// import banner3Img from '../../../../../public/b3.jpg';
// import banner4Img from '../../../../../public/b4.jpg';
// import banner5Img from '../../../../../public/b5.jpg';
// // components
// import BlurImage from 'src/components/blurImage';
// import * as api from 'src/services';

// export default function Banner({ type }) {
//   const [advertiseImage, setAdvertiseImage] = useState();

//   useEffect(() => {
//     getAllAdvertiseByAdmin();
//   }, []);
//   let bannerImg;
//   const getAllAdvertiseByAdmin = async () => {
//     debugger;
//     try {
//       const response = await api.getAdvertiseImages();
//       bannerImg =
//         process.env.IMAGE_BASE == 'LOCAL'
//           ? `${process.env.IMAGE_URL}${advertiseImage?.advertise_img?.url}`
//           : advertiseImage?.advertise_img?.url;
//       if (type == 1) {
//         bannerImg =
//           process.env.IMAGE_BASE == 'LOCAL'
//             ? `${process.env.IMAGE_URL}${response?.data[0]?.advertise_img?.url}`
//             : response?.data[0]?.advertise_img?.url;
//       } else if (type == 2) {
//         bannerImg =
//           process.env.IMAGE_BASE == 'LOCAL'
//             ? `${process.env.IMAGE_URL}${response?.data[0]?.advertise2_img?.url}`
//             : response?.data[0]?.advertise2_img?.url;
//       } else if (type == 3) {
//         bannerImg =
//           process.env.IMAGE_BASE == 'LOCAL'
//             ? `${process.env.IMAGE_URL}${response?.data[0]?.advertise3_img?.url}`
//             : response?.data[0]?.advertise3_img?.url;
//       } else if (type == 4) {
//         bannerImg =
//           process.env.IMAGE_BASE == 'LOCAL'
//             ? `${process.env.IMAGE_URL}${response?.data[0]?.advertise4_img?.url}`
//             : response?.data[0]?.advertise4_img?.url;
//       } else if (type == 5) {
//         bannerImg =
//           process.env.IMAGE_BASE == 'LOCAL'
//             ? `${process.env.IMAGE_URL}${response?.data[0]?.advertise5_img?.url}`
//             : response?.data[0]?.advertise5_img?.url;
//       }
//       // setAdvertiseImage(response?.data[0]);
//       console.log('API response:', response);
//     } catch (error) {
//       console.error('Error fetching advertise images:', error);
//     }
//   };

//   console.log('Current advertiseImage state:', bannerImg);

//   return (
//     <Box
//       sx={{
//         mt: 4,
//         overflow: 'hidden',
//         position: 'relative',

//         display: { md: 'block', xs: 'none' }
//       }}
//     >
//       <Box
//         sx={{
//           mt: 3,
//           py: 12,
//           height: 300,
//           position: 'relative'
//         }}
//       >
//         {bannerImg && (
//           <BlurImage
//             src={bannerImg}
//             alt="banner-3"
//             placeholder="blur"
//             layout="fill"
//             static
//             sizes="700px"
//             objectFit="cover"
//           />
//         )}
//       </Box>
//     </Box>
//   );
// }
'use client';
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import BlurImage from 'src/components/blurImage';
import Link from 'next/link';
import * as api from 'src/services';

export default function Banner({ type }) {
  const [bannerImg, setBannerImg] = useState('');
  const [blurDataURL, setBlurDataURL] = useState('');
  const [productURL, setProductURL] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    getAllAdvertiseByAdmin();
  }, [type]);

  const getAllAdvertiseByAdmin = async () => {
    try {
      const response = await api.getAdvertiseImages();

      if (response?.data && response.data.length > 0) {
        const advertiseData = response.data[0];

        let imgURL = '';
        let blurURL = '';
        let prodURL = '';

        const numericType = Number(type);

        switch (numericType) {
          case 1:
            imgURL =
              process.env.IMAGE_BASE === 'LOCAL'
                ? `${process.env.IMAGE_URL}${advertiseData.advertise_img?.url || ''}`
                : advertiseData.advertise_img?.url || '';
            blurURL = advertiseData.advertise_img?.blurDataURL || '';
            prodURL = advertiseData.advertise_img?.productURL || '';
            break;
          case 2:
            imgURL =
              process.env.IMAGE_BASE === 'LOCAL'
                ? `${process.env.IMAGE_URL}${advertiseData.advertise2_img?.url || ''}`
                : advertiseData.advertise2_img?.url || '';
            blurURL = advertiseData.advertise2_img?.blurDataURL || '';
            prodURL = advertiseData.advertise2_img?.productURL || '';
            break;
          case 3:
            imgURL =
              process.env.IMAGE_BASE === 'LOCAL'
                ? `${process.env.IMAGE_URL}${advertiseData.advertise3_img?.url || ''}`
                : advertiseData.advertise3_img?.url || '';
            blurURL = advertiseData.advertise3_img?.blurDataURL || '';
            prodURL = advertiseData.advertise3_img?.productURL || '';
            break;
          case 4:
            imgURL =
              process.env.IMAGE_BASE === 'LOCAL'
                ? `${process.env.IMAGE_URL}${advertiseData.advertise4_img?.url || ''}`
                : advertiseData.advertise4_img?.url || '';
            blurURL = advertiseData.advertise4_img?.blurDataURL || '';
            prodURL = advertiseData.advertise4_img?.productURL || '';
            break;
          case 5:
            imgURL =
              process.env.IMAGE_BASE === 'LOCAL'
                ? `${process.env.IMAGE_URL}${advertiseData.advertise5_img?.url || ''}`
                : advertiseData.advertise5_img?.url || '';
            blurURL = advertiseData.advertise5_img?.blurDataURL || '';
            prodURL = advertiseData.advertise5_img?.productURL || '';
            break;
          default:
            imgURL = '';
            blurURL = '';
            prodURL = '';
            break;
        }

        if (!imgURL || !blurURL) {
          setError(true); // Set error if image URL or blurDataURL is missing
        } else {
          setBannerImg(imgURL);
          setBlurDataURL(blurURL);
          setProductURL(prodURL);
          setError(false);
        }
      } else {
        console.warn('No data received in API response.');
        setError(true);
      }
    } catch (error) {
      console.error('Error fetching advertise images:', error);
      setError(true);
    }
  };

  return (
    <Box
      sx={{
        mt: 0,
        overflow: 'hidden',
        position: 'relative',
        display: { md: 'block', xs: 'none' }
      }}
    >
      <Box
        sx={{
          mt: 0,
          py: 6,
          height: 300, // Increased height for taller images
          position: 'relative'
        }}
      >
        {bannerImg && blurDataURL && !error ? (
          <Link
            href={productURL || '#'}
            style={{ textDecoration: 'none', display: 'block', height: '100%' }}
            rel="noopener noreferrer"
          >
            <BlurImage
              src={bannerImg}
              alt={`banner-${type}`}
              blurDataURL={blurDataURL}
              layout="fill"
              sizes="(max-width: 768px) 100vw, 50vw"
              objectFit="cover"
              onError={() => setError(true)}
            />
          </Link>
        ) : (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.200',
              borderRadius: 2
            }}
          >
            <Typography variant="body1" color="text.secondary">
              {error ? `Banner ${type} not available` : 'Loading...'}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
