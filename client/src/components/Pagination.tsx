interface PaginationProps {
  page: number
  pageCount: number
  onPageChange: (page: number) => void
  totalItems: number
  pageSize: number
}

export default function Pagination({ page, pageCount, onPageChange, totalItems, pageSize }: PaginationProps) {
  if (pageCount <= 1) return null

  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, totalItems)

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 text-sm">
      <span className="text-gray-500">
        Hiển thị {from}-{to} trên {totalItems.toLocaleString('vi-VN')}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-md px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
        >
          Trước
        </button>
        <span className="px-2 text-gray-500">
          Trang {page}/{pageCount}
        </span>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pageCount}
          className="rounded-md px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent"
        >
          Sau
        </button>
      </div>
    </div>
  )
}
