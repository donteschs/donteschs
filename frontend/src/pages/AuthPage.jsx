import { useState } from 'react'
import { loginUser, registerUser } from '../services/api'

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      const action = isLogin ? loginUser : registerUser
      const res = await action(form)
      localStorage.setItem('token', res.access_token)
      setMessage('Authenticated successfully. JWT token stored in browser.')
    } catch {
      setMessage('Authentication failed. Try another email/password.')
    }
  }

  return (
    <section className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 light:border-slate-200 light:bg-white">
      <h3 className="mb-4 text-xl font-semibold">{isLogin ? 'Login' : 'Create account'}</h3>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 light:border-slate-300 light:bg-slate-50" type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 light:border-slate-300 light:bg-slate-50" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <button className="w-full rounded-lg bg-indigo-500 px-4 py-2 font-medium text-white" type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={() => setIsLogin((prev) => !prev)} className="mt-3 text-sm text-indigo-400">
        {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
      </button>
      {message ? <p className="mt-3 text-sm text-slate-300">{message}</p> : null}
    </section>
  )
}

export default AuthPage
