import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchArticle } from '../api/articles'
import type { Article } from '../types'

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let active = true
    setLoading(true)
    fetchArticle(id)
      .then((data) => {
        if (active) setArticle(data)
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
  }, [id])

  return (
    <div className="space-y-4 max-w-3xl">
      <Link to="/articles" className="text-sm text-green-700 hover:text-green-900">
        ← Quay lại danh sách bài viết
      </Link>

      {loading && <p className="text-gray-500">Đang tải...</p>}

      {!loading && !article && <p className="text-gray-400">Không tìm thấy bài viết.</p>}

      {!loading && article && (
        <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {article.coverImage && (
            <img src={article.coverImage} alt={article.title} className="w-full max-h-80 object-cover" />
          )}
          <div className="p-6 space-y-4">
            <h1 className="text-2xl font-semibold text-gray-900">{article.title}</h1>
            <div className="flex flex-wrap gap-1.5">
              {article.tags.map((tag) => (
                <span key={tag} className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{article.content}</p>
          </div>
        </article>
      )}
    </div>
  )
}
