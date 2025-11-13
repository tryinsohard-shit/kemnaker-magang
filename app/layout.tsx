import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { SplashScreen } from "@/components/splash-screen"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Alternate Intern Kemnaker - Lowongan Magang",
  description: "Platform alternatif untuk menemukan lowongan magang dari Kementerian Ketenagakerjaan RI",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <SplashScreen />
        {children}
      </body>
    </html>
  )
}
