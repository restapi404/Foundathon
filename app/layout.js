import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Verdant — Climate Tech Platform',
  description: 'Connect climate startups with investors, researchers, and talent.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
