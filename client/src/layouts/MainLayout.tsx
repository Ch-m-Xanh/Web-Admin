import { NavLink, Outlet, useNavigate } from 'react-router-dom'
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

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-60 shrink-0 bg-green-800 text-white flex flex-col">
        <div className="px-5 py-5 text-xl font-semibold border-b border-green-700">
          Chạm Xanh Admin
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
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

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6 gap-3">
          <span className="text-sm text-gray-600">{user?.name ?? user?.email ?? 'Quản trị viên'}</span>
          <div className="h-9 w-9 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-semibold uppercase">
            {(user?.name ?? user?.email ?? 'A').charAt(0)}
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
