import { useEffect, useState } from 'react'
import { fetchContentCenter } from '../services/api'

const ContentCenterPage = () => {
  const [items, setItems] = useState([])
  const [sortBy, setSortBy] = useState('views')

  useEffect(() => {
    fetchContentCenter().then((res) => setItems(res.top_content))
  }, [])

  const sorted = [...items].sort((a, b) => (b[sortBy] ?? 0) - (a[sortBy] ?? 0))

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 light:border-slate-200 light:bg-white">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Unified Content Performance</h3>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded border border-slate-700 bg-slate-950 px-2 py-1 light:border-slate-300 light:bg-slate-50">
          <option value="views">Views</option>
          <option value="likes">Engagement</option>
          <option value="comments">Growth impact</option>
        </select>
      </div>
      <ul className="space-y-2 text-sm">
        {sorted.map((item) => (
          <li key={item.id} className="flex items-center justify-between rounded-xl border border-slate-800 px-3 py-2 light:border-slate-200">
            <span>{item.title} · {item.platform}</span>
            <span>{item.views.toLocaleString()} views</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ContentCenterPage
