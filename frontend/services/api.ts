import axios from 'axios'

const API_BASE_URL = '/api'

export interface Plate {
  plate_id: string
  image_url: string
  category: string
}

export interface Answer {
  plate_id: string
  user_answer: string
}

export interface PredictionResult {
  prediction: 'Normal' | 'Protanopia' | 'Deuteranopia' | 'RG_Deficient'
  confidence: number
  explanation: string
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT if present
api.interceptors.request.use(config => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export async function getTestPlates(): Promise<Plate[]> {
  const response = await api.get<Plate[]>('/get-test')
  return response.data
}

export async function submitAnswers(answers: Answer[]): Promise<PredictionResult> {
  const response = await api.post<PredictionResult>('/predict', { answers })
  return response.data
}

export default api
