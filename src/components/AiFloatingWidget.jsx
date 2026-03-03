import { useState, useRef, useEffect } from 'react'
import { Sparkles, X, Send, Loader2, Minimize2, Maximize2 } from 'lucide-react'
import { aiChat } from '../lib/api'

export default function AiFloatingWidget() {
  const [open, setOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI compliance assistant. Ask me anything about ISO 27001 certification, controls, policies, or risk management.' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)
    try {
      const res = await aiChat(userMsg, { page: window.location.pathname })
      const reply = res.data?.message || res.data?.response || res.data?.content || 'I can help with that. Let me look into it.'
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'I\'m having trouble connecting right now. Please try again or visit the AI Assistant page for full features.' }])
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full
          gradient-accent shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30
          transition-all hover:scale-105 active:scale-95 animate-pulse-glow"
      >
        <Sparkles size={22} className="text-white" />
      </button>
    )
  }

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        minimized
          ? 'bottom-6 right-6 w-72 h-12'
          : 'bottom-6 right-6 w-96 h-[32rem]'
      }`}
    >
      <div className="flex h-full flex-col rounded-2xl border border-gray-800 bg-gray-950/95 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gradient-to-r from-emerald-500/10 to-transparent">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-accent">
              <Sparkles size={14} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">AI Assistant</p>
              <p className="text-[9px] text-gray-500">ISO 27001 Compliance</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMinimized(!minimized)}
              className="rounded p-1 text-gray-500 hover:text-gray-300 hover:bg-gray-800"
            >
              {minimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded p-1 text-gray-500 hover:text-gray-300 hover:bg-gray-800"
            >
              <X size={12} />
            </button>
          </div>
        </div>

        {!minimized && (
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`chat-message flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-emerald-600 text-white rounded-br-md'
                        : 'bg-gray-800 text-gray-300 rounded-bl-md'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-gray-800 px-4 py-3">
                    <div className="typing-dots">
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-800 px-3 py-2.5">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend() }}
                className="flex items-center gap-2"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about ISO 27001..."
                  className="flex-1 rounded-lg border border-gray-800 bg-gray-900 px-3 py-2 text-xs text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="flex h-8 w-8 items-center justify-center rounded-lg gradient-accent text-white disabled:opacity-40 transition-opacity"
                >
                  {loading ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
