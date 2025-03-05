import React, { Suspense, useEffect, useState } from 'react';

// components
import SingleSlideCarousel from 'src/components/carousels/singleSlide';
// slides data
// mui
import { Stack } from '@mui/material';
import * as api from 'src/services';
import MegaMenu from 'src/components/mega-menu/MegaMenuDesktopVertical';

export default function Hero({}) {
  const [val, setVal] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await api.getBanners();
      if (data?.success) {
        let arr = [];
        for (let item of data.data) {
          let obj = {
            cover: `${process.env.IMAGE_URL}${item?.banner_img?.url}`,
            heading: 'Top Products Of The Year!',
            description: 'It is a long established fact that a reader will be distracted by the readable.',
            color: '#FBCA66',
            btnPrimary: {
              btnText: 'Shop Now',
              url: '/products?top=-1'
            },
            btnSecondary: {
              btnText: 'See All',
              url: '/products'
            }
          };
          arr.push(obj);
        }
        setVal(arr);
      }
    }
    fetchData();
  }, []);

  return (
    <Stack direction="row" gap={2} mt={2}>
      <Suspense>
        <MegaMenu />
      </Suspense>
      <SingleSlideCarousel data={val} />
    </Stack>
  );
}
