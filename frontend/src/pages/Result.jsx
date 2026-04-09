import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

const CVD_INFO = {
  Normal: {
    color: '#22c55e',
    gradient: 'from-green-500 to-emerald-400',
    icon: '✅',
    desc: 'Your color vision is normal. You can distinguish all colors accurately.',
    tip: 'No action needed. Your vision is healthy!'
  },
  Protanopia: {
    color: '#ef4444',
    gradient: 'from-red-500 to-orange-400',
    icon: '🔴',
    desc: 'You have Protanopia — difficulty distinguishing red colors. Red appears darker or absent.',
    tip: 'Consider consulting an ophthalmologist. Use color-blind friendly tools.'
  },
  Deuteranopia: {
    color: '#22c55e',
    gradient: 'from-green-500 to-teal-400',
    icon: '🟢',
    desc: 'You have Deuteranopia — difficulty distinguishing green colors. Green and red may look similar.',
    tip: 'Consider consulting an ophthalmologist. Use color-blind friendly tools.'
  },
  RG_Deficient: {
    color: '#a855f7',
    gradient: 'from-purple-500 to-pink-400',
    icon: '🟣',
    desc: 'You have a Red-Green deficiency — difficulty distinguishing both red and green colors.',
    tip: 'This is the most common form of color blindness. Consult a specialist.'
  }
}

export default function Result() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const result = state?.result

  if (!result) {
    navigate('/')
    return null
  }

  const info = CVD_INFO[result.prediction] || CVD_INFO.Normal

  // Pie chart data
  const pieData = Object.entries(result.scores || {}).map(([name, value]) => ({ name, value }))

  // Bar chart data
  const barData = [
    { name: 'Control Fail', value: result.controlFail },
    { name: 'Red Fail', value: result.redFail },
    { name: 'Green Fail', value: result.greenFail },
    { name: 'Vanishing Seen', value: result.vanishingSeen },
    { name: 'Correct', value: result.totalCorrect },
  ]

  const COLORS = ['#22c55e', '#ef4444', '#3b82f6', '#a855f7', '#f59e0b']

  return (
    <div className="min-h-screen bg-[#0f172a] px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Result card */}
        <motion.div
          className={`relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br ${info.gradient} shadow-2xl`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 text-center">
            <motion.div
              className="text-6xl mb-4"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {info.icon}
            </motion.div>
            <p className="text-white/80 text-sm font-medium uppercase tracking-widest mb-2">Diagnosis Result</p>
            <h1 className="text-4xl font-['Poppins'] font-bold text-white mb-2">
              {result.prediction === 'RG_Deficient' ? 'Red-Green Deficient' : result.prediction}
            </h1>
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-5 py-2 mt-2">
              <span className="text-white font-bold text-xl">{result.confidence}%</span>
              <span className="text-white/80 text-sm">confidence</span>
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        >
          <p className="text-slate-300 mb-3">{info.desc}</p>
          <div className="flex items-start gap-2 bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
            <span className="text-blue-400 mt-0.5">💡</span>
            <p className="text-blue-300 text-sm">{info.tip}</p>
          </div>
          <p className="text-slate-500 text-xs mt-4">⚠️ This is a screening tool only, not a medical diagnosis. Consult an ophthalmologist for clinical evaluation.</p>
        </motion.div>

        {/* Charts row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pie chart */}
          <motion.div
            className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          >
            <h3 className="text-sm font-semibold text-slate-300 mb-4">Probability Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1 text-xs text-slate-400">
                  <div className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  {d.name}: {d.value}%
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bar chart */}
          <motion.div
            className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
          >
            <h3 className="text-sm font-semibold text-slate-300 mb-4">Response Breakdown</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 9 }} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {barData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => navigate('/test')}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-sm font-medium transition-colors"
          >
            Retake Test
          </button>
          <button
            onClick={() => navigate('/history')}
            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl text-sm font-semibold transition-all"
          >
            View History →
          </button>
        </motion.div>
      </div>
    </div>
  )
}
