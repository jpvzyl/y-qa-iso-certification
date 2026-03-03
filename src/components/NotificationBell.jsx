import { useState, useEffect, useRef, useCallback } from 'react'
import { Bell, Check, X, AlertTriangle, Info, CheckCircle2, Clock } from 'lucide-react'
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../lib/api'

const TYPE_CONFIG = {
  alert: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  success: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  warning: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
  reminder: { icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500/10' },
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const ref = useRef(null)

  const fetchNotifications = useCallback(() => {
    getNotifications({ limit: 20 })
      .then((res) => {
        const items = res.data?.notifications || res.data || []
        setNotifications(items)
        setUnreadCount(items.filter((n) => !n.read_at).length)
      })
      .catch(() => { /* connection may not be available */ })
  }, [])

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id)
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
      setUnreadCount((c) => Math.max(0, c - 1))
    } catch { /* best-effort */ }
  }

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })))
      setUnreadCount(0)
    } catch { /* best-effort */ }
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-500 px-1 text-[9px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-gray-800 bg-gray-900/95 backdrop-blur-xl shadow-2xl z-50 animate-scale-in origin-top-right">
          <div className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300"
              >
                <Check size={10} />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-600">
                <Bell size={24} className="mb-2" />
                <p className="text-xs">No notifications</p>
              </div>
            ) : (
              notifications.map((n) => {
                const config = TYPE_CONFIG[n.notification_type] || TYPE_CONFIG.info
                const Icon = config.icon
                return (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${!n.read_at ? 'bg-gray-800/20' : ''}`}
                  >
                    <div className={`rounded-lg p-1.5 ${config.bg} mt-0.5`}>
                      <Icon size={12} className={config.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-relaxed ${!n.read_at ? 'text-gray-200' : 'text-gray-400'}`}>
                        {n.message || n.title}
                      </p>
                      <p className="text-[10px] text-gray-600 mt-0.5">
                        {n.created_at ? new Date(n.created_at).toLocaleString() : ''}
                      </p>
                    </div>
                    {!n.read_at && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleMarkRead(n.id) }}
                        className="shrink-0 rounded p-1 text-gray-600 hover:text-gray-300 hover:bg-gray-800"
                      >
                        <X size={10} />
                      </button>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
