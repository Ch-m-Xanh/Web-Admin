import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/plants', label: 'Cây trồng' },
  { to: '/users', label: 'Người dùng' },
  { to: '/articles', label: 'Bài viết' },
]

export default function MainLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 shrink-0 bg-green-800 text-white flex flex-col transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-5 py-5 text-xl font-semibold border-b border-green-700 flex items-center justify-between">
          <span>Chạm Xanh Admin</span>
          <button
            type="button"
            onClick={closeSidebar}
            className="lg:hidden text-green-100 hover:text-white"
            aria-label="Đóng menu"
          >
            ×
          </button>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-green-700 text-white' : 'text-green-100 hover:bg-green-700/60'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-green-700">
          <button
            onClick={handleLogout}
            className="w-full rounded-md px-3 py-2 text-sm font-medium text-green-100 hover:bg-green-700/60 text-left"
          >
            Đăng xuất
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-md text-gray-600 hover:bg-gray-100"
            aria-label="Mở menu"
          >
            <span className="sr-only">Mở menu</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <span className="hidden sm:block text-sm font-medium text-gray-500">
            {navItems.find((item) => (item.end ? location.pathname === item.to : location.pathname.startsWith(item.to)))?.label ?? ''}
          </span>
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-sm text-gray-600 hidden sm:inline">{user?.name ?? user?.email ?? 'Quản trị viên'}</span>
            <div className="h-9 w-9 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-semibold uppercase">
              {(user?.name ?? user?.email ?? 'A').charAt(0)}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
