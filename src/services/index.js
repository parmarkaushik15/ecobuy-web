import http from './http';
import { sha256 } from 'js-sha256';

export const register = async (payload) => {
  const { data } = await http.post(`/auth/register`, payload);
  return data;
};
export const verifyOTP = async (payload) => {
  const { data } = await http.post(`/auth/verify-otp`, payload);
  return data;
};
export const resendOTP = async (payload) => {
  const { data } = await http.post(`/auth/resend-otp`, payload);
  return data;
};

export const login = async (payload) => {
  const { data } = await http.post(`/auth/login`, payload);
  return data;
};

export const forgetPassword = async (payload) => {
  const { data } = await http.post('/auth/forget-password', payload);
  return data;
};

export const resetPassword = async ({ newPassword, token }) => {
  const { data } = await http.post('/auth/reset-password', {
    newPassword: newPassword,
    token: token
  });
  return data;
};

export const adminDashboardAnalytics = async () => {
  const { data } = await http.get(`/admin/dashboard-analytics`);
  return data;
};
export const getNotifications = async (page) => {
  const { data } = await http.get(`/admin/notifications?limit=${page}`, {});
  return data;
};

export const getBrandsByAdmin = async (page, search) => {
  const { data } = await http.get(`/admin/brands?search=${search}&page=${page}`);
  return data;
};
export const getBrandByAdmin = async (id) => {
  const { data } = await http.get(`/admin/brands/${id}`);
  return data;
};
export const getAllBrandsByAdmin = async () => {
  const { data } = await http.get(`/admin/all-brands`);
  return data;
};
export const addBrandByAdmin = async (payload) => {
  const { data } = await http.post(`/admin/brands`, payload);
  return data;
};
export const updateBrandByAdmin = async ({ currentSlug, ...payload }) => {
  const { data } = await http.put(`/admin/brands/${currentSlug}`, payload);
  return data;
};
export const deleteBrandByAdmin = async (slug) => {
  const { data } = await http.delete(`/admin/brands/${slug}`);
  return data;
};

export const getCategoriesByAdmin = async (page, search) => {
  const { data } = await http.get(`/admin/categories?search=${search}&page=${page}`);
  return data;
};
export const getCategoryByAdmin = async (slug) => {
  const { data } = await http.get(`/admin/categories/${slug}`);
  return data;
};
export const deleteCategoryByAdmin = async (slug) => {
  const { data } = await http.delete(`/admin/categories/${slug}`);
  return data;
};
export const addCategoryByAdmin = async (payload) => {
  const { data } = await http.post(`/admin/categories`, payload);
  return data;
};
export const updateCategoryByAdmin = async ({ currentSlug, ...payload }) => {
  const { data } = await http.put(`/admin/categories/${currentSlug}`, payload);
  return data;
};
export const getAllCategoriesByAdmin = async () => {
  const { data } = await http.get(`/admin/all-categories`);
  return data;
};

export const getSubCategoryByAdmin = async (slug) => {
  const { data } = await http.get(`/admin/subcategories/${slug}`);
  return data;
};
export const getSubCategoriesByAdmin = async (params) => {
  const { data } = await http.get(`/admin/subcategories?${params}`);
  return data;
};
export const deleteSubCategoryByAdmin = async (slug) => {
  const { data } = await http.delete(`/admin/subcategories/${slug}`);
  return data;
};
export const addSubCategoryByAdmin = async (payload) => {
  const { data } = await http.post(`/admin/subcategories`, payload);
  return data;
};
export const updateSubCategoryByAdmin = async ({ currentSlug, ...payload }) => {
  const { data } = await http.put(`/admin/subcategories/${currentSlug}`, payload);
  return data;
};

export const getProductsByAdmin = async (params) => {
  const { data: response } = await http.get(`/admin/products?${params}`);
  return response;
};
export const createProductByAdmin = async (payload) => {
  const { data: response } = await http.post(`/admin/products`, payload);
  return response;
};
export const updateProductByAdmin = async ({ currentSlug, ...payload }) => {
  const { data: response } = await http.put(`/admin/products/${currentSlug}`, payload);
  return response;
};

export const deleteProductByAdmin = async (slug) => {
  const { data: response } = await http.delete(`/admin/products/${slug}`);
  return response;
};

export const getOrdersByAdmin = async (payload) => {
  const { data } = await http.get(`/admin/orders?${payload}`);
  return data;
};
export const getOrderByAdmin = async (id) => {
  const { data } = await http.get(`/admin/orders/${id}`);
  return data;
};
export const deleteOrderByAdmin = async (id) => {
  const { data } = await http.delete(`/admin/orders/${id}`);
  return data;
};
export const updateOrderStatus = async ({ id, ...payload }) => {
  const { data } = await http.put(`/admin/orders/${id}`, payload);
  return data;
};
export const getUserByAdminsByAdmin = async (page, search) => {
  const { data: response } = await http.get(`/admin/users?search=${search}&page=${page}`);
  return response;
};
export const getUserByAdmin = async (id) => {
  const { data: response } = await http.get(`/admin/users/${id}`);
  return response;
};
export const updateUserRoleByAdmin = async (id) => {
  const { data: response } = await http.post(`/admin/users/role/${id}`);
  return response;
};

export const getCouponCodesByAdmin = async (page, search) => {
  const { data: response } = await http.get(`/admin/coupon-codes?search=${search}&page=${page}`);
  return response;
};

export const getCouponCodeByAdmin = async (id) => {
  const { data: response } = await http.get(`/admin/coupon-codes/${id}`);
  return response;
};

export const addCouponCodeByAdmin = async (payload) => {
  const { data: response } = await http.post(`/admin/coupon-codes`, payload);
  return response;
};
export const updateCouponCodeByAdmin = async ({ currentId, ...others }) => {
  const { data: response } = await http.put(`/admin/coupon-codes/${currentId}`, others);
  return response;
};
export const deleteCouponCodeByAdmin = async (id) => {
  const { data: response } = await http.delete(`/admin/coupon-codes/${id}`);
  return response;
};

export const getNewsletter = async (page) => {
  const { data } = await http.get(`/admin/newsletter?page=${page}`);
  return data;
};
export const getShopDetailsByAdmin = async (slug) => {
  const { data } = await http.get(`/admin/shops/${slug}`);
  return data;
};
export const addAdminShopByAdmin = async (payload) => {
  const { data } = await http.post(`/admin/shops`, payload);
  return data;
};
export const updateAdminShopByAdmin = async ({ currentSlug, ...payload }) => {
  const { data } = await http.put(`/admin/shops/${currentSlug}`, payload);
  return data;
};
export const deleteShop = async (slug) => {
  const { data: response } = await http.delete(`/admin/shops/${slug}`);
  return response;
};
export const getLowStockProductsByAdmin = async (page) => {
  const { data: response } = await http.get(`/admin/low-stock-products?page=${page}`);
  return response;
};
export const getShopsByAdmin = async (page, search) => {
  const { data: response } = await http.get(`/admin/shops?search=${search}&page=${page}`);
  return response;
};
export const getShopIncomeByAdmin = async (slug, page) => {
  const { data } = await http.get(`/admin/shops/${slug}/income?page=${page || 1}`);

  return data;
};
export const getIncomeDetailsByAdmin = async (pid, page) => {
  const { data } = await http.get(`/admin/payments/${pid}?page=${page || 1}`);
  return data;
};
export const editPaymentByAdmin = async ({ pid, ...payload }) => {
  const { data } = await http.put(`/admin/payments/${pid}`, { ...payload });
  return data;
};
export const createPaymentByAdmin = async ({ ...payload }) => {
  const { data } = await http.post(`/admin/payments`, { ...payload });
  return data;
};
export const getPayoutsByAdmin = async (params) => {
  const { data } = await http.get(`/admin/payouts?${params}`);
  return data;
};
export const getAllShopsByAdmin = async () => {
  const { data } = await http.get(`/admin/all-shops`);
  return data;
};
export const getCurrenciesByAdmin = async (page, search) => {
  const { data } = await http.get(`/admin/currencies?page=${page || 1}&search=${search || ''}`);
  return data;
};
export const addCurrencyByAdmin = async (payload) => {
  const { data } = await http.post(`/admin/currencies`, payload);
  return data;
};
export const updateCurrencyByAdmin = async ({ _id, ...others }) => {
  const { data } = await http.put(`/admin/currencies/${_id}`, others);
  return data;
};
export const getCurrencyByAdmin = async (cid) => {
  const { data } = await http.get(`/admin/currencies/${cid}`);
  return data;
};
export const getCompaignsByAdmin = async (page, search) => {
  const { data } = await http.get(`/admin/compaigns?page=${page || 1}&search=${search || ''}`);
  return data;
};
export const addCompaignByAdmin = async (payload) => {
  const { data } = await http.post(`/admin/compaigns`, payload);
  return data;
};
export const updateCompaignByAdmin = async ({ currentSlug, ...payload }) => {
  const { data } = await http.put(`/admin/compaigns/${currentSlug}`, payload);
  return data;
};
export const getCompaignByAdmin = async (slug) => {
  const { data } = await http.get(`/admin/compaigns/${slug}`);
  return data;
};
export const deleteCompaignByAdmin = async (slug) => {
  const { data } = await http.delete(`/admin/compaigns/${slug}`);
  return data;
};

export const getVendorProductBySlug = async (slug) => {
  const { data } = await http.get(`/vendor/products/${slug}`);
  return data;
};
export const getVendorShop = async () => {
  const { data } = await http.get(`/vendor/shop`);
  return data;
};
export const vendorDashboardAnalytics = async () => {
  const { data } = await http.get(`/vendor/dashboard-analytics`);
  return data;
};
export const getVendorLowStockProducts = async (page) => {
  const { data: response } = await http.get(`/vendor/low-stock-products?page=${page}`);
  return response;
};
export const getVendorProducts = async (page, search) => {
  const { data: response } = await http.get(`/vendor/products?search=${search}&page=${page}`);
  return response;
};
export const deleteVendorProduct = async (slug) => {
  const { data: response } = await http.delete(`/vendor/products/${slug}`);
  return response;
};
export const createVendorProduct = async (payload) => {
  const { data: response } = await http.post(`/vendor/products`, payload);
  return response;
};

export const updateVendorShopAddress = async (payload) => {
  const { data } = await http.post(`/vendor/address/update`, payload);
  return data;
};

export const updateVendorProduct = async ({ currentSlug, ...payload }) => {
  const { data: response } = await http.put(`/vendor/products/${currentSlug}`, payload);
  return response;
};
export const statusVendorByAdmin = async (param) => {
  const { data } = await http.put(`/admin/update/status/products/${param.slug}`, {
    viewStatus: param.status
  });
  return data;
};
export const getOrdersByVendor = async (payload) => {
  const { data } = await http.get(`/vendor/orders?${payload}`);
  return data;
};
export const addShopByVendor = async (payload) => {
  const { data } = await http.post(`/vendor/shops`, payload);
  return data;
};
export const updateShopByVendor = async ({ currentSlug, ...payload }) => {
  const { data } = await http.put(`/vendor/shops/${currentSlug}`, payload);
  return data;
};
export const getShopDetailsByVendor = async () => {
  const { data } = await http.get(`/vendor/shop/stats`);
  return data;
};
export const getIncomeByVendor = async (slug, page) => {
  const { data } = await http.get(`/vendor/shops/income?page=${page || 1}`);
  return data;
};

export const getProducts = async (query = '', cat, rate) => {
  const { data } = await http.get(`/products${query || '?'}&rate=${rate}`);
  return data;
};
export const getProductDetails = async (pid) => {
  const { data } = await http.get(`/products/${pid}`);
  return data;
};

export const getBanners = async () => {
  const { data } = await http.get(`/banner`);
  return data;
};

export const getProductsByCategory = async (query = '', category, rate) => {
  const { data } = await http.get(`/category/products/${category}${query || '?'}&rate=${rate}`);
  return data;
};
export const getProductsByCompaign = async (query = '', slug, rate) => {
  const { data } = await http.get(`/compaign/products/${slug}${query || '?'}&rate=${rate}`);
  return data;
};

export const getProductSlugs = async () => {
  const { data } = await http.get(`/products-slugs`);
  return data;
};
export const getProductsBySubCategory = async (query = '', subcategory, rate) => {
  const { data } = await http.get(`/subcategory/products/${subcategory}${query || '?'}&rate=${rate}`);
  return data;
};

export const getProductsByShop = async (query = '', shop, rate) => {
  const { data } = await http.get(`/shop/products/${shop}${query || '?'}&rate=${rate}`);
  return data;
};

export const getAllProducts = async () => {
  const { data } = await http.get(`/products/all`);
  return data;
};
export const getAllFilters = async () => {
  const { data } = await http.get(`/products/filters`);
  return data;
};

export const getNewProducts = async () => {
  const { data } = await http.get(`/products/new`);
  return data;
};
export const getFiltersByShop = async (shop) => {
  const { data } = await http.get(`/filters/${shop}`);
  return data;
};

export const getNewArrivels = async () => {
  const { data } = await http.get('/new-arrivals');
  return data;
};
export const getRelatedProducts = async (pid) => {
  const { data } = await http.get(`/related-products/${pid}`);
  return data;
};
export const getProductBySlug = async (slug) => {
  const { data } = await http.get(`/products/${slug}`);
  return data;
};

export const getProductReviews = async (pid) => {
  const { data } = await http.get(`/reviews/${pid}`);
  return data;
};
export const addReview = async (payload) => {
  const { data } = await http.post(`/reviews`, payload);
  return data;
};

export const getUserInvoice = async (page) => {
  const { data: response } = await http.get(`/users/invoice${page}`);
  return response;
};

export const updateProfile = async ({ ...payload }) => {
  const { data } = await http.put(`/users/profile`, payload);
  return data;
};
export const changePassword = async ({ ...payload }) => {
  const { data } = await http.put(`/users/change-password`, payload);
  return data;
};

export const getAddress = async (payload) => {
  const { data } = await http.get(`/users/addresses?id=${payload}`);
  return data;
};
export const updateAddress = async ({ _id, ...payload }) => {
  const { data } = await http.put(`/users/addresses/${_id}`, payload);
  return data;
};
export const createAddress = async ({ ...payload }) => {
  const { data } = await http.post(`/users/addresses/`, payload);
  return data;
};
export const deleteAddress = async ({ _id }) => {
  const { data } = await http.delete(`/users/addresses/${_id}`);
  return data;
};
export const search = async (payload) => {
  const { data } = await http.post(`/search`, payload);
  return data;
};
export const getSearchFilters = async () => {
  const { data } = await http.get(`/search-filters`);
  return data;
};
export const getInvoices = async () => {
  const { data } = await http.get(`/users/invoice`);
  return data;
};
export const placeOrder = async (payload) => {
  const { data } = await http.post(`/orders`, payload);
  return data;
};
export const getLayout = async () => {
  const { data } = await http.get(`/layout`);
  return data;
};
export const singleDeleteFile = async (id) => {
  const { data } = await http.delete(`/delete-file/${id}`);
  return data;
};

export const sendNewsletter = async (payload) => {
  const { data } = await http.post(`/newsletter`, payload);
  return data;
};

export const getWishlist = async () => {
  const { data } = await http.get(`/wishlist`);
  return data;
};
export const updateWishlist = async (pid) => {
  const { data } = await http.post(`/wishlist`, { pid });
  return data;
};
export const getCompareProducts = async (products) => {
  const { data } = await http.post(`/compare/products`, { products });
  return data;
};

export const getProfile = async () => {
  const { data } = await http.get(`/users/profile`);
  return data;
};

export const getCart = async (ids) => {
  const { data } = await http.post(`/cart`, {
    products: ids
  });
  return data;
};

export const getAllCategories = async () => {
  const { data } = await http.get(`/all-categories`);
  return data;
};
export const getHomeCategories = async () => {
  const { data } = await http.get(`/home/categories`);
  return data;
};

export const getHomeShops = async () => {
  const { data } = await http.get(`/shops?limit=5`);
  return data;
};
export const getHomeCompaigns = async () => {
  const { data } = await http.get(`/compaigns`);
  return data;
};
export const getBestSellingProducts = async () => {
  const { data } = await http.get(`/home/products/best-selling`);
  return data;
};
export const getFeaturedProducts = async () => {
  const { data } = await http.get(`/home/products/featured`);
  return data;
};

export const getTopRatedProducts = async () => {
  const { data } = await http.get(`/home/products/top`);
  return data;
};
export const getHomeBrands = async () => {
  const { data } = await http.get(`/home/brands`);
  return data;
};
export const getBrands = async () => {
  const { data } = await http.get(`/brands`);
  return data;
};
export const applyCouponCode = async (code) => {
  const { data: response } = await http.get(`/coupon-codes/${code}`);
  return response;
};

export const paymentIntents = async (amount, currency, note = 'Online purchase') => {
  const { data } = await http.post(`/payment-intents`, {
    amount,
    currency,
    description: note
  });
  return data;
};

export const phonePePaymentIntents = async (amount, currency, phone, userId) => {
  const { data } = await http.post(`/phone-pe/payment-intents`, {
    amount,
    currency,
    phone,
    userId
  });
  return data;
};

export const phonePePaymentStatus = async (id) => {
  const { data } = await http.get(`/phone-pe/validate/response/${id}`);
  return data;
};

export const addShopByUser = async (payload) => {
  const { data } = await http.post(`/shops`, {
    ...payload
  });

  return data;
};
export const getShopByUser = async () => {
  const { data } = await http.get(`/user/shop`);
  return data;
};

export const getShops = async () => {
  const { data } = await http.get(`/shops`);
  return data;
};
export const getAllCategoriesByUser = async () => {
  const { data } = await http.get(`/all-categories`);
  return data;
};

export const getCurrencies = async () => {
  const { data } = await http.get(`/currencies`);
  return data;
};
export const getCategoryTitle = async (category) => {
  const { data } = await http.get(`/category-title/${category}`);
  return data;
};

export const getCategoryBySlug = async (category) => {
  const { data } = await http.get(`/categories/${category}`);
  return data;
};

export const getCategorySlugs = async () => {
  const { data } = await http.get(`/categories-slugs`);
  return data;
};
export const getShopSlugs = async () => {
  const { data } = await http.get('/shops-slugs');
  return data;
};
export const getShopBySlug = async (shop) => {
  const { data } = await http.get(`/shops/${shop}`);
  return data;
};
export const getShopTitle = async (shop) => {
  const { data } = await http.get(`/shop-title/${shop}`);
  return data;
};

export const getSubCategoryTitle = async (subcategory) => {
  const { data } = await http.get(`/subcategory-title/${subcategory}`);
  return data;
};
export const getSubCategoryBySlug = async (subcategory) => {
  const { data } = await http.get(`/subcategories/${subcategory}`);
  return data;
};

export const getSubCategorySlugs = async () => {
  const { data } = await http.get(`/subcategories-slugs`);
  return data;
};

export const getCompaignSlugs = async () => {
  const { data } = await http.get('/compaigns-slugs');
  return data;
};
export const getCompaignBySlug = async (slug) => {
  const { data } = await http.get(`/compaigns/${slug}`);
  return data;
};
export const getCompaignTitle = async (slug) => {
  const { data } = await http.get(`/compaign-title/${slug}`);
  return data;
};

export const followShop = async (shopId) => {
  const { data } = await http.put(`/shops/${shopId}/follow`);
  return data;
};
export const getAdvertiseImages = async () => {
  const { data } = await http.get(`/advertise`);
  return data;
};
export const getAddSenseData = async () => {
  const { data } = await http.get(`/add-sense`);
  return data;
};
export const getFaqData = async () => {
  const { data } = await http.get(`/faqs`);
  return data;
};
export const getBlogData = async (search) => {
  const { data } = await http.get(`/blog?search=${search}`);
  return data;
};
export const getBlogSlugs = async (slug) => {
  const { data } = await http.get('/blog-slugs/' + slug);
  return data;
};
export const submitContact = async (payload) => {
  const { data } = await http.post(`/contact`, payload);
  return data;
};
export const getReviews = async () => {
  const { data } = await http.get(`/app-reviews`);
  return data;
};
export const getLookbook = async () => {
  const { data } = await http.get(`/lookup`);
  return data;
};
export const getSetting = async () => {
  const { data } = await http.get(`/setting`);
  return data;
};
// export const contactUs = async (payload) => {
//   const { data } = await http.post(`/contact-us`, payload);
//   return data;
// };

export const getOrderInfo = async (oid) => {
  const { data } = await http.get(`/track-order/${oid}`);
  return data;
};
export const updateStockByVendor = async (param) => {
  const { data } = await http.put(`/vendor/update/stock/products/${param.slug}`, {
    qty: param.qty
  });
  return data;
};

// Get order status history
export const getOrderStatusHistory = async ({ orderId }) => {
  const { data } = await http.post('/order/status/history/status-history', { orderId });
  return data;
};

// Update vendor order status
export const updateVendorOrderStatus = async ({ orderId, status, notes }) => {
  const { data } = await http.post('/order/status/change', { orderId, status, notes });
  return data;
};

// In src/services/index.js
export const cancelOrder = async ({ orderId, cancelReason }) => {
  const { data } = await http.post('/order/cancel', { orderId, cancelReason });
  return data;
};

export const returnOrder = async ({ orderId, reason }) => {
  const { data } = await http.post('/order/request/return', { orderId, reason });
  return data;
};

export const reOrder = async ({ previousOrderId }) => {
  const { data } = await http.post('/reOrder', { previousOrderId });
  return data;
};

// Create shipment
export const createShipment = async ({ order_id }) => {
  const { data } = await http.post('/create/shipment', { order_id });
  return data;
};

export const getAllVendorDetails = async ({ vendorId }) => {
  const params = new URLSearchParams({ vendor: vendorId });
  const { data } = await http.get(`/all/average/report?${params.toString()}`);
  return data;
};

// New APIs for reports
export const getMonthlyReport = async ({ vendorId, month }) => {
  const params = new URLSearchParams({ vendor: vendorId });
  if (month) params.append('month', month);
  const { data } = await http.get(`/vendor/report/month?${params.toString()}`);
  return data;
};

export const getYearlyReport = async ({ vendorId, page = 1, limit = 10 }) => {
  const params = new URLSearchParams({ vendor: vendorId, page, limit });
  const { data } = await http.get(`/vendor/report?${params.toString()}`);
  return data;
};

export const updateReportStatus = async ({ reportId, status }) => {
  const { data } = await http.post('/update/vendor/report/status', { reportId, status });
  return data;
};

export const getHomePageContext = async () => {
  const { data } = await http.get('/get/home/PageConstant');
  return data;
};

export const getFooterPageContext = async () => {
  const { data } = await http.get('/get/footer/PageConstant');
  return data;
};

export const getProductPageContext = async () => {
  const { data } = await http.get('/get/product/PageConstant');
  return data;
};

export const getOffersAboutusPageContext = async () => {
  const { data } = await http.get('/get/offers-aboutus/PageConstant');
  return data;
};

export const getShopsPageContext = async () => {
  const { data } = await http.get('/get/shop/PageConstant');
  return data;
};

export const getContactusPageContext = async () => {
  const { data } = await http.get('/get/contactUs/PageConstant');
  return data;
};

export const getCmsBySlug = async (slug) => {
  const { data } = await http.get(`/admin/cms/${slug}`);
  return data;
};

export const updateVariant = async (productId, payload) => {
  const { data } = await http.put(`/admin/products/update-variant/${productId}`, payload);
  return data;
};

export const razorpayCreateOrder = async (amount, currency, receipt) => {
  const { data } = await http.post(`/admin/razorpay/createOrder`, {
    amount,
    currency,
    receipt
  });
  return data;
};

// export const verifyRazorpayPayment = async (paymentData) => {
//   const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = paymentData;
//   if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
//     console.error('Missing Razorpay payment data:', paymentData);
//     throw new Error('Invalid payment data');
//   }
//   console.log('Verifying payment with payload:', paymentData);
//   const { data } = await http.post('/razorpay/verifyPayment', {
//     razorpay_payment_id,
//     razorpay_order_id,
//     razorpay_signature
//   }, {
//     headers: {
//       'Content-Type': 'application/json'
//     }
//   });
//   return data;
// };

export const verifyRazorpayPayment = async (paymentData) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = paymentData;
  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    console.error('Missing Razorpay payment data:', paymentData);
    throw new Error('Invalid payment data');
  }
  console.log('Verifying payment with payload:', paymentData);
  const { data } = await http.post(
    '/razorpay/verifyPayment',
    {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  return data;
};

export const getShipmentPrice = async (payload) => {
  const { data } = await http.post('/shipment/fetch-shipment-price', payload);
  return data;
};

export const generateLabel = async (data) => {
  const { data: responseData } = await http.post('/generate/lable', data);
  return responseData;
};

export const downloadLabel = async (data) => {
  const response = await http.post('/label/download', data, {
    responseType: 'blob'
  });
  return response.data;
};
export const getFingerprint = async (userId) => {
  const { data } = await http.get(`/fingerprint/${userId}`);
  return data;
};

export const blockFingerprint = async (id) => {
  const { data } = await http.put(`/block/${id}`);
  return data;
};

export const unblockFingerprint = async (id) => {
  const { data } = await http.put(`/unblock/${id}`);
  return data;
};
