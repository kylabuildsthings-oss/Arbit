import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from './components/Navigation'
import { ThemeProvider } from './components/ThemeProvider'
import ThemeToggle from './components/ThemeToggle'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ARBIT - Trading Cards',
  description: 'Collect, trade, and master trading card strategies. Learn crypto trading concepts while building your ultimate collection.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          {children}
          <Navigation />
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  )
}

