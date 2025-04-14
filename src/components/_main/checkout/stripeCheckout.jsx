import PropTypes from 'prop-types';
import StripeCheckoutForm from 'src/components/stripe/Form';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import countries from './countries.json';
import React from 'react';
import * as api from 'src/services';
import { useCurrencyConvert } from 'src/hooks/convertCurrency';
const StripeCheckout = React.forwardRef((props, ref) => {
  const {
    setCheckoutError,
    error,
    mutate,
    totalWithDiscount,
    checkout,
    values,
    currency,
    couponCode,
    setProcessingTo
  } = props;
  const cCurrency = useCurrencyConvert();
  React.useImperativeHandle(ref, () => ({
    onSubmit
  }));

  const elements = useElements();
  const stripe = useStripe();

  const onSubmit = async ({ ...data }) => {
    console.log(data);
    setProcessingTo(true);
    setCheckoutError(null);
    const selected = countries.find((v) => v.label.toLowerCase() === values.country.toLowerCase());
    const billingDetails = {
      name: values.firstName + ' ' + values.lastName,
      email: values.email,
      address: {
        city: values.city,
        line1: values.address,
        state: values.state,
        postal_code: values.zip,
        country: selected?.code.toLocaleLowerCase() || 'us'
      }
    };

    const cardElement = elements.getElement('card');
    try {
      const { client_secret: clientSecret } = await api.paymentIntents(
        cCurrency(totalWithDiscount || checkout.total),
        currency
      );

      const paymentMethodReq = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: billingDetails
      });

      if (paymentMethodReq?.error) {
        setCheckoutError(paymentMethodReq.error.message);
        setProcessingTo(false);
        return;
      }

      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodReq?.paymentMethod.id
      });

      if (error) {
        setCheckoutError(error.message);
        setProcessingTo(false);
        return;
      }

      setProcessingTo(false);

      mutate({
        ...data,
        paymentMethod: 'STRIPE',
        couponCode,
        paymentId: paymentMethodReq?.paymentMethod.id
      });
      return;
    } catch (err) {
      setCheckoutError(err?.response?.data?.message);
      setProcessingTo(false);
    }
  };

  return <StripeCheckoutForm error={error} />;
});

StripeCheckout.propTypes = {
  error: PropTypes.string
};

export default StripeCheckout;
