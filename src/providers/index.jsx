'use client';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

// mui
import { LinearProgress, Stack } from '@mui/material';
import ThemeRegistry from 'src/theme';

// redux
import { Provider } from 'react-redux';
import { reduxStore, persistor } from 'src/redux';
import { PersistGate } from 'redux-persist/integration/react';

// react query
import { QueryClient, QueryClientProvider } from 'react-query';

// toast
import { Toaster } from 'react-hot-toast';

// components
import GlobalStyles from 'src/theme/globalStyles';
import AuthProvider from './auth';
import { initCsrf } from 'src/services/http';

// dynamic import
const ProgressBar = dynamic(() => import('src/components/ProgressBar'), {
  ssr: false
});

export default function Providers(props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false // default: true
          }
        }
      })
  );

  useEffect(() => {
    initCsrf();
  }, []);

  return (
    <Provider store={reduxStore}>
      <AuthProvider isAuth={props.isAuth}>
        <ThemeRegistry>
          <GlobalStyles />
          <QueryClientProvider client={queryClient}>
            <Toaster position={'top-center'} />
            <PersistGate
              loading={
                <Stack
                  sx={{
                    position: 'fixed',
                    top: 'calc(50vh - 2px)',
                    width: '300px',
                    left: 'calc(50vw - 150px)',
                    zIndex: 11
                  }}
                >
                  <LinearProgress />
                </Stack>
              }
              persistor={persistor}
            >
              {props.children}
            </PersistGate>
          </QueryClientProvider>
          <ProgressBar />
        </ThemeRegistry>
      </AuthProvider>
    </Provider>
  );
}

Providers.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
};
