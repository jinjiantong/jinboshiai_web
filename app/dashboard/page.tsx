'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LogOut, User, GraduationCap, BookOpen, ClipboardList, Users, Clock, FileText, Bot, Sparkles, X, Building2 } from 'lucide-react'

interface ClassOption {
  id: string
  name: string
}

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState({ name: '', type: '' })
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [loginType, setLoginType] = useState<'teacher' | 'student'>('teacher')
  const [username, setUsername] = useState('')
  const [classId, setClassId] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [classError, setClassError] = useState('')
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    totalHomework: 0,
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const name = params.get('name')
    const type = params.get('type')

    // 先获取统计数据（无论是否登录都需要）
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.data)
        }
      })

    // 检查本地存储的登录状态
    const savedLogin = localStorage.getItem('dashboard_login')
    if (savedLogin) {
      try {
        const loginData = JSON.parse(savedLogin)
        const expiryTime = loginData.expiryTime
        const now = Date.now()

        if (expiryTime && now < expiryTime) {
          setUserInfo({ name: loginData.name, type: loginData.type })
          setIsLoginModalOpen(false)
          return
        } else {
          localStorage.removeItem('dashboard_login')
        }
      } catch (e) {
        localStorage.removeItem('dashboard_login')
      }
    }

    if (name && type) {
      setUserInfo({ name, type })
      setIsLoginModalOpen(false)
    } else {
      setIsLoginModalOpen(true)
    }

    fetch('/api/classes')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setClasses(data.data)
          setClassError('')
        } else {
          setClassError(data.message || '获取班级列表失败')
        }
      })
      .catch(err => {
        console.error('Failed to fetch classes:', err)
        setClassError('获取班级列表失败，请刷新页面')
      })
  }, [])

  useEffect(() => {
    if (isLoginModalOpen && loginType === 'student') {
      setClassError('')
      fetch('/api/classes')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setClasses(data.data)
            setClassError('')
          } else {
            setClassError(data.message || '获取班级列表失败')
          }
        })
        .catch(err => {
          console.error('Failed to fetch classes:', err)
          setClassError('获取班级列表失败，请刷新页面')
        })
    }
  }, [isLoginModalOpen, loginType])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    setMessage('')

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
          const userType = loginType === 'teacher' ? 'teacher' : 'student'
          const loginData = {
            name: username,
            type: userType,
            expiryTime: Date.now() + 48 * 60 * 60 * 1000
          }
          localStorage.setItem('dashboard_login', JSON.stringify(loginData))
          setUserInfo({
            name: username,
            type: userType
          })
          setIsLoginModalOpen(false)
          setUsername('')
          setClassId('')
          setMessage('')
        }, 1500)
      } else {
        setMessageType('error')
        setMessage(data.message)
      }
    } catch (error) {
      setMessageType('error')
      setMessage('登录失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setUserInfo({ name: '', type: '' })
    setIsLoginModalOpen(true)
    setUsername('')
    setClassId('')
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 登录弹窗 */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">后台登录</h2>
              <button
                onClick={() => window.location.href = '/'}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => {
                    setLoginType('teacher')
                    setMessage('')
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-colors ${
                    loginType === 'teacher'
                      ? 'bg-white shadow text-blue-600'
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
                      ? 'bg-white shadow text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <User className="w-5 h-5" />
                  学员登录
                </button>
              </div>

              {message && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${
                  messageType === 'success'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleLogin}>
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
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

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
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all appearance-none bg-white"
                        required
                      >
                        <option value="">请选择班级</option>
                        {classes.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name}
                          </option>
                        ))}
                      </select>
                      {classError && (
                        <p className="mt-2 text-sm text-red-600">{classError}</p>
                      )}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '登录中...' : '登录'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">
                <span className="text-blue-600">金博士</span>AI
              </span>
              <span className="text-gray-500 text-sm">后台管理</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                {userInfo.type === 'teacher' ? (
                  <GraduationCap className="w-5 h-5" />
                ) : (
                  <User className="w-5 h-5" />
                )}
                <span>欢迎, {userInfo.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
              >
                <LogOut className="w-4 h-4" />
                退出登录
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userInfo.type !== 'student' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">总学员数</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">总班级数</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalClasses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">作业总数</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalHomework}</p>
              </div>
            </div>
          </div>
        </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {userInfo.type === 'student' ? (
            <Link href={`/assignment?name=${encodeURIComponent(userInfo.name)}&type=${encodeURIComponent(userInfo.type)}`} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition-shadow hover:border-primary/30 group block">
              <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-50 transition-colors">
                <ClipboardList className="w-7 h-7 text-orange-600 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">作业管理系统</h3>
              <p className="text-sm text-gray-500">管理学生作业</p>
            </Link>
          ) : (
            <>
          <Link href={`/course?name=${encodeURIComponent(userInfo.name)}&type=${encodeURIComponent(userInfo.type)}`} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition-shadow hover:border-primary/30 group block">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-50 transition-colors">
              <BookOpen className="w-7 h-7 text-green-600 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">课件系统</h3>
            <p className="text-sm text-gray-500">管理课程课件资料</p>
          </Link>

          <Link href="/student-management" target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition-shadow hover:border-primary/30 group block">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
              <Users className="w-7 h-7 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">学生管理系统</h3>
            <p className="text-sm text-gray-500">管理学员信息</p>
          </Link>

          <Link href={`/assignment?name=${encodeURIComponent(userInfo.name)}&type=${encodeURIComponent(userInfo.type)}`} target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition-shadow hover:border-primary/30 group block">
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-50 transition-colors">
              <ClipboardList className="w-7 h-7 text-orange-600 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">作业管理系统</h3>
            <p className="text-sm text-gray-500">管理学生作业</p>
          </Link>

          <Link href="/class-management" target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition-shadow hover:border-primary/30 group block">
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-50 transition-colors">
              <Clock className="w-7 h-7 text-purple-600 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">上课管理系统</h3>
            <p className="text-sm text-gray-500">管理上课安排</p>
          </Link>

          <Link href="/admin/chatbot" target="_blank" rel="noopener noreferrer" className="bg-white rounded-xl shadow-sm p-6 border hover:shadow-md transition-shadow hover:border-primary/30 group block">
            <div className="w-14 h-14 bg-cyan-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-50 transition-colors">
              <Bot className="w-7 h-7 text-cyan-600 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">智能客服管理</h3>
            <p className="text-sm text-gray-500">管理知识库和同步</p>
          </Link>

          <Link href="/admin/cases" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-br from-primary/5 to-purple-50 rounded-xl shadow-sm p-6 border hover:shadow-md transition-shadow hover:border-primary/30 group block">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">实验室企业案例</h3>
            <p className="text-sm text-gray-500">金博士AI技术案例展示</p>
          </Link>
            </>
          )}
        </div>
      </main>
    </div>
  )
}