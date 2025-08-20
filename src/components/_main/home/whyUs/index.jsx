'use client';
// react
import React from 'react';
// mui
import { Typography, Card, Stack, Divider, Skeleton } from '@mui/material';

// icons
import { MdOutlineSupportAgent } from 'react-icons/md';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { VscFeedback } from 'react-icons/vsc';
// import { MdSettingsBackupRestore } from 'react-icons/md';
import { RiExchangeDollarLine } from 'react-icons/ri';
import { useQuery } from 'react-query';
import * as api from 'src/services';

export default function WhyUs() {
  const { data: pageContextData, isLoading: loadingContext } = useQuery(['get-home-page-context'], () => {
    return api.getHomePageContext();
  });

  const content = pageContextData?.data?.content || {};

  const data = [
    {
      title: content?.freeShippingTitle || 'Free Shipping',
      icon: <AiOutlineShoppingCart size={40} />,
      description: content?.freeShippingSubTitle || 'When you spend ₹100+'
    },
    {
      title: content?.feedbacksTitle || 'Feedbacks',
      icon: <VscFeedback size={40} />,
      description: content?.feedbacksSubTitle || '100% Customer'
    },
    // {
    //   title: 'Free Return',
    //   icon: <MdSettingsBackupRestore size={40} />,
    //   description: '30 Day Returns Policy'
    // },
    {
      title: content?.secureSystemTitle || 'Secure System',
      icon: <RiExchangeDollarLine size={40} />,
      description: content?.secureSystemSubTitle || '100% Secure Gaurantee'
    },
    {
      title: content?.onlineSupportsTitle || 'Online Supports',
      icon: <MdOutlineSupportAgent size={40} />,
      description: content?.onlineSupportsSubTitle || '24/7 Dedicated Support.'
    }
  ];
  return (
    <Card
      sx={{
        mt: 4,
        p: 3,
        borderRadius: '5px',
        boxShadow: 'unset',
        display: {
          md: 'block',
          xs: 'none'
        },
        borderBottom: (theme) => `solid 1px ${theme.palette.divider}`
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-around" spacing={1}>
        {loadingContext ? (
          <>
            {[1, 2, 3, 4].map((item) => (
              <React.Fragment key={item}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Stack>
                    <Skeleton variant="text" width={120} height={30} />
                    <Skeleton variant="text" width={150} height={20} />
                  </Stack>
                </Stack>
                {item !== 4 && <Divider orientation="vertical" flexItem />}
              </React.Fragment>
            ))}
          </>
        ) : (
          // Actual content
          <>
            {data.map((v, i) => (
              <React.Fragment key={Math.random()}>
                <Stack
                  direction="row"
                  alignItems="center"
                  // justifyContent="center"
                  spacing={1}
                  sx={{
                    svg: {
                      color: 'primary.main'
                    }
                  }}
                >
                  {v.icon}
                  <Stack>
                    <Typography variant="h5" color="text.primary">
                      {v.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {v.description}
                    </Typography>
                  </Stack>
                </Stack>
                {/* {i !== 4 ? <Divider orientation="vertical" flexItem /> : null} */}
                {i !== data.length - 1 ? <Divider orientation="vertical" flexItem /> : null}
              </React.Fragment>
            ))}
          </>
        )}
      </Stack>
    </Card>
  );
}
