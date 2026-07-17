import type { Metadata } from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Core CMS',
  description: 'Visual editor for the Core website.',
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-[#0b0b0d] font-sans text-fg antialiased">{children}</body>
    </html>
  );
}
