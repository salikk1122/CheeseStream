import type { Metadata } from 'next';
import { Inter, Bebas_Neue } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'CheeseStream — Movies & TV Shows',
    template: '%s | CheeseStream',
  },
  description:
    'Browse movies and TV shows with CheeseStream. Discover trending titles, watch trailers, and build your watchlist.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover' as const,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${bebasNeue.variable}`}>
      <body className="min-h-screen overflow-x-hidden font-sans">
        <Navbar />
        <main className="min-w-0">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
