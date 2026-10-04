import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "sonner"
import { GoogleTagManager } from '@next/third-parties/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from "next/script";
import { Notification } from "@/components/notification"
import { SessionRefresher } from "@/components/auth/session-refresher"
export const metadata: Metadata = {
  metadataBase: new URL("https://isroot.in"),

  title: "isroot.in - Free Subdomains for Developers",
  description:
    "Get your free yourname.isroot.in subdomain. Simple, fast DNS management for students and indie hackers.",

  icons: {
  icon: [
    { url: "/favicon.svg", type: "image/svg+xml" },
    { url: "/favicon.ico" }, // fallback
  ],
},
  openGraph: {
    title: "isroot.in - Free Subdomains for Developers",
    description:
      "Get your free yourname.isroot.in subdomain. Simple DNS management for developers.",
    url: "https://isroot.in",
    siteName: "isroot.in",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "isroot.in – Free Subdomains for Developers",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "isroot.in - Free Subdomains",
    description: "Get your free subdomain and manage DNS records",
    images: ["/og.png"],
  },
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-mono antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const isDark =
                  localStorage.getItem('theme') === 'dark' ||
                  (!localStorage.getItem('theme') &&
                    window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) document.documentElement.classList.add('dark');
              } catch {}
            `,
          }}
        />

        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />

        <Toaster />
        <Notification />
        <SessionRefresher />
        {children}
        <GoogleTagManager gtmId="GTM-WFQPHX4T" />
        <GoogleAnalytics gaId="G-QNPP31MS7E" />
      </body>
    </html>
  )
}
