import React from 'react';

// mui
import { Container } from '@mui/material';

// component
import CartMain from 'src/components/_main/cart';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// Meta information
export const metadata = {
  title: 'Perfumeswale Shopping Cart | Perfumeswale - Convenient Shopping Cart for Easy Checkout',
  description:
    'View your shopping cart on Perfumeswale for easy checkout. Add, remove, and manage items effortlessly. Enjoy a seamless shopping experience with secure transactions and personalized recommendations. Explore your cart now!',
  applicationName: 'Perfumeswale',
  authors: 'Perfumeswale',
  keywords:
    'shopping cart, Perfumeswale, view cart, cart items, add to cart, remove from cart, manage cart, checkout, online shopping, secure transactions, personalized recommendations, seamless shopping, convenient shopping'
};

export default async function Cart() {
  return (
    <>
      <HeaderBreadcrumbs
        heading="Cart"
        links={[
          {
            name: 'Home',
            href: '/'
          },
          {
            name: 'Products',
            href: '/products'
          },
          {
            name: 'Cart'
          }
        ]}
      />

      <Container maxWidth="xl">
        <CartMain />
      </Container>
    </>
  );
}
