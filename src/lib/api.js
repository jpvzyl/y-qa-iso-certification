import axios from 'axios'

let authToken = localStorage.getItem('yqa_token')
let projectId = localStorage.getItem('yqa_project_id')

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers['Authorization'] = `Bearer ${authToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.startsWith('/auth/')) {
      authToken = null
      projectId = null
      localStorage.removeItem('yqa_token')
      localStorage.removeItem('yqa_project_id')
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export function setAuthToken(token) {
  authToken = token
  if (token) {
    localStorage.setItem('yqa_token', token)
  } else {
    localStorage.removeItem('yqa_token')
  }
}

export function setProjectId(id) {
  projectId = id
  if (id) {
    localStorage.setItem('yqa_project_id', String(id))
  } else {
    localStorage.removeItem('yqa_project_id')
  }
}

export function getProjectId() {
  return projectId
}

function p(path) {
  if (!projectId) throw new Error('No project selected')
  return `/iso_certification/projects/${projectId}${path}`
}

// ─── Auth ─────────────────────────────────────────────────────
export const login = (data) => api.post('/auth/login', { user: data })
export const register = (data) => api.post('/auth/register', { user: data })
export const logout = () => api.delete('/auth/logout')
export const forgotPassword = (email) => api.post('/auth/forgot_password', { user: { email } })
export const getMe = () => api.get('/auth/me')
export const getProjects = () => api.get('/projects')

// ─── Frameworks (no project scope) ───────────────────────────
export const getFrameworks = () => api.get('/iso_certification/frameworks')
export const getFramework = (id) => api.get(`/iso_certification/frameworks/${id}`)

// ─── Controls ────────────────────────────────────────────────
export const getControls = (params) => api.get(p('/controls'), { params })
export const getControl = (id) => api.get(p(`/controls/${id}`))

// ─── Applicabilities (SoA) ──────────────────────────────────
export const getApplicabilities = (params) => api.get(p('/applicabilities'), { params })
export const updateApplicability = (id, data) => api.patch(p(`/applicabilities/${id}`), data)
export const generateSoA = () => api.post(p('/applicabilities/generate'))

// ─── Evidence ────────────────────────────────────────────────
export const getEvidences = (params) => api.get(p('/evidences'), { params })
export const getEvidence = (id) => api.get(p(`/evidences/${id}`))
export const createEvidence = (data) => api.post(p('/evidences'), data)
export const collectEvidence = () => api.post(p('/evidences/collect'))

// ─── Audits ──────────────────────────────────────────────────
export const getAudits = (params) => api.get(p('/audits'), { params })
export const getAudit = (id) => api.get(p(`/audits/${id}`))
export const createAudit = (data) => api.post(p('/audits'), data)
export const updateAudit = (id, data) => api.patch(p(`/audits/${id}`), data)

// ─── Findings ────────────────────────────────────────────────
export const getFindings = (params) => api.get(p('/findings'), { params })
export const createFinding = (data) => api.post(p('/findings'), data)
export const updateFinding = (id, data) => api.patch(p(`/findings/${id}`), data)

// ─── Compliance / Dashboard ─────────────────────────────────
export const getComplianceDashboard = () => api.get(p('/compliance/dashboard'))
export const getGapAnalysis = () => api.get(p('/compliance/gap_analysis'))

// ─── Risk Registers ─────────────────────────────────────────
export const getRiskRegisters = () => api.get(p('/risk_registers'))
export const getRiskRegister = (id) => api.get(p(`/risk_registers/${id}`))
export const createRiskRegister = (data) => api.post(p('/risk_registers'), data)
export const approveRiskRegister = (id) => api.patch(p(`/risk_registers/${id}/approve`))

// ─── Risk Entries ────────────────────────────────────────────
export const getRiskEntries = (params) => api.get(p('/risk_entries'), { params })
export const getRiskEntry = (id) => api.get(p(`/risk_entries/${id}`))
export const createRiskEntry = (data) => api.post(p('/risk_entries'), data)
export const updateRiskEntry = (id, data) => api.patch(p(`/risk_entries/${id}`), data)

// ─── Policies ────────────────────────────────────────────────
export const getPolicies = (params) => api.get(p('/policies'), { params })
export const getPolicy = (id) => api.get(p(`/policies/${id}`))
export const createPolicy = (data) => api.post(p('/policies'), data)
export const updatePolicy = (id, data) => api.patch(p(`/policies/${id}`), data)
export const publishPolicy = (id) => api.patch(p(`/policies/${id}/publish`))

// ─── Connection Test ─────────────────────────────────────────
export const testConnection = () => api.get('/iso_certification/frameworks')

export default api
