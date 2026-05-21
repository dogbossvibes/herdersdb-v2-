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
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        <nav className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center gap-1 sticky top-0 z-50">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 mr-2">
            <span className="text-white text-xs font-bold">H</span>
          </div>
          <span className="text-slate-900 text-sm font-medium mr-3">HerdersDB</span>
          <Link href="/hunde"      className="text-slate-500 hover:text-slate-900 text-xs px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors">Hunde</Link>
          <Link href="/verpaarung" className="text-slate-500 hover:text-slate-900 text-xs px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors">Verpaarung</Link>
          <Link href="/erfassen"   className="text-slate-500 hover:text-slate-900 text-xs px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors">Hund erfassen</Link>
          <div className="ml-auto flex items-center gap-2">
            <div className="bg-green-50 border border-green-200 rounded-full px-2.5 py-1 text-xs text-green-700 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              Live
            </div>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-xs font-medium">
              MV
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  )
}