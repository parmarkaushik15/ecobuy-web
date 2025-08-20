'use client';
// react
import React from 'react';
import PropTypes from 'prop-types';
// mui
import { Typography } from '@mui/material';
// components
import ProductsCarousel from 'src/components/carousels/gridSlider';
// styles
import RootStyled from './styled';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';

RelatedProducts.propTypes = {
  id: PropTypes.string.isRequired
};

export default function RelatedProducts({ ...props }) {
  const { id } = props;
  const { data, isLoading } = useQuery(['related-products'], () => api.getRelatedProducts(id));

  const { data: pageContextData, isLoading: loadingContext } = useQuery(['get-products-page-context'], () => {
    return api.getProductPageContext();
  });

  const content = pageContextData?.data?.content || {};

  if (!isLoading && !Boolean(data?.data?.length)) {
    return null;
  }
  return (
    <RootStyled>
      <Typography variant="h3" color="text.primary" className="heading">
        {content?.relatedProductTitle || 'Related Products'}
      </Typography>
      <Typography variant="body1" color="text.secondary" className="description">
        {content?.relatedProductSubTitle ||
          'You may also like these carefully selected fragrances that complement your choice.'}
      </Typography>
      <ProductsCarousel data={data?.data} isLoading={isLoading} />
    </RootStyled>
  );
}
