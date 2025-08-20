'use client';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// mui
import { Card, CardContent, FormControlLabel, Radio, Typography, Stack, RadioGroup } from '@mui/material';
// icons
import { BsCash, BsStripe } from 'react-icons/bs';
import { FaPaypal } from 'react-icons/fa';
import { IoCash } from 'react-icons/io5';
import { SiRazorpay } from 'react-icons/si';

PaymentMethodCard.propTypes = {
  paymentGateway: PropTypes.array,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  setGateway: PropTypes.func,
  error: PropTypes.string
};

export default function PaymentMethodCard({ paymentGateway, value, setValue, error, setGateway }) {
  useEffect(() => {
    if (paymentGateway && paymentGateway.length > 0 && !value) {
      // Prioritize COD if available
      const defaultMethod =
        paymentGateway.find((item) => item.pgConstant === 'COD') ||
        paymentGateway.find((item) => item.pgConstant === 'RAZORPAY') ||
        paymentGateway[0]; // Fallback to first available method
      if (defaultMethod) {
        setValue(defaultMethod.pgConstant);
        setGateway(defaultMethod);
      }
    }
  }, [paymentGateway, value, setValue, setGateway]);

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setValue(selectedValue);
    const gateway = paymentGateway.find((item) => selectedValue === item.pgConstant);
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
                  key={item.pgConstant}
                  value={item.pgConstant}
                  control={<Radio />}
                  label={
                    <Stack direction="row" alignItems="center" spacing={1} ml={1}>
                      {item.pgConstant === 'COD' && <IoCash size={20} />}
                      {item.pgConstant === 'PAYPAL' && <FaPaypal size={20} />}
                      {item.pgConstant === 'STRIPE' && <BsStripe size={20} />}
                      {item.pgConstant === 'RAZORPAY' && <SiRazorpay size={20} />}
                      {item.pgConstant === 'PHONEPE' && <BsCash size={20} />}
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
