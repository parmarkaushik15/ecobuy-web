// mui
import { Box, Container } from '@mui/material';
import BlogDetail from 'src/components/_main/blog';
// components

// api
import * as api from 'src/services';
export default async function Listing({ params }) {
  const { slug } = params;
  let data;
  if (slug) {
    let value = await api.getBlogSlugs(slug);
    if (value.success) {
      data = value.data;
    }
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ padding: 0, marginTop: '20px' }}>
        <Container maxWidth="xl">
          <BlogDetail value={data} />
        </Container>
      </Box>
    </Container>
  );
}
