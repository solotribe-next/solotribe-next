import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import ThemeProvider from '@/components/ThemeProvider';
import './globals.css';
import './style.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SoloTribe — Where Solopreneurs Find Their Tribe',
  description:
    'Connect with ambitious solopreneurs. Share experiences, find accountability partners, and grow together.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
