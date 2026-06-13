'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LogOut, User, GraduationCap, BookOpen, ClipboardList, Users, Clock, FileText, Bot, Sparkles } from 'lucide-react'

export default function Dashboard() {
  const [userInfo, setUserInfo] = useState({ name: '', type: '' })
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    totalHomework: 0,
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setUserInfo({
      name: params.get('name') || '用户',
      type: params.get('type') || '',
    })

    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.data)
        }
      })
  }, [])

  const handleLogout = () => {
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">
                <span className="text-primary">金博士</span>AI
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
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
        </div>
      </main>
    </div>
  )
}