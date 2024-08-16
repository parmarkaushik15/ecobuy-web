import React from 'react';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import AccountGeneral from 'src/components/_main/profile/edit/accountGeneral';

// Meta information
export const metadata = {
  title: 'Setting - Ecobuy',
  applicationName: 'Ecobuy',
  authors: 'Ecobuy'
};
export default function page() {
  return (
    <div>
      <HeaderBreadcrumbs
        heading="Dashboard"
        admin
        links={[
          {
            name: 'Dashboard',
            href: '/'
          },
          {
            name: 'Settings'
          }
        ]}
        action={{
          href: `/vendor/settings/shop`,
          title: 'Shop Setting'
        }}
      />
      <AccountGeneral />
    </div>
  );
}
