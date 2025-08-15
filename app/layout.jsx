//app/layout.jsx
import { Poppins } from 'next/font/google';
import './(styles)/globals.css';
import AuthProvider from './components/auth/AuthProvider';
import MainContentWrapper from './components/layout/MainContentWrapper';
import ConditionalNavAndFooter from './components/layout/ConditionalNavAndFooter';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata = {
  title: 'HomeLend | Find Your Perfect Rental House',
  description: "Discover apartments, houses, and studios across Kenya's neighborhoods.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={poppins.className}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>
        <AuthProvider>
          <ConditionalNavAndFooter>
            <MainContentWrapper>
              {children}
            </MainContentWrapper>
          </ConditionalNavAndFooter>
        </AuthProvider>
      </body>
    </html>
  );
}
