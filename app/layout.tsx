import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-provider"
import { ApolloWrapper } from "@/lib/apollo-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Tactology Department Management",
  description: "A modern department management system",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <ApolloWrapper>
            <AuthProvider>{children}</AuthProvider>
          </ApolloWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
