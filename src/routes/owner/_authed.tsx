import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { LayoutDashboard, BarChart3, Megaphone, Settings, UtensilsCrossed, LogOut } from 'lucide-react'
import { getSession, logout } from '../../server/auth.functions'

export const Route = createFileRoute('/owner/_authed')({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session || (session.role !== 'owner' && session.role !== 'staff')) {
      throw redirect({ to: '/owner/login' })
    }
    return { session }
  },
  component: OwnerLayout,
})

const nav = [
  { to: '/owner', label: 'Reservations', icon: LayoutDashboard },
  { to: '/owner/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/owner/marketing', label: 'Marketing', icon: Megaphone },
  { to: '/owner/menu', label: 'Menu', icon: UtensilsCrossed },
  { to: '/owner/settings', label: 'Settings', icon: Settings },
] as const

function OwnerLayout() {
  const { session } = Route.useRouteContext()

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 border-r border-stone-200 bg-white p-4 flex flex-col">
        <p className="font-semibold text-stone-900 px-2">Owner dashboard</p>
        <p className="text-xs text-stone-400 px-2 mb-6">{session.name}</p>
        <nav className="space-y-1 flex-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === '/owner' }}
              className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-100"
              activeProps={{ className: 'flex items-center gap-2 px-2 py-2 rounded-lg text-sm bg-amber-50 text-amber-700 font-medium' }}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <LogoutButton />
      </aside>
      <main className="flex-1 bg-stone-50 min-h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

function LogoutButton() {
  return (
    <button
      type="button"
      onClick={async () => {
        await logout()
        window.location.href = '/owner/login'
      }}
      className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-stone-500 hover:bg-stone-100 w-full"
    >
      <LogOut className="w-4 h-4" /> Log out
    </button>
  )
}
