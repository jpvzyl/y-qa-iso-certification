import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/auth'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Controls from './pages/Controls'
import ControlDetail from './pages/ControlDetail'
import StatementOfApplicability from './pages/StatementOfApplicability'
import Evidence from './pages/Evidence'
import Audits from './pages/Audits'
import AuditDetail from './pages/AuditDetail'
import RiskManagement from './pages/RiskManagement'
import RiskDetail from './pages/RiskDetail'
import Policies from './pages/Policies'
import PolicyDetail from './pages/PolicyDetail'
import GapAnalysis from './pages/GapAnalysis'
import Settings from './pages/Settings'

export default function App() {
  return (
    <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="controls" element={<Controls />} />
            <Route path="controls/:id" element={<ControlDetail />} />
            <Route path="soa" element={<StatementOfApplicability />} />
            <Route path="evidence" element={<Evidence />} />
            <Route path="audits" element={<Audits />} />
            <Route path="audits/:id" element={<AuditDetail />} />
            <Route path="risk" element={<RiskManagement />} />
            <Route path="risk/:id" element={<RiskDetail />} />
            <Route path="policies" element={<Policies />} />
            <Route path="policies/:id" element={<PolicyDetail />} />
            <Route path="gap-analysis" element={<GapAnalysis />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
    </AuthProvider>
  )
}
