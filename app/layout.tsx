import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { Suspense } from 'react';
import { ClientLayoutBackground } from '@/components/ClientLayoutBackground';
import { PageTransition } from '@/components/PageTransition';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LUMA — AI Reflection Companion',
  description: 'An AI-powered mirror for life reflection. Understand your emotional patterns, recover from digital burnout, and live more intentionally.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} dark`}>
      <body className="antialiased font-sans bg-[#07080F] text-slate-100 overflow-x-hidden min-h-screen flex flex-col relative">
        <ClientLayoutBackground />
        <div className="pt-16 flex-1 flex flex-col">
          <Suspense fallback={<div className="flex-1" />}>
            <PageTransition>
              {children}
            </PageTransition>
          </Suspense>
        </div>
      </body>
    </html>
  );
}
