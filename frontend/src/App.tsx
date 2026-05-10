import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

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

            <Route path="/recruiter" element={<RecruiterDashboardPage />} />
          <Route path="/recruiter/job-offers" element={<JobOffersPage />} />
          <Route path="/recruiter/job-offers/:id" element={<JobOfferDetailPage />} />

          <Route path="/candidate" element={<CandidateDashboardPage />} />
          <Route path="/candidate/profile" element={<CandidateProfilePage />} />
          <Route path="/candidate/job-offers" element={<CandidateJobOffersPage />} />
            <Route path="/candidate/job-offers/:id" element={<CandidateJobOfferDetailPage />} />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App