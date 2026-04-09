import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Test from './pages/Test'
import Result from './pages/Result'
import History from './pages/History'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/test" element={<PrivateRoute><Test /></PrivateRoute>} />
      <Route path="/result" element={<PrivateRoute><Result /></PrivateRoute>} />
      <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' }
          }}
        />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
