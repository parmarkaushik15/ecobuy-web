import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AddProduct from 'src/components/_admin/products/addProduct';

// api
import * as api from 'src/services';

export default async function page() {
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Product List"
        links={[
          {
            name: 'Dashboard',
            href: '/'
          },
          {
            name: 'Products',
            href: '/vendor/products'
          },
          {
            name: 'Add Product'
          }
        ]}
      />
      <AddProduct isVendor />
    </div>
  );
}
