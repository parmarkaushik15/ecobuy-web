// // components/LookBook.js
// import React from 'react';
// import { Box, Container, Typography, Grid } from '@mui/material';

// const LookBook = () => {
//   const lookbookItems = [
//     {
//       img: 'https://via.placeholder.com/400x300/FF0000/FFFFFF?text=Women%27s+T-Shirts',
//       title: "Women's T-Shirts",
//       price: 'STARTING AT $19'
//     },
//     {
//       img: 'https://via.placeholder.com/400x300/F0F0F0/000000?text=Slim+Fit+Cotton+Shorts',
//       title: 'Slim Fit Cotton Shorts',
//       price: 'STARTING AT $21'
//     },
//     {
//       img: 'https://via.placeholder.com/400x600/E0E0E0/000000?text=Men%27s+Sportswear',
//       title: "Men's Sportswear",
//       price: 'STARTING AT $39'
//     },
//     {
//       img: 'https://via.placeholder.com/400x300/E0E0E0/000000?text=Canvas+Trainers',
//       title: 'Canvas Trainers',
//       price: 'STARTING AT $19'
//     },
//     {
//       img: 'https://via.placeholder.com/400x300/F0F0F0/000000?text=Sample+Product',
//       title: 'Sample Product',
//       price: 'STARTING AT $00'
//     }
//   ];

//   return (
//     <Container sx={{ mt: 5 }}>
//       <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 5, textAlign: 'left' }}>
//         LOOKBOOK
//       </Typography>
//       <Grid container spacing={2}>
//         {lookbookItems.map((item, index) => (
//           <Grid item xs={12} sm={6} md={4} key={index}>
//             <Box
//               sx={{
//                 backgroundImage: `url(${item.img})`,
//                 backgroundSize: 'cover',
//                 backgroundPosition: 'center',
//                 height: '300px',
//                 position: 'relative',
//                 '&:hover': {
//                   opacity: 0.8
//                 }
//               }}
//             >
//               <Box
//                 sx={{
//                   position: 'absolute',
//                   bottom: 10,
//                   left: 10,
//                   backgroundColor: 'rgba(255, 255, 255, 0.8)',
//                   padding: '10px',
//                   borderRadius: '5px'
//                 }}
//               >
//                 <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
//                   {item.price}
//                 </Typography>
//                 <Typography variant="h6">{item.title}</Typography>
//               </Box>
//             </Box>
//           </Grid>
//         ))}
//       </Grid>
//     </Container>
//   );
// };

// export default LookBook;
'use client';
import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import Image from 'next/image';
import LokkBookImage from '../../../../public/images/Lookbook001.jpg';
import * as api from 'src/services';

const dataImg =
  'data:image/jpeg;base64,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';
const LookBook = () => {
  const lookbookItems = [
    {
      img: LokkBookImage,
      title: "Women's T-Shirts",
      price: 'STARTING AT $19'
    },
    {
      img: LokkBookImage,
      title: 'Slim Fit Cotton Shorts',
      price: 'STARTING AT $21'
    },
    {
      img: LokkBookImage,
      title: "Men's Sportswear",
      price: 'STARTING AT $39'
    },
    {
      img: LokkBookImage,
      title: 'Canvas Trainers',
      price: 'STARTING AT $19'
    },
    {
      img: LokkBookImage,
      title: 'Sample Product',
      price: 'STARTING AT $00'
    },
    {
      img: LokkBookImage,
      title: 'Sample Product',
      price: 'STARTING AT $00'
    }
  ];
  const [lookbookData, setLookbookData] = useState([]);
  useEffect(() => {
    const getLookbookData = async () => {
      const response = await api.getLookbook();
      if (response.success) {
        let arr = [];
        for (const item of response.data) {
          let obj = {
            img:
              process.env.IMAGE_BASE == 'LOCAL'
                ? `${process.env.IMAGE_URL}${item?.lookup_img?.url}`
                : item?.lookup_img?.url,
            title: item.name,
            price: item.price
          };
          arr.push(obj);
        }
        setLookbookData(arr);
      }
    };
    getLookbookData();
  }, []);

  return (
    // <Container sx={{ mt: 5 }}>
    //   <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 5, textAlign: 'left' }}>
    //     LOOKBOOK
    //   </Typography>
    //   <Box
    //     sx={{
    //       display: 'grid',
    //       gridTemplateColumns: '1fr 1fr',
    //       gridTemplateRows: 'repeat(2, 1fr)',
    //       gap: 2,
    //       alignItems: 'stretch'
    //     }}
    //   >
    //     {lookbookItems.map((item, index) => (
    //       <Box
    //         key={index}
    //         sx={{
    //           gridColumn: index % 3 === 2 ? '2 / 3' : '1 / 2',
    //           gridRow: index % 3 === 2 ? `${Math.floor(index / 3)  2 + 1} / span 2` : `${Math.floor(index / 3)  2 + 1 + (index % 3)} / span 1`,
    //           backgroundImage: `url(${item.img})`,
    //           backgroundSize: 'cover',
    //           backgroundPosition: 'center',
    //           height: '500px',
    //           position: 'relative',
    //           '&:hover': {
    //             opacity: 0.8
    //           }
    //         }}
    //       >
    //         <Box
    //           sx={{
    //             position: 'absolute',
    //             bottom: 10,
    //             left: 10,
    //             top: 10,
    //             backgroundColor: 'rgba(255, 255, 255, 0.8)',
    //             padding: '10px',
    //             borderRadius: '5px'
    //           }}
    //         >
    //           <Image
    //             src={item.img}
    //             alt=""
    //             sx={{
    //               width: '100%',
    //               height: '100%',
    //               aspectRatio: '4/3',
    //               background: '#e9e9e9',
    //               objectFit: 'cover'
    //             }}
    //           />
    //           <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
    //             {item.price}
    //           </Typography>
    //           <Typography variant="h6">{item.title}</Typography>
    //         </Box>
    //       </Box>
    //     ))}
    //   </Box>

    //   {/* <Box
    //     sx={{
    //       display: 'grid',
    //       gridTemplateColumns: '1fr 1fr',
    //       gridTemplateRows: 'repeat(2, 1fr)',
    //       gap: 2,
    //       alignItems: 'stretch'
    //     }}
    //   >
    //     {lookbookItems.map((item, index) => (
    //       <Box
    //         key={index}
    //         sx={{
    //           gridColumn: index % 3 === 2 ? '2 / 3' : '1 / 2',
    //           gridRow:
    //             index % 3 === 2
    //               ? `${Math.floor(index / 3) * 2 + 1} / span 2`
    //               : `${Math.floor(index / 3) * 2 + 1 + (index % 3)} / span 1`,
    //           backgroundImage: `url(${item.img})`,
    //           backgroundSize: 'cover',
    //           backgroundPosition: 'center',
    //           height: index % 3 === 2 ? '600px' : '300px',
    //           position: 'relative',
    //           '&:hover': {
    //             opacity: 0.8
    //           }
    //         }}
    //       >
    //         <Box
    //           sx={{
    //             position: 'absolute',
    //             bottom: 10,
    //             left: 10,
    //             backgroundColor: 'rgba(255, 255, 255, 0.8)',
    //             padding: '10px',
    //             borderRadius: '5px'
    //           }}
    //         >
    //           <Image
    //             src={item.img}
    //             alt=""
    //             sx={{
    //               width: '100%',
    //               height: 'auto',
    //               aspectRatio: '4/3',
    //               background: '#e9e9e9',
    //               objectFit: 'cover'
    //             }}
    //           />
    //           <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
    //             {item.price}
    //           </Typography>
    //           <Typography variant="h6">{item.title}</Typography>
    //         </Box>
    //       </Box>
    //     ))}
    //   </Box> */}
    // </Container>

    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 5, textAlign: 'left' }}>
        LOOKBOOK
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: 'repeat(2, 1fr)',
          gap: 2,
          alignItems: 'stretch'
        }}
      >
        {lookbookData.map((item, index) => (
          <Box
            key={index}
            sx={{
              gridColumn: index % 3 === 2 ? '2 / 3' : '1 / 2',
              gridRow:
                index % 3 === 2
                  ? `${Math.floor(index / 3) * 2 + 1} / span 2`
                  : `${Math.floor(index / 3) * 2 + 1 + (index % 3)} / span 1`,
              backgroundImage: `url(${item?.img})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              backgroundColor: '#000',
              backgroundPosition: 'center',
              height: index % 3 === 2 ? '600px' : '300px',
              position: 'relative',
              '&:hover': {
                opacity: 0.8
              }
            }}
          >
            {/* <Image src={item.img} /> */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 10,
                left: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                padding: '10px',
                borderRadius: '5px'
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {item.price}
              </Typography>
              <Typography variant="h6">{item.title}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default LookBook;
