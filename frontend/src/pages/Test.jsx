import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../api/axios'

// Plate categories and how responses map to features
const CATEGORY_MAP = {
  Green_Dominant: 'green',
  Red_Dominant: 'red',
  Control: 'control',
  Vanishing: 'vanishing',
}

export default function Test() {
  const [plates, setPlates] = useState([])
  const [current, setCurrent] = useState(0)
  const [answer, setAnswer] = useState('')
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/plates').then(({ data }) => {
      setPlates(data)
      setLoading(false)
    }).catch(() => toast.error('Failed to load plates'))
  }, [])

  const plate = plates[current]
  const progress = plates.length ? Math.round((current / plates.length) * 100) : 0

  const handleNext = () => {
    if (!answer.trim()) { toast.error('Please enter what you see'); return }
    setResponses(prev => [...prev, { plate, answer: answer.trim() }])
    setAnswer('')
    if (current + 1 < plates.length) {
      setCurrent(c => c + 1)
    } else {
      handleSubmit([...responses, { plate, answer: answer.trim() }])
    }
  }

  const handleSkip = () => {
    setResponses(prev => [...prev, { plate, answer: '' }])
    setAnswer('')
    if (current + 1 < plates.length) setCurrent(c => c + 1)
    else handleSubmit([...responses, { plate, answer: '' }])
  }

  const handleSubmit = async (allResponses) => {
    setSubmitting(true)
    // Compute the 6 features from responses
    let controlFail = 0, redFail = 0, greenFail = 0, vanishingSeen = 0
    let totalCorrect = 0, totalSeen = allResponses.length

    allResponses.forEach(({ plate: p, answer: a }) => {
      const cat = CATEGORY_MAP[p.category]
      const answered = a.trim() !== ''
      if (answered) totalCorrect++

      if (cat === 'control' && !answered) controlFail++
      if (cat === 'red' && !answered) redFail++
      if (cat === 'green' && !answered) greenFail++
      if (cat === 'vanishing' && answered) vanishingSeen++
    })

    try {
      const { data } = await api.post('/test/submit', {
        controlFail, redFail, greenFail, vanishingSeen, totalCorrect, totalSeen
      })
      navigate('/result', { state: { result: data } })
    } catch (err) {
      toast.error(err.response?.data?.error || 'Submission failed')
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (submitting) return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400">Analyzing your responses...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      {/* Top bar */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex justify-between items-center mb-3">
          <span className="text-slate-400 text-sm">Plate <span className="text-white font-semibold">{current + 1}</span> of {plates.length}</span>
          <span className="text-slate-400 text-sm capitalize">{plate?.category?.replace('_', ' ')}</span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 gap-8">
        {/* Plate image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.35 }}
            className="relative"
          >
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-slate-700 shadow-2xl shadow-blue-500/10">
              <img
                src={`/api/plates/image/${plate?.plateNumber}`}
                alt={`Ishihara plate ${plate?.plateNumber}`}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        {/* Question */}
        <div className="text-center">
          <p className="text-slate-300 text-lg mb-1">What number or pattern do you see?</p>
          <p className="text-slate-500 text-sm">Type "none" if you can't see anything</p>
        </div>

        {/* Input */}
        <div className="w-full max-w-sm flex flex-col gap-3">
          <input
            type="text"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleNext()}
            placeholder="Enter what you see..."
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 text-center text-lg focus:outline-none focus:border-blue-500 transition-colors"
            autoFocus
          />

          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-400 text-sm transition-colors"
            >
              Can't see anything
            </button>
            <motion.button
              onClick={handleNext}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold transition-all"
              whileTap={{ scale: 0.97 }}
            >
              {current + 1 === plates.length ? 'Submit →' : 'Next →'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  )
}
