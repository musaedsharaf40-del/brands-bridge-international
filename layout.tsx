import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Brands Bridge International | Premium FMCG Trading',
  description: 'Brands Bridge International - Your trusted partner in global FMCG distribution. Import, export, and distribution of premium consumer goods worldwide.',
  keywords: ['FMCG', 'trading', 'distribution', 'import', 'export', 'brands', 'consumer goods'],
  authors: [{ name: 'Brands Bridge International' }],
  openGraph: {
    title: 'Brands Bridge International | Premium FMCG Trading',
    description: 'Your trusted partner in global FMCG distribution',
    type: 'website',
    locale: 'en_US',
  },
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
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
