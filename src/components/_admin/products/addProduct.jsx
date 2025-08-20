'use client';
import React from 'react';
// components
import ProductForm from 'src/components/forms/product';
// api
import * as api from 'src/services';
import { useQuery } from 'react-query';

export default function AddProduct({ isVendor }) {
  const { data: data1 } = useQuery('getAllCategories', api.getAllCategories);
  const { data: data3 } = useQuery('getAllShops', api.getAllShopsByAdmin);
  const { data: data2 } = useQuery('getAllBrandsByAdmin', api.getAllBrandsByAdmin);
  if (data1 && data2 && data3) {
    const { data: categories } = data1;
    const { data: shops } = data3;
    const { data: brands } = data2;
    return (
      <div>
        <ProductForm
          brands={brands}
          categories={categories}
          subCategories={[]}
          shops={shops}
          isEdit={true}
          isVendor={isVendor}
        />
      </div>
    );
  } else {
    return <div>loading</div>;
  }
}
