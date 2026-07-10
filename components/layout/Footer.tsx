'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone, Mail, MapPin, X, Eye, EyeOff, User, GraduationCap, Building2 } from 'lucide-react'
import PrivacyModal from '@/components/PrivacyModal'
import TermsModal from '@/components/TermsModal'

interface ClassOption {
  id: string
  name: string
}

export default function Footer() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [loginType, setLoginType] = useState<'teacher' | 'student'>('teacher')
  const [username, setUsername] = useState('')
  const [classId, setClassId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false)
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)

  const navLinks = [
    { name: '作品展示', href: '#portfolio' },
    { name: '课程体系', href: '#courses' },
    { name: '关于我们', href: '#about' },
    { name: '联系我们', href: '#join' },
  ]

  useEffect(() => {
    fetch('/api/classes')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setClasses(data.data)
        }
      })
      .catch(err => console.error('Failed to fetch classes:', err))
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    // 在用户点击的同步上下文中立即打开空白窗口，避免被浏览器拦截
    let newWindow: Window | null = null
    try {
      newWindow = window.open('', '_blank')
    } catch (err) {
      console.warn('无法打开新窗口:', err)
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: loginType,
          username,
          classId: loginType === 'student' ? classId : undefined,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMessageType('success')
        setMessage(data.message)
        setTimeout(() => {
          setIsLoginModalOpen(false)
          setUsername('')
          setClassId('')
          setMessage('')
          const userType = loginType === 'teacher' ? 'teacher' : 'student'
          const dashboardUrl = `/dashboard?name=${encodeURIComponent(username)}&type=${userType}`
          
          // 使用之前打开的窗口，如果打开失败则在当前窗口跳转
          if (newWindow) {
            newWindow.location.href = dashboardUrl
          } else {
            window.location.href = dashboardUrl
          }
        }, 1500)
      } else {
        // 登录失败，关闭之前打开的空白窗口
        if (newWindow) {
          newWindow.close()
        }
        setMessageType('error')
        setMessage(data.message)
      }
    } catch (error) {
      // 出现错误，关闭之前打开的空白窗口
      if (newWindow) {
        newWindow.close()
      }
      setMessageType('error')
      setMessage('登录失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setIsLoginModalOpen(false)
    setMessage('')
    setUsername('')
    setClassId('')
  }

  return (
    <>
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* 品牌信息 */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl font-bold text-white">金博士AI</span>
              </div>
              <p className="text-slate-400 mb-6 leading-relaxed">
                专注零基础AI技能实战教学，让AI不再是小众技术，而是人人可用的效率与成长工具。
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                  aria-label="微信"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.269-.03-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                  aria-label="微博"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10.098 20.323c-3.977.391-7.414-1.406-7.672-4.02-.259-2.609 2.759-5.047 6.74-5.441 3.979-.394 7.413 1.404 7.671 4.018.259 2.6-2.759 5.049-6.737 5.439l-.002.004zM9.05 17.219c-.384.616-1.208.884-1.829.602-.612-.279-.793-.991-.406-1.593.379-.595 1.176-.861 1.793-.601.622.263.82.972.442 1.592zm1.27-1.627c-.141.237-.449.353-.689.253-.236-.09-.313-.361-.177-.586.138-.227.436-.346.672-.24.239.09.315.36.18.573h.014zm.176-2.719c-1.893-.493-4.033.45-4.857 2.118-.836 1.704-.026 3.591 1.886 4.21 1.983.64 4.318-.341 5.132-2.179.8-1.793-.201-3.642-2.161-4.149zm7.563-1.224c-.346-.105-.579-.18-.405-.649.375-1.018.42-1.896.008-2.521-.781-1.188-2.924-1.123-5.382-.032 0 0-.768.334-.571-.271.381-1.204.324-2.212-.27-2.793-1.35-1.33-4.945.047-8.028 3.079C1.116 10.641 0 12.792 0 14.667c0 3.589 4.613 5.773 9.127 5.773 5.916 0 9.856-3.44 9.856-6.175 0-1.649-1.389-2.583-2.894-3.016zM21.466 6.088c-1.043-1.187-2.59-1.842-4.354-1.842-.552 0-1.001.448-1.001 1s.449 1 1.001 1c1.168 0 2.183.43 2.858 1.212.675.781.96 1.803.803 2.877-.073.549.318 1.053.867 1.126.549.073 1.053-.318 1.126-.867.227-1.69-.194-3.251-1.3-4.506zM18.112 7.112c-.552 0-1 .448-1 1s.448 1 1 1c.404 0 .75.146.99.418.241.272.349.63.304 1.008-.055.548.346 1.041.894 1.096.548.055 1.041-.346 1.096-.894.092-.896-.196-1.77-.801-2.454-.605-.684-1.478-1.074-2.483-1.074z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                  aria-label="抖音"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* 快速链接 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">快速链接</h3>
              <ul className="space-y-3">
                {navLinks.map(({ name, href }) => (
                  <li key={name}>
                    <Link
                      href={href}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      {name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    后台管理
                  </Link>
                </li>
              </ul>
            </div>

            {/* 联系信息 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">联系我们</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                  <div className="text-slate-400">
                    <div>13051202991</div>
                    <div>微信：jinboshiai</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                  <span className="text-slate-400">北京市顺义区临空经济核心区安庆大街7号良基科技广场A座316室</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                  <span className="text-slate-400">https://jinboshiai.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-500 text-sm text-center md:text-left">
              <p>© 2026 金博士AI. All rights reserved.</p>
              <p className="mt-1">吉ICP备2024020391号</p>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button onClick={() => setIsPrivacyModalOpen(true)} className="text-slate-500 hover:text-white text-sm transition-colors">
                隐私政策
              </button>
              <button onClick={() => setIsTermsModalOpen(true)} className="text-slate-500 hover:text-white text-sm transition-colors">
                服务条款
              </button>
              <Link href="#" className="text-slate-500 hover:text-white text-sm transition-colors">
                网站地图
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* 登录弹窗 */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">后台登录</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* 登录类型切换 */}
              <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => {
                    setLoginType('teacher')
                    setMessage('')
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-colors ${
                    loginType === 'teacher'
                      ? 'bg-white shadow text-primary'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <GraduationCap className="w-5 h-5" />
                  老师登录
                </button>
                <button
                  onClick={() => {
                    setLoginType('student')
                    setClassId('')
                    setMessage('')
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-colors ${
                    loginType === 'student'
                      ? 'bg-white shadow text-primary'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <User className="w-5 h-5" />
                  学员登录
                </button>
              </div>

              {/* 消息提示 */}
              {message && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${
                  messageType === 'success'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {message}
                </div>
              )}

              {/* 登录表单 */}
              <form onSubmit={handleLogin}>
                {/* 用户名 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    用户名
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={loginType === 'teacher' ? '请输入老师姓名' : '请输入学员姓名'}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {/* 班级选择（仅学员登录） */}
                {loginType === 'student' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      所属班级
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        value={classId}
                        onChange={(e) => setClassId(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all appearance-none bg-white"
                        required
                      >
                        <option value="">请选择班级</option>
                        {classes.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* 登录按钮 */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/80 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '登录中...' : '登录'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      <PrivacyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
      <TermsModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />
    </>
  )
}
