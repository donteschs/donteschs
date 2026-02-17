import { NavLink } from 'react-router-dom'
import { BarChart3, Calendar, Clapperboard, Cog, Home, Lightbulb, Video } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/youtube', label: 'YouTube', icon: Video },
  { to: '/tiktok', label: 'TikTok', icon: Clapperboard },
  { to: '/facebook', label: 'Facebook', icon: BarChart3 },
  { to: '/content-center', label: 'Content Center', icon: BarChart3 },
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/insights', label: 'Insights', icon: Lightbulb },
  { to: '/settings', label: 'Settings', icon: Cog },
]

const Layout = ({ children, darkMode, setDarkMode }) => (
  <div className={darkMode ? '' : 'light'}>
    <div className="min-h-screen bg-slate-950 text-slate-100 transition-colors duration-300 light:bg-slate-100 light:text-slate-900">
      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[260px_1fr]">
        <aside className="border-r border-slate-800/80 p-5 light:border-slate-200">
          <h1 className="mb-6 text-2xl font-bold tracking-wide">DONTESCHS</h1>
          <nav className="space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2 transition ${
                    isActive ? 'bg-indigo-500/20 text-indigo-300' : 'hover:bg-slate-800/70 light:hover:bg-slate-200'
                  }`
                }
              >
                <Icon size={17} />
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="p-4 md:p-7">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-glow light:border-slate-200 light:bg-white">
            <div>
              <p className="text-sm text-slate-400">Creator Control Dashboard</p>
              <h2 className="text-xl font-semibold">Real-time cross-platform analytics</h2>
            </div>
            <div className="flex items-center gap-3">
              <select className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm light:border-slate-300 light:bg-slate-50">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Today</option>
              </select>
              <select className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm light:border-slate-300 light:bg-slate-50">
                <option>All Platforms</option>
                <option>YouTube</option>
                <option>TikTok</option>
                <option>Facebook</option>
              </select>
              <button
                onClick={() => setDarkMode((prev) => !prev)}
                className="rounded-lg bg-indigo-500 px-3 py-2 text-sm font-medium text-white"
              >
                {darkMode ? 'Light mode' : 'Dark mode'}
              </button>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  </div>
)

export default Layout
