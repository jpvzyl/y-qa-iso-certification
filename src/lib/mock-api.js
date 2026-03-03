import {
  DEMO_USER, DEMO_PROJECTS, DEMO_FRAMEWORKS, DEMO_CONTROLS,
  DEMO_APPLICABILITIES, DEMO_EVIDENCES, DEMO_AUDITS, DEMO_DASHBOARD,
  DEMO_GAP_ANALYSIS, DEMO_RISK_REGISTERS, DEMO_RISK_ENTRIES, DEMO_POLICIES,
  DEMO_NOTIFICATIONS, DEMO_REPORTS, DEMO_TRAINING, DEMO_ROADMAP,
  AI_CHAT_RESPONSES, AI_AUDIT_READINESS, AI_GAP_RECOMMENDATIONS,
} from './demo-data'

const DEMO_TOKEN = 'demo-token-yqa-iso-27001'
let demoNotifications = [...DEMO_NOTIFICATIONS]

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms + Math.random() * 200))
}

function mock(data) {
  return { data }
}

function matchRoute(url, method, requestData) {
  const u = url.replace(/^\/api\/v1/, '')

  // Auth
  if (u === '/auth/login' && method === 'post') return mock({ token: DEMO_TOKEN, user: DEMO_USER })
  if (u === '/auth/register' && method === 'post') return mock({ token: DEMO_TOKEN, user: DEMO_USER })
  if (u === '/auth/logout' && method === 'delete') return mock({ success: true })
  if (u === '/auth/forgot_password' && method === 'post') return mock({ message: 'Reset link sent' })
  if (u === '/auth/me') return mock({ user: DEMO_USER, projects: DEMO_PROJECTS })

  // Projects
  if (u === '/projects') return mock({ projects: DEMO_PROJECTS })

  // Frameworks
  if (u === '/iso_certification/frameworks') return mock({ frameworks: DEMO_FRAMEWORKS })
  if (u.match(/\/iso_certification\/frameworks\/\d+/)) return mock({ framework: DEMO_FRAMEWORKS[0] })

  // Project-scoped routes
  const projMatch = u.match(/\/iso_certification\/projects\/\d+(.*)/)
  if (!projMatch) return null
  const path = projMatch[1]

  // Controls
  if (path === '/controls' && method === 'get') return mock({ controls: DEMO_CONTROLS })
  const controlMatch = path.match(/^\/controls\/(\d+)$/)
  if (controlMatch) return mock({ control: DEMO_CONTROLS.find((c) => c.id === Number(controlMatch[1])) || DEMO_CONTROLS[0] })

  // Applicabilities
  if (path === '/applicabilities') return mock({ applicabilities: DEMO_APPLICABILITIES })
  if (path.match(/\/applicabilities\/\d+/) && method === 'patch') return mock({ applicability: {} })
  if (path === '/applicabilities/generate' && method === 'post') return mock({ applicabilities: DEMO_APPLICABILITIES })

  // Evidence
  if (path === '/evidences' && method === 'get') return mock({ evidences: DEMO_EVIDENCES })
  if (path === '/evidences' && method === 'post') return mock({ evidence: { id: 999, ...{}, status: 'pending', collected_at: new Date().toISOString() } })
  if (path === '/evidences/collect' && method === 'post') return mock({ collected: 5, message: 'Auto-collected 5 new evidence items' })
  if (path.match(/\/evidences\/\d+/)) return mock({ evidence: DEMO_EVIDENCES[0] })

  // Audits
  if (path === '/audits' && method === 'get') return mock({ audits: DEMO_AUDITS })
  if (path === '/audits' && method === 'post') return mock({ audit: { id: 99, status: 'planned', findings: [], findings_count: 0 } })
  const auditMatch = path.match(/^\/audits\/(\d+)$/)
  if (auditMatch) {
    if (method === 'patch') return mock({ audit: { ...DEMO_AUDITS.find((a) => a.id === Number(auditMatch[1])), status: 'completed' } })
    return mock({ audit: DEMO_AUDITS.find((a) => a.id === Number(auditMatch[1])) || DEMO_AUDITS[0] })
  }

  // Findings
  if (path === '/findings' && method === 'get') {
    const all = DEMO_AUDITS.flatMap((a) => a.findings || [])
    return mock({ findings: all })
  }
  if (path === '/findings' && method === 'post') return mock({ finding: { id: 999, status: 'open' } })

  // Compliance
  if (path === '/compliance/dashboard') return mock(DEMO_DASHBOARD)
  if (path === '/compliance/gap_analysis') return mock(DEMO_GAP_ANALYSIS)

  // Risk
  if (path === '/risk_registers') return mock({ risk_registers: DEMO_RISK_REGISTERS })
  if (path.match(/\/risk_registers\/\d+\/approve/)) return mock({ risk_register: { ...DEMO_RISK_REGISTERS[0], status: 'approved' } })
  if (path.match(/\/risk_registers\/\d+/)) return mock({ risk_register: DEMO_RISK_REGISTERS[0] })
  if (path === '/risk_entries' && method === 'get') return mock({ risk_entries: DEMO_RISK_ENTRIES })
  if (path === '/risk_entries' && method === 'post') return mock({ risk_entry: { id: 99, risk_treatments: [] } })
  const riskMatch = path.match(/^\/risk_entries\/(\d+)$/)
  if (riskMatch) {
    if (method === 'patch') return mock({ risk_entry: DEMO_RISK_ENTRIES.find((r) => r.id === Number(riskMatch[1])) || DEMO_RISK_ENTRIES[0] })
    return mock({ risk_entry: DEMO_RISK_ENTRIES.find((r) => r.id === Number(riskMatch[1])) || DEMO_RISK_ENTRIES[0] })
  }

  // Policies
  if (path === '/policies' && method === 'get') return mock({ policies: DEMO_POLICIES })
  if (path === '/policies' && method === 'post') return mock({ policy: { id: 99, status: 'draft', version: '0.1' } })
  const policyMatch = path.match(/^\/policies\/(\d+)(\/publish)?$/)
  if (policyMatch) {
    const pol = DEMO_POLICIES.find((p) => p.id === Number(policyMatch[1])) || DEMO_POLICIES[0]
    if (policyMatch[2] === '/publish') return mock({ policy: { ...pol, status: 'published' } })
    if (method === 'patch') return mock({ policy: pol })
    return mock({ policy: pol })
  }

  // AI
  if (path === '/ai/chat' && method === 'post') {
    return handleAiChat(requestData)
  }
  if (path === '/ai/policy_draft' && method === 'post') {
    return mock({ content: AI_CHAT_RESPONSES.policy, title: 'Information Security Policy' })
  }
  if (path === '/ai/risk_assessment' && method === 'post') {
    return mock({ likelihood: 3, impact: 4, risk_level: 'high', treatment_strategy: 'mitigate' })
  }
  if (path === '/ai/gap_recommendations') return mock(AI_GAP_RECOMMENDATIONS)
  if (path === '/ai/audit_readiness') return mock(AI_AUDIT_READINESS)
  if (path.match(/\/ai\/evidence_review/)) return mock({ status: 'valid', confidence: 0.92, suggestions: [] })
  if (path.match(/\/ai\/controls\/\d+\/suggestions/)) {
    return mock({ suggestions: [
      'Ensure documented procedures are in place and reviewed annually.',
      'Collect and maintain evidence of regular testing and verification.',
      'Assign a control owner responsible for ongoing compliance monitoring.',
    ] })
  }

  // Certification
  if (path === '/certification/roadmap') return mock(DEMO_ROADMAP)
  if (path.match(/\/certification\/milestones/)) return mock({ milestone: {} })

  // Training
  if (path === '/training/courses') return mock(DEMO_TRAINING)
  if (path === '/training/progress') return mock(DEMO_TRAINING.progress)
  if (path.match(/\/training\/assignments/)) return mock({ assignment: {} })

  // Reports
  if (path === '/reports' && method === 'get') return mock({ reports: DEMO_REPORTS })
  if (path === '/reports/generate' && method === 'post') {
    return mock({ report: { id: Date.now(), title: 'Generated Report', status: 'completed', ai_generated: true, created_at: new Date().toISOString(), file_size: '1.2 MB', download_url: '#' } })
  }
  if (path.match(/\/reports\/\d+/)) return mock({ report: DEMO_REPORTS[0] })

  // Notifications
  if (path === '/notifications' && method === 'get') return mock({ notifications: demoNotifications })
  if (path.match(/\/notifications\/\d+\/read/) && method === 'patch') {
    const nid = Number(path.match(/\/notifications\/(\d+)/)[1])
    demoNotifications = demoNotifications.map((n) => n.id === nid ? { ...n, read_at: new Date().toISOString() } : n)
    return mock({ success: true })
  }
  if (path === '/notifications/read_all' && method === 'patch') {
    demoNotifications = demoNotifications.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
    return mock({ success: true })
  }

  return null
}

function handleAiChat(requestData) {
  const msg = (requestData?.message || '').toLowerCase()
  let response = AI_CHAT_RESPONSES.default

  if (msg.includes('control') || msg.includes('annex')) {
    response = AI_CHAT_RESPONSES.controls
      .replace('{compliant}', String(DEMO_CONTROLS.filter((c) => c.compliance_status === 'compliant').length))
      .replace('{partial}', String(DEMO_CONTROLS.filter((c) => c.compliance_status === 'partial').length))
      .replace('{nc}', String(DEMO_CONTROLS.filter((c) => c.compliance_status === 'non_compliant').length))
      .replace('{na}', String(DEMO_CONTROLS.filter((c) => c.compliance_status === 'not_assessed').length))
  } else if (msg.includes('policy') || msg.includes('draft')) {
    response = AI_CHAT_RESPONSES.policy
  } else if (msg.includes('risk')) {
    response = AI_CHAT_RESPONSES.risk
  } else if (msg.includes('audit') || msg.includes('checklist') || msg.includes('prepare')) {
    response = AI_CHAT_RESPONSES.audit
  } else if (msg.includes('evidence') || msg.includes('document') || msg.includes('record')) {
    response = AI_CHAT_RESPONSES.evidence.replace('{evidence_count}', String(DEMO_EVIDENCES.length))
  } else if (msg.includes('gap') || msg.includes('analysis')) {
    response = AI_CHAT_RESPONSES.gap
  }

  return mock({
    message: response,
    suggestions: ['Tell me about risk management', 'How do I prepare for audit?', 'What gaps should I prioritize?'],
  })
}

export function installMockApi(axiosInstance) {
  axiosInstance.interceptors.request.use((config) => {
    config._startTime = Date.now()
    return config
  })

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error.config
      if (!config || config._mockRetried) return Promise.reject(error)

      config._mockRetried = true
      const url = config.url || ''
      const method = (config.method || 'get').toLowerCase()

      let requestData = {}
      if (config.data) {
        try { requestData = typeof config.data === 'string' ? JSON.parse(config.data) : config.data }
        catch { /* not JSON */ }
      }

      const result = matchRoute(url, method, requestData)
      if (result) {
        await delay()
        return result
      }

      return Promise.reject(error)
    },
  )
}
