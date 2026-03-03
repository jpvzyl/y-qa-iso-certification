import { useEffect, useState } from 'react'
import {
  GraduationCap, Users, Award, Clock, CheckCircle2, Play, BookOpen,
  TrendingUp, BarChart3, ChevronRight, Loader2, Plus, Target,
} from 'lucide-react'
import GlassCard from '../components/GlassCard'
import PageHeader from '../components/PageHeader'
import LoadingScreen from '../components/LoadingScreen'
import EmptyState from '../components/EmptyState'
import ProgressRing from '../components/ProgressRing'
import { getTrainingCourses, getTrainingProgress } from '../lib/api'

const COURSE_CATEGORIES = {
  awareness: { label: 'Security Awareness', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  technical: { label: 'Technical Training', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  management: { label: 'Management Training', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  compliance: { label: 'Compliance Training', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  incident: { label: 'Incident Response', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
}

const DEFAULT_COURSES = [
  { id: 1, title: 'ISO 27001 Fundamentals', category: 'awareness', duration: '2h', enrolled: 45, completed: 38, required: true },
  { id: 2, title: 'Information Security Awareness', category: 'awareness', duration: '1h', enrolled: 120, completed: 95, required: true },
  { id: 3, title: 'Phishing & Social Engineering', category: 'awareness', duration: '45m', enrolled: 120, completed: 82, required: true },
  { id: 4, title: 'Access Control Best Practices', category: 'technical', duration: '1.5h', enrolled: 30, completed: 22, required: false },
  { id: 5, title: 'Incident Response Procedures', category: 'incident', duration: '2h', enrolled: 25, completed: 18, required: true },
  { id: 6, title: 'Risk Management Overview', category: 'management', duration: '1h', enrolled: 15, completed: 12, required: false },
  { id: 7, title: 'GDPR & Data Protection', category: 'compliance', duration: '1.5h', enrolled: 60, completed: 45, required: true },
  { id: 8, title: 'Secure Development Practices', category: 'technical', duration: '3h', enrolled: 20, completed: 10, required: false },
]

export default function Training() {
  const [courses, setCourses] = useState(DEFAULT_COURSES)
  const [, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [showAssign, setShowAssign] = useState(false)

  useEffect(() => {
    Promise.all([
      getTrainingCourses().catch(() => null),
      getTrainingProgress().catch(() => null),
    ]).then(([coursesRes, progressRes]) => {
      if (coursesRes?.data?.courses) setCourses(coursesRes.data.courses)
      if (progressRes?.data) setProgress(progressRes.data)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingScreen message="Loading training data..." />

  const totalEnrolled = courses.reduce((sum, c) => sum + (c.enrolled || 0), 0)
  const totalCompleted = courses.reduce((sum, c) => sum + (c.completed || 0), 0)
  const completionRate = totalEnrolled > 0 ? Math.round((totalCompleted / totalEnrolled) * 100) : 0
  const requiredCourses = courses.filter((c) => c.required)
  const requiredCompletion = requiredCourses.length > 0
    ? Math.round(requiredCourses.reduce((sum, c) => sum + (c.enrolled > 0 ? (c.completed / c.enrolled) * 100 : 0), 0) / requiredCourses.length)
    : 0

  const filtered = activeCategory === 'all' ? courses : courses.filter((c) => c.category === activeCategory)

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Training & Awareness"
        subtitle="Manage security training programs for ISO 27001 compliance"
        actions={
          <button
            onClick={() => setShowAssign(!showAssign)}
            className="flex items-center gap-2 rounded-lg gradient-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            <Plus size={14} />
            Assign Training
          </button>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger">
        <GlassCard hover className="text-center">
          <ProgressRing value={completionRate} size={80} strokeWidth={6} label="Overall Completion" />
        </GlassCard>

        <GlassCard hover>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-500/10 p-2.5">
              <CheckCircle2 size={18} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Completed</p>
              <p className="text-xl font-bold text-white">{totalCompleted}</p>
              <p className="text-[10px] text-gray-600">of {totalEnrolled} assignments</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard hover>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-2.5">
              <BookOpen size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Courses</p>
              <p className="text-xl font-bold text-white">{courses.length}</p>
              <p className="text-[10px] text-gray-600">{requiredCourses.length} required</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard hover>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-500/10 p-2.5">
              <Target size={18} className="text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Required Completion</p>
              <p className="text-xl font-bold text-white">{requiredCompletion}%</p>
              <div className="mt-1 h-1 w-20 rounded-full bg-gray-800">
                <div className="h-full rounded-full bg-amber-500 animate-progress" style={{ width: `${requiredCompletion}%` }} />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Category filter */}
      <div className="flex gap-1 rounded-xl bg-gray-900/50 border border-gray-800/50 p-1 overflow-x-auto">
        <button
          onClick={() => setActiveCategory('all')}
          className={`rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
            activeCategory === 'all' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          All Courses
        </button>
        {Object.entries(COURSE_CATEGORIES).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
              activeCategory === key ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Course cards */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No courses found"
          description="No training courses match the selected category."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course, i) => {
            const cat = COURSE_CATEGORIES[course.category] || COURSE_CATEGORIES.awareness
            const pct = course.enrolled > 0 ? Math.round((course.completed / course.enrolled) * 100) : 0
            return (
              <GlassCard
                key={course.id}
                hover
                className={`${cat.border} animate-fade-in`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={`inline-flex rounded-full ${cat.bg} px-2.5 py-0.5 text-[10px] font-medium ${cat.color} uppercase`}>
                    {cat.label}
                  </span>
                  {course.required && (
                    <span className="rounded-full bg-red-500/10 border border-red-500/20 px-2 py-0.5 text-[9px] font-medium text-red-400 uppercase">
                      Required
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-semibold text-white mb-1">{course.title}</h3>

                <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Clock size={10} />{course.duration}</span>
                  <span className="flex items-center gap-1"><Users size={10} />{course.enrolled} enrolled</span>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">Completion</span>
                  <span className={`text-xs font-semibold ${pct >= 80 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                    {pct}%
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-800">
                  <div
                    className={`h-full rounded-full transition-all ${pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-gray-600">
                  <span>{course.completed} / {course.enrolled} completed</span>
                  <Award size={12} className={pct === 100 ? 'text-emerald-400' : 'text-gray-700'} />
                </div>
              </GlassCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
