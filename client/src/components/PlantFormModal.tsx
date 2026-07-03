import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { fetchCategories, FALLBACK_CATEGORIES } from '../api/categories'
import { uploadFile } from '../api/uploads'
import { useGlobalPopup } from '../context/GlobalPopupContext'
import type { CareLevel, CategoryOption, Plant, PlantInput } from '../types'

interface PlantFormModalProps {
  plant: Plant | null
  onClose: () => void
  onSubmit: (input: PlantInput) => Promise<void>
}

const CARE_LEVELS: { value: CareLevel; label: string }[] = [
  { value: 'easy', label: 'Dễ' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'hard', label: 'Khó' },
]

function emptyForm(): PlantInput {
  return {
    name: '',
    scientificName: '',
    description: '',
    careLevel: 'easy',
    light: '',
    water: '',
    category: '',
    images: [],
    isMedicinal: false,
    tags: [],
  }
}

export default function PlantFormModal({ plant, onClose, onSubmit }: PlantFormModalProps) {
  const [form, setForm] = useState<PlantInput>(() => (plant ? { ...plant } : emptyForm()))
  const [tagsText, setTagsText] = useState(() => (plant?.tags ?? []).join(', '))
  const [categories, setCategories] = useState<CategoryOption[]>(FALLBACK_CATEGORIES)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { showError, showSuccess } = useGlobalPopup()

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => {
        // Keep fallback categories on error.
      })
  }, [])

  const handleChange = (field: keyof PlantInput, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { url } = await uploadFile(file)
      setForm((prev) => ({ ...prev, images: [...prev.images, url] }))
      showSuccess('Tải ảnh thành công')
    } catch {
      // Error surfaced globally.
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const removeImage = (index: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!form.name.trim()) {
      showError('Vui lòng nhập tên cây')
      return
    }
    if (!form.category) {
      showError('Vui lòng chọn danh mục')
      return
    }
    setSubmitting(true)
    try {
      const tags = tagsText
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
      await onSubmit({ ...form, tags })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{plant ? 'Sửa cây trồng' : 'Thêm cây mới'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên cây</label>
              <input
                required
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên khoa học</label>
              <input
                value={form.scientificName}
                onChange={(e) => handleChange('scientificName', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <select
                required
                value={form.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="">-- Chọn --</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Độ khó chăm sóc</label>
              <select
                value={form.careLevel}
                onChange={(e) => handleChange('careLevel', e.target.value as CareLevel)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                {CARE_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isMedicinal}
                  onChange={(e) => handleChange('isMedicinal', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-green-700 focus:ring-green-600"
                />
                Cây dược liệu
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ánh sáng</label>
              <input
                value={form.light}
                onChange={(e) => handleChange('light', e.target.value)}
                placeholder="vd: Ánh sáng gián tiếp"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nước</label>
              <input
                value={form.water}
                onChange={(e) => handleChange('water', e.target.value)}
                placeholder="vd: Tưới 2 lần/tuần"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thẻ (tags, cách nhau bởi dấu phẩy)</label>
            <input
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="vd: trong-nha, de-trong"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh</label>
            <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="text-sm" />
            {uploading && <p className="text-xs text-gray-500 mt-1">Đang tải ảnh lên...</p>}
            <div className="flex flex-wrap gap-3 mt-3">
              {form.images.map((url, index) => (
                <div key={`${url}-${index}`} className="relative">
                  <img src={url} alt="" className="h-20 w-20 object-cover rounded-md border border-gray-200" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-600 text-white text-xs leading-none hover:bg-red-700"
                    aria-label="Xoá ảnh"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="rounded-md px-4 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-800 disabled:opacity-60"
            >
              {submitting ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
