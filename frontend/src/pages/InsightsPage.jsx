import { useEffect, useState } from 'react'
import { fetchInsights } from '../services/api'

const InsightsPage = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchInsights().then(setData)
  }, [])

  if (!data) return <p>Loading insights...</p>

  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 light:border-slate-200 light:bg-white">Fastest Growing Platform: <strong>{data.fastest_growing_platform}</strong></div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 light:border-slate-200 light:bg-white">Best Content Type: <strong>{data.best_content_type}</strong></div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 light:border-slate-200 light:bg-white md:col-span-2">Engagement Trend: <strong>{data.engagement_trend}</strong></div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 light:border-slate-200 light:bg-white md:col-span-2">
        <h3 className="mb-2 font-semibold">Alerts</h3>
        {data.alerts.map((alert) => <p key={alert}>• {alert}</p>)}
      </div>
    </section>
  )
}

export default InsightsPage
