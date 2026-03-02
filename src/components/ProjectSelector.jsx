import { useState, useRef, useEffect } from 'react'
import { ChevronDown, FolderOpen } from 'lucide-react'
import { useAuth } from '../lib/auth'

export default function ProjectSelector() {
  const { projects, selectedProject, selectProject } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (!projects.length) return null

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-left text-sm text-gray-200 hover:border-gray-600 transition-colors"
      >
        <FolderOpen size={14} className="text-emerald-400 shrink-0" />
        <span className="truncate flex-1">{selectedProject?.name || 'Select project...'}</span>
        <ChevronDown size={14} className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border border-gray-700 bg-gray-800 py-1 shadow-xl">
          {projects.map((proj) => (
            <button
              key={proj.id}
              onClick={() => {
                selectProject(proj)
                setOpen(false)
              }}
              className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${
                selectedProject?.id === proj.id
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <FolderOpen size={12} className="shrink-0" />
              <span className="truncate">{proj.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
