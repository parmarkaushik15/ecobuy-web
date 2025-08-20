'use client';
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { useMediaQuery } from '@mui/material';
import * as api from 'src/services';
import { useQuery } from 'react-query';
import ProductList from './productList';
import SortBar from './sortbar';

ProductListing.propTypes = {
  category: PropTypes.object,
  subCategory: PropTypes.object,
  shop: PropTypes.object,
  compaign: PropTypes.object
};

const sortData = [
  { title: 'Top Rated', key: 'top', value: -1 },
  { title: 'Ascending', key: 'name', value: 1 },
  { title: 'Descending', key: 'name', value: -1 },
  { title: 'Price low to high', key: 'price', value: 1 },
  { title: 'Price high to low', key: 'price', value: -1 },
  { title: 'Oldest', key: 'date', value: 1 },
  { title: 'Newest', key: 'date', value: -1 }
];

const getSearchParams = (searchParams, page) => {
  const params = new URLSearchParams(searchParams);
  params.set('page', page);
  params.set('limit', 12); // Set limit to 12 products per page
  return params.toString().length ? '?' + params.toString() : '';
};

export default function ProductListing({ category, subCategory, shop, compaign }) {
  const searchParams = useSearchParams();
  const { rate } = useSelector(({ settings }) => settings);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const isMobile = useMediaQuery('(max-width:900px)');
  const isFirstRender = useRef(true);

  const { data, isLoading, isFetching, isRefetching } = useQuery(
    [
      'products' + (category || subCategory ? '-with-category' : ''),
      searchParams.toString(),
      category,
      subCategory,
      shop,
      page
    ],
    () =>
      api[
        category
          ? 'getProductsByCategory'
          : subCategory
            ? 'getProductsBySubCategory'
            : shop
              ? 'getProductsByShop'
              : compaign
                ? 'getProductsByCompaign'
                : 'getProducts'
      ](
        getSearchParams(searchParams, page),
        shop ? shop?.slug : category ? category?.slug : subCategory ? subCategory?.slug : compaign ? compaign.slug : '',
        rate
      ),
    {
      keepPreviousData: true,
      onSuccess: (newData) => {
        if (page === 1) {
          setProducts(newData?.data || []);
        } else {
          setProducts((prev) => [...prev, ...(newData?.data || [])]);
        }
        setHasMore((newData?.data?.length || 0) === 12); // Assume more pages if we get 12 products
        isFirstRender.current = false;
      }
    }
  );

  useEffect(() => {
    // Reset products and page when search params change
    setProducts([]);
    setPage(1);
    setHasMore(true);
    isFirstRender.current = true;
  }, [searchParams, category, subCategory, shop, compaign]);

  useEffect(() => {
    if (!hasMore || isFetching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore, isFetching]);

  return (
    <>
      <SortBar
        sortData={sortData}
        productData={data}
        category={subCategory?.parentCategory || category}
        shop={shop}
        subCategory={subCategory}
        isLoading={isLoading}
        compaign={compaign}
      />
      <ProductList
        data={{ ...data, data: products }}
        isLoading={isLoading}
        isMobile={isMobile}
        isFirstLoadDone={!isFirstRender.current}
      />
      {hasMore && (
        <div ref={observerRef} style={{ height: '20px', background: 'transparent' }}>
          {isFetching && !isLoading && <p>Loading more...</p>}
        </div>
      )}
    </>
  );
}
