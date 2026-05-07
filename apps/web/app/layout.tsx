import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
  title: 'BEAST_BOTS - Sovereign AI Workforce',
  description: 'Every integration. One perfect bot.',
  icons: { icon: '/favicon.ico' },
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-zinc-950 text-white antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
