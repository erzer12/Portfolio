import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Harshil P — CS Student, Builder',
  description:
    'Third-year CS student focused on AI, ML, and practical product work. Portfolio of projects, experience, and certifications.',
  openGraph: {
    title: 'Harshil P',
    description: 'Third-year CS student focused on AI, ML, and practical product work.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
