import { useState, useRef, useEffect } from 'react'
import {
  Sparkles, Send, Loader2, Lightbulb, RotateCcw, Copy, Check,
} from 'lucide-react'
import GlassCard from '../components/GlassCard'
import AiBadge from '../components/AiBadge'
import { aiChat, aiAuditReadiness, aiGapRecommendations } from '../lib/api'

const QUICK_ACTIONS = [
  { label: 'Explain ISO 27001 controls', prompt: 'Explain the key ISO 27001:2022 Annex A controls and their themes. What should I focus on first?' },
  { label: 'Draft a policy', prompt: 'Help me draft an Information Security Policy that meets ISO 27001 requirements.' },
  { label: 'Risk assessment guidance', prompt: 'Walk me through the ISO 27001 risk assessment process. What methodology should I use?' },
  { label: 'Audit preparation', prompt: 'What do I need to prepare for an ISO 27001 certification audit? Give me a comprehensive checklist.' },
  { label: 'Evidence requirements', prompt: 'What evidence do I need to collect for ISO 27001 compliance? List the key documents and records.' },
  { label: 'Gap analysis tips', prompt: 'How should I conduct a gap analysis for ISO 27001? What are common gaps organizations face?' },
]

function MessageContent({ content }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="group relative">
      <div className="text-sm leading-relaxed whitespace-pre-line">{content}</div>
      <button
        onClick={handleCopy}
        className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 rounded p-1 text-gray-600 hover:text-gray-300 hover:bg-gray-700/50 transition-all"
      >
        {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
      </button>
    </div>
  )
}

export default function AiAssistant() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [readinessData, setReadinessData] = useState(null)
  const [gapRecs, setGapRecs] = useState(null)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  useEffect(() => {
    Promise.all([
      aiAuditReadiness().catch(() => null),
      aiGapRecommendations().catch(() => null),
    ]).then(([readiness, gaps]) => {
      if (readiness?.data) setReadinessData(readiness.data)
      if (gaps?.data) setGapRecs(gaps.data)
    })
  }, [])

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return
    const userMsg = text.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMsg, timestamp: new Date() }])
    setLoading(true)

    try {
      const res = await aiChat(userMsg, { page: 'ai_assistant' })
      const reply = res.data?.message || res.data?.response || res.data?.content
        || 'I can help with that. Based on ISO 27001:2022 requirements, here are my recommendations...'
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
        suggestions: res.data?.suggestions,
      }])
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble processing that request right now. Please try again in a moment.',
        timestamp: new Date(),
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleQuickAction = (prompt) => {
    sendMessage(prompt)
  }

  const clearConversation = () => {
    setMessages([])
  }

  const readinessScore = readinessData?.readiness_score ?? readinessData?.score
  const recommendations = gapRecs?.recommendations || gapRecs?.gaps || []

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-6 animate-fade-in">
      {/* Main chat area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-accent glow-sm">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">AI Compliance Assistant</h1>
                <AiBadge label="Powered by AI" size="md" />
              </div>
              <p className="text-xs text-gray-500">Expert guidance for ISO 27001:2022 certification</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearConversation}
              className="flex items-center gap-1.5 rounded-lg border border-gray-800 px-3 py-1.5 text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 transition-colors"
            >
              <RotateCcw size={12} />
              Clear
            </button>
          )}
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto rounded-xl border border-gray-800/50 bg-gray-950/50 p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center">
              <div className="animate-float mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl gradient-accent glow-md">
                  <Sparkles size={36} className="text-white" />
                </div>
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">How can I help with your certification?</h2>
              <p className="text-sm text-gray-500 mb-8 max-w-md text-center">
                I can help you understand ISO 27001 requirements, draft policies, assess risks, prepare for audits, and more.
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 max-w-3xl w-full">
                {QUICK_ACTIONS.map(({ label, prompt }) => (
                  <button
                    key={label}
                    onClick={() => handleQuickAction(prompt)}
                    className="flex items-center gap-3 rounded-xl border border-gray-800/50 bg-gray-900/50 p-3 text-left transition-all hover:bg-gray-800/50 hover:border-gray-700 group"
                  >
                    <div className="rounded-lg bg-gray-800/50 p-2 group-hover:bg-emerald-500/10 transition-colors">
                      <Lightbulb size={14} className="text-gray-500 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <span className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-message flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`shrink-0 mt-1 flex h-7 w-7 items-center justify-center rounded-lg ${
                    msg.role === 'user' ? 'bg-emerald-500/20' : 'gradient-accent'
                  }`}>
                    {msg.role === 'user' ? (
                      <span className="text-xs font-bold text-emerald-400">You</span>
                    ) : (
                      <Sparkles size={12} className="text-white" />
                    )}
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-emerald-600/90 text-white rounded-tr-md'
                        : 'bg-gray-800/80 text-gray-300 rounded-tl-md border border-gray-700/50'
                    }`}
                  >
                    <MessageContent content={msg.content} />
                    <p className={`mt-2 text-[10px] ${msg.role === 'user' ? 'text-emerald-200/60' : 'text-gray-600'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {msg.suggestions.map((s, j) => (
                          <button
                            key={j}
                            onClick={() => sendMessage(s)}
                            className="rounded-full border border-gray-700/50 bg-gray-900/50 px-2.5 py-1 text-[10px] text-gray-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-1 flex h-7 w-7 items-center justify-center rounded-lg gradient-accent">
                  <Sparkles size={12} className="text-white" />
                </div>
                <div className="rounded-2xl rounded-tl-md bg-gray-800/80 border border-gray-700/50 px-4 py-3">
                  <div className="typing-dots">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="mt-3 flex items-center gap-3">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about ISO 27001 compliance, policies, controls, risks..."
              className="w-full rounded-xl border border-gray-800 bg-gray-900/80 px-4 py-3 pr-12 text-sm text-gray-200 placeholder-gray-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg gradient-accent text-white disabled:opacity-30 transition-opacity"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            </button>
          </div>
        </form>
      </div>

      {/* Sidebar */}
      <div className="hidden xl:flex xl:w-72 xl:flex-col xl:gap-4">
        {/* Audit readiness */}
        <GlassCard className="animate-fade-in">
          <h3 className="mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Audit Readiness</h3>
          {readinessScore != null ? (
            <div className="text-center">
              <div className="relative mx-auto mb-3">
                <svg width="100" height="100" className="transform -rotate-90">
                  <circle cx="50" cy="50" r="40" stroke="#1f2937" strokeWidth="8" fill="none" />
                  <circle
                    cx="50" cy="50" r="40"
                    stroke={readinessScore >= 80 ? '#10b981' : readinessScore >= 50 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (readinessScore / 100) * 251.2}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-white">{readinessScore}%</span>
                  <span className="text-[9px] text-gray-500">Ready</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {readinessScore >= 80 ? 'Looking good for audit!' : readinessScore >= 50 ? 'Making progress' : 'Needs attention'}
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="shimmer h-20 w-20 mx-auto rounded-full mb-2" />
              <p className="text-xs text-gray-600">Analyzing readiness...</p>
            </div>
          )}
        </GlassCard>

        {/* AI recommendations */}
        <GlassCard className="flex-1 overflow-hidden animate-fade-in delay-100">
          <h3 className="mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Recommendations</h3>
          {recommendations.length > 0 ? (
            <div className="space-y-2 overflow-y-auto max-h-64">
              {recommendations.slice(0, 5).map((rec, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(`Tell me more about: ${rec.title || rec.description || rec}`)}
                  className="w-full rounded-lg bg-gray-800/50 p-3 text-left hover:bg-gray-800 transition-colors group"
                >
                  <p className="text-xs text-gray-300 group-hover:text-emerald-400 transition-colors line-clamp-2">
                    {rec.title || rec.description || rec}
                  </p>
                  {rec.priority && (
                    <span className={`mt-1 inline-block text-[9px] font-medium uppercase ${
                      rec.priority === 'high' ? 'text-red-400' : rec.priority === 'medium' ? 'text-amber-400' : 'text-gray-500'
                    }`}>
                      {rec.priority} priority
                    </span>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="shimmer h-14 rounded-lg bg-gray-800/30" />
              ))}
            </div>
          )}
        </GlassCard>

        {/* Contextual tips */}
        <GlassCard className="animate-fade-in delay-200">
          <h3 className="mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Quick Tips</h3>
          <div className="space-y-2 text-[11px] text-gray-500">
            <p>Ask me to draft a specific policy for your organization.</p>
            <p>I can review your evidence and suggest improvements.</p>
            <p>Request a step-by-step certification roadmap.</p>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
