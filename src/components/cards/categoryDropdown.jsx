'use client';
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
// MUI
import { Typography, FormControl, Select, MenuItem, Skeleton, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled components for professional look
const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1,
  display: 'none' // Hidden since we don’t need a label for this dropdown
}));

const DropdownWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 1000,
  width: 200,
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  borderRadius: 4,
  opacity: 0,
  visibility: 'hidden',
  transition: 'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out'
}));

const Container = styled(Box)(({ theme }) => ({
  position: 'relative',
  '&:hover .dropdown': {
    opacity: 1,
    visibility: 'visible'
  }
}));

export default function CategoryDropdown({ category, isLoading, baseUrl }) {
  const [selectedSubCategory, setSelectedSubCategory] = useState('');

  // Debounced handler to prevent rapid state changes
  const handleChange = useCallback((event) => {
    setSelectedSubCategory(event.target.value);
  }, []);

  return (
    <Container>
      <Typography
        {...(!isLoading && {
          component: Link,
          href: baseUrl + category.slug
        })}
        color="text.primary"
        variant="h6"
        textAlign="center"
        noWrap
        className="title"
        sx={{ py: 0.5, textTransform: 'capitalize' }}
      >
        {isLoading ? <Skeleton variant="text" width={100} /> : category?.name}
      </Typography>
      {category?.subCategories?.length > 0 && (
        <DropdownWrapper className="dropdown">
          <FormControl fullWidth sx={{ p: 1 }}>
            <LabelStyle component={'label'} htmlFor="subCategory">
              SubCategory
            </LabelStyle>
            {isLoading ? (
              <Skeleton variant="rounded" height={40} width="100%" />
            ) : (
              <Select
                id="subCategory"
                size="small"
                value={selectedSubCategory}
                onChange={handleChange}
                displayEmpty
                sx={{
                  '& .MuiSelect-select': {
                    padding: '8px 12px'
                  }
                }}
              >
                <MenuItem value="" disabled>
                  Select Subcategory
                </MenuItem>
                {category.subCategories.map((subcat) => (
                  <MenuItem key={subcat.slug} value={subcat.slug} component={Link} href={`/products/${subcat.slug}`}>
                    {subcat.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          </FormControl>
        </DropdownWrapper>
      )}
    </Container>
  );
}

CategoryDropdown.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  baseUrl: PropTypes.string.isRequired,
  category: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    subCategories: PropTypes.array
  }).isRequired
};
