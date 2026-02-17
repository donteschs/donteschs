import { useEffect, useState } from 'react'
import { fetchSettings } from '../services/api'

const SettingsPage = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchSettings().then(setData)
  }, [])

  if (!data) return <p>Loading settings...</p>

  return (
    <section className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 light:border-slate-200 light:bg-white">
        <h3 className="mb-2 font-semibold">API Connections</h3>
        <p>YouTube: {data.youtube_connected ? 'Connected' : 'Not connected'}</p>
        <p>TikTok: {data.tiktok_connected ? 'Connected' : 'Manual mode'}</p>
        <p>Facebook: {data.facebook_connected ? 'Connected' : 'Not connected'}</p>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 light:border-slate-200 light:bg-white">
        <h3 className="mb-2 font-semibold">Revenue Input</h3>
        <p>Monthly revenue (manual): ${data.monthly_revenue.toLocaleString()}</p>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 light:border-slate-200 light:bg-white md:col-span-2">
        <h3 className="mb-2 font-semibold">Profile Settings</h3>
        <p>Email/password auth enabled via JWT.</p>
      </div>
    </section>
  )
}

export default SettingsPage
