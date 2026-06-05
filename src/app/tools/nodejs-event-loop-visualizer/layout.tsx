import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Node.js Event Loop Architecture',
  description: 'Interactive visualization of Node.js event loop phases and request lifecycle',
}

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export default function ToolLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" className={`${GeistSans.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen overflow-hidden bg-slate-950 text-slate-200" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
