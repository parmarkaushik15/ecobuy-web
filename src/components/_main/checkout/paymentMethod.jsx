'use client';
import React from 'react';
import PropTypes from 'prop-types';

// mui
import { Card, CardContent, FormControlLabel, Radio, Typography, Stack, RadioGroup, Collapse } from '@mui/material';
// icons
import { BsCash, BsStripe } from 'react-icons/bs';
import { FaPaypal } from 'react-icons/fa';
import { IoCash } from 'react-icons/io5';
// componenets
import StripeCheckoutForm from 'src/components/stripe/Form';

PaymentMethodCard.propTypes = {
  paymentGateway: PropTypes.array,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  setGateway: PropTypes.func,
  error: PropTypes.string
};

export default function PaymentMethodCard({ paymentGateway, value, setValue, error, setGateway }) {
  const handleChange = (event) => {
    setValue(event.target.value);
    const gateway = paymentGateway.find((item) => event.target.value == item.pgConstant);
    setGateway(gateway);
  };
  return (
    <Card>
      <CardContent>
        <Typography variant="h4" mb={1}>
          Payment Method
        </Typography>

        <Stack spacing={1} mt={1}>
          <RadioGroup value={value} onChange={handleChange} sx={{ pl: 1 }}>
            {paymentGateway &&
              paymentGateway.map((item) => (
                <FormControlLabel
                  value={item.pgConstant}
                  control={<Radio />}
                  label={
                    <Stack direction="row" alignItem="center" spacing={1} ml={1}>
                      {item.pgConstant == 'COD' && <IoCash size={20} />}
                      {item.pgConstant == 'PAYPAL' && <FaPaypal size={20} />}
                      {item.pgConstant == 'STRIPE' && <BsStripe size={20} />}
                      {item.pgConstant == 'PHONEPE' && <BsCash size={20} />}
                      <Typography variant="subtitle2">{item.pgName}</Typography>
                    </Stack>
                  }
                />
              ))}
          </RadioGroup>
        </Stack>
      </CardContent>
    </Card>
  );
}
