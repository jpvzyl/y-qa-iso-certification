// ─── Demo User & Project ─────────────────────────────────────
export const DEMO_USER = {
  id: 1,
  email: 'sarah.chen@acmecorp.com',
  first_name: 'Sarah',
  last_name: 'Chen',
  role: 'compliance_manager',
}

export const DEMO_PROJECTS = [
  { id: 1, name: 'Acme Corp — ISO 27001', description: 'Primary ISMS certification project' },
  { id: 2, name: 'Acme Cloud — SOC 2', description: 'Cloud services compliance' },
]

export const DEMO_FRAMEWORKS = [
  { id: 1, name: 'ISO/IEC 27001', version: '2022', controls_count: 93 },
  { id: 2, name: 'ISO/IEC 27002', version: '2022', controls_count: 93 },
]

// ─── Controls (full 93 Annex A) ──────────────────────────────
const ORG_CONTROLS = [
  ['A.5.1', 'Policies for information security', 'compliant'],
  ['A.5.2', 'Information security roles and responsibilities', 'compliant'],
  ['A.5.3', 'Segregation of duties', 'partial'],
  ['A.5.4', 'Management responsibilities', 'compliant'],
  ['A.5.5', 'Contact with authorities', 'compliant'],
  ['A.5.6', 'Contact with special interest groups', 'partial'],
  ['A.5.7', 'Threat intelligence', 'non_compliant'],
  ['A.5.8', 'Information security in project management', 'partial'],
  ['A.5.9', 'Inventory of information and other associated assets', 'compliant'],
  ['A.5.10', 'Acceptable use of information and other associated assets', 'compliant'],
  ['A.5.11', 'Return of assets', 'compliant'],
  ['A.5.12', 'Classification of information', 'partial'],
  ['A.5.13', 'Labelling of information', 'non_compliant'],
  ['A.5.14', 'Information transfer', 'compliant'],
  ['A.5.15', 'Access control', 'compliant'],
  ['A.5.16', 'Identity management', 'compliant'],
  ['A.5.17', 'Authentication information', 'compliant'],
  ['A.5.18', 'Access rights', 'partial'],
  ['A.5.19', 'Information security in supplier relationships', 'partial'],
  ['A.5.20', 'Addressing information security within supplier agreements', 'partial'],
  ['A.5.21', 'Managing information security in the ICT supply chain', 'non_compliant'],
  ['A.5.22', 'Monitoring, review and change management of supplier services', 'not_assessed'],
  ['A.5.23', 'Information security for use of cloud services', 'partial'],
  ['A.5.24', 'Information security incident management planning and preparation', 'compliant'],
  ['A.5.25', 'Assessment and decision on information security events', 'compliant'],
  ['A.5.26', 'Response to information security incidents', 'partial'],
  ['A.5.27', 'Learning from information security incidents', 'partial'],
  ['A.5.28', 'Collection of evidence', 'compliant'],
  ['A.5.29', 'Information security during disruption', 'partial'],
  ['A.5.30', 'ICT readiness for business continuity', 'non_compliant'],
  ['A.5.31', 'Legal, statutory, regulatory and contractual requirements', 'compliant'],
  ['A.5.32', 'Intellectual property rights', 'compliant'],
  ['A.5.33', 'Protection of records', 'compliant'],
  ['A.5.34', 'Privacy and protection of PII', 'partial'],
  ['A.5.35', 'Independent review of information security', 'not_assessed'],
  ['A.5.36', 'Compliance with policies, rules and standards for information security', 'partial'],
  ['A.5.37', 'Documented operating procedures', 'compliant'],
]
const PPL_CONTROLS = [
  ['A.6.1', 'Screening', 'compliant'],
  ['A.6.2', 'Terms and conditions of employment', 'compliant'],
  ['A.6.3', 'Information security awareness, education and training', 'partial'],
  ['A.6.4', 'Disciplinary process', 'compliant'],
  ['A.6.5', 'Responsibilities after termination or change of employment', 'compliant'],
  ['A.6.6', 'Confidentiality or non-disclosure agreements', 'compliant'],
  ['A.6.7', 'Remote working', 'partial'],
  ['A.6.8', 'Information security event reporting', 'compliant'],
]
const PHY_CONTROLS = [
  ['A.7.1', 'Physical security perimeters', 'compliant'],
  ['A.7.2', 'Physical entry', 'compliant'],
  ['A.7.3', 'Securing offices, rooms and facilities', 'compliant'],
  ['A.7.4', 'Physical security monitoring', 'partial'],
  ['A.7.5', 'Protecting against physical and environmental threats', 'compliant'],
  ['A.7.6', 'Working in secure areas', 'compliant'],
  ['A.7.7', 'Clear desk and clear screen', 'partial'],
  ['A.7.8', 'Equipment siting and protection', 'compliant'],
  ['A.7.9', 'Security of assets off-premises', 'partial'],
  ['A.7.10', 'Storage media', 'compliant'],
  ['A.7.11', 'Supporting utilities', 'compliant'],
  ['A.7.12', 'Cabling security', 'compliant'],
  ['A.7.13', 'Equipment maintenance', 'compliant'],
  ['A.7.14', 'Secure disposal or re-use of equipment', 'compliant'],
]
const TECH_CONTROLS = [
  ['A.8.1', 'User endpoint devices', 'compliant'],
  ['A.8.2', 'Privileged access rights', 'compliant'],
  ['A.8.3', 'Information access restriction', 'compliant'],
  ['A.8.4', 'Access to source code', 'partial'],
  ['A.8.5', 'Secure authentication', 'compliant'],
  ['A.8.6', 'Capacity management', 'partial'],
  ['A.8.7', 'Protection against malware', 'compliant'],
  ['A.8.8', 'Management of technical vulnerabilities', 'partial'],
  ['A.8.9', 'Configuration management', 'partial'],
  ['A.8.10', 'Information deletion', 'compliant'],
  ['A.8.11', 'Data masking', 'non_compliant'],
  ['A.8.12', 'Data leakage prevention', 'partial'],
  ['A.8.13', 'Information backup', 'compliant'],
  ['A.8.14', 'Redundancy of information processing facilities', 'compliant'],
  ['A.8.15', 'Logging', 'compliant'],
  ['A.8.16', 'Monitoring activities', 'partial'],
  ['A.8.17', 'Clock synchronisation', 'compliant'],
  ['A.8.18', 'Use of privileged utility programs', 'compliant'],
  ['A.8.19', 'Installation of software on operational systems', 'compliant'],
  ['A.8.20', 'Networks security', 'compliant'],
  ['A.8.21', 'Security of network services', 'compliant'],
  ['A.8.22', 'Segregation of networks', 'partial'],
  ['A.8.23', 'Web filtering', 'partial'],
  ['A.8.24', 'Use of cryptography', 'compliant'],
  ['A.8.25', 'Secure development life cycle', 'partial'],
  ['A.8.26', 'Application security requirements', 'partial'],
  ['A.8.27', 'Secure system architecture and engineering principles', 'partial'],
  ['A.8.28', 'Secure coding', 'partial'],
  ['A.8.29', 'Security testing in development and acceptance', 'non_compliant'],
  ['A.8.30', 'Outsourced development', 'not_assessed'],
  ['A.8.31', 'Separation of development, test and production environments', 'compliant'],
  ['A.8.32', 'Change management', 'compliant'],
  ['A.8.33', 'Test information', 'partial'],
  ['A.8.34', 'Protection of information systems during audit testing', 'compliant'],
]

function makeControl(arr, theme, baseId) {
  return arr.map(([code, title, status], i) => {
    const id = baseId + i + 1
    const evCount = status === 'compliant' ? Math.floor(Math.random() * 4) + 2 : status === 'partial' ? Math.floor(Math.random() * 2) + 1 : 0
    const implPct = status === 'compliant' ? 100 : status === 'partial' ? Math.floor(Math.random() * 40) + 40 : status === 'non_compliant' ? Math.floor(Math.random() * 20) : 0
    return {
      id, code, title, theme,
      compliance_status: status,
      evidence_count: evCount,
      implementation_percentage: implPct,
      implementation_status: implPct === 100 ? 'implemented' : implPct > 50 ? 'in_progress' : implPct > 0 ? 'planned' : 'not_started',
      description: `This control addresses the requirement for ${title.toLowerCase()} as defined in ISO 27001:2022 Annex A. Organizations must ensure appropriate measures are in place to satisfy this requirement.`,
      guidance: `Implementation guidance:\n\n1. Document the current state of ${title.toLowerCase()}\n2. Identify gaps against ISO 27001 requirements\n3. Implement necessary controls and procedures\n4. Collect and maintain evidence of implementation\n5. Schedule regular reviews and updates`,
      applicability: { applicable: true, justification: `Required for ${theme} security posture` },
      evidences: Array.from({ length: evCount }, (_, j) => ({
        id: id * 100 + j,
        title: `${code} Evidence ${j + 1}`,
        source: ['y_qa_platform', 'github', 'manual', 'ci_cd'][j % 4],
        status: 'valid',
        collected_at: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString(),
      })),
      findings: status === 'non_compliant' ? [{
        id: id * 10, description: `Non-conformity identified: ${title} not fully implemented`, finding_type: 'minor_nc', status: 'open',
      }] : [],
      risk_treatments: [],
    }
  })
}

export const DEMO_CONTROLS = [
  ...makeControl(ORG_CONTROLS, 'organizational', 0),
  ...makeControl(PPL_CONTROLS, 'people', 100),
  ...makeControl(PHY_CONTROLS, 'physical', 200),
  ...makeControl(TECH_CONTROLS, 'technological', 300),
]

// ─── Statement of Applicability ──────────────────────────────
export const DEMO_APPLICABILITIES = DEMO_CONTROLS.map((c) => ({
  id: c.id,
  control_code: c.code,
  control_title: c.title,
  theme: c.theme,
  applicable: true,
  justification: c.applicability.justification,
  implementation_status: c.compliance_status,
  compliance_status: c.compliance_status,
  evidence_count: c.evidence_count,
}))

// ─── Evidence ────────────────────────────────────────────────
const EVIDENCE_TITLES = [
  'Information Security Policy Document', 'Access Control Matrix', 'Network Architecture Diagram',
  'Vulnerability Scan Report — Q4 2025', 'Employee Security Training Records', 'Incident Response Playbook',
  'Data Classification Procedure', 'Business Continuity Plan', 'Risk Assessment Methodology',
  'Penetration Test Report', 'Change Management Log', 'Backup Verification Report',
  'Physical Security Audit Report', 'Encryption Key Management Procedure', 'Supplier Security Assessment',
  'SIEM Dashboard Screenshot', 'Code Review Checklist', 'Asset Inventory Export',
  'Privacy Impact Assessment', 'DR Test Results — Feb 2026', 'SOC Monitoring Procedures',
  'Firewall Rule Review', 'MFA Enrollment Report', 'Patch Management Report',
  'Security Awareness Quiz Results', 'Third-Party Audit Certificate', 'Data Retention Schedule',
  'Endpoint Protection Dashboard', 'API Security Scan Results', 'Cloud Configuration Audit',
]

export const DEMO_EVIDENCES = EVIDENCE_TITLES.map((title, i) => {
  const sources = ['y_qa_platform', 'github', 'manual', 'ci_cd', 'cloud']
  const types = ['document', 'screenshot', 'log', 'configuration', 'report']
  const statuses = ['valid', 'valid', 'valid', 'valid', 'stale', 'pending']
  const daysAgo = Math.floor(Math.random() * 120)
  return {
    id: i + 1,
    title,
    control_code: DEMO_CONTROLS[i % DEMO_CONTROLS.length].code,
    source: sources[i % sources.length],
    evidence_type: types[i % types.length],
    status: statuses[i % statuses.length],
    collected_at: new Date(Date.now() - daysAgo * 86400000).toISOString(),
    notes: '',
  }
})

// ─── Audits ──────────────────────────────────────────────────
export const DEMO_AUDITS = [
  {
    id: 1, title: 'Internal ISMS Audit — Q1 2026', audit_type: 'internal', status: 'completed',
    auditor: 'James Wright', scope: 'Full ISMS scope — all Annex A controls',
    scheduled_date: '2026-01-15', completed_at: '2026-01-18', findings_count: 4,
    findings: [
      { id: 1, finding_type: 'minor_nc', description: 'Threat intelligence process (A.5.7) not formally documented', control_code: 'A.5.7', status: 'open' },
      { id: 2, finding_type: 'observation', description: 'Information labelling (A.5.13) inconsistently applied across departments', control_code: 'A.5.13', status: 'in_progress' },
      { id: 3, finding_type: 'minor_nc', description: 'ICT supply chain security (A.5.21) lacks formal vendor assessment process', control_code: 'A.5.21', status: 'open' },
      { id: 4, finding_type: 'opportunity', description: 'Consider automating vulnerability scanning for A.8.8 compliance', control_code: 'A.8.8', status: 'closed' },
    ],
  },
  {
    id: 2, title: 'Supplier Security Assessment', audit_type: 'external', status: 'completed',
    auditor: 'Lisa Park (External)', scope: 'Supplier management controls (A.5.19-A.5.23)',
    scheduled_date: '2025-11-20', completed_at: '2025-11-22', findings_count: 2,
    findings: [
      { id: 5, finding_type: 'minor_nc', description: 'Cloud service provider agreements missing specific security clauses', control_code: 'A.5.23', status: 'closed' },
      { id: 6, finding_type: 'observation', description: 'Supplier review frequency should be increased to quarterly', control_code: 'A.5.22', status: 'closed' },
    ],
  },
  {
    id: 3, title: 'Stage 1 Certification Audit', audit_type: 'external', status: 'planned',
    auditor: 'BSI Group — Dr. Müller', scope: 'Documentation review — all ISMS documentation',
    scheduled_date: '2026-04-10', completed_at: null, findings_count: 0, findings: [],
  },
  {
    id: 4, title: 'Pre-Certification Readiness Check', audit_type: 'internal', status: 'scheduled',
    auditor: 'Sarah Chen', scope: 'Gap closure verification for critical findings',
    scheduled_date: '2026-03-15', completed_at: null, findings_count: 0, findings: [],
  },
]

// ─── Compliance Dashboard ────────────────────────────────────
const total = DEMO_CONTROLS.length
const compliantCount = DEMO_CONTROLS.filter((c) => c.compliance_status === 'compliant').length
const partialCount = DEMO_CONTROLS.filter((c) => c.compliance_status === 'partial').length
const ncCount = DEMO_CONTROLS.filter((c) => c.compliance_status === 'non_compliant').length
const naCount = DEMO_CONTROLS.filter((c) => c.compliance_status === 'not_assessed').length

export const DEMO_DASHBOARD = {
  compliance_score: Math.round(((compliantCount + partialCount * 0.5) / total) * 100),
  total_controls: total,
  applicable_controls: total - 2,
  evidence_count: DEMO_EVIDENCES.length,
  open_findings: 3,
  upcoming_audits: 2,
  status_breakdown: {
    compliant: compliantCount,
    partial: partialCount,
    non_compliant: ncCount,
    not_assessed: naCount,
  },
  compliance_trend: [
    { month: 'Sep', score: 28 }, { month: 'Oct', score: 39 }, { month: 'Nov', score: 48 },
    { month: 'Dec', score: 56 }, { month: 'Jan', score: 64 }, { month: 'Feb', score: Math.round(((compliantCount + partialCount * 0.5) / total) * 100) },
  ],
  recent_activity: [
    { description: 'Policy "Information Security Policy" published', timestamp: new Date(Date.now() - 1 * 3600000).toISOString(), status: 'compliant' },
    { description: 'Evidence collected: Vulnerability Scan Report Q4', timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), status: 'compliant' },
    { description: 'Risk entry "Ransomware Attack" updated — treatment added', timestamp: new Date(Date.now() - 12 * 3600000).toISOString() },
    { description: 'Internal audit finding closed: A.8.8 vulnerability scanning', timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), status: 'compliant' },
    { description: 'Training completed: Phishing Awareness (92% pass rate)', timestamp: new Date(Date.now() - 48 * 3600000).toISOString() },
    { description: 'Control A.5.23 status updated to "Partial"', timestamp: new Date(Date.now() - 72 * 3600000).toISOString(), status: 'partial' },
    { description: 'New risk entry added: Third-party data breach', timestamp: new Date(Date.now() - 96 * 3600000).toISOString() },
    { description: 'SoA generated for ISO 27001:2022 framework', timestamp: new Date(Date.now() - 120 * 3600000).toISOString() },
  ],
}

// ─── Gap Analysis ────────────────────────────────────────────
export const DEMO_GAP_ANALYSIS = {
  summary: { total_gaps: 12, critical_gaps: 2, evidence_gaps: 4, implementation_gaps: 6 },
  gaps: [
    { id: 1, control_code: 'A.5.7', gap_type: 'implementation', severity: 'high', description: 'Threat intelligence process not established — no formal feeds or analysis procedures in place', recommendation: 'Subscribe to threat intelligence feeds (e.g., MISP, OTX) and establish a weekly review process' },
    { id: 2, control_code: 'A.5.30', gap_type: 'implementation', severity: 'critical', description: 'ICT readiness for business continuity not tested — no DR test conducted in last 12 months', recommendation: 'Schedule and conduct a full disaster recovery test within 30 days' },
    { id: 3, control_code: 'A.8.11', gap_type: 'implementation', severity: 'high', description: 'Data masking not implemented for non-production environments', recommendation: 'Implement data masking for all staging and development databases' },
    { id: 4, control_code: 'A.8.29', gap_type: 'implementation', severity: 'critical', description: 'Security testing not integrated into CI/CD pipeline — no SAST/DAST tools configured', recommendation: 'Integrate SAST (e.g., SonarQube) and DAST (e.g., OWASP ZAP) into the build pipeline' },
    { id: 5, control_code: 'A.5.13', gap_type: 'implementation', severity: 'medium', description: 'Information labelling procedures documented but not consistently enforced across all departments', recommendation: 'Roll out mandatory labelling training and implement automated classification tools' },
    { id: 6, control_code: 'A.5.21', gap_type: 'implementation', severity: 'high', description: 'No formal ICT supply chain risk assessment process — critical vendors not evaluated', recommendation: 'Develop vendor risk assessment questionnaire and evaluate all critical suppliers within 60 days' },
    { id: 7, control_code: 'A.5.3', gap_type: 'evidence', severity: 'medium', description: 'Segregation of duties policy exists but evidence of implementation is incomplete', recommendation: 'Document role-based access matrices and collect access review logs' },
    { id: 8, control_code: 'A.6.3', gap_type: 'evidence', severity: 'medium', description: 'Security awareness training records missing for 15% of employees', recommendation: 'Complete training enrollment for all remaining employees and archive completion certificates' },
    { id: 9, control_code: 'A.8.25', gap_type: 'evidence', severity: 'medium', description: 'Secure development lifecycle documented but evidence of code reviews inconsistent', recommendation: 'Enforce mandatory PR reviews and capture evidence in version control system' },
    { id: 10, control_code: 'A.7.4', gap_type: 'evidence', severity: 'low', description: 'Physical security monitoring logs not regularly reviewed', recommendation: 'Establish weekly review of CCTV and access logs with documented sign-off' },
    { id: 11, control_code: 'A.5.34', gap_type: 'policy', severity: 'medium', description: 'Privacy impact assessment procedure not fully aligned with GDPR requirements', recommendation: 'Update PIA template to include GDPR Article 35 requirements and conduct PIAs for all new projects' },
    { id: 12, control_code: 'A.5.29', gap_type: 'policy', severity: 'low', description: 'Information security during disruption policy needs review — last updated 18 months ago', recommendation: 'Review and update the business disruption security policy with current contact information and procedures' },
  ],
}

// ─── Risk Management ─────────────────────────────────────────
export const DEMO_RISK_REGISTERS = [
  { id: 1, name: 'ISMS Risk Register 2026', status: 'active', created_at: '2025-09-01', entries_count: 8 },
]

export const DEMO_RISK_ENTRIES = [
  { id: 1, title: 'Ransomware Attack', asset: 'Production Servers', description: 'Risk of ransomware encrypting critical production data and disrupting operations', likelihood: 3, impact: 5, risk_score: 15, risk_level: 'critical', treatment_strategy: 'mitigate', risk_register_id: 1, control_code: 'A.8.7',
    risk_treatments: [
      { id: 1, description: 'Deploy EDR solution on all endpoints', treatment_type: 'mitigate', status: 'completed', responsible: 'IT Security', due_date: '2025-12-01' },
      { id: 2, description: 'Implement immutable backup strategy', treatment_type: 'mitigate', status: 'in_progress', responsible: 'Infrastructure', due_date: '2026-03-15' },
    ] },
  { id: 2, title: 'Third-Party Data Breach', asset: 'Customer Data', description: 'Risk of customer data exposure through compromised supplier systems', likelihood: 3, impact: 4, risk_score: 12, risk_level: 'high', treatment_strategy: 'mitigate', risk_register_id: 1, control_code: 'A.5.19',
    risk_treatments: [
      { id: 3, description: 'Implement vendor security assessment program', treatment_type: 'mitigate', status: 'in_progress', responsible: 'Procurement', due_date: '2026-04-01' },
    ] },
  { id: 3, title: 'Insider Threat', asset: 'Intellectual Property', description: 'Risk of unauthorized access or data exfiltration by malicious or negligent insiders', likelihood: 2, impact: 5, risk_score: 10, risk_level: 'high', treatment_strategy: 'mitigate', risk_register_id: 1, control_code: 'A.5.15',
    risk_treatments: [
      { id: 4, description: 'Implement DLP solution', treatment_type: 'mitigate', status: 'planned', responsible: 'IT Security', due_date: '2026-06-01' },
      { id: 5, description: 'Quarterly access reviews', treatment_type: 'mitigate', status: 'completed', responsible: 'HR / IT', due_date: '2026-01-15' },
    ] },
  { id: 4, title: 'Cloud Service Outage', asset: 'AWS Infrastructure', description: 'Risk of extended cloud service unavailability impacting business operations', likelihood: 2, impact: 4, risk_score: 8, risk_level: 'medium', treatment_strategy: 'mitigate', risk_register_id: 1, control_code: 'A.8.14',
    risk_treatments: [
      { id: 6, description: 'Multi-region deployment architecture', treatment_type: 'mitigate', status: 'completed', responsible: 'DevOps', due_date: '2025-11-01' },
    ] },
  { id: 5, title: 'Phishing Attack', asset: 'Email Systems', description: 'Risk of credential theft through sophisticated phishing campaigns', likelihood: 4, impact: 3, risk_score: 12, risk_level: 'high', treatment_strategy: 'mitigate', risk_register_id: 1, control_code: 'A.6.3',
    risk_treatments: [
      { id: 7, description: 'Deploy advanced email filtering', treatment_type: 'mitigate', status: 'completed', responsible: 'IT', due_date: '2025-10-01' },
      { id: 8, description: 'Monthly phishing simulation campaigns', treatment_type: 'mitigate', status: 'completed', responsible: 'Security', due_date: '2025-10-15' },
    ] },
  { id: 6, title: 'Physical Intrusion', asset: 'Data Center', description: 'Risk of unauthorized physical access to server rooms', likelihood: 1, impact: 4, risk_score: 4, risk_level: 'low', treatment_strategy: 'accept', risk_register_id: 1, control_code: 'A.7.1',
    risk_treatments: [] },
  { id: 7, title: 'Software Vulnerabilities', asset: 'Web Applications', description: 'Risk of exploitation of unpatched vulnerabilities in customer-facing applications', likelihood: 3, impact: 4, risk_score: 12, risk_level: 'high', treatment_strategy: 'mitigate', risk_register_id: 1, control_code: 'A.8.8',
    risk_treatments: [
      { id: 9, description: 'Weekly vulnerability scanning', treatment_type: 'mitigate', status: 'completed', responsible: 'Security', due_date: '2025-09-01' },
      { id: 10, description: 'Implement bug bounty program', treatment_type: 'mitigate', status: 'planned', responsible: 'Engineering', due_date: '2026-06-01' },
    ] },
  { id: 8, title: 'Regulatory Non-Compliance', asset: 'Business Operations', description: 'Risk of penalties from non-compliance with GDPR and other regulations', likelihood: 2, impact: 3, risk_score: 6, risk_level: 'medium', treatment_strategy: 'mitigate', risk_register_id: 1, control_code: 'A.5.31',
    risk_treatments: [
      { id: 11, description: 'Appoint dedicated DPO', treatment_type: 'mitigate', status: 'completed', responsible: 'Legal', due_date: '2025-07-01' },
    ] },
]

// ─── Policies ────────────────────────────────────────────────
export const DEMO_POLICIES = [
  { id: 1, title: 'Information Security Policy', category: 'information_security', status: 'published', version: '3.1', content: '1. PURPOSE\nThis policy establishes the framework for information security management at Acme Corp, ensuring the confidentiality, integrity, and availability of all information assets.\n\n2. SCOPE\nThis policy applies to all employees, contractors, and third parties who access Acme Corp information systems.\n\n3. POLICY STATEMENTS\n3.1 Information shall be classified according to its sensitivity and business value.\n3.2 Access to information shall be granted on a need-to-know basis.\n3.3 All information security incidents shall be reported and investigated.\n3.4 Regular risk assessments shall be conducted to identify and mitigate threats.\n\n4. RESPONSIBILITIES\n4.1 The CISO is responsible for the overall information security program.\n4.2 Department heads are responsible for ensuring compliance within their teams.\n4.3 All employees are responsible for adhering to this policy.\n\n5. REVIEW\nThis policy shall be reviewed annually or upon significant changes to the business environment.', created_at: '2025-06-15', updated_at: '2026-01-10', review_due_date: '2026-06-15', approved_at: '2026-01-12', versions: [{ version: '3.1', created_at: '2026-01-10' }, { version: '3.0', created_at: '2025-06-15' }, { version: '2.0', created_at: '2024-06-15' }] },
  { id: 2, title: 'Access Control Policy', category: 'access_control', status: 'published', version: '2.0', content: '1. PURPOSE\nThis policy defines the requirements for controlling access to Acme Corp information systems and data.\n\n2. ACCESS CONTROL PRINCIPLES\n2.1 Least privilege: Users shall receive minimum permissions necessary.\n2.2 Separation of duties: Critical functions shall require multiple approvals.\n2.3 Multi-factor authentication required for all remote access and privileged accounts.\n\n3. USER ACCESS MANAGEMENT\n3.1 Access requests must be approved by the resource owner.\n3.2 Access rights shall be reviewed quarterly.\n3.3 Access shall be revoked within 24 hours of termination.', created_at: '2025-08-01', updated_at: '2025-12-15', review_due_date: '2026-08-01', approved_at: '2025-12-18', versions: [{ version: '2.0', created_at: '2025-12-15' }, { version: '1.0', created_at: '2025-08-01' }] },
  { id: 3, title: 'Risk Management Policy', category: 'information_security', status: 'published', version: '1.2', content: '1. PURPOSE\nDefine the approach to identifying, assessing, and managing information security risks.\n\n2. RISK ASSESSMENT\n2.1 Risk assessments shall be conducted annually and upon significant changes.\n2.2 The risk assessment methodology shall use a 5x5 likelihood/impact matrix.\n2.3 All risks with a score of 12 or above require formal treatment plans.\n\n3. RISK TREATMENT\n3.1 Treatment options: mitigate, accept, transfer, or avoid.\n3.2 Risk acceptance requires approval from the risk owner and CISO.', created_at: '2025-09-01', updated_at: '2026-02-01', review_due_date: '2026-09-01', approved_at: '2026-02-03', versions: [{ version: '1.2', created_at: '2026-02-01' }] },
  { id: 4, title: 'Incident Response Policy', category: 'incident_management', status: 'published', version: '2.1', content: '1. PURPOSE\nEstablish procedures for detecting, responding to, and recovering from information security incidents.\n\n2. INCIDENT CLASSIFICATION\n- P1 Critical: Data breach, ransomware, system-wide outage\n- P2 High: Targeted attack, significant vulnerability exploited\n- P3 Medium: Phishing success, unauthorized access attempt\n- P4 Low: Policy violation, suspicious activity\n\n3. RESPONSE PROCEDURES\n3.1 All incidents must be reported within 1 hour of detection.\n3.2 P1 incidents trigger the Incident Response Team within 15 minutes.\n3.3 Post-incident reviews required for all P1 and P2 incidents.', created_at: '2025-07-01', updated_at: '2025-11-20', review_due_date: '2026-07-01', approved_at: '2025-11-22', versions: [{ version: '2.1', created_at: '2025-11-20' }, { version: '2.0', created_at: '2025-07-01' }] },
  { id: 5, title: 'Acceptable Use Policy', category: 'information_security', status: 'published', version: '1.0', content: 'Defines acceptable use of company IT resources and information assets for all employees and contractors.', created_at: '2025-10-01', updated_at: '2025-10-01', review_due_date: '2026-10-01', approved_at: '2025-10-05', versions: [{ version: '1.0', created_at: '2025-10-01' }] },
  { id: 6, title: 'Data Classification & Handling Policy', category: 'asset_management', status: 'review', version: '1.1', content: 'Defines data classification levels (Public, Internal, Confidential, Restricted) and handling requirements for each level.', created_at: '2025-11-01', updated_at: '2026-02-15', review_due_date: '2026-03-15', versions: [{ version: '1.1', created_at: '2026-02-15' }] },
  { id: 7, title: 'Remote Working Policy', category: 'hr_security', status: 'published', version: '1.0', content: 'Defines security requirements for remote working arrangements, including VPN usage, device security, and secure communication.', created_at: '2025-08-15', updated_at: '2025-08-15', review_due_date: '2026-08-15', approved_at: '2025-08-20', versions: [{ version: '1.0', created_at: '2025-08-15' }] },
  { id: 8, title: 'Physical Security Policy', category: 'physical_security', status: 'draft', version: '0.9', content: 'Draft policy covering physical security perimeters, access controls, visitor management, and equipment protection.', created_at: '2026-01-20', updated_at: '2026-02-20', review_due_date: '2026-07-20', versions: [] },
  { id: 9, title: 'Cryptography & Key Management Policy', category: 'operations', status: 'published', version: '1.0', content: 'Establishes requirements for use of cryptographic controls, key generation, distribution, storage, and destruction.', created_at: '2025-12-01', updated_at: '2025-12-01', review_due_date: '2026-12-01', approved_at: '2025-12-05', versions: [{ version: '1.0', created_at: '2025-12-01' }] },
  { id: 10, title: 'Business Continuity & DR Policy', category: 'operations', status: 'review', version: '1.2', content: 'Defines business continuity planning, disaster recovery procedures, and ICT readiness requirements.', created_at: '2025-09-15', updated_at: '2026-02-28', review_due_date: '2026-03-10', versions: [{ version: '1.2', created_at: '2026-02-28' }, { version: '1.0', created_at: '2025-09-15' }] },
]

// ─── Notifications ───────────────────────────────────────────
export const DEMO_NOTIFICATIONS = [
  { id: 1, notification_type: 'alert', message: 'Stage 1 certification audit scheduled for April 10, 2026', created_at: new Date(Date.now() - 2 * 3600000).toISOString(), read_at: null },
  { id: 2, notification_type: 'success', message: 'Information Security Policy v3.1 published successfully', created_at: new Date(Date.now() - 5 * 3600000).toISOString(), read_at: null },
  { id: 3, notification_type: 'warning', message: 'Data Classification Policy review due in 13 days', created_at: new Date(Date.now() - 12 * 3600000).toISOString(), read_at: null },
  { id: 4, notification_type: 'info', message: '3 new evidence items collected via auto-collection', created_at: new Date(Date.now() - 24 * 3600000).toISOString(), read_at: new Date(Date.now() - 20 * 3600000).toISOString() },
  { id: 5, notification_type: 'reminder', message: 'Monthly security awareness training due for 12 employees', created_at: new Date(Date.now() - 48 * 3600000).toISOString(), read_at: null },
  { id: 6, notification_type: 'success', message: 'Risk treatment "Deploy EDR solution" marked as completed', created_at: new Date(Date.now() - 72 * 3600000).toISOString(), read_at: new Date(Date.now() - 70 * 3600000).toISOString() },
  { id: 7, notification_type: 'info', message: 'Internal audit finding for A.8.8 closed after remediation', created_at: new Date(Date.now() - 96 * 3600000).toISOString(), read_at: new Date(Date.now() - 90 * 3600000).toISOString() },
]

// ─── AI Responses ────────────────────────────────────────────
export const AI_CHAT_RESPONSES = {
  default: 'Based on ISO 27001:2022 requirements, I recommend focusing on the following areas:\n\n1. **Complete your gap analysis** — You currently have 12 identified gaps, with 2 critical items that need immediate attention (A.5.30 ICT readiness and A.8.29 security testing).\n\n2. **Address critical findings** — The internal audit identified 3 open findings that should be resolved before your Stage 1 audit in April.\n\n3. **Strengthen evidence collection** — Some controls have insufficient evidence. Use the auto-collect feature to gather evidence from integrated sources.\n\n4. **Review policies due for update** — The Data Classification Policy and Business Continuity Policy are due for review.\n\nWould you like me to elaborate on any of these areas?',
  controls: 'ISO 27001:2022 Annex A contains **93 controls** organized into 4 themes:\n\n• **Organizational (37 controls)** — Policies, roles, asset management, access control, supplier relationships, incident management, compliance\n• **People (8 controls)** — Screening, employment terms, awareness training, disciplinary process, remote working\n• **Physical (14 controls)** — Security perimeters, entry controls, equipment protection, clear desk\n• **Technological (34 controls)** — Endpoint security, access rights, authentication, malware protection, cryptography, network security, secure development\n\nYour organization has **{compliant} compliant**, **{partial} partially compliant**, **{nc} non-compliant**, and **{na} not assessed** controls. I recommend prioritizing the non-compliant controls first, especially A.5.7 (Threat intelligence) and A.8.29 (Security testing).',
  policy: '# Information Security Policy — Draft\n\n## 1. Purpose\nThis policy establishes the information security management framework for [Organization Name], ensuring the confidentiality, integrity, and availability of information assets in accordance with ISO/IEC 27001:2022.\n\n## 2. Scope\nThis policy applies to all employees, contractors, consultants, and third parties who access organizational information systems and data.\n\n## 3. Policy Statements\n\n### 3.1 Information Security Governance\nThe organization shall establish, implement, maintain, and continually improve an Information Security Management System (ISMS) in accordance with ISO 27001:2022.\n\n### 3.2 Risk Management\nInformation security risks shall be identified, assessed, and treated in accordance with the Risk Management Policy.\n\n### 3.3 Asset Classification\nAll information assets shall be classified according to their sensitivity and protected accordingly.\n\n### 3.4 Access Control\nAccess to information systems shall be controlled based on the principle of least privilege.\n\n### 3.5 Incident Management\nAll information security incidents shall be reported, investigated, and lessons learned documented.\n\n## 4. Responsibilities\n- **CISO**: Overall accountability for information security\n- **Department Heads**: Compliance within their areas\n- **All Staff**: Adherence to policies and reporting incidents\n\n## 5. Review\nThis policy shall be reviewed annually.',
  risk: 'For an ISO 27001 risk assessment, I recommend the **quantitative 5×5 matrix methodology**:\n\n**Likelihood Scale (1-5):**\n1. Rare — Less than once per 5 years\n2. Unlikely — Once per 2-5 years\n3. Possible — Once per 1-2 years\n4. Likely — Several times per year\n5. Almost Certain — Monthly or more frequent\n\n**Impact Scale (1-5):**\n1. Negligible — Minimal business impact\n2. Minor — Limited impact, easily recoverable\n3. Moderate — Significant but manageable impact\n4. Major — Severe impact on operations\n5. Critical — Existential threat to business\n\n**Risk Score = Likelihood × Impact**\n- 1-4: Low (Accept)\n- 5-9: Medium (Monitor & Mitigate)\n- 10-15: High (Prioritize Treatment)\n- 16-25: Critical (Immediate Action Required)\n\nYour current risk register shows **1 critical**, **4 high**, **2 medium**, and **1 low** risk entries. I recommend focusing on the ransomware and third-party data breach risks first.',
  audit: '# ISO 27001 Certification Audit Preparation Checklist\n\n## Documentation (Stage 1)\n✅ ISMS Scope Statement\n✅ Information Security Policy\n✅ Risk Assessment Methodology\n✅ Statement of Applicability\n✅ Risk Treatment Plan\n⬜ Internal Audit Reports\n⬜ Management Review Minutes\n✅ Incident Response Procedures\n\n## Implementation Evidence (Stage 2)\n✅ Access control logs and reviews\n✅ Security awareness training records\n✅ Vulnerability scan reports\n⬜ Penetration test results\n✅ Change management records\n✅ Backup verification logs\n⬜ Business continuity test results\n✅ Supplier security assessments\n\n## Key Recommendations\n1. Complete the internal audit program — you have 1 planned audit\n2. Schedule management review meeting before April\n3. Ensure all 12 identified gaps have documented treatment plans\n4. Conduct a mock audit 2 weeks before Stage 1\n\nYour current audit readiness score is **72%**. Focus on the unchecked items above to improve.',
  evidence: 'For ISO 27001 compliance, you need evidence for each applicable control. Key evidence types:\n\n**Mandatory Documents:**\n• ISMS Scope (Clause 4.3)\n• Information Security Policy (Clause 5.2)\n• Risk Assessment Process (Clause 6.1.2)\n• Risk Treatment Plan (Clause 6.1.3)\n• Statement of Applicability (Clause 6.1.3d)\n• Information Security Objectives (Clause 6.2)\n• Evidence of Competence (Clause 7.2)\n• Operational Planning & Control (Clause 8.1)\n• Risk Assessment Results (Clause 8.2)\n• Risk Treatment Results (Clause 8.3)\n• Monitoring & Measurement Results (Clause 9.1)\n• Internal Audit Program & Results (Clause 9.2)\n• Management Review Results (Clause 9.3)\n• Nonconformities & Corrective Actions (Clause 10.1)\n\nYou currently have **{evidence_count} evidence items**. I recommend using auto-collect to gather evidence from your integrated tools (GitHub, CI/CD, cloud platforms).',
  gap: 'Common ISO 27001 gaps organizations face:\n\n1. **Lack of formal risk methodology** — Many organizations assess risks informally without documented criteria\n2. **Insufficient evidence** — Controls may be implemented but lack proof\n3. **Outdated policies** — Policies not reviewed annually as required\n4. **Incomplete SoA** — Statement of Applicability missing justifications\n5. **No internal audit** — Required by Clause 9.2 but often skipped\n6. **Missing management review** — Top management must review ISMS effectiveness\n\nYour specific gaps:\n• **2 critical**: ICT readiness (A.5.30) and security testing (A.8.29)\n• **4 evidence gaps**: Missing documentation for implemented controls\n• **6 implementation gaps**: Controls not yet fully deployed\n\nPrioritize the critical gaps first — these could be stage-stoppers in your certification audit.',
}

export const AI_AUDIT_READINESS = {
  readiness_score: 72,
  areas: [
    { name: 'Documentation', score: 85, status: 'good' },
    { name: 'Implementation', score: 68, status: 'needs_work' },
    { name: 'Evidence', score: 75, status: 'good' },
    { name: 'Risk Management', score: 80, status: 'good' },
    { name: 'Internal Audit', score: 50, status: 'critical' },
    { name: 'Management Review', score: 60, status: 'needs_work' },
  ],
}

export const AI_GAP_RECOMMENDATIONS = {
  recommendations: [
    { title: 'Conduct DR test for ICT readiness (A.5.30)', priority: 'high', impact: 'Closes critical gap, improves audit readiness by 5%' },
    { title: 'Integrate SAST/DAST into CI/CD pipeline (A.8.29)', priority: 'high', impact: 'Addresses critical security testing gap' },
    { title: 'Complete vendor risk assessments for critical suppliers', priority: 'high', impact: 'Mitigates supply chain risk, closes A.5.21 gap' },
    { title: 'Implement data masking for non-production environments', priority: 'medium', impact: 'Closes A.8.11 gap and reduces data exposure risk' },
    { title: 'Schedule management review meeting before Stage 1 audit', priority: 'medium', impact: 'Required by Clause 9.3, currently not scheduled' },
  ],
}

// ─── Reports ─────────────────────────────────────────────────
export const DEMO_REPORTS = [
  { id: 1, title: 'Compliance Summary — February 2026', report_type: 'compliance_summary', status: 'completed', ai_generated: true, created_at: new Date(Date.now() - 2 * 86400000).toISOString(), file_size: '2.4 MB', download_url: '#' },
  { id: 2, title: 'Risk Assessment Report — Q1 2026', report_type: 'risk_assessment', status: 'completed', ai_generated: true, created_at: new Date(Date.now() - 7 * 86400000).toISOString(), file_size: '3.1 MB', download_url: '#' },
  { id: 3, title: 'Internal Audit Report — January 2026', report_type: 'audit_report', status: 'completed', ai_generated: false, created_at: new Date(Date.now() - 30 * 86400000).toISOString(), file_size: '1.8 MB', download_url: '#' },
  { id: 4, title: 'Statement of Applicability Export', report_type: 'soa_export', status: 'completed', ai_generated: false, created_at: new Date(Date.now() - 14 * 86400000).toISOString(), file_size: '156 KB', download_url: '#' },
]

// ─── Training ────────────────────────────────────────────────
export const DEMO_TRAINING = {
  courses: [
    { id: 1, title: 'ISO 27001 Fundamentals', category: 'awareness', duration: '2h', enrolled: 45, completed: 38, required: true },
    { id: 2, title: 'Information Security Awareness', category: 'awareness', duration: '1h', enrolled: 120, completed: 108, required: true },
    { id: 3, title: 'Phishing & Social Engineering', category: 'awareness', duration: '45m', enrolled: 120, completed: 95, required: true },
    { id: 4, title: 'Access Control Best Practices', category: 'technical', duration: '1.5h', enrolled: 30, completed: 24, required: false },
    { id: 5, title: 'Incident Response Procedures', category: 'incident', duration: '2h', enrolled: 25, completed: 20, required: true },
    { id: 6, title: 'Risk Management for Managers', category: 'management', duration: '1h', enrolled: 15, completed: 13, required: false },
    { id: 7, title: 'GDPR & Data Protection', category: 'compliance', duration: '1.5h', enrolled: 60, completed: 52, required: true },
    { id: 8, title: 'Secure Development Practices', category: 'technical', duration: '3h', enrolled: 20, completed: 12, required: false },
  ],
  progress: { overall_completion: 82, required_completion: 88, total_enrolled: 435, total_completed: 362 },
}

// ─── Certification Roadmap ───────────────────────────────────
export const DEMO_ROADMAP = {
  phases: [
    { id: 'planning', name: 'Planning & Scoping', status: 'completed', milestones: [
      { title: 'Define ISMS scope', status: 'completed', description: 'Scope defined: all business units, IT infrastructure, and cloud services' },
      { title: 'Management commitment', status: 'completed', description: 'Board approval and budget allocation secured' },
      { title: 'Risk assessment methodology', status: 'completed', description: '5x5 matrix methodology documented and approved' },
      { title: 'Initial gap analysis', status: 'completed', description: 'Gap analysis completed — 12 gaps identified' },
    ]},
    { id: 'implementation', name: 'Controls Implementation', status: 'in_progress', milestones: [
      { title: 'Statement of Applicability', status: 'completed', description: 'SoA generated for all 93 Annex A controls' },
      { title: 'Implement organizational controls', status: 'completed', description: '37 organizational controls reviewed and implemented' },
      { title: 'Implement technical controls', status: 'in_progress', description: '28 of 34 technical controls implemented' },
      { title: 'Evidence collection', status: 'in_progress', description: '30 evidence items collected, ongoing auto-collection active' },
    ]},
    { id: 'documentation', name: 'Documentation', status: 'in_progress', milestones: [
      { title: 'ISMS policies', status: 'completed', description: '10 policies drafted, 7 published, 2 in review' },
      { title: 'Procedures & processes', status: 'in_progress', description: 'Core procedures documented, operational procedures in progress' },
      { title: 'Risk register', status: 'completed', description: 'Risk register with 8 entries and treatment plans' },
      { title: 'Records & logs', status: 'in_progress', description: 'Logging infrastructure in place, retention policies being configured' },
    ]},
    { id: 'audit', name: 'Internal Audit & Review', status: 'in_progress', milestones: [
      { title: 'Internal audit plan', status: 'completed', description: 'Audit plan approved covering all ISMS processes' },
      { title: 'Conduct internal audit', status: 'completed', description: 'Q1 2026 internal audit completed — 4 findings' },
      { title: 'Management review', status: 'pending', description: 'Scheduled for March 2026' },
      { title: 'Corrective actions', status: 'in_progress', description: '1 of 3 open findings resolved' },
    ]},
    { id: 'certification', name: 'Certification Audit', status: 'pending', milestones: [
      { title: 'Pre-audit readiness check', status: 'pending', description: 'Scheduled for March 15, 2026' },
      { title: 'Stage 1 audit (Documentation)', status: 'pending', description: 'Scheduled April 10, 2026 — BSI Group' },
      { title: 'Stage 2 audit (Implementation)', status: 'pending', description: 'Expected May 2026' },
      { title: 'Certificate issued', status: 'pending', description: 'Target: June 2026' },
    ]},
  ],
}
