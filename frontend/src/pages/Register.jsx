import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', form)
      login(data)
      toast.success(`Account created! Welcome, ${data.name}`)
      navigate('/test')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4">
      <motion.div
        className="w-full max-w-md bg-slate-800/60 backdrop-blur border border-slate-700 rounded-2xl p-8"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold mb-1">Create account</h2>
        <p className="text-slate-400 text-sm mb-6">Start your color vision test for free</p>

        <form onSubmit={submit} className="space-y-4">
          {[
            { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Prasad Ingole' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
            { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label className="text-sm text-slate-400 mb-1 block">{label}</label>
              <input
                type={type} required
                value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                placeholder={placeholder}
              />
            </div>
          ))}
          <button
            type="submit" disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold transition-all disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-6">
          Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
