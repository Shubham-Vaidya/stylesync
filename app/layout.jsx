import './globals.css';
import { Playfair_Display, DM_Sans, DM_Mono } from 'next/font/google';
import { AuthProvider, TryOnProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/components/Toast';
import Navbar from '@/components/Navbar';
import CustomCursor from '@/components/CustomCursor';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export const metadata = {
  title: 'StyleSync AI — Virtual Fashion Try-On',
  description: 'AI-powered virtual fashion try-on. See yourself in any outfit before you buy it.',
  keywords: 'virtual try-on, AI fashion, outfit visualizer, fashion tech',
  openGraph: {
    title: 'StyleSync AI',
    description: 'Wear it before you buy it.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body style={{ background: '#080808', minHeight: '100vh', overflowX: 'hidden' }}>
        <AuthProvider>
          <TryOnProvider>
            <ToastProvider>
              <CustomCursor />
              <Navbar />
              <main>{children}</main>
            </ToastProvider>
          </TryOnProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
