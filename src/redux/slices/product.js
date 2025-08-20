import { sum, map, filter, uniqBy } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';

// ----------------------------------------------------------------------

const initialState = {
  checkout: {
    activeStep: 0,
    cart: [],
    subtotal: 0,
    total: 0,
    discount: 0,
    shipping: 0,
    isFreeShipping: false,
    billing: null
  }
};

const slice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // SET SHIPPING DETAILS
    setShippingDetails(state, action) {
      const { shippingCost, isFreeShipping } = action.payload;
      state.checkout.shipping = isFreeShipping ? 0 : shippingCost;
      state.checkout.isFreeShipping = isFreeShipping;
      state.checkout.total = state.checkout.subtotal - state.checkout.discount + (isFreeShipping ? 0 : shippingCost);
    },

    // CHECKOUT
    getCart(state, action) {
      const cart = action.payload;

      const subtotal = sum(cart.map((product) => (product.priceSale || product.price) * product.quantity));
      const discount = cart.length === 0 ? 0 : state.checkout.discount;
      const shipping = cart.length === 0 ? 0 : state.checkout.shipping;
      const billing = cart.length === 0 ? null : state.checkout.billing;

      state.checkout.cart = cart;
      state.checkout.discount = discount;
      state.checkout.shipping = shipping;
      state.checkout.billing = billing;
      state.checkout.subtotal = subtotal;
      state.checkout.total = subtotal - discount + shipping;
    },

    addCart(state, action) {
      const product = action.payload;
      const updatedProduct = {
        ...product,
        sku: `${product.sku}-${product.size}-${product.color}`,
        subtotal: (product.priceSale || product.price) * product.quantity
      };
      const existingItem = state.checkout.cart.find((item) => item.sku === updatedProduct.sku);

      if (existingItem) {
        state.checkout.cart = map(state.checkout.cart, (item) => {
          if (item.sku === updatedProduct.sku) {
            return {
              ...item,
              quantity: item.quantity + product.quantity,
              subtotal: (item.priceSale || item.price) * (item.quantity + product.quantity)
            };
          }
          return item;
        });
      } else {
        state.checkout.cart = [...state.checkout.cart, updatedProduct];
      }

      state.checkout.cart = uniqBy(state.checkout.cart, 'sku');
      state.checkout.subtotal = sum(state.checkout.cart.map((item) => (item.priceSale || item.price) * item.quantity));
      state.checkout.total = state.checkout.subtotal - state.checkout.discount + state.checkout.shipping;
    },

    clearCart(state, action) {
      const updateCart = filter(state.checkout.cart, (item) => item.sku !== action.payload);

      state.checkout.cart = updateCart;
      state.checkout.subtotal = sum(updateCart.map((item) => (item.priceSale || item.price) * item.quantity));
      state.checkout.total = state.checkout.subtotal - state.checkout.discount + state.checkout.shipping;
    },

    deleteCart(state, action) {
      const updateCart = filter(state.checkout.cart, (item) => item.sku !== action.payload);

      state.checkout.cart = updateCart;
      state.checkout.subtotal = sum(updateCart.map((item) => (item.priceSale || item.price) * item.quantity));
      state.checkout.total = state.checkout.subtotal - state.checkout.discount + state.checkout.shipping;
    },

    resetCart(state) {
      state.checkout.activeStep = 0;
      state.checkout.cart = [];
      state.checkout.total = 0;
      state.checkout.subtotal = 0;
      state.checkout.discount = 0;
      state.checkout.shipping = state.checkout.isFreeShipping ? 0 : state.checkout.shipping;
      state.checkout.billing = null;
    },

    increaseQuantity(state, action) {
      const productSku = action.payload;
      state.checkout.cart = map(state.checkout.cart, (product) => {
        if (product.sku === productSku && product.quantity < product.available) {
          const newQuantity = product.quantity + 1;
          return {
            ...product,
            quantity: newQuantity,
            subtotal: (product.priceSale || product.price) * newQuantity
          };
        }
        return product;
      });

      state.checkout.subtotal = sum(state.checkout.cart.map((item) => (item.priceSale || item.price) * item.quantity));
      state.checkout.total = state.checkout.subtotal - state.checkout.discount + state.checkout.shipping;
    },

    decreaseQuantity(state, action) {
      const productSku = action.payload;
      state.checkout.cart = map(state.checkout.cart, (product) => {
        if (product.sku === productSku && product.quantity > 1) {
          const newQuantity = product.quantity - 1;
          return {
            ...product,
            quantity: newQuantity,
            subtotal: (product.priceSale || product.price) * newQuantity
          };
        }
        return product;
      });

      state.checkout.subtotal = sum(state.checkout.cart.map((item) => (item.priceSale || item.price) * item.quantity));
      state.checkout.total = state.checkout.subtotal - state.checkout.discount + state.checkout.shipping;
    },

    createBilling(state, action) {
      state.checkout.billing = action.payload;
    },

    applyDiscount(state, action) {
      const discount = action.payload;
      state.checkout.discount = discount;
      state.checkout.total = state.checkout.subtotal - discount + state.checkout.shipping;
    }
  }
});

// Reducer
export default slice.reducer;

// Actions
export const {
  getCart,
  addCart,
  resetCart,
  clearCart,
  deleteCart,
  createBilling,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity,
  setShippingDetails
} = slice.actions;
