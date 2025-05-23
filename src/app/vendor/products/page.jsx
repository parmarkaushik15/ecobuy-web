import React from 'react';

// components
import ProductList from 'src/components/_admin/products/productList';
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';

// Meta information
export const metadata = {
  title: 'Products - Ecobuy',
  applicationName: 'Ecobuy',
  authors: 'Ecobuy'
};
export default async function AdminProducts() {
  return (
    <>
      <HeaderBreadcrumbs
        admin
        heading="Product List"
        links={[
          {
            name: 'Dashboard',
            href: '/'
          },
          {
            name: 'Products'
          }
        ]}
        action={{
          href: `/vendor/products/add`,
          title: 'Add Product'
        }}
      />
      <ProductList isVendor />
    </>
  );
}
