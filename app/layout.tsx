import './globals.css'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import Providers from './providers'
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { AuthContextProvider } from '@/context/AuthContextProvider';
import Script from 'next/script'
import { Montserrat_Alternates } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import Notification from '@/components/ui/notification';

const mont = Montserrat_Alternates({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap'
})

// const konstanz = localFont({
//   src: [
//     {
//       path: './fonts/Konstanz-Black.otf',
//       weight: '800',
//       style: 'normal',
//     },
//     {
//       path: './fonts/Konstanz-Bold.otf',
//       weight: '700',
//       style: 'normal',
//     },
//     {
//       path: './fonts/Konstanz-SemiBold.otf',
//       weight: '600',
//       style: 'normal',
//     },
//     {
//       path: './fonts/Konstanz-Medium.otf',
//       weight: '500',
//       style: 'normal',
//     },
//     {
//       path: './fonts/Konstanz-Regular.otf',
//       weight: '400',
//       style: 'normal',
//     },
//     {
//       path: './fonts/Konstanz-Light.otf',
//       weight: '300',
//       style: 'normal',
//     },
//     {
//       path: './fonts/Konstanz-Thin.otf',
//       weight: '200',
//       style: 'normal',
//     },
//   ],
//   display: 'swap'
// })

export const metadata: Metadata = {
  title: 'Katangwa | Home',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={mont.className}>
        <Providers>
          <AuthContextProvider>
            <ToastContainer />
            <Toaster />
            <Notification />
            <div id="search-div"></div>
            {children}
          </AuthContextProvider>
        </Providers>
      </body>
      <Script defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB0Ra8Wv09iY0yu0xCU77J7mm0r3kbhjME&libraries=places"
      />
    </html>
  )
}
