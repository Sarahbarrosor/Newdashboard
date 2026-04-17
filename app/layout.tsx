import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cellgenic Operations',
  description: 'Multi-country inventory, transfer, and intelligence platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
