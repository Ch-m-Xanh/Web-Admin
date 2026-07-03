import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchArticles } from '../api/articles'
import type { Article } from '../types'

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetchArticles()
      .then((data) => {
        if (active) setArticles(data)
      })
      .catch(() => {
        // Error surfaced globally.
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Bài viết</h1>

      {loading && <p className="text-gray-500">Đang tải...</p>}

      {!loading && articles.length === 0 && (
        <p className="text-gray-400">Chưa có bài viết nào.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <Link
            key={article._id}
            to={`/articles/${article._id}`}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {article.coverImage ? (
              <img src={article.coverImage} alt={article.title} className="h-40 w-full object-cover" />
            ) : (
              <div className="h-40 w-full bg-green-50 flex items-center justify-center text-green-300 text-sm">
                Không có ảnh
              </div>
            )}
            <div className="p-4">
              <h2 className="font-semibold text-gray-900 line-clamp-2">{article.title}</h2>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
