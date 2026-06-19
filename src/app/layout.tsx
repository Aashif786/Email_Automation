import './globals.css';
import type { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import { ClientLayout } from '@/components/ClientLayout';

export const metadata: Metadata = {
  title: 'Caldim Digital Postmaster',
  description: 'AI-driven email classification dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#0B0F19] text-slate-200 antialiased selection:bg-[#06B6D4]/30 selection:text-white font-sans">
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
