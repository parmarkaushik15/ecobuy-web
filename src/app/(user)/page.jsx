'use client';
import dynamic from 'next/dynamic';

// mui
import { Container } from '@mui/material'; // Importing Container component from MUI (Material-UI) library.

// components
import Hero from 'src/components/_main/home/hero'; // Importing the Hero component.
import TopBanners from 'src/components/_main/home/topBanners'; // Importing the TopBanners component.

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
  return (
    <>
      <Container maxWidth="xl">
        <Hero />
      </Container>
      <Container maxWidth="xl">
        <Categories />
      </Container>
      <Banner type={'1'} />
      <Container maxWidth="xl">
        <FeaturedProducts />
      </Container>
      <Banner type={'2'} />
      <Container maxWidth="xl">
        <BestSellingProducs />
      </Container>
      <Banner type={'3'} />
      <Container maxWidth="xl">
        <TopCollection />
      </Container>
      <Banner type={'4'} />
      <Container maxWidth="xl">
        <Compaigns />
      </Container>
      <Banner type={'5'} />
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
