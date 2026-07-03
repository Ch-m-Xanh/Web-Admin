import { useCallback, useEffect, useState } from 'react'
import { deleteUser, fetchUsers, updateUser } from '../api/admin'
import { useGlobalPopup } from '../context/GlobalPopupContext'
import type { User } from '../types'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const { showSuccess } = useGlobalPopup()

  const loadUsers = useCallback(() => {
    setLoading(true)
    fetchUsers()
      .then(setUsers)
      .catch(() => {
        // Error surfaced globally.
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const handleToggleLock = async (user: User) => {
    await updateUser(user._id, { isLocked: !user.isLocked })
    showSuccess(user.isLocked ? 'Đã mở khoá người dùng' : 'Đã khoá người dùng')
    loadUsers()
  }

  const handleDelete = async (user: User) => {
    const confirmed = window.confirm(`Bạn có chắc muốn xoá người dùng "${user.name}"?`)
    if (!confirmed) return
    await deleteUser(user._id)
    showSuccess('Đã xoá người dùng')
    loadUsers()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Người dùng</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              <th className="py-3 px-4 font-medium">Tên</th>
              <th className="py-3 px-4 font-medium">Email</th>
              <th className="py-3 px-4 font-medium">Vai trò</th>
              <th className="py-3 px-4 font-medium">Trạng thái</th>
              <th className="py-3 px-4 font-medium text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-400">
                  Đang tải...
                </td>
              </tr>
            )}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-400">
                  Không có người dùng nào
                </td>
              </tr>
            )}
            {!loading &&
              users.map((user) => (
                <tr key={user._id} className="border-b border-gray-100 last:border-0">
                  <td className="py-3 px-4 text-gray-900">{user.name}</td>
                  <td className="py-3 px-4 text-gray-500">{user.email}</td>
                  <td className="py-3 px-4 text-gray-500 capitalize">{user.role}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.isLocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {user.isLocked ? 'Đã khoá' : 'Đang hoạt động'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-3">
                    <button
                      onClick={() => handleToggleLock(user)}
                      className="text-green-700 hover:text-green-900 font-medium"
                    >
                      {user.isLocked ? 'Mở khoá' : 'Khoá'}
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Xoá
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
