'use client';
import React from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// components
import ProductForm from 'src/components/forms/product';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';

EditProduct.propTypes = {
  brands: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  slug: PropTypes.string.isRequired,
  isVendor: PropTypes.bool
};

export default function EditProduct({ slug, isVendor }) {
  const { data: data1 } = useQuery('getAllCategories', api.getAllCategories);
  const { data: data3 } = useQuery('getAllShops', api.getAllShopsByAdmin);
  const { data: data2 } = useQuery('getAllBrandsByAdmin', api.getAllBrandsByAdmin);

  if (data1 && data2 && data3) {
    const { data: categories } = data1;
    const { data: shops } = data3;
    const { data: brands } = data2;
    const { data, isLoading } = useQuery(
      ['coupon-codes'],
      () => api[isVendor ? 'getVendorProductBySlug' : 'getProductBySlug'](slug),
      {
        onError: (err) => {
          toast.error(err.response.data.message || 'Something went wrong!');
        }
      }
    );
    return (
      <div>
        <ProductForm
          shops={shops}
          brands={brands}
          categories={categories}
          currentProduct={data?.data}
          isLoading={isLoading}
          isVendor={isVendor}
        />
      </div>
    );
  } else {
    return <div>loading</div>;
  }
}
