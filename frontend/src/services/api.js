import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
})

export const fetchDashboard = () => api.get('/analytics/dashboard').then((res) => res.data)
export const fetchPlatform = (platform) => api.get(`/analytics/platform/${platform}`).then((res) => res.data)
export const fetchContentCenter = () => api.get('/analytics/content-center').then((res) => res.data)
export const fetchCalendar = () => api.get('/analytics/calendar').then((res) => res.data)
export const fetchInsights = () => api.get('/analytics/insights').then((res) => res.data)
export const fetchSettings = () => api.get('/analytics/settings').then((res) => res.data)

export const registerUser = (payload) => api.post('/auth/register', payload).then((res) => res.data)
export const loginUser = (payload) => api.post('/auth/login', payload).then((res) => res.data)
