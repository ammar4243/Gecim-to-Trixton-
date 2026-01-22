import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ReferralProvider } from "@/hooks/use-referral"
import { Space_Grotesk, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "Gecim - Revolutionary Blockchain Ecosystem",
  description:
    "Join the revolutionary blockchain ecosystem with Gecim. Secure your position in the next generation of decentralized finance.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: "#0a0a1a",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <div className="gradient-mesh grid-pattern min-h-screen">
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse-glow w-16 h-16 rounded-full bg-primary/20" />
              </div>
            }
          >
            <ReferralProvider>{children}</ReferralProvider>
          </Suspense>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
