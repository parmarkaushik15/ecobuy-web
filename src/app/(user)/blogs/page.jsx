'use client';
import React, { useEffect, useState } from 'react';

// mui
// import { Box, Container } from '@mui/material';
import { Box, Container, Typography, Link as MuiLink } from '@mui/material';
import Image from 'next/image';
import * as api from 'src/services';
import { format } from 'date-fns';
// component import
// Next.js dynamic import
import dynamic from 'next/dynamic';
import './page.css';

// skeleton component import
import HeaderBreadcrumbsSkeleton from 'src/components/skeletons/breadcrumbs';
const HeaderBreadcrumbs = dynamic(() => import('src/components/headerBreadcrumbs'), {
  loading: () => <HeaderBreadcrumbsSkeleton />
});

export default function Page() {
  const [blogData, setBlogData] = useState([]);

  function fDateShort(date) {
    return format(new Date(date), 'dd MMM yyyy');
  }
  useEffect(() => {
    const getBlogData = async () => {
      const response = await api.getBlogData();

      if (response.success) {
        let arr = [];
        for (const item of response.data) {
          let obj = {
            img:
              process.env.IMAGE_BASE == 'LOCAL'
                ? `${process.env.IMAGE_URL}${item?.blog_img?.url}`
                : item?.blog_img?.url,
            author: 'BY' + ' ' + item?.author,
            date: fDateShort(item.createdAt),
            title: item?.name,
            description: item?.description,
            slug: item?.slug
          };
          arr.push(obj);
        }
        setBlogData(arr);
      }
    };
    getBlogData();
  }, []);
  return (
    <>
      <HeaderBreadcrumbs
        heading="Blogs"
        links={[
          {
            name: 'Home',
            href: '/'
          },
          {
            name: 'Blogs'
          }
        ]}
      />
      <Container maxWidth="xl">
        <Box sx={{ padding: 0, marginTop: '20px' }}>
          <Container
            component="section"
            sx={{
              padding: 0,
              maxWidth: '1320px',
              margin: '0 auto',
              width: '100%'
            }}
          >
            <Box
              className="blog-items"
              sx={{
                display: 'grid',
                gap: '30px',
                gridTemplateColumns: 'repeat(3, 1fr)',
                [(theme) => theme.breakpoints.down('md')]: {
                  gridTemplateColumns: 'repeat(2, 1fr)'
                },
                [(theme) => theme.breakpoints.down('sm')]: {
                  gridTemplateColumns: 'repeat(1, 1fr)'
                }
              }}
            >
              {blogData.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'grid',
                    gap: '15px',
                    textDecoration: 'none',
                    transition: 'all 0.5s ease-in-out'
                  }}
                >
                  <MuiLink href={'/blogs/' + item.slug} component="a" sx={{ display: 'grid', gap: '15px' }}>
                    <Image
                      src={item.img}
                      alt=""
                      width={100}
                      height={100}
                      style={{
                        width: '100%',
                        height: 'auto',
                        aspectRatio: '4/3',
                        background: '#e9e9e9',
                        objectFit: 'cover'
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        display: 'flex',
                        fontFamily: 'Sedan SC, serif',
                        fontWeight: 400,
                        color: '#2d2d2d',
                        fontSize: '24px',
                        margin: 0,
                        padding: 0
                      }}
                    >
                      {item.author + '\u00A0\u00A0\u00A0' + item.date}
                    </Typography>

                    <Typography
                      variant="h3"
                      sx={{
                        fontFamily: 'Sedan SC, serif',
                        fontWeight: 400,
                        color: '#2d2d2d',
                        fontSize: '24px',
                        margin: 0,
                        padding: 0
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: 'Poppins, sans-serif',
                        margin: 0,
                        fontSize: '17px',
                        fontWeight: 300,
                        color: '#2d2d2d',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                      }}
                    >
                      {item.description}
                    </Typography>
                  </MuiLink>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>
      </Container>
    </>
  );
}
