import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const LABEL_COLORS = {
  Normal: '#22c55e',
  Protanopia: '#ef4444',
  Deuteranopia: '#3b82f6',
  RG_Deficient: '#a855f7',
}

export default function History() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/test/history').then(({ data }) => {
      setHistory(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleLogout = () => { logout(); navigate('/') }

  // Chart data — count per prediction type
  const chartData = Object.entries(
    history.reduce((acc, h) => {
      acc[h.prediction] = (acc[h.prediction] || 0) + 1
      return acc
    }, {})
  ).map(([name, count]) => ({ name, count }))

  return (
    <div className="min-h-screen bg-[#0f172a] px-4 py-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-slate-400 text-sm">Welcome back, {user?.name}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/test')}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-sm font-medium"
            >
              New Test
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-400 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Tests', value: history.length },
            { label: 'Latest Result', value: history[0]?.prediction?.replace('_', ' ') || '—' },
            { label: 'Last Taken', value: history[0] ? new Date(history[0].takenAt).toLocaleDateString() : '—' },
          ].map(({ label, value }) => (
            <motion.div
              key={label}
              className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 text-center"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            >
              <div className="text-xl font-bold text-white">{value}</div>
              <div className="text-xs text-slate-500 mt-1">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <motion.div
            className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 mb-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          >
            <h3 className="text-sm font-semibold text-slate-300 mb-4">Your Test History Distribution</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((d) => <Cell key={d.name} fill={LABEL_COLORS[d.name] || '#3b82f6'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* History list */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Test Records</h3>
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-10 text-slate-500">No tests taken yet. <button onClick={() => navigate('/test')} className="text-blue-400">Take your first test →</button></div>
          ) : (
            history.map((h, i) => (
              <motion.div
                key={h.id}
                className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 flex items-center justify-between"
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: LABEL_COLORS[h.prediction] || '#64748b' }} />
                  <div>
                    <div className="font-medium text-sm">{h.prediction?.replace('_', ' ')}</div>
                    <div className="text-xs text-slate-500">{new Date(h.takenAt).toLocaleString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold" style={{ color: LABEL_COLORS[h.prediction] }}>{h.confidence}%</div>
                  <div className="text-xs text-slate-500">confidence</div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
