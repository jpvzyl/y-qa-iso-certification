import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Shield,
  ClipboardCheck,
  FileSearch,
  BookOpen,
  AlertTriangle,
  FileText,
  Settings,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/controls', icon: Shield, label: 'Controls' },
  { to: '/soa', icon: ClipboardCheck, label: 'Statement of Applicability' },
  { to: '/evidence', icon: FileSearch, label: 'Evidence' },
  { to: '/audits', icon: BookOpen, label: 'Audits' },
  { to: '/risk', icon: AlertTriangle, label: 'Risk Management' },
  { to: '/policies', icon: FileText, label: 'Policies' },
  { to: '/gap-analysis', icon: FileSearch, label: 'Gap Analysis' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

function SidebarContent({ onClose }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-800 px-5 py-5">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">Y-QA ISO Certification</h1>
          <p className="text-[11px] text-gray-500 tracking-wide uppercase">ISO 27001:2022</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-white lg:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-800 px-5 py-4">
        <p className="text-[11px] text-gray-600 text-center">Powered by <span className="text-emerald-500 font-semibold">Y-QA</span></p>
      </div>
    </div>
  )
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar - mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-950 border-r border-gray-800 transition-transform lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-800 bg-gray-950">
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b border-gray-800 bg-gray-950 px-4 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white">
            <Menu size={22} />
          </button>
          <h1 className="text-sm font-bold text-white">Y-QA ISO Certification</h1>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-950 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
