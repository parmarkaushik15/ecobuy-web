// import * as React from 'react';
// import Providers from 'src/providers';
// import 'simplebar-react/dist/simplebar.min.css';
// import { GoogleAnalytics } from '@next/third-parties/google';

// export default function RootLayout({ children }) {
//   return (
//     <html lang={'en-US'}>
//       <body>
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <Providers>{children}</Providers>
//         <GoogleAnalytics gaId="G-E0Y9P87HCF" />
//       </body>
//     </html>
//   );
// }

// D:\workspace\perfumes-wala\perfume-wala-web\src\app\layout.jsx
import * as React from 'react';
import { cookies } from 'next/headers';
import Providers from 'src/providers';
import 'simplebar-react/dist/simplebar.min.css';
import AnalyticsWrapper from './AnalyticsWrapper';

export default function RootLayout({ children }) {
  const cookieConsent = cookies().get('cookieConsent')?.value;

  return (
    <html lang="en-US">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <Providers cookieConsent={cookieConsent}>
          <AnalyticsWrapper>{children}</AnalyticsWrapper>
        </Providers>
      </body>
    </html>
  );
}
