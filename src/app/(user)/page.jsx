'use client';
import dynamic from 'next/dynamic';

// MUI
import { Container, Grid } from '@mui/material';

// Components
import Hero from 'src/components/_main/home/hero';
import TopBanners from 'src/components/_main/home/topBanners';
import WhyUs from 'src/components/_main/home/whyUs';
import * as api from 'src/services';
import { useQuery } from 'react-query';
import Head from 'next/head';
import { useEffect } from 'react';

// Dynamic imports
const Categories = dynamic(() => import('src/components/_main/home/categories'));
const BestSellingProducs = dynamic(() => import('src/components/_main/home/bestSelling'));
const Banner = dynamic(() => import('src/components/_main/home/banner'));
const Brands = dynamic(() => import('src/components/_main/home/brands'));
const TopCollection = dynamic(() => import('src/components/_main/home/top'));
const Compaigns = dynamic(() => import('src/components/_main/home/compaign'));
const FeaturedProducts = dynamic(() => import('src/components/_main/home/featured'));
const SubscriptionModal = dynamic(() => import('src/components/_main/home/subscription'), {
  ssr: false
});

export default function IndexPage() {
  const { data, isLoading } = useQuery(['get-home-compaign-all'], () => api.getHomeCompaigns());

  const pageTitle = 'Home | Perfumes Wala';

  useEffect(() => {
    document.title = pageTitle; // Force title update
  }, []);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Container maxWidth="xl">
        <Categories />
      </Container>

      <Container maxWidth="xl">
        <Hero />
        <WhyUs />
      </Container>

      <Container maxWidth="xl">
        <FeaturedProducts />
      </Container>

      <Container maxWidth="xl">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Banner type={'1'} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Banner type={'2'} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Banner type={'3'} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Banner type={'4'} />
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth="xl">
        <BestSellingProducs />
      </Container>

      <Container maxWidth="xl">
        <TopCollection />
      </Container>

      <Container maxWidth="xl">
        <Compaigns />
      </Container>

      <Container maxWidth="xl">
        <Banner type={'5'} />
      </Container>

      <Container maxWidth="xl">
        <Brands />
      </Container>

      <Container maxWidth="xl">
        <TopBanners />
      </Container>

      <SubscriptionModal />
    </>
  );
}
