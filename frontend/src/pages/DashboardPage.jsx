import { useEffect, useState } from 'react'
import LineChart from '../charts/LineChart'
import CardGrid from '../components/CardGrid'
import { fetchDashboard } from '../services/api'

const DashboardPage = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchDashboard().then(setData)
  }, [])

  if (!data) return <p>Loading dashboard...</p>

  return (
    <section className="space-y-5">
      <CardGrid cards={data.cards} />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 lg:col-span-2 light:border-slate-200 light:bg-white">
          <h3 className="mb-3 text-lg font-semibold">Followers Growth</h3>
          <LineChart data={data.follower_growth} label="Followers" />
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 light:border-slate-200 light:bg-white">
            <p className="text-sm text-slate-400">Engagement Rate</p>
            <p className="mt-1 text-3xl font-bold">{data.engagement_rate}%</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 light:border-slate-200 light:bg-white">
            <p className="text-sm text-slate-400">Best Platform</p>
            <p className="mt-1 text-3xl font-bold">{data.best_platform}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 light:border-slate-200 light:bg-white">
            <p className="mb-2 text-sm text-slate-400">Recent Alerts</p>
            <ul className="space-y-1 text-sm">
              {data.alerts.map((alert) => (
                <li key={alert}>• {alert}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DashboardPage
