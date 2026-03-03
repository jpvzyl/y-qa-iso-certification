import { NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Shield, ClipboardCheck, FileSearch, BookOpen,
  AlertTriangle, FileText, Settings, Menu, X, LogOut, User,
  Sparkles, Map, GraduationCap, FileBarChart, ChevronDown,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../lib/auth'
import ProjectSelector from './ProjectSelector'
import NotificationBell from './NotificationBell'
import AiFloatingWidget from './AiFloatingWidget'

const NAV_SECTIONS = [
  {
    title: 'Overview',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/roadmap', icon: Map, label: 'Certification Roadmap' },
    ],
  },
  {
    title: 'Compliance',
    items: [
      { to: '/controls', icon: Shield, label: 'Controls' },
      { to: '/soa', icon: ClipboardCheck, label: 'Statement of Applicability' },
      { to: '/evidence', icon: FileSearch, label: 'Evidence' },
      { to: '/gap-analysis', icon: FileSearch, label: 'Gap Analysis' },
    ],
  },
  {
    title: 'Governance',
    items: [
      { to: '/audits', icon: BookOpen, label: 'Audits' },
      { to: '/risk', icon: AlertTriangle, label: 'Risk Management' },
      { to: '/policies', icon: FileText, label: 'Policies' },
    ],
  },
  {
    title: 'Intelligence',
    items: [
      { to: '/ai-assistant', icon: Sparkles, label: 'AI Assistant', accent: true },
      { to: '/reports', icon: FileBarChart, label: 'Reports' },
      { to: '/training', icon: GraduationCap, label: 'Training' },
    ],
  },
]

function SidebarContent({ onClose }) {
  const { user, logout } = useAuth()
  const [collapsedSections, setCollapsedSections] = useState({})

  const toggleSection = (title) => {
    setCollapsedSections((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="border-b border-gray-800/60 px-5 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-accent glow-sm">
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight">Y-QA</h1>
              <p className="text-[9px] text-gray-500 tracking-widest uppercase">ISO Certification</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-white lg:hidden">
              <X size={18} />
            </button>
          )}
        </div>

        {user && (
          <div className="mt-4 flex items-center gap-2.5 rounded-lg bg-gray-800/30 px-3 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <User size={12} className="text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-gray-200">
                {user.first_name} {user.last_name}
              </p>
              <p className="truncate text-[10px] text-gray-600">{user.email}</p>
            </div>
          </div>
        )}

        <div className="mt-3">
          <ProjectSelector />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
        {NAV_SECTIONS.map(({ title, items }) => (
          <div key={title}>
            <button
              onClick={() => toggleSection(title)}
              className="flex w-full items-center justify-between px-3 py-2 text-[10px] font-semibold text-gray-600 uppercase tracking-wider hover:text-gray-400 transition-colors"
            >
              {title}
              <ChevronDown
                size={10}
                className={`transition-transform ${collapsedSections[title] ? '-rotate-90' : ''}`}
              />
            </button>
            {!collapsedSections[title] && (
              <div className="space-y-0.5 mb-2">
                {items.map((navItem) => (
                  <NavLink
                    key={navItem.to}
                    to={navItem.to}
                    end={navItem.to === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all ${
                        isActive
                          ? navItem.accent
                            ? 'bg-gradient-to-r from-emerald-500/15 to-cyan-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-emerald-500/10 text-emerald-400'
                          : navItem.accent
                          ? 'text-emerald-400/70 hover:bg-emerald-500/5 hover:text-emerald-400'
                          : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                      }`
                    }
                  >
                    <navItem.icon size={16} />
                    <span className="truncate">{navItem.label}</span>
                    {navItem.accent && (
                      <span className="ml-auto flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-800/60 px-3 py-3 space-y-1">
        <NavLink
          to="/settings"
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
              isActive ? 'bg-emerald-500/10 text-emerald-400' : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
            }`
          }
        >
          <Settings size={16} />
          Settings
        </NavLink>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-gray-500 hover:bg-gray-800/50 hover:text-red-400 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
        <p className="mt-2 text-[9px] text-gray-700 text-center tracking-wide">
          Powered by <span className="text-gradient font-bold">Y-QA</span> &middot; ISO 27001:2022
        </p>
      </div>
    </div>
  )
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const isAiPage = location.pathname === '/ai-assistant'

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-950 border-r border-gray-800/60 transition-transform lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-800/60 bg-gray-950/95 backdrop-blur-xl">
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 items-center justify-between border-b border-gray-800/40 bg-gray-950/80 backdrop-blur-xl px-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white lg:hidden">
              <Menu size={20} />
            </button>
            <h1 className="text-sm font-semibold text-white lg:hidden">Y-QA ISO Certification</h1>
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-950 p-6 gradient-mesh">
          <Outlet />
        </main>
      </div>

      {/* AI floating widget (hidden on AI page) */}
      {!isAiPage && <AiFloatingWidget />}
    </div>
  )
}
