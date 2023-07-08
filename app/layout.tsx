import './globals.css'

export const metadata = {
  title: 'URL Shorter',
  description: 'Make you URL short',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
