'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, X, Loader2, MessageCircle, ChevronDown, ThumbsUp, ThumbsDown } from 'lucide-react'
import Link from 'next/link'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isLiked?: boolean
  isDisliked?: boolean
}

const quickReplies = [
  { text: '课程咨询', query: '我想了解课程内容' },
  { text: '价格优惠', query: '课程怎么收费' },
  { text: '报名学习', query: '如何报名学习' },
  { text: '学习帮助', query: '零基础能学吗' }
]

const defaultGreeting = `您好！👋 我是金博士AI智能助手

很高兴为您服务！我可以帮您：
• 介绍课程内容和学习路径
• 解答AI工具使用问题
• 提供报名咨询和优惠信息

请问有什么可以帮助您的？`

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const path = window.location.pathname
    if (path.startsWith('/dashboard') || path.startsWith('/class-management') ||
        path.startsWith('/student-management') || path.startsWith('/assignment') ||
        path.startsWith('/admin')) {
      setIsVisible(false)
    } else {
      setIsVisible(true)
    }
  }, [])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'greeting',
        role: 'assistant',
        content: defaultGreeting,
        timestamp: new Date()
      }])
    }
  }, [isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim()
    if (!text || loading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          sessionId: sessionId || 'web-session-' + Date.now(),
          history: messages.slice(-10)
        })
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || '抱歉，服务暂时不可用，请稍后再试。',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId)
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，网络连接出现问题，请检查网络后重试。',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleQuickReply = (query: string) => {
    handleSend(query)
  }

  const handleFeedback = (messageId: string, isHelpful: boolean) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          isLiked: isHelpful ? true : undefined,
          isDisliked: !isHelpful ? true : undefined
        }
      }
      return msg
    }))
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }

  if (!isVisible) return null

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full shadow-2xl flex items-center justify-center hover:shadow-3xl transition-all z-50 group"
        style={{ boxShadow: '0 10px 40px rgba(37, 99, 235, 0.4)' }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-7 h-7 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageCircle className="w-7 h-7 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute -top-12 right-0 bg-slate-800 text-white px-3 py-1.5 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          {isOpen ? '关闭客服' : '在线咨询'}
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 w-[380px] h-[580px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 border border-slate-200"
            style={{ maxHeight: 'calc(100vh - 140px)' }}
          >
            <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-5 flex items-center gap-4 flex-shrink-0">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Bot className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">金博士AI助手</h3>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-white/90">在线服务中</span>
                </div>
              </div>
              <Link
                href="tel:15811055744"
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
                title="电话咨询"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-br from-primary to-blue-600' 
                        : 'bg-white border border-slate-200 shadow-sm'
                    }`}>
                      {msg.role === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-primary" />
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <div className={`px-4 py-3 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-primary to-blue-600 text-white rounded-tr-md'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-md shadow-sm'
                      }`}>
                        <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{msg.content}</p>
                      </div>

                      <div className={`flex items-center gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs text-slate-400">{formatTime(msg.timestamp)}</span>

                        {msg.role === 'assistant' && index > 0 && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleFeedback(msg.id, true)}
                              disabled={msg.isLiked !== undefined}
                              className={`p-1 rounded transition-colors ${
                                msg.isLiked 
                                  ? 'text-green-500 bg-green-50' 
                                  : 'text-slate-400 hover:text-green-500 hover:bg-green-50'
                              }`}
                              title="有帮助"
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleFeedback(msg.id, false)}
                              disabled={msg.isDisliked !== undefined}
                              className={`p-1 rounded transition-colors ${
                                msg.isDisliked 
                                  ? 'text-red-500 bg-red-50' 
                                  : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
                              }`}
                              title="没帮助"
                            >
                              <ThumbsDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                      <Bot className="w-5 h-5 text-primary" />
                    </div>
                    <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-md shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-sm text-slate-500">AI正在思考...</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {!loading && messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap gap-2 justify-center mt-4"
                >
                  {quickReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickReply(reply.query)}
                      className="px-4 py-2 bg-white border border-primary/30 text-primary rounded-full text-sm hover:bg-primary hover:text-white transition-all hover:shadow-md"
                    >
                      {reply.text}
                    </button>
                  ))}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-slate-200 flex-shrink-0">
              <div className="flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                  placeholder="输入您的问题..."
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-slate-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 text-slate-800 placeholder-slate-400 transition-all"
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 text-white rounded-xl flex items-center justify-center hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)' }}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </motion.button>
              </div>

              <div className="flex items-center justify-center gap-2 mt-3 text-xs text-slate-400">
                <Bot className="w-3.5 h-3.5" />
                <span>AI辅助回答，如需帮助请联系 15811055744</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
