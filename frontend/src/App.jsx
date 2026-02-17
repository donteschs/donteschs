import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import AuthPage from './pages/AuthPage'
import CalendarPage from './pages/CalendarPage'
import ContentCenterPage from './pages/ContentCenterPage'
import DashboardPage from './pages/DashboardPage'
import InsightsPage from './pages/InsightsPage'
import PlatformPage from './pages/PlatformPage'
import SettingsPage from './pages/SettingsPage'

const App = () => {
  const [darkMode, setDarkMode] = useState(true)

  return (
    <Layout darkMode={darkMode} setDarkMode={setDarkMode}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/youtube" element={<PlatformPage platform="youtube" />} />
        <Route path="/tiktok" element={<PlatformPage platform="tiktok" />} />
        <Route path="/facebook" element={<PlatformPage platform="facebook" />} />
        <Route path="/content-center" element={<ContentCenterPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

export default App
