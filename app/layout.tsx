import './globals.css'
import { NextAuthProvider } from '@/components/nextauth-session-provider'
import {Session} from 'next-auth'

export const metadata = {
  title: 'URL Shorter',
  description: 'Make you URL short',
}

export default function RootLayout({
  children,
  session
}: {
  children: React.ReactNode,
  session: Session
}) {
  return (
    <html lang="en">
      <NextAuthProvider session={session}>
        <body className="bg-white">{children}</body>
      </NextAuthProvider>
    </html>
  )
}
