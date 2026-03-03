import { useEffect, useState } from 'react'
import {
  Map, CheckCircle2, Circle, Clock, ChevronRight,
  Target, Shield, FileText, BookOpen, AlertTriangle, Sparkles,
} from 'lucide-react'
import GlassCard from '../components/GlassCard'
import PageHeader from '../components/PageHeader'
import LoadingScreen from '../components/LoadingScreen'
import ProgressRing from '../components/ProgressRing'
import AiBadge from '../components/AiBadge'
import { getCertificationRoadmap, getComplianceDashboard } from '../lib/api'

const PHASE_ICONS = {
  planning: Target,
  implementation: Shield,
  documentation: FileText,
  audit: BookOpen,
  certification: CheckCircle2,
}

const PHASE_COLORS = {
  planning: { border: 'border-blue-500/30', bg: 'bg-blue-500/10', text: 'text-blue-400', line: 'bg-blue-500' },
  implementation: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400', line: 'bg-emerald-500' },
  documentation: { border: 'border-purple-500/30', bg: 'bg-purple-500/10', text: 'text-purple-400', line: 'bg-purple-500' },
  audit: { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400', line: 'bg-amber-500' },
  certification: { border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', text: 'text-cyan-400', line: 'bg-cyan-500' },
}

const DEFAULT_PHASES = [
  {
    id: 'planning', name: 'Planning & Scoping', status: 'in_progress',
    milestones: [
      { title: 'Define ISMS scope', status: 'completed', description: 'Define organizational scope boundaries' },
      { title: 'Management commitment', status: 'completed', description: 'Obtain leadership buy-in and resources' },
      { title: 'Risk assessment methodology', status: 'in_progress', description: 'Select and document risk methodology' },
      { title: 'Gap analysis', status: 'pending', description: 'Complete initial gap analysis' },
    ],
  },
  {
    id: 'implementation', name: 'Controls Implementation', status: 'pending',
    milestones: [
      { title: 'Statement of Applicability', status: 'pending', description: 'Define applicable controls' },
      { title: 'Implement controls', status: 'pending', description: 'Deploy 93 Annex A controls' },
      { title: 'Risk treatment plans', status: 'pending', description: 'Address identified risks' },
      { title: 'Evidence collection', status: 'pending', description: 'Gather implementation evidence' },
    ],
  },
  {
    id: 'documentation', name: 'Documentation', status: 'pending',
    milestones: [
      { title: 'ISMS policies', status: 'pending', description: 'Draft and approve all required policies' },
      { title: 'Procedures & processes', status: 'pending', description: 'Document operational procedures' },
      { title: 'Risk register', status: 'pending', description: 'Complete risk register with treatments' },
      { title: 'Records & logs', status: 'pending', description: 'Establish record-keeping processes' },
    ],
  },
  {
    id: 'audit', name: 'Internal Audit', status: 'pending',
    milestones: [
      { title: 'Internal audit plan', status: 'pending', description: 'Create audit schedule and scope' },
      { title: 'Conduct internal audit', status: 'pending', description: 'Execute internal audit program' },
      { title: 'Management review', status: 'pending', description: 'Review ISMS performance' },
      { title: 'Corrective actions', status: 'pending', description: 'Address non-conformities' },
    ],
  },
  {
    id: 'certification', name: 'Certification Audit', status: 'pending',
    milestones: [
      { title: 'Stage 1 audit', status: 'pending', description: 'Documentation review by certification body' },
      { title: 'Stage 2 audit', status: 'pending', description: 'On-site implementation verification' },
      { title: 'Certificate issued', status: 'pending', description: 'Achieve ISO 27001 certification' },
    ],
  },
]

function StatusIcon({ status }) {
  if (status === 'completed') return <CheckCircle2 size={16} className="text-emerald-400" />
  if (status === 'in_progress') return <Clock size={16} className="text-amber-400 animate-pulse" />
  return <Circle size={16} className="text-gray-600" />
}

export default function CertificationRoadmap() {
  const [phases, setPhases] = useState(DEFAULT_PHASES)
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expandedPhase, setExpandedPhase] = useState(null)

  useEffect(() => {
    Promise.all([
      getCertificationRoadmap().catch(() => null),
      getComplianceDashboard().catch(() => null),
    ]).then(([roadmapRes, dashRes]) => {
      if (roadmapRes?.data?.phases) setPhases(roadmapRes.data.phases)
      if (dashRes?.data) setDashboard(dashRes.data)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingScreen message="Loading certification roadmap..." />

  const totalMilestones = phases.reduce((sum, p) => sum + p.milestones.length, 0)
  const completedMilestones = phases.reduce(
    (sum, p) => sum + p.milestones.filter((m) => m.status === 'completed').length, 0
  )
  const overallProgress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0
  const currentPhase = phases.find((p) => p.status === 'in_progress') || phases[0]
  const score = dashboard?.compliance_score ?? 0

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Certification Roadmap"
        subtitle="Track your journey to ISO 27001:2022 certification"
        aiPowered
      />

      {/* Overview cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger">
        <GlassCard hover className="text-center">
          <ProgressRing value={overallProgress} size={90} strokeWidth={6} label="Overall Progress" />
        </GlassCard>

        <GlassCard hover className="text-center">
          <ProgressRing value={score} size={90} strokeWidth={6} label="Compliance Score" color="#10b981" />
        </GlassCard>

        <GlassCard hover>
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg bg-amber-500/10 p-2">
              <Clock size={16} className="text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Current Phase</p>
              <p className="text-sm font-semibold text-white">{currentPhase?.name || 'Not started'}</p>
            </div>
          </div>
          <div className="h-1.5 rounded-full bg-gray-800">
            <div
              className="h-full rounded-full bg-amber-500 animate-progress"
              style={{
                width: `${currentPhase ? Math.round(
                  (currentPhase.milestones.filter((m) => m.status === 'completed').length /
                    currentPhase.milestones.length) * 100
                ) : 0}%`,
              }}
            />
          </div>
        </GlassCard>

        <GlassCard hover>
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-lg bg-emerald-500/10 p-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Milestones</p>
              <p className="text-sm font-semibold text-white">{completedMilestones} / {totalMilestones}</p>
            </div>
          </div>
          <div className="flex gap-1">
            {phases.map((p) => (
              <div key={p.id} className="flex-1 flex gap-0.5">
                {p.milestones.map((m, j) => (
                  <div
                    key={j}
                    className={`h-1.5 flex-1 rounded-full ${
                      m.status === 'completed' ? 'bg-emerald-500' :
                      m.status === 'in_progress' ? 'bg-amber-500' : 'bg-gray-800'
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-800 lg:left-1/2" />

        <div className="space-y-6">
          {phases.map((phase, index) => {
            const colors = PHASE_COLORS[phase.id] || PHASE_COLORS.planning
            const Icon = PHASE_ICONS[phase.id] || Target
            const isExpanded = expandedPhase === phase.id
            const phaseProgress = Math.round(
              (phase.milestones.filter((m) => m.status === 'completed').length / phase.milestones.length) * 100
            )

            return (
              <div key={phase.id} className={`relative animate-fade-in`} style={{ animationDelay: `${index * 100}ms` }}>
                {/* Timeline node */}
                <div className={`absolute left-5 lg:left-1/2 lg:-translate-x-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                  phase.status === 'completed' ? 'border-emerald-500 bg-emerald-500/20' :
                  phase.status === 'in_progress' ? `border-amber-500 bg-amber-500/20` :
                  'border-gray-700 bg-gray-900'
                }`}>
                  {phase.status === 'completed' ? (
                    <CheckCircle2 size={12} className="text-emerald-400" />
                  ) : phase.status === 'in_progress' ? (
                    <Clock size={12} className="text-amber-400" />
                  ) : (
                    <span className="text-[9px] font-bold text-gray-600">{index + 1}</span>
                  )}
                </div>

                {/* Phase card */}
                <div className={`ml-16 lg:ml-0 ${index % 2 === 0 ? 'lg:mr-[52%]' : 'lg:ml-[52%]'}`}>
                  <GlassCard
                    hover
                    onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                    className={`${colors.border} cursor-pointer`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-lg ${colors.bg} p-2`}>
                          <Icon size={16} className={colors.text} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{phase.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase">Phase {index + 1}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-medium ${
                          phaseProgress === 100 ? 'text-emerald-400' : phaseProgress > 0 ? 'text-amber-400' : 'text-gray-600'
                        }`}>
                          {phaseProgress}%
                        </span>
                        <ChevronRight
                          size={14}
                          className={`text-gray-600 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        />
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1.5 rounded-full bg-gray-800">
                      <div
                        className={`h-full rounded-full ${colors.line} transition-all duration-700`}
                        style={{ width: `${phaseProgress}%` }}
                      />
                    </div>

                    {/* Milestones (expanded) */}
                    {isExpanded && (
                      <div className="mt-4 space-y-2 animate-fade-in">
                        {phase.milestones.map((milestone, j) => (
                          <div
                            key={j}
                            className="flex items-start gap-3 rounded-lg bg-gray-800/30 p-3"
                          >
                            <StatusIcon status={milestone.status} />
                            <div className="flex-1">
                              <p className={`text-sm ${milestone.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
                                {milestone.title}
                              </p>
                              {milestone.description && (
                                <p className="text-xs text-gray-600 mt-0.5">{milestone.description}</p>
                              )}
                            </div>
                            {milestone.ai_suggestion && (
                              <AiBadge size="xs" label="Tip" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </GlassCard>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* AI insight */}
      <GlassCard gradient className="gradient-accent-soft animate-fade-in">
        <div className="flex items-start gap-4">
          <div className="rounded-xl gradient-accent p-3 glow-sm">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-white">AI Recommendation</h3>
              <AiBadge size="xs" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {overallProgress < 30
                ? 'Focus on completing the gap analysis and defining your ISMS scope. These foundational steps will accelerate your implementation phase.'
                : overallProgress < 60
                ? 'Great progress! Prioritize documenting your policies and completing the Statement of Applicability to maintain momentum.'
                : overallProgress < 90
                ? 'You\'re well on your way. Ensure all evidence is collected and prepare your internal audit plan for the next phase.'
                : 'Excellent! You\'re nearly ready for certification. Review all documentation and conduct a pre-audit assessment.'}
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
