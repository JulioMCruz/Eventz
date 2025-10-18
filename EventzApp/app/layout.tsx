import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/components/providers'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Eventz - The Solution to Manage Your Events',
  description: 'Professional event management platform with customizable landing pages, automated redirects, and seamless attendee experience. Create, manage, and track your events effortlessly.',
  keywords: ['event management', 'event platform', 'event redirect', 'landing pages', 'event marketing', 'event registration', 'event tracking'],
  authors: [{ name: 'Eventz' }],
  openGraph: {
    title: 'Eventz - The Solution to Manage Your Events',
    description: 'Professional event management platform with customizable landing pages and automated redirects.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eventz - The Solution to Manage Your Events',
    description: 'Professional event management platform with customizable landing pages and automated redirects.',
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
