'use client';
import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Container,
  Avatar,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Rating
} from '@mui/material';
import { styled } from '@mui/system';

const StyledImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 'auto',
  borderRadius: '8px',
  objectFit: 'cover',
  [theme.breakpoints.down('sm')]: {
    borderRadius: '4px'
  }
}));

const sampleReviews = [
  {
    author: 'John Doe',
    text: 'Great article! I really enjoyed the insights provided.',
    rating: 5
  },
  {
    author: 'Jane Smith',
    text: 'Very informative post. Helped me a lot in understanding the topic.',
    rating: 4
  },
  {
    author: 'Alex Johnson',
    text: 'The content is well-structured and easy to follow. Keep up the good work!',
    rating: 4.5
  },
  {
    author: 'Emily Davis',
    text: 'I found some sections a bit too technical, but overall, a great read.',
    rating: 3.5
  }
];

export default function BlogDetail({ value, reviews = [] }) {
  const { blog_img, name, author, description, createdAt } = value || {};

  const handleSubmitReview = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const review = formData.get('review');
    console.log('New Review:', review);
    // Submit review logic here
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', minHeight: '100vh' }}>
      <Container>
        <Grid container spacing={4}>
          {/* Left Portion - Blog Detail */}
          <Grid item xs={12} md={8}>
            <Box py={5} sx={{ px: { xs: 2, sm: 3, md: 5 }, maxWidth: '100%' }}>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {name}
              </Typography>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <Avatar alt={author} src="/static/images/avatar/1.jpg" />
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1" color="text.secondary">
                    By {author}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(createdAt).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
              <Box mt={3}>
                {blog_img && (
                  <StyledImage
                    src={process.env.IMAGE_BASE === 'LOCAL' ? `${process.env.IMAGE_URL}${blog_img.url}` : blog_img.url}
                    alt={name}
                  />
                )}
              </Box>
              <Typography variant="body1" color="text.primary" mt={3}>
                {description}
              </Typography>
            </Box>
          </Grid>

          {/* Right Portion - Reviews */}
          <Grid item xs={12} md={4}>
            <Box py={5} sx={{ px: { xs: 2, sm: 3, md: 5 } }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Reviews
              </Typography>
              <List>
                {sampleReviews.map((review, index) => (
                  <ListItem key={index} alignItems="flex-start">
                    <ListItemText
                      primary={review.author}
                      secondary={
                        <>
                          <Rating value={review.rating} precision={0.5} readOnly size="small" />
                          <Typography variant="body2" color="text.secondary">
                            {review.text}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
              <Box component="form" onSubmit={handleSubmitReview} mt={3}>
                <TextField
                  label="Write a review"
                  name="review"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  sx={{ mb: 2 }}
                />
                <Rating name="rating" precision={0.5} sx={{ mb: 2 }} />
                <Button type="submit" variant="contained" color="primary">
                  Submit Review
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
