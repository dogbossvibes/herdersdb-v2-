import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'

export const metadata: Metadata = {
  title: 'HerdersDB',
  description: 'Zuchtdatenbank fuer Hollaendische Schaeferhunde',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <nav style={{
          background: '#0f172a',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: '12px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          <span style={{ fontWeight: 800, fontSize: 16, color: '#f8fafc', marginRight: 16 }}>
            HerdersDB
          </span>
          <Link href="/hunde" style={{ color: '#a5b4fc', fontSize: 13, fontWeight: 600, textDecoration: 'none', padding: '6px 14px' }}>
            Hunde
          </Link>
          <Link href="/erfassen" style={{ color: '#64748b', fontSize: 13, fontWeight: 600, textDecoration: 'none', padding: '6px 14px' }}>
            Hund erfassen
          </Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}