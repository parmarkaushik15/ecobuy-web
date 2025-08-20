'use client';
import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Link as MuiLink, TextField, Grid, Stack } from '@mui/material';
import Image from 'next/image';
import * as api from 'src/services';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import HeaderBreadcrumbsSkeleton from 'src/components/skeletons/breadcrumbs';

const HeaderBreadcrumbs = dynamic(() => import('src/components/headerBreadcrumbs'), {
  loading: () => <HeaderBreadcrumbsSkeleton />
});

export default function Page() {
  const [blogData, setBlogData] = useState([]);
  const [searchParams, setSearchParams] = useState('');
  const pageTitle = 'Blogs | Perfumeswale';

  function fDateShort(date) {
    return format(new Date(date), 'dd MMM yyyy');
  }

  const getBlogData = async (title = '') => {
    const response = await api.getBlogData(title);
    if (response.success) {
      const arr = response.data.map((item) => ({
        img:
          process.env.IMAGE_BASE === 'LOCAL' ? `${process.env.IMAGE_URL}${item?.blog_img?.url}` : item?.blog_img?.url,
        author: `BY ${item?.author}`,
        date: fDateShort(item.createdAt),
        title: item?.name,
        description: item?.description,
        slug: item?.slug
      }));
      setBlogData(arr);
    }
  };

  useEffect(() => {
    document.title = pageTitle;
    getBlogData();
  }, []);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <HeaderBreadcrumbs heading="Blogs" links={[{ name: 'Home', href: '/' }, { name: 'Blogs' }]} />

      <Stack
        pt={2}
        alignItems="center"
        justifyContent={'space-between'}
        sx={{
          flexDirection: { md: 'row', xs: 'column-reverse' },
          button: {
            mr: 1,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: '5px',
            '&.active': {
              border: (theme) => `1px solid ${theme.palette.primary.main}`,
              svg: {
                color: 'primary.main'
              }
            }
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            width: '100%',
            mt: 2
          }}
        ></Box>
        <TextField
          name="title"
          label="Search by Title"
          variant="outlined"
          size="small"
          value={searchParams}
          onChange={(e) => setSearchParams(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') getBlogData(searchParams);
          }}
          sx={{ width: '300px' }}
        />
      </Stack>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          {blogData.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <MuiLink
                href={`/blogs/${item.slug}`}
                underline="none"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.3s',
                  '&:hover': { transform: 'scale(1.02)' }
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    aspectRatio: '4 / 3',
                    borderRadius: 2,
                    overflow: 'hidden',
                    background: '#e9e9e9'
                  }}
                >
                  <Image src={item.img} alt={item.title} fill style={{ objectFit: 'cover' }} />
                </Box>

                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {item.author} &nbsp; | &nbsp; {item.date}
                </Typography>

                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {item.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {item.description}
                </Typography>
              </MuiLink>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
