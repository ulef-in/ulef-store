import React from 'react';
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: 'ULEF.IN — Heavyweight Oversized Essentials',
  description: 'ULEF.IN Luxury Oversized Apparel. Minimalist, drop-shoulder heavy 240-320 GSM cotton t-shirts crafted for modern luxury.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
