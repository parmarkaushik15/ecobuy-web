import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import OrdersList from 'src/components/_admin/orders/ordersList';

// Meta information
export const metadata = {
  title: 'Order - Ecobuy',
  applicationName: 'Ecobuy',
  authors: 'Ecobuy'
};
export default function page() {
  return (
    <div>
      <HeaderBreadcrumbs
        admin
        heading="Orders List"
        links={[
          {
            name: 'Dashboard',
            href: '/'
          },
          {
            name: 'Orders'
          }
        ]}
      />
      <OrdersList isVendor />
    </div>
  );
}
