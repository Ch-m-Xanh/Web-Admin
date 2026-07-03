import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchArticles } from '../api/articles'
import { SkeletonCards } from '../components/Skeleton'
import { getSocket } from '../services/socket'
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

  // Real-time sync: reflect article changes made from other admin sessions
  // immediately without requiring a manual refresh.
  useEffect(() => {
    const socket = getSocket()

    const handleCreated = (article: Article) => {
      setArticles((prev) => (prev.some((a) => a._id === article._id) ? prev : [article, ...prev]))
    }
    const handleUpdated = (article: Article) => {
      setArticles((prev) => prev.map((a) => (a._id === article._id ? article : a)))
    }
    const handleDeleted = (payload: { _id: string }) => {
      setArticles((prev) => prev.filter((a) => a._id !== payload._id))
    }

    socket.on('article:created', handleCreated)
    socket.on('article:updated', handleUpdated)
    socket.on('article:deleted', handleDeleted)

    return () => {
      socket.off('article:created', handleCreated)
      socket.off('article:updated', handleUpdated)
      socket.off('article:deleted', handleDeleted)
    }
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Bài viết</h1>

      {!loading && articles.length === 0 && (
        <p className="text-gray-400">Chưa có bài viết nào.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && <SkeletonCards count={6} />}
        {!loading &&
          articles.map((article) => (
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
