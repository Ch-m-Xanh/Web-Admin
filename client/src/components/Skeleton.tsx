/** Simple pulse skeleton block. Compose with width/height utility classes. */
export function SkeletonBlock({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
}

/** Skeleton rows for a table body, matching the given column count. */
export function SkeletonTableRows({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-gray-100 last:border-0">
          {Array.from({ length: columns }).map((__, colIndex) => (
            <td key={colIndex} className="py-3 px-4">
              <SkeletonBlock className="h-4 w-full max-w-[10rem]" />
            </td>
          ))}
        </tr>
      ))}
    </>
  )
}

/** Skeleton cards for a card-grid layout (e.g. articles). */
export function SkeletonCards({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <SkeletonBlock className="h-40 w-full rounded-none" />
          <div className="p-4 space-y-2">
            <SkeletonBlock className="h-4 w-3/4" />
            <SkeletonBlock className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </>
  )
}
