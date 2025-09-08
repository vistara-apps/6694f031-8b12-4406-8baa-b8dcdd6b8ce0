import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SampleSafe - Clear music samples legally, get paid hassle-free',
  description: 'A Frame mini-app for remix artists to manage music sample clearance and invoicing, streamlining the legal and payment processes.',
  openGraph: {
    title: 'SampleSafe',
    description: 'Clear music samples legally, get paid hassle-free.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
