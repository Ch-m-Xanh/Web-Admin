import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { fetchAdminStats } from '../api/admin'
import type { AdminStats } from '../types'

const CHART_COLOR = '#15803d'

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-semibold text-gray-900 mt-2">{value.toLocaleString('vi-VN')}</p>
    </div>
  )
}

export default function DashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetchAdminStats()
      .then((data) => {
        if (active) setStats(data)
      })
      .catch(() => {
        // Error surfaced globally via interceptor.
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const chartData = (stats?.newUsersLast7Days ?? []).map((count, index) => ({
    day: `Ngày ${index + 1}`,
    count,
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      {loading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Tổng người dùng" value={stats?.totalUsers ?? 0} />
            <StatCard label="Tổng số cây" value={stats?.totalPlants ?? 0} />
            <StatCard label="Bài đăng tuần này" value={stats?.totalPostsThisWeek ?? 0} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h2 className="text-base font-semibold text-gray-900 mb-1">Người dùng mới (7 ngày qua)</h2>
              <p className="text-xs text-gray-500 mb-4">Số lượng người dùng mới đăng ký mỗi ngày</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={{ stroke: '#e5e7eb' }}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(21,128,61,0.08)' }}
                      formatter={(value) => [String(value), 'Người dùng mới']}
                    />
                    <Bar dataKey="count" fill={CHART_COLOR} radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Top 5 cây được xem nhiều nhất</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-200">
                    <th className="py-2 font-medium">Tên cây</th>
                    <th className="py-2 font-medium">Danh mục</th>
                    <th className="py-2 font-medium text-right">Lượt xem</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats?.topViewedPlants ?? []).slice(0, 5).map((plant) => (
                    <tr key={plant._id} className="border-b border-gray-100 last:border-0">
                      <td className="py-2 text-gray-900">{plant.name}</td>
                      <td className="py-2 text-gray-500">{plant.category}</td>
                      <td className="py-2 text-right text-gray-900">{plant.viewCount.toLocaleString('vi-VN')}</td>
                    </tr>
                  ))}
                  {(stats?.topViewedPlants ?? []).length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-4 text-center text-gray-400">
                        Chưa có dữ liệu
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
