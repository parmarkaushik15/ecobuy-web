// mui
import { Box, Container } from '@mui/material';

// components
import HeaderBreadcrumbs from 'src/components/headerBreadcrumbs';
import ProductList from 'src/components/_main/products';

export default async function Listing() {
  return (
    <Box>
      <Box sx={{ bgcolor: 'background.default' }}>
        <HeaderBreadcrumbs
          heading="Products"
          links={[
            {
              name: 'Home',
              href: '/'
            },
            {
              name: 'Products'
            }
          ]}
        />
        <Container maxWidth="xl">
          <ProductList />
        </Container>
      </Box>
    </Box>
  );
}
