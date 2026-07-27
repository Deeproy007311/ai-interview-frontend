import { Routes, Route } from 'react-router-dom'
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'
import ResumeUpload from '@/pages/ResumeUpload'
import InterviewCreate from '@/pages/InterviewCreate'
import InterviewSession from '@/pages/InterviewSession'
import InterviewReport from '@/pages/InterviewReport'
import InterviewHistory from '@/pages/InterviewHistory'
import NotFound from '@/pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/resume/upload" element={<ResumeUpload />} />
      <Route path="/interviews/new" element={<InterviewCreate />} />
      <Route path="/interviews/:id" element={<InterviewSession />} />
      <Route path="/interviews/:id/report" element={<InterviewReport />} />
      <Route path="/interviews/history" element={<InterviewHistory />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App