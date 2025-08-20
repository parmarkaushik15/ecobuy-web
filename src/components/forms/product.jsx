'use client';
import * as Yup from 'yup';
import React from 'react';
import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import { capitalCase } from 'change-case';
import { useRouter } from 'next-nprogress-bar';
import { sendGAEvent } from '@next/third-parties/google';

import { Form, FormikProvider, useFormik, FieldArray } from 'formik';
// mui
import { alpha, styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Chip,
  Grid,
  Stack,
  Select,
  TextField,
  Typography,
  FormControl,
  Autocomplete,
  FormHelperText,
  FormControlLabel,
  FormGroup,
  Skeleton,
  Switch,
  InputAdornment,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
// api
import * as api from 'src/services';
import { useMutation } from 'react-query';
import axios from 'axios';

// components
import UploadMultiFile from 'src/components/upload/UploadMultiFile';
import { fCurrency } from 'src/utils/formatNumber';

// ----------------------------------------------------------------------

const GENDER_OPTION = ['men', 'women', 'kids', 'others'];
const STATUS_OPTIONS = ['sale', 'new', 'regular', 'disabled'];
const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,

  lineHeight: 2.5
}));

// ----------------------------------------------------------------------

export default function ProductForm({
  categories,
  currentProduct,
  categoryLoading = false,
  isInitialized = false,
  brands,
  shops,
  isVendor
}) {
  const router = useRouter();
  const [loading, setloading] = React.useState(false);
  const { mutate, isLoading: updateLoading } = useMutation(
    currentProduct ? 'update' : 'new',
    currentProduct
      ? isVendor
        ? api.updateVendorProduct
        : api.updateProductByAdmin
      : isVendor
        ? api.createVendorProduct
        : api.createProductByAdmin,
    {
      onSuccess: (data) => {
        toast.success(data.message);

        router.push((isVendor ? '/vendor' : '/admin') + '/products');
      },
      onError: (error) => {
        toast.error(error.response.data.message);
      }
    }
  );

  const [videoState, setVideoState] = React.useState({
    video: null, // Store single video object
    videoBlob: null, // Store video file for preview
    videoLoading: false, // Track video upload progress
    videoProgress: 0 // Track upload percentage
  });

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Product name is required'),
    code: Yup.string().required('Product code is required'),
    tags: Yup.array().min(1, 'Tags is required'),
    status: Yup.string().required('Status is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
    shop: isVendor ? Yup.string().nullable().notRequired() : Yup.string().required('Shop is required'),
    slug: Yup.string().required('Slug is required'),
    brand: Yup.string().required('Brand is required'),
    metaTitle: Yup.string().required('Meta title is required'),
    metaDescription: Yup.string().required('Meta description is required'),
    images: Yup.array().min(1, 'Images is required'),
    sku: Yup.string().required('SKU is required'),
    available: Yup.number().required('Quantity is required'),
    colors: Yup.array().required('Color is required'),
    variant: Yup.array()
      .of(
        Yup.object().shape({
          size: Yup.string().required('Size is required'),
          price: Yup.number().required('Price is required').min(0, 'Price must be non-negative'),
          priceSale: Yup.number()
            .required('Sale price is required')
            .min(0, 'Sale price must be non-negative')
            .lessThan(Yup.ref('price'), 'Sale price must be less than regular price')
        })
      )
      .min(1, 'At least one variant is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      code: currentProduct?.code || '',
      slug: currentProduct?.slug || '',
      metaTitle: currentProduct?.metaTitle || '',
      metaDescription: currentProduct?.metaDescription || '',
      brand: currentProduct?.brand || brands[0]?._id || '',
      tags: currentProduct?.tags || [],
      gender: currentProduct?.gender || '',
      category: currentProduct?.category || (categories.length && categories[0]?._id) || '',
      shop: isVendor ? null : currentProduct?.shop || (shops?.length && shops[0]?._id) || '',
      subCategory: currentProduct?.subCategory || (categories.length && categories[0].subCategories[0]?._id) || '',
      status: currentProduct?.status || STATUS_OPTIONS[0],
      blob: currentProduct?.blob || [],
      isFeatured: currentProduct?.isFeatured || false,
      sku: currentProduct?.sku || '',
      available: currentProduct?.available || '',
      images: currentProduct?.images || [],
      video: currentProduct?.video || null,
      colors: currentProduct?.colors || [],
      variant: currentProduct?.variant || [{ size: '', price: '', priceSale: '' }]
    },

    validationSchema: NewProductSchema,
    onSubmit: async (values) => {
      const { ...rest } = values;
      try {
        mutate({
          ...rest,
          video: values.video || null,
          ...(currentProduct && { currentSlug: currentProduct.slug })
        });
      } catch (error) {
        console.error(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;
  const { mutate: deleteMutate } = useMutation(api.singleDeleteFile, {
    onError: (error) => {
      toast.error(error.response.data.message);
    }
  });

  const handleDrop = (acceptedFiles) => {
    setloading(true);
    const uploaders = acceptedFiles.map((file) => {
      if (file.type === 'video/mp4') {
        if (!isVendor) {
          setloading(false);
          toast.error('Only vendors can upload videos');
          return Promise.resolve(null);
        }
        if (file.size > 10485760) {
          setloading(false);
          toast.error('Video must be 10MB or smaller');
          return Promise.resolve(null);
        }
        setVideoState((prev) => ({ ...prev, videoBlob: file, videoLoading: true }));
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'my-uploads');
        const config = {
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            const percentage = Math.floor((loaded * 100) / total);
            setVideoState((prev) => ({ ...prev, videoProgress: percentage }));
          }
        };
        if (process.env.IMAGE_BASE === 'LOCAL') {
          return axios
            .post(`${process.env.BASE_URL}/upload?location=product&isVideo=true`, formData, config)
            .catch((error) => {
              toast.error('Video upload failed');
              return null;
            });
        } else {
          return axios
            .post(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`, formData, config)
            .catch((error) => {
              toast.error('Video upload failed');
              return null;
            });
        }
      } else if (file.type.startsWith('image/')) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'my-uploads');
        setFieldValue('blob', [...values.blob, file]);
        const config = {
          onUploadProgress: (progressEvent) => {
            const { loaded, total } = progressEvent;
            const percentage = Math.floor((loaded * 100) / total);
            setstate((prev) => ({ ...prev, loading: percentage }));
          }
        };
        if (process.env.IMAGE_BASE === 'LOCAL') {
          return axios.post(`${process.env.BASE_URL}/upload?location=product`, formData, config).catch((error) => {
            toast.error('Image upload failed');
            return null;
          });
        } else {
          return axios
            .post(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, formData, config)
            .catch((error) => {
              toast.error('Image upload failed');
              return null;
            });
        }
      } else {
        toast.error('Only MP4 videos and images are allowed');
        return Promise.resolve(null);
      }
    });

    axios.all(uploaders).then((results) => {
      const newImages = [];
      let newVideo = null;
      results.forEach((result) => {
        if (result && result.data && (result.data.secure_url || (result.data.data && result.data.data.secure_url))) {
          const { data } = result;
          const secureUrl = data.secure_url || data.data.secure_url;
          if (secureUrl && secureUrl.endsWith('.mp4')) {
            newVideo = {
              _id: data.public_id || data.data?.public_id,
              url: process.env.IMAGE_BASE === 'LOCAL' ? `${process.env.BASE_URL}/${secureUrl}` : secureUrl
            };
          } else if (secureUrl && secureUrl.match(/\.(jpeg|jpg|png|gif)$/)) {
            newImages.push({
              _id: data.public_id || data.data?.public_id,
              url: process.env.IMAGE_BASE === 'LOCAL' ? `${process.env.BASE_URL}/${secureUrl}` : secureUrl
            });
          }
        }
      });

      if (newImages.length > 0) {
        setFieldValue('images', [...values.images, ...newImages]);
      }
      if (newVideo) {
        setFieldValue('video', newVideo);
        setVideoState((prev) => ({
          ...prev,
          video: newVideo,
          videoBlob: prev.videoBlob,
          videoLoading: false,
          videoProgress: 0
        }));
      } else {
        setVideoState((prev) => ({
          ...prev,
          videoLoading: false,
          videoProgress: 0
        }));
      }
      setloading(false);
    });
  };

  const [state, setstate] = React.useState({
    loading: false,
    name: '',
    search: '',
    open: false
  });

  const handleRemoveAll = () => {
    values.images.forEach((image) => {
      deleteMutate(image._id);
    });
    setFieldValue('images', []);
  };

  const handleRemove = (file) => {
    const removeImage = values.images.filter((_file) => {
      if (_file._id === file._id) {
        deleteMutate(file._id);
      }
      return _file !== file;
    });
    setFieldValue('images', removeImage);
  };

  const handleRemoveVideo = () => {
    if (values.video) {
      deleteMutate(values.video._id);
      setFieldValue('video', null);
      setVideoState((prev) => ({ ...prev, video: null, videoBlob: null }));
    }
  };

  const [openVideoModal, setOpenVideoModal] = React.useState(false);

  const handleOpenVideoModal = () => {
    if (values.video || videoState.videoBlob) {
      setOpenVideoModal(true);
    } else {
      toast.error('No video available to play');
    }
  };

  const handleCloseVideoModal = () => {
    setOpenVideoModal(false);
  };

  const handleTitleChange = (event) => {
    const title = event.target.value;
    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]+/g, '')
      .replace(/\s+/g, '-');
    formik.setFieldValue('slug', slug);
    formik.handleChange(event);
  };

  return (
    <Stack spacing={3}>
      <>
        {(currentProduct?.approvalStatus == 'need info' || currentProduct?.approvalStatus == 'rejected') && (
          <Card sx={{ borderRadius: 0, boxShadow: 'unset' }}>
            <Box textAlign={'left'} sx={{ background: (theme) => theme.palette.primary.gray, p: 2 }}>
              <Typography component="h2" color="error" sx={{ fontSize: 20, fontWeight: 700 }}>
                Reason
              </Typography>
              <Typography component="p" color="text.secondarydark" mb={1}>
                {currentProduct.notes}
              </Typography>
            </Box>
          </Card>
        )}
      </>
      <FormikProvider value={formik}>
        <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Stack spacing={3}>
                <Card sx={{ p: 3, borderRadius: 0, boxShadow: 'unset' }}>
                  <Stack spacing={3}>
                    <div>
                      {isInitialized ? (
                        <Skeleton variant="text" width={140} />
                      ) : (
                        <LabelStyle component={'label'} htmlFor="product-name">
                          {'Product Name'}
                        </LabelStyle>
                      )}
                      {isInitialized ? (
                        <Skeleton variant="rectangular" width="100%" height={56} />
                      ) : (
                        <TextField
                          id="product-name"
                          fullWidth
                          {...getFieldProps('name')}
                          onChange={handleTitleChange}
                          error={Boolean(touched.name && errors.name)}
                          helperText={touched.name && errors.name}
                        />
                      )}
                    </div>
                    <div>
                      <Grid container spacing={2}>
                        {isVendor ? null : (
                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                              {isInitialized ? (
                                <Skeleton variant="text" width={100} />
                              ) : (
                                <LabelStyle component={'label'} htmlFor="shop-select">
                                  {'Shop'}
                                </LabelStyle>
                              )}
                              <Select native {...getFieldProps('shop')} value={values.shop} id="shop-select">
                                {shops?.map((shop) => (
                                  <option key={shop._id} value={shop._id}>
                                    {shop.title}
                                  </option>
                                ))}
                              </Select>
                              {touched.shop && errors.shop && (
                                <FormHelperText error sx={{ px: 2, mx: 0 }}>
                                  {touched.shop && errors.shop}
                                </FormHelperText>
                              )}
                            </FormControl>
                          </Grid>
                        )}
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            {isInitialized ? (
                              <Skeleton variant="text" width={100} />
                            ) : (
                              <LabelStyle component={'label'} htmlFor="grouped-native-select">
                                {'Category'}
                              </LabelStyle>
                            )}
                            {!categoryLoading ? (
                              <Select
                                native
                                {...getFieldProps('category')}
                                value={values.category}
                                id="grouped-native-select"
                              >
                                {categories?.map((category) => (
                                  <option key={category._id} value={category._id}>
                                    {category.name}
                                  </option>
                                ))}
                              </Select>
                            ) : (
                              <Skeleton variant="rectangular" width={'100%'} height={56} />
                            )}
                            {touched.category && errors.category && (
                              <FormHelperText error sx={{ px: 2, mx: 0 }}>
                                {touched.category && errors.category}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            {isInitialized ? (
                              <Skeleton variant="text" width={100} />
                            ) : (
                              <LabelStyle component={'label'} htmlFor="grouped-native-select-subCategory">
                                {'Sub Category'}
                              </LabelStyle>
                            )}
                            {!categoryLoading ? (
                              <Select
                                native
                                {...getFieldProps('subCategory')}
                                value={values.subCategory}
                                id="grouped-native-select-subCategory"
                              >
                                {categories
                                  .find((v) => v._id.toString() === values.category)
                                  ?.subCategories?.map((subCategory) => (
                                    <option key={subCategory._id} value={subCategory._id}>
                                      {subCategory.name}
                                    </option>
                                  ))}
                              </Select>
                            ) : (
                              <Skeleton variant="rectangular" width={'100%'} height={56} />
                            )}
                            {touched.subCategory && errors.subCategory && (
                              <FormHelperText error sx={{ px: 2, mx: 0 }}>
                                {touched.subCategory && errors.subCategory}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            {isInitialized ? (
                              <Skeleton variant="text" width={100} />
                            ) : (
                              <LabelStyle component={'label'} htmlFor="brand-name">
                                {'Brand'}
                              </LabelStyle>
                            )}
                            <Select native {...getFieldProps('brand')} value={values.brand} id="grouped-native-select">
                              {brands?.map((brand) => (
                                <option key={brand._id} value={brand._id}>
                                  {brand.name}
                                </option>
                              ))}
                            </Select>
                            {touched.brand && errors.brand && (
                              <FormHelperText error sx={{ px: 2, mx: 0 }}>
                                {touched.brand && errors.brand}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                          <LabelStyle component={'label'}>Variants</LabelStyle>
                          <FieldArray name="variant">
                            {({ push, remove }) => (
                              <>
                                {values.variant.map((variant, index) => (
                                  <Grid container spacing={1} key={index} alignItems="center" sx={{ mb: 2 }}>
                                    <Grid item xs={12} sm={4}>
                                      <TextField
                                        fullWidth
                                        label="Size"
                                        name={`variant[${index}].size`}
                                        value={variant.size}
                                        onChange={(e) => {
                                          setFieldValue(`variant[${index}].size`, e.target.value.toUpperCase());
                                        }}
                                        error={Boolean(touched.variant?.[index]?.size && errors.variant?.[index]?.size)}
                                        helperText={touched.variant?.[index]?.size && errors.variant?.[index]?.size}
                                      />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                      <TextField
                                        fullWidth
                                        label="Price"
                                        type="number"
                                        name={`variant[${index}].price`}
                                        value={variant.price}
                                        onChange={formik.handleChange}
                                        InputProps={{
                                          startAdornment: (
                                            <InputAdornment position="start">
                                              {fCurrency(0)?.split('0')[0]}
                                            </InputAdornment>
                                          )
                                        }}
                                        error={Boolean(
                                          touched.variant?.[index]?.price && errors.variant?.[index]?.price
                                        )}
                                        helperText={touched.variant?.[index]?.price && errors.variant?.[index]?.price}
                                      />
                                    </Grid>
                                    <Grid item xs={12} sm={3}>
                                      <TextField
                                        fullWidth
                                        label="Sale Price"
                                        type="number"
                                        name={`variant[${index}].priceSale`}
                                        value={variant.priceSale}
                                        onChange={formik.handleChange}
                                        InputProps={{
                                          startAdornment: (
                                            <InputAdornment position="start">
                                              {fCurrency(0)?.split('0')[0]}
                                            </InputAdornment>
                                          )
                                        }}
                                        error={Boolean(
                                          touched.variant?.[index]?.priceSale && errors.variant?.[index]?.priceSale
                                        )}
                                        helperText={
                                          touched.variant?.[index]?.priceSale && errors.variant?.[index]?.priceSale
                                        }
                                      />
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                      <IconButton
                                        color="error"
                                        onClick={() => remove(index)}
                                        disabled={values.variant.length === 1}
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </Grid>
                                  </Grid>
                                ))}
                                <Button
                                  variant="outlined"
                                  onClick={() => push({ size: '', price: '', priceSale: '' })}
                                  sx={{ mt: 1 }}
                                >
                                  Add Variant
                                </Button>
                              </>
                            )}
                          </FieldArray>
                          {touched.variant && errors.variant && typeof errors.variant === 'string' && (
                            <FormHelperText error sx={{ px: 2 }}>
                              {errors.variant}
                            </FormHelperText>
                          )}
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <LabelStyle component={'label'} htmlFor="color">
                            {'Colors'}
                          </LabelStyle>
                          <Autocomplete
                            id="color"
                            multiple
                            freeSolo
                            value={values.colors}
                            onChange={(event, newValue) => {
                              setFieldValue('colors', newValue);
                            }}
                            options={[]}
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                              ))
                            }
                            renderInput={(params) => (
                              <TextField
                                id=""
                                {...params}
                                error={Boolean(touched.colors && errors.colors)}
                                helperText={touched.colors && errors.colors}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
                            {isInitialized ? (
                              <Skeleton variant="text" width={80} />
                            ) : (
                              <LabelStyle component={'label'} htmlFor="gander">
                                {'Gender'}
                              </LabelStyle>
                            )}
                            {isInitialized ? (
                              <Skeleton variant="rectangular" width="100%" height={56} />
                            ) : (
                              <Select
                                id="gander"
                                native
                                {...getFieldProps('gender')}
                                error={Boolean(touched.gender && errors.gender)}
                              >
                                <option value={''}>
                                  <em>None</em>
                                </option>
                                {GENDER_OPTION.map((gender) => (
                                  <option key={gender} value={gender}>
                                    {capitalCase(gender)}
                                  </option>
                                ))}
                              </Select>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <FormControl fullWidth>
                            {isInitialized ? (
                              <Skeleton variant="text" width={80} />
                            ) : (
                              <LabelStyle component={'label'} htmlFor="status">
                                {'Status'}
                              </LabelStyle>
                            )}
                            {isInitialized ? (
                              <Skeleton variant="rectangular" width="100%" height={56} />
                            ) : (
                              <Select
                                id="status"
                                native
                                {...getFieldProps('status')}
                                error={Boolean(touched.status && errors.status)}
                              >
                                <option value="" style={{ display: 'none' }} />
                                {STATUS_OPTIONS.map((status) => (
                                  <option key={status} value={status}>
                                    {capitalCase(status)}
                                  </option>
                                ))}
                              </Select>
                            )}
                            {touched.status && errors.status && (
                              <FormHelperText error sx={{ px: 2, mx: 0 }}>
                                {touched.status && errors.status}
                              </FormHelperText>
                            )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <div>
                            {isInitialized ? (
                              <Skeleton variant="text" width={120} />
                            ) : (
                              <LabelStyle component={'label'} htmlFor="product-code">
                                {'Product Code'}
                              </LabelStyle>
                            )}
                            {isInitialized ? (
                              <Skeleton variant="rectangular" width="100%" height={56} />
                            ) : (
                              <TextField
                                id="product-code"
                                fullWidth
                                {...getFieldProps('code')}
                                error={Boolean(touched.code && errors.code)}
                                helperText={touched.code && errors.code}
                              />
                            )}
                          </div>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <div>
                            <LabelStyle component={'label'} htmlFor="product-sku">
                              {'Product SKU'}
                            </LabelStyle>
                            <TextField
                              id="product-sku"
                              fullWidth
                              {...getFieldProps('sku')}
                              error={Boolean(touched.sku && errors.sku)}
                              helperText={touched.sku && errors.sku}
                            />
                          </div>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          {isInitialized ? (
                            <Skeleton variant="text" width={70} />
                          ) : (
                            <LabelStyle component={'label'} htmlFor="tags">
                              {'Tags'}
                            </LabelStyle>
                          )}
                          {isInitialized ? (
                            <Skeleton variant="rectangular" width="100%" height={56} />
                          ) : (
                            <Autocomplete
                              id="tags"
                              multiple
                              freeSolo
                              value={values.tags}
                              onChange={(event, newValue) => {
                                setFieldValue('tags', newValue);
                              }}
                              options={[]}
                              renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                  <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                                ))
                              }
                              renderInput={(params) => (
                                <TextField
                                  id=""
                                  {...params}
                                  error={Boolean(touched.tags && errors.tags)}
                                  helperText={touched.tags && errors.tags}
                                />
                              )}
                            />
                          )}
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <div>
                            {isInitialized ? (
                              <Skeleton variant="text" width={100} />
                            ) : (
                              <LabelStyle component={'label'} htmlFor="meta-title">
                                {'Meta Title'}
                              </LabelStyle>
                            )}
                            {isInitialized ? (
                              <Skeleton variant="rectangular" width="100%" height={56} />
                            ) : (
                              <TextField
                                id="meta-title"
                                fullWidth
                                {...getFieldProps('metaTitle')}
                                error={Boolean(touched.metaTitle && errors.metaTitle)}
                                helperText={touched.metaTitle && errors.metaTitle}
                              />
                            )}
                          </div>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <div>
                            {isInitialized ? (
                              <Skeleton variant="text" width={120} />
                            ) : (
                              <LabelStyle component={'label'} htmlFor="description">
                                {'Description'}
                              </LabelStyle>
                            )}
                            {isInitialized ? (
                              <Skeleton variant="rectangular" width="100%" height={240} />
                            ) : (
                              <TextField
                                id="description"
                                fullWidth
                                {...getFieldProps('description')}
                                error={Boolean(touched.description && errors.description)}
                                helperText={touched.description && errors.description}
                                rows={9}
                                multiline
                              />
                            )}
                          </div>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <div>
                            <LabelStyle component={'label'} htmlFor="product-image">
                              {'Product Images'} <span>1080 * 1080</span>
                            </LabelStyle>
                            <UploadMultiFile
                              id="product-image"
                              showPreview
                              maxSize={3145728}
                              accept="image/*"
                              files={values.images}
                              blob={values.blob}
                              loading={loading}
                              onDrop={(files) => handleDrop(files)}
                              onRemove={handleRemove}
                              onRemoveAll={handleRemoveAll}
                              error={Boolean(touched.images && errors.images)}
                            />
                            {touched.images && errors.images && (
                              <FormHelperText error sx={{ px: 2 }}>
                                {touched.images && errors.images}
                              </FormHelperText>
                            )}
                          </div>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <div>
                            <LabelStyle component={'label'} htmlFor="product-video">
                              {'Product Video'} <span>MP4 only, max 10MB</span>
                            </LabelStyle>
                            <UploadMultiFile
                              id="product-video"
                              showPreview
                              accept="video/mp4"
                              files={
                                values.video
                                  ? [values.video]
                                  : videoState.videoBlob
                                    ? [{ url: 'video-placeholder', blob: videoState.videoBlob }]
                                    : []
                              }
                              blob={[]}
                              loading={videoState.videoLoading}
                              progress={videoState.videoProgress}
                              onDrop={(files) => handleDrop(files)}
                              onRemove={() => handleRemoveVideo()}
                              onRemoveAll={() => handleRemoveVideo()}
                              error={false}
                              disabled={!isVendor}
                              isInitialized={false}
                              isEdit={!!currentProduct}
                              dropzoneText="Drop or Select Video"
                              playButton={
                                (values.video || videoState.videoBlob) && (
                                  <Button
                                    variant="outlined"
                                    startIcon={<PlayCircleOutlineIcon />}
                                    onClick={handleOpenVideoModal}
                                  >
                                    Play Video
                                  </Button>
                                )
                              }
                            />
                            {!isVendor && (
                              <FormHelperText sx={{ px: 2 }}>Video upload is available for vendors only</FormHelperText>
                            )}
                          </div>
                        </Grid>
                        <Dialog
                          open={openVideoModal}
                          onClose={handleCloseVideoModal}
                          TransitionComponent={Slide}
                          TransitionProps={{ direction: 'up' }}
                          maxWidth="md"
                          aria-labelledby="video-dialog-title"
                          sx={{
                            '& .MuiDialog-paper': {
                              bgcolor: 'background.default',
                              borderRadius: 2,
                              boxShadow: (theme) => theme.shadows[24]
                            }
                          }}
                        >
                          <DialogTitle
                            id="video-dialog-title"
                            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                          >
                            <Typography variant="h6">Product Video</Typography>
                            <IconButton onClick={handleCloseVideoModal} aria-label="close">
                              <CloseIcon />
                            </IconButton>
                          </DialogTitle>
                          <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
                            <video
                              src={videoState.videoBlob ? URL.createObjectURL(videoState.videoBlob) : values.video?.url}
                              controls
                              autoPlay
                              style={{
                                width: '100%',
                                maxHeight: '70vh',
                                objectFit: 'contain',
                                backgroundColor: '#000'
                              }}
                            />
                          </DialogContent>
                        </Dialog>
                      </Grid>
                    </div>
                  </Stack>
                </Card>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card sx={{ p: 3, borderRadius: 0, boxShadow: 'unset' }}>
                <Stack spacing={3} pb={1}>
                  <div>
                    {isInitialized ? (
                      <Skeleton variant="text" width={70} />
                    ) : (
                      <LabelStyle component={'label'} htmlFor="slug">
                        {'Slug'}
                      </LabelStyle>
                    )}
                    {isInitialized ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <TextField
                        id="slug"
                        fullWidth
                        {...getFieldProps('slug')}
                        error={Boolean(touched.slug && errors.slug)}
                        helperText={touched.slug && errors.slug}
                      />
                    )}
                  </div>
                  <div>
                    {isInitialized ? (
                      <Skeleton variant="text" width={140} />
                    ) : (
                      <LabelStyle component={'label'} htmlFor="meta-description">
                        {'Meta Description'}
                      </LabelStyle>
                    )}
                    {isInitialized ? (
                      <Skeleton variant="rectangular" width="100%" height={240} />
                    ) : (
                      <TextField
                        id="meta-description"
                        fullWidth
                        {...getFieldProps('metaDescription')}
                        error={Boolean(touched.metaDescription && errors.metaDescription)}
                        helperText={touched.metaDescription && errors.metaDescription}
                        rows={9}
                        multiline
                      />
                    )}
                  </div>
                  <div>
                    <LabelStyle component={'label'} htmlFor="quantity">
                      {'Quantity'}
                    </LabelStyle>
                    <TextField
                      id="quantity"
                      fullWidth
                      type="number"
                      {...getFieldProps('available')}
                      error={Boolean(touched.available && errors.available)}
                      helperText={touched.available && errors.available}
                    />
                  </div>
                  <div>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            onChange={(e) => setFieldValue('isFeatured', e.target.checked)}
                            checked={values.isFeatured}
                          />
                        }
                        label={'Featured Product'}
                      />
                    </FormGroup>
                  </div>
                  <Stack spacing={2}>
                    {isInitialized ? (
                      <Skeleton variant="rectangular" width="100%" height={56} />
                    ) : (
                      <LoadingButton
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        loading={updateLoading}
                        onClick={() =>
                          sendGAEvent('event', 'product_submit', {
                            action: currentProduct ? 'update' : 'create',
                            product_id: currentProduct?._id || 'new'
                          })
                        }
                      >
                        {currentProduct ? 'Update Product' : 'Create Product'}
                      </LoadingButton>
                    )}
                  </Stack>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Form>
      </FormikProvider>
    </Stack>
  );
}

ProductForm.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      subCategories: PropTypes.array.isRequired
    })
  ).isRequired,
  currentProduct: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    code: PropTypes.string,
    slug: PropTypes.string,
    metaTitle: PropTypes.string,
    metaDescription: PropTypes.string,
    brand: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    gender: PropTypes.string,
    category: PropTypes.string,
    subCategory: PropTypes.string,
    status: PropTypes.string,
    blob: PropTypes.array,
    isFeatured: PropTypes.bool,
    sku: PropTypes.string,
    available: PropTypes.number,
    images: PropTypes.array,
    video: PropTypes.object,
    colors: PropTypes.arrayOf(PropTypes.string),
    variant: PropTypes.arrayOf(
      PropTypes.shape({
        size: PropTypes.string,
        price: PropTypes.number,
        priceSale: PropTypes.number,
        _id: PropTypes.string
      })
    )
  }),
  categoryLoading: PropTypes.bool,
  isInitialized: PropTypes.bool,
  isVendor: PropTypes.bool,
  brands: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ),
  shops: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired
    })
  )
};
