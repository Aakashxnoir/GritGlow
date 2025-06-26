import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GritGlow - Daily Habit Tracker",
  description:
    "Build better habits with gamification. Track your daily habits, earn points, unlock achievements, and level up your life.",
  keywords: "habit tracker, daily habits, productivity, gamification, personal development",
  authors: [{ name: "GritGlow Team" }],
  viewport: "width=device-width, initial-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
