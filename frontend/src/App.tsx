import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ProtectedRoute from './shared/components/layout/ProtectedRoute'

import RecruiterDashboardPage from './pages/recruiter/DashboardPage'
import JobOffersPage from './pages/recruiter/JobOffersPage'
import JobOfferDetailPage from './pages/recruiter/JobOfferDetailPage'

import CandidateDashboardPage from './pages/candidate/DashboardPage'
import CandidateProfilePage from './pages/candidate/ProfilePage'
import CandidateJobOffersPage from './pages/candidate/JobOffersPage'
import CandidateJobOfferDetailPage from './pages/candidate/JobOfferDetailPage'

function App() {
  return (
      <BrowserRouter>
        <Routes>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register/candidate" element={<RegisterPage role="ROLE_CANDIDATE" />} />
          <Route path="/register/recruiter" element={<RegisterPage role="ROLE_RECRUITER" />} />

          <Route path="/recruiter" element={<ProtectedRoute role="ROLE_RECRUITER"><RecruiterDashboardPage /></ProtectedRoute>} />
          <Route path="/recruiter/job-offers" element={<ProtectedRoute role="ROLE_RECRUITER"><JobOffersPage /></ProtectedRoute>} />
          <Route path="/recruiter/job-offers/:id" element={<ProtectedRoute role="ROLE_RECRUITER"><JobOfferDetailPage /></ProtectedRoute>} />

          <Route path="/candidate" element={<ProtectedRoute role="ROLE_CANDIDATE"><CandidateDashboardPage /></ProtectedRoute>} />
          <Route path="/candidate/profile" element={<ProtectedRoute role="ROLE_CANDIDATE"><CandidateProfilePage /></ProtectedRoute>} />
          <Route path="/candidate/job-offers" element={<ProtectedRoute role="ROLE_CANDIDATE"><CandidateJobOffersPage /></ProtectedRoute>} />
          <Route path="/candidate/job-offers/:id" element={<ProtectedRoute role="ROLE_CANDIDATE"><CandidateJobOfferDetailPage /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App