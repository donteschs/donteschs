import { useEffect, useState } from 'react'
import LineChart from '../charts/LineChart'
import { fetchPlatform } from '../services/api'

const PlatformPage = ({ platform }) => {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchPlatform(platform).then(setData)
  }, [platform])

  if (!data) return <p>Loading {platform} analytics...</p>

  return (
    <section className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 light:border-slate-200 light:bg-white"><p>Followers</p><h3 className="text-2xl font-bold">{data.followers.toLocaleString()}</h3></div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 light:border-slate-200 light:bg-white"><p>Total Views</p><h3 className="text-2xl font-bold">{data.views.toLocaleString()}</h3></div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 light:border-slate-200 light:bg-white"><p>Engagement</p><h3 className="text-2xl font-bold">{data.engagement_rate}%</h3></div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 light:border-slate-200 light:bg-white">
        <h3 className="mb-3 text-lg font-semibold">Growth by Day</h3>
        <LineChart data={data.growth} label={`${data.platform} Growth`} />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 light:border-slate-200 light:bg-white">
        <h3 className="mb-4 text-lg font-semibold">Top Videos</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                <th className="py-2">Title</th><th>Views</th><th>Likes</th><th>Comments</th><th>Publish Date</th>
              </tr>
            </thead>
            <tbody>
              {data.top_videos.map((video) => (
                <tr key={video.id} className="border-b border-slate-800/80">
                  <td className="py-2 pr-2">{video.title}</td>
                  <td>{video.views.toLocaleString()}</td>
                  <td>{video.likes.toLocaleString()}</td>
                  <td>{video.comments.toLocaleString()}</td>
                  <td>{new Date(video.publish_date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default PlatformPage
