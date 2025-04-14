'use client';
import React, { useEffect, useState } from 'react';
// stripe for paymen get way

// checkout main component import
import CheckoutMain from './mainCheckout';
// Set up the Stripe promise with your public key
import * as api from 'src/services';

export default function Checkout() {
  return <CheckoutMain />;
}
