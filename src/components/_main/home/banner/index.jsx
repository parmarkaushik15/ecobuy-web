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
import { Box } from '@mui/material';
import BlurImage from 'src/components/blurImage';
import * as api from 'src/services';

export default function Banner({ type }) {
  const [bannerImg, setBannerImg] = useState('');
  const [blurDataURL, setBlurDataURL] = useState('');

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

        const numericType = Number(type);

        switch (numericType) {
          case 1:
            imgURL =
              process.env.IMAGE_BASE === 'LOCAL'
                ? `${process.env.IMAGE_URL}${advertiseData.advertise_img.url}`
                : advertiseData.advertise_img.url;
            blurURL = advertiseData.advertise_img.blurDataURL;
            break;
          case 2:
            imgURL =
              process.env.IMAGE_BASE === 'LOCAL'
                ? `${process.env.IMAGE_URL}${advertiseData.advertise2_img.url}`
                : advertiseData.advertise2_img.url;
            blurURL = advertiseData.advertise2_img.blurDataURL;
            break;
          case 3:
            imgURL =
              process.env.IMAGE_BASE === 'LOCAL'
                ? `${process.env.IMAGE_URL}${advertiseData.advertise3_img.url}`
                : advertiseData.advertise3_img.url;
            blurURL = advertiseData.advertise3_img.blurDataURL;
            break;
          case 4:
            imgURL =
              process.env.IMAGE_BASE === 'LOCAL'
                ? `${process.env.IMAGE_URL}${advertiseData.advertise4_img.url}`
                : advertiseData.advertise4_img.url;
            blurURL = advertiseData.advertise4_img.blurDataURL;
            break;
          case 5:
            imgURL =
              process.env.IMAGE_BASE === 'LOCAL'
                ? `${process.env.IMAGE_URL}${advertiseData.advertise5_img.url}`
                : advertiseData.advertise5_img.url;
            blurURL = advertiseData.advertise5_img.blurDataURL;
            break;
          default:
            imgURL = '';
            blurURL = '';
            break;
        }

        setBannerImg(imgURL);
        setBlurDataURL(blurURL);
      } else {
        console.warn('No data received in API response.');
      }
    } catch (error) {
      console.error('Error fetching advertise images:', error);
    }
  };

  return (
    <Box
      sx={{
        mt: 4,
        overflow: 'hidden',
        position: 'relative',
        display: { md: 'block', xs: 'none' }
      }}
    >
      <Box
        sx={{
          mt: 3,
          py: 12,
          height: 300,
          position: 'relative'
        }}
      >
        {bannerImg && blurDataURL ? (
          <BlurImage
            src={bannerImg}
            alt="banner"
            blurDataURL={blurDataURL}
            layout="fill"
            sizes="700px"
            objectFit="cover"
          />
        ) : (
          <div>No image available</div>
        )}
      </Box>
    </Box>
  );
}
