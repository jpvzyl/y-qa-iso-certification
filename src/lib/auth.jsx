import { createContext, useContext, useState, useEffect } from 'react'
import {
  setAuthToken,
  setProjectId as setApiProjectId,
  getMe,
  getProjects,
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
} from './api'
import { DEMO_USER, DEMO_PROJECTS } from './demo-data'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('yqa_token'))
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [loading, setLoading] = useState(true)

  function pickProject(projs) {
    const savedId = localStorage.getItem('yqa_project_id')
    const saved = projs.find((proj) => String(proj.id) === savedId)
    const pick = saved || projs[0] || null
    if (pick) {
      setSelectedProject(pick)
      setApiProjectId(String(pick.id))
    }
  }

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    setAuthToken(token)
    getMe()
      .then((res) => {
        setUser(res.data.user)
        const projs = res.data.projects || []
        setProjects(projs)
        pickProject(projs)
      })
      .catch(() => {
        setAuthToken(null)
        setToken(null)
        setUser(null)
        localStorage.removeItem('yqa_token')
      })
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (email, password) => {
    const res = await apiLogin({ email, password })
    const jwt = res.data.token || res.headers?.authorization?.replace('Bearer ', '')
    setAuthToken(jwt)
    setToken(jwt)
    setUser(res.data.user)

    try {
      const projRes = await getProjects()
      const projs = projRes.data.projects || projRes.data || []
      setProjects(projs)
      pickProject(projs)
    } catch {
      /* projects may not be available yet */
    }
    return res.data.user
  }

  const register = async (data) => {
    const res = await apiRegister(data)
    const jwt = res.data.token || res.headers?.authorization?.replace('Bearer ', '')
    setAuthToken(jwt)
    setToken(jwt)
    setUser(res.data.user)

    try {
      const projRes = await getProjects()
      const projs = projRes.data.projects || projRes.data || []
      setProjects(projs)
      pickProject(projs)
    } catch {
      /* projects may not be available yet */
    }
    return res.data.user
  }

  const logout = async () => {
    try {
      await apiLogout()
    } catch {
      /* best-effort */
    }
    setAuthToken(null)
    setApiProjectId(null)
    setToken(null)
    setUser(null)
    setProjects([])
    setSelectedProject(null)
  }

  const demoLogin = () => {
    const jwt = 'demo-token-yqa-iso-27001'
    setAuthToken(jwt)
    setToken(jwt)
    setUser(DEMO_USER)
    setProjects(DEMO_PROJECTS)
    setSelectedProject(DEMO_PROJECTS[0])
    setApiProjectId(String(DEMO_PROJECTS[0].id))
    localStorage.setItem('yqa_demo', '1')
    return DEMO_USER
  }

  const selectProject = (project) => {
    setSelectedProject(project)
    setApiProjectId(String(project.id))
  }

  return (
    <AuthContext.Provider
      value={{ user, token, projects, selectedProject, loading, login, register, logout, demoLogin, selectProject }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
