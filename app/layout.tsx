import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

// Optimized font loading - subset and swap for performance
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

// Static metadata - cached at build time
export const metadata: Metadata = {
  title: {
    default: "Resume Bullet Generator | AI-Powered Resume Writer",
    template: "%s | Resume Bullets Generator",
  },
  description:
    "Generate tailored, quantified resume bullet points in seconds. Paste your job description and experience — get 10 powerful STAR-format bullets instantly.",
  keywords: [
    "resume generator",
    "AI resume writer",
    "bullet points",
    "job application",
    "career",
    "STAR format",
  ],
  authors: [{ name: "Resume Bullets Generator" }],
  creator: "Resume Bullets Generator",
  publisher: "Resume Bullets Generator",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Resume Bullets Generator",
    title: "Resume Bullet Generator | AI-Powered Resume Writer",
    description:
      "Generate tailored, quantified resume bullet points in seconds. Paste your job description and experience — get 10 powerful STAR-format bullets instantly.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume Bullet Generator | AI-Powered Resume Writer",
    description:
      "Generate tailored, quantified resume bullet points in seconds.",
  },
}

// Viewport configuration - separated from metadata in Next.js 16
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-white text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-gray-900 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>

        {/* Main content */}
        <main id="main-content" className="flex min-h-screen flex-col">
          {children}
        </main>
      </body>
    </html>
  )
}
