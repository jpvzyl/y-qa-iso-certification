import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const projectId = localStorage.getItem('yqa_project_id')
  const apiKey = localStorage.getItem('yqa_api_key')
  if (projectId) config.headers['X-Project-Id'] = projectId
  if (apiKey) config.headers['X-Api-Key'] = apiKey
  return config
})

// ─── ISO Certification: Frameworks ───────────────────────────
export const getFrameworks = () => api.get('/iso_certification/frameworks')
export const getFramework = (id) => api.get(`/iso_certification/frameworks/${id}`)

// ─── Controls ────────────────────────────────────────────────
export const getControls = (params) => api.get('/iso_certification/controls', { params })
export const getControl = (id) => api.get(`/iso_certification/controls/${id}`)

// ─── Applicabilities (SoA) ───────────────────────────────────
export const getApplicabilities = (params) => api.get('/iso_certification/applicabilities', { params })
export const updateApplicability = (id, data) => api.patch(`/iso_certification/applicabilities/${id}`, data)
export const generateSoA = () => api.post('/iso_certification/applicabilities/generate')

// ─── Evidence ────────────────────────────────────────────────
export const getEvidences = (params) => api.get('/iso_certification/evidences', { params })
export const getEvidence = (id) => api.get(`/iso_certification/evidences/${id}`)
export const createEvidence = (data) => api.post('/iso_certification/evidences', data)
export const collectEvidence = () => api.post('/iso_certification/evidences/collect')

// ─── Audits ──────────────────────────────────────────────────
export const getAudits = (params) => api.get('/iso_certification/audits', { params })
export const getAudit = (id) => api.get(`/iso_certification/audits/${id}`)
export const createAudit = (data) => api.post('/iso_certification/audits', data)
export const updateAudit = (id, data) => api.patch(`/iso_certification/audits/${id}`, data)

// ─── Findings ────────────────────────────────────────────────
export const getFindings = (params) => api.get('/iso_certification/findings', { params })
export const createFinding = (data) => api.post('/iso_certification/findings', data)
export const updateFinding = (id, data) => api.patch(`/iso_certification/findings/${id}`, data)

// ─── Compliance / Dashboard ──────────────────────────────────
export const getComplianceDashboard = () => api.get('/iso_certification/compliance/dashboard')
export const getGapAnalysis = () => api.get('/iso_certification/compliance/gap_analysis')

// ─── Risk Registers ──────────────────────────────────────────
export const getRiskRegisters = () => api.get('/iso_certification/risk_registers')
export const getRiskRegister = (id) => api.get(`/iso_certification/risk_registers/${id}`)
export const createRiskRegister = (data) => api.post('/iso_certification/risk_registers', data)
export const approveRiskRegister = (id) => api.patch(`/iso_certification/risk_registers/${id}/approve`)

// ─── Risk Entries ────────────────────────────────────────────
export const getRiskEntries = (params) => api.get('/iso_certification/risk_entries', { params })
export const getRiskEntry = (id) => api.get(`/iso_certification/risk_entries/${id}`)
export const createRiskEntry = (data) => api.post('/iso_certification/risk_entries', data)
export const updateRiskEntry = (id, data) => api.patch(`/iso_certification/risk_entries/${id}`, data)

// ─── Policies ────────────────────────────────────────────────
export const getPolicies = (params) => api.get('/iso_certification/policies', { params })
export const getPolicy = (id) => api.get(`/iso_certification/policies/${id}`)
export const createPolicy = (data) => api.post('/iso_certification/policies', data)
export const updatePolicy = (id, data) => api.patch(`/iso_certification/policies/${id}`, data)
export const publishPolicy = (id) => api.patch(`/iso_certification/policies/${id}/publish`)

// ─── Connection Test ─────────────────────────────────────────
export const testConnection = () => api.get('/iso_certification/frameworks')

export default api
