import { useCallback, useEffect, useState } from 'react'
import PlantFormModal from '../components/PlantFormModal'
import { createPlant, deletePlant, fetchPlants, updatePlant } from '../api/plants'
import { useGlobalPopup } from '../context/GlobalPopupContext'
import type { Plant, PlantInput } from '../types'

const CARE_LEVEL_LABEL: Record<string, string> = {
  easy: 'Dễ',
  medium: 'Trung bình',
  hard: 'Khó',
}

export default function PlantsPage() {
  const [plants, setPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPlant, setEditingPlant] = useState<Plant | null>(null)
  const { showSuccess } = useGlobalPopup()

  const loadPlants = useCallback(() => {
    setLoading(true)
    fetchPlants({ search: search || undefined })
      .then(setPlants)
      .catch(() => {
        // Error surfaced globally.
      })
      .finally(() => setLoading(false))
  }, [search])

  useEffect(() => {
    loadPlants()
  }, [loadPlants])

  const openCreateModal = () => {
    setEditingPlant(null)
    setModalOpen(true)
  }

  const openEditModal = (plant: Plant) => {
    setEditingPlant(plant)
    setModalOpen(true)
  }

  const closeModal = () => setModalOpen(false)

  const handleSubmit = async (input: PlantInput) => {
    if (editingPlant) {
      await updatePlant(editingPlant._id, input)
      showSuccess('Cập nhật cây trồng thành công')
    } else {
      await createPlant(input)
      showSuccess('Thêm cây mới thành công')
    }
    setModalOpen(false)
    loadPlants()
  }

  const handleDelete = async (plant: Plant) => {
    const confirmed = window.confirm(`Bạn có chắc muốn xoá "${plant.name}"?`)
    if (!confirmed) return
    await deletePlant(plant._id)
    showSuccess('Đã xoá cây trồng')
    loadPlants()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Cây trồng</h1>
        <button
          onClick={openCreateModal}
          className="rounded-md px-4 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-800"
        >
          + Thêm cây mới
        </button>
      </div>

      <div className="flex items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm theo tên..."
          className="w-full max-w-sm rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200">
              <th className="py-3 px-4 font-medium">Tên</th>
              <th className="py-3 px-4 font-medium">Danh mục</th>
              <th className="py-3 px-4 font-medium">Độ khó</th>
              <th className="py-3 px-4 font-medium text-right">Lượt xem</th>
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
            {!loading && plants.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-400">
                  Không có cây nào
                </td>
              </tr>
            )}
            {!loading &&
              plants.map((plant) => (
                <tr key={plant._id} className="border-b border-gray-100 last:border-0">
                  <td className="py-3 px-4 text-gray-900">{plant.name}</td>
                  <td className="py-3 px-4 text-gray-500">{plant.category}</td>
                  <td className="py-3 px-4 text-gray-500">{CARE_LEVEL_LABEL[plant.careLevel] ?? plant.careLevel}</td>
                  <td className="py-3 px-4 text-right text-gray-900">{plant.viewCount.toLocaleString('vi-VN')}</td>
                  <td className="py-3 px-4 text-right space-x-3">
                    <button
                      onClick={() => openEditModal(plant)}
                      className="text-green-700 hover:text-green-900 font-medium"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(plant)}
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

      {modalOpen && (
        <PlantFormModal plant={editingPlant} onClose={closeModal} onSubmit={handleSubmit} />
      )}
    </div>
  )
}
