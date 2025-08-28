'use client';
import * as Yup from 'yup';
import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQuery } from 'react-query';
import RouterLink from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next-nprogress-bar';
import toast from 'react-hot-toast';

// formik
import { useFormik, Form, FormikProvider } from 'formik';
import { getDeviceInfo } from 'src/utils/deviceInfo';
// cookies
import { createCookies } from 'src/hooks/cookies';
// redux
import { useDispatch } from 'react-redux';
import { setWishlist } from 'src/redux/slices/wishlist';
import { setLogin } from 'src/redux/slices/user';
// api
import * as api from 'src/services';
// mui
import {
  Link,
  Typography,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Box,
  Button,
  CircularProgress
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { MdOutlineVisibility, MdLock, MdOutlineVisibilityOff } from 'react-icons/md';
import { IoMail, IoRefresh } from 'react-icons/io5';

const MAX_FAILED_ATTEMPTS = 3;
const FAILED_ATTEMPTS_KEY = 'login_failed_attempts';
const ATTEMPTS_RESET_TIMEOUT = 15 * 60 * 1000; // 15 minutes

export default function LoginForm() {
  const { push } = useRouter();
  const dispatch = useDispatch();
  const searchParam = useSearchParams();
  const redirect = searchParam.get('redirect');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaImg, setCaptchaImg] = useState('');
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [captchaError, setCaptchaError] = useState(null);

  // Load failed attempts from localStorage
  useEffect(() => {
    const storedAttempts = parseInt(localStorage.getItem(FAILED_ATTEMPTS_KEY) || '0', 10);
    setFailedAttempts(storedAttempts);
    setShowCaptcha(storedAttempts >= MAX_FAILED_ATTEMPTS);
  }, []);

  // Fetch CAPTCHA when needed
  const { refetch: refetchCaptcha } = useQuery('captcha', api.getCaptcha, {
    enabled: showCaptcha,
    onSuccess: (data) => {
      console.log('CAPTCHA Response:', data); // Debugging log
      setCaptchaImg(data.image || '');
      setCaptchaLoading(false);
      setCaptchaError(null);
    },
    onError: (err) => {
      console.error('CAPTCHA Fetch Error:', err); // Debugging log
      setCaptchaLoading(false);
      setCaptchaError('Failed to load CAPTCHA. Please try again.');
      toast.error('Failed to load CAPTCHA. Please try again.');
    }
  });

  const refreshCaptcha = useCallback(() => {
    setCaptchaLoading(true);
    setCaptchaImg(`/api/auth/captcha?${Date.now()}`);
    refetchCaptcha();
  }, [refetchCaptcha]);

  // Trigger CAPTCHA fetch when showCaptcha changes
  useEffect(() => {
    if (showCaptcha && !captchaImg) {
      setCaptchaLoading(true);
      refreshCaptcha();
    }
  }, [showCaptcha, captchaImg, refreshCaptcha]);

  const { mutate } = useMutation(api.login, {
    onSuccess: async (data) => {
      setLoading(false);
      const isAdmin = data.user.role.includes('admin');
      const isVendor = data.user.role.includes('vendor');
      if (isAdmin) {
        toast.error('You are not authorized to login!');
      } else {
        toast.success('Logged in successfully!');
        dispatch(setLogin(data.user));
        dispatch(setWishlist(data.user.wishlist));
        await createCookies('token', data.token);
        // Reset failed attempts on successful login
        setFailedAttempts(0);
        localStorage.setItem(FAILED_ATTEMPTS_KEY, '0');
        setShowCaptcha(false);
        setCaptchaImg('');
        push(redirect || isVendor ? '/vendor/dashboard' : '/');
      }
    },
    onError: (err) => {
      setLoading(false);
      const message = err.response?.data?.message || 'Something went wrong!';
      console.error('Login Error:', err.response?.data); // Debugging log
      toast.error(message);
      if (message.includes('captcha') || err.response?.data?.code === 'captcha_required') {
        setShowCaptcha(true);
        if (!captchaImg) {
          refreshCaptcha();
        }
      }
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      localStorage.setItem(FAILED_ATTEMPTS_KEY, newAttempts.toString());
      if (newAttempts >= MAX_FAILED_ATTEMPTS) {
        setShowCaptcha(true);
        if (!captchaImg) {
          refreshCaptcha();
        }
      }
    }
  });

  // Reset failed attempts after timeout
  useEffect(() => {
    if (failedAttempts > 0) {
      const timeout = setTimeout(() => {
        setFailedAttempts(0);
        localStorage.setItem(FAILED_ATTEMPTS_KEY, '0');
        setShowCaptcha(false);
        setCaptchaImg('');
      }, ATTEMPTS_RESET_TIMEOUT);
      return () => clearTimeout(timeout);
    }
  }, [failedAttempts]);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Enter valid email').required('Email is required.'),
    password: Yup.string().required('Password is required.').min(8, 'Password should be 8 characters or longer.'),
    captcha: showCaptcha ? Yup.string().required('CAPTCHA is required.') : Yup.string().notRequired()
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      captcha: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      const { email, password, captcha } = values;
      setLoading(true);
      try {
        const deviceInfo = await getDeviceInfo();
        mutate({ email, password, deviceInfo, captcha: showCaptcha ? captcha : undefined });
      } catch (err) {
        console.error('Error collecting device info:', err);
        mutate({ email, password, captcha: showCaptcha ? captcha : undefined });
      }
    }
  });
  const { errors, touched, values, handleSubmit, getFieldProps } = formik;
  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <Stack gap={0.5} width={1}>
              <Typography variant="overline" color="text.primary" htmlFor="email" component="label">
                Email
              </Typography>
              <TextField
                id="email"
                fullWidth
                autoComplete="username"
                type="email"
                {...getFieldProps('email')}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IoMail size={24} />
                    </InputAdornment>
                  )
                }}
              />
            </Stack>

            <Stack gap={0.5} width={1}>
              <Typography variant="overline" color="text.primary" htmlFor="password" component="label">
                Password
              </Typography>
              <TextField
                id="password"
                fullWidth
                autoComplete="current-password"
                type={showPassword ? 'text' : 'password'}
                {...getFieldProps('password')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MdLock size={24} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                        {showPassword ? <MdOutlineVisibility size={24} /> : <MdOutlineVisibilityOff size={24} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
              />
            </Stack>

            {showCaptcha && (
              <Stack gap={0.5} width={1}>
                <Typography variant="overline" color="text.primary" component="label">
                  CAPTCHA
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  {captchaLoading ? (
                    <CircularProgress size={24} />
                  ) : captchaError ? (
                    <Typography color="error">{captchaError}</Typography>
                  ) : captchaImg ? (
                    <img
                      src={captchaImg}
                      alt="CAPTCHA"
                      style={{ maxWidth: '150px', height: '50px', objectFit: 'contain' }}
                      onError={() => {
                        console.error('CAPTCHA Image Load Error');
                        setCaptchaError('Failed to load CAPTCHA image.');
                        refreshCaptcha();
                      }}
                    />
                  ) : (
                    <Typography>Loading CAPTCHA...</Typography>
                  )}
                  <IconButton onClick={refreshCaptcha} title="Refresh CAPTCHA" disabled={captchaLoading}>
                    <IoRefresh size={20} />
                  </IconButton>
                </Box>
                <TextField
                  fullWidth
                  placeholder="Enter CAPTCHA"
                  {...getFieldProps('captcha')}
                  error={Boolean(touched.captcha && errors.captcha)}
                  helperText={touched.captcha && errors.captcha}
                />
              </Stack>
            )}
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
            <FormControlLabel
              control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
              label="Remember me"
            />
            <Link component={RouterLink} variant="subtitle2" href="/auth/forget-password">
              Forgot password
            </Link>
          </Stack>
          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
            Login
          </LoadingButton>
          <Typography variant="subtitle2" mt={3} textAlign="center">
            Don&apos;t have an account? &nbsp;
            <Link href={`/auth/register${redirect ? '?redirect=' + redirect : ''}`} component={RouterLink}>
              Register
            </Link>
          </Typography>
        </Form>
      </FormikProvider>
    </>
  );
}
