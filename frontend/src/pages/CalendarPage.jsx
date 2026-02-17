import { useEffect, useState } from 'react'
import { fetchCalendar } from '../services/api'

const CalendarPage = () => {
  const [entries, setEntries] = useState([])

  useEffect(() => {
    fetchCalendar().then(setEntries)
  }, [])

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 light:border-slate-200 light:bg-white">
        <h3 className="mb-3 text-lg font-semibold">Posting Tracker</h3>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {entries.map((entry) => (
            <article key={`${entry.date}-${entry.title}`} className="rounded-xl border border-slate-800 px-3 py-2 text-sm light:border-slate-200">
              <p className="font-semibold">{entry.title}</p>
              <p>{entry.date}</p>
              <p>{entry.platform} · {entry.performance}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 light:border-slate-200 light:bg-white">Best Posting Days: Tuesday & Thursday</div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 light:border-slate-200 light:bg-white">Best Frequency: 4-5 uploads/week</div>
      </div>
    </section>
  )
}

export default CalendarPage
