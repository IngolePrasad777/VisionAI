import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

// Floating dot component
function Dot({ style }) {
  return (
    <motion.div
      className="absolute rounded-full opacity-20 blur-sm"
      style={style}
      animate={{ y: [0, -30, 0], scale: [1, 1.2, 1] }}
      transition={{ duration: 4 + Math.random() * 3, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 2 }}
    />
  )
}

const DOTS = [
  { width: 120, height: 120, background: '#ef4444', top: '10%', left: '5%' },
  { width: 80,  height: 80,  background: '#22c55e', top: '20%', right: '8%' },
  { width: 160, height: 160, background: '#3b82f6', bottom: '15%', left: '10%' },
  { width: 100, height: 100, background: '#a855f7', top: '50%', right: '5%' },
  { width: 60,  height: 60,  background: '#f59e0b', bottom: '30%', right: '20%' },
  { width: 90,  height: 90,  background: '#06b6d4', top: '70%', left: '30%' },
  { width: 140, height: 140, background: '#ec4899', top: '5%', left: '45%' },
  { width: 70,  height: 70,  background: '#22c55e', bottom: '10%', right: '40%' },
]

export default function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0f172a]">

      {/* Background floating dots */}
      {DOTS.map((d, i) => <Dot key={i} style={d} />)}

      {/* Radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.15)_0%,_transparent_70%)] pointer-events-none" />

      {/* Nav */}
      <nav className="absolute top-0 w-full flex justify-between items-center px-8 py-5 z-10">
        <span className="font-['Poppins'] font-bold text-xl text-white">VisionCheck <span className="text-blue-400">AI</span></span>
        <div className="flex gap-3">
          {user ? (
            <button onClick={() => navigate('/test')} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors">
              Dashboard
            </button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="px-4 py-2 text-slate-300 hover:text-white text-sm transition-colors">Login</button>
              <button onClick={() => navigate('/register')} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors">Sign Up</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-3xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        >
          AI-Powered Color Vision Screening
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-['Poppins'] font-bold leading-tight mb-6">
          <span className="text-white">Vision</span>
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Check</span>
          <br />
          <span className="text-3xl md:text-4xl text-slate-300 font-semibold">Color Blindness Detection</span>
        </h1>

        <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
          Take the Ishihara test online. Get instant AI-powered diagnosis for Protanopia, Deuteranopia, and more — in under 2 minutes.
        </p>

        <motion.button
          onClick={() => navigate(user ? '/test' : '/register')}
          className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-2xl text-lg font-semibold shadow-lg shadow-blue-500/30 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Start Test →
        </motion.button>

        <p className="mt-4 text-slate-500 text-sm">Free · No equipment needed · Results in 2 min</p>
      </motion.div>

      {/* Stats row */}
      <motion.div
        className="absolute bottom-10 flex gap-12 text-center z-10"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
      >
        {[['30', 'Ishihara Plates'], ['4', 'CVD Types Detected'], ['100%', 'Model Accuracy']].map(([val, label]) => (
          <div key={label}>
            <div className="text-2xl font-bold text-white font-['Poppins']">{val}</div>
            <div className="text-xs text-slate-500">{label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
