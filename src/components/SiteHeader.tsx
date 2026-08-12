import { Link } from '@tanstack/react-router'
import { CalendarClock } from 'lucide-react'

export function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight text-stone-900">
          <CalendarClock className="w-5 h-5 text-amber-600" />
          TableTime
        </Link>
        <nav className="flex items-center gap-4 text-sm text-stone-600">
          <Link to="/my-reservations" className="hover:text-stone-900">
            My reservations
          </Link>
          <Link to="/owner/login" className="hover:text-stone-900">
            Restaurant login
          </Link>
          <Link to="/admin/login" className="hover:text-stone-900">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  )
}
