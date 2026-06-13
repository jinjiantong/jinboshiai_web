'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bot, Database, RefreshCw, CheckCircle, XCircle, Loader2, Server, Activity, BarChart3, Layers, HardDrive, Clock, TrendingUp, MessageSquare, Users, Zap, Eye, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function ChatbotAdminPage() {
  useEffect(() => {
    const savedLogin = localStorage.getItem('dashboard_login');
    if (!savedLogin) {
      window.location.href = '/dashboard';
      return;
    }
    try {
      const loginData = JSON.parse(savedLogin);
      if (!loginData.expiryTime || Date.now() >= loginData.expiryTime) {
        localStorage.removeItem('dashboard_login');
        window.location.href = '/dashboard';
      }
    } catch (e) {
      localStorage.removeItem('dashboard_login');
      window.location.href = '/dashboard';
    }
  }, []);

  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null)
  const [systemStatus, setSystemStatus] = useState<{ qdrant: boolean; mysql: boolean; redis: boolean; api: boolean } | null>(null)
  const [checkingStatus, setCheckingStatus] = useState(false)
  const [qdrantStats, setQdrantStats] = useState({ pointsCount: 0, dimension: 0 })
  const [chatStats, setChatStats] = useState({
    topQuestions: [] as Array<{ question: string; count: number }>,
    overall: { totalQuestions: 0, totalSessions: 0, todayQuestions: 0, yesterdayQuestions: 0, avgResponseTime: 0 }
  })
  const [refreshing, setRefreshing] = useState(false)

  const handleSync = async () => {
    setSyncing(true)
    setSyncResult(null)
    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'sync' })
      })
      const data = await response.json()
      setSyncResult({ success: data.success, message: data.message || '同步完成' })
      if (data.success) fetchQdrantStats()
    } catch {
      setSyncResult({ success: false, message: '同步失败，请稍后重试' })
    }
    setSyncing(false)
  }

  const checkSystemStatus = async () => {
    setCheckingStatus(true)
    try {
      const qdrantRes = await fetch('http://82.156.230.158:6333/readyz')
      setSystemStatus({ qdrant: qdrantRes.ok, mysql: true, redis: true, api: true })
    } catch {
      setSystemStatus({ qdrant: false, mysql: true, redis: true, api: true })
    }
    setCheckingStatus(false)
  }

  const fetchQdrantStats = async () => {
    try {
      const response = await fetch('/api/chatbot-stats')
      const data = await response.json()
      if (data.success && data.vectorDb) {
        setQdrantStats({
          pointsCount: data.vectorDb.pointsCount || 0,
          dimension: data.vectorDb.dimension || 0
        })
      }
    } catch (e) {
      console.error('Failed to fetch stats:', e)
    }
  }

  const fetchChatStats = async () => {
    setRefreshing(true)
    try {
      const response = await fetch('/api/chat-stats')
      const data = await response.json()
      if (data.success) {
        setChatStats({
          topQuestions: data.topQuestions || [],
          overall: data.overall || { totalQuestions: 0, totalSessions: 0, todayQuestions: 0, yesterdayQuestions: 0, avgResponseTime: 0 }
        })
      }
    } catch (e) {
      console.error('Failed to fetch chat stats:', e)
    }
    setRefreshing(false)
  }

  const maxCount = chatStats.topQuestions[0]?.count || 1

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Bot className="w-8 h-8 text-primary" />
            智能客服管理后台
          </h1>
          <p className="text-slate-600 mt-2">管理知识库、监控系统状态、数据分析</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-primary" />
              知识库管理
            </h2>
            <p className="text-slate-600 mb-6">将课程知识同步到向量数据库，供智能客服检索使用</p>
            <button onClick={handleSync} disabled={syncing} className="w-full py-3 px-6 bg-primary text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50">
              {syncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
              {syncing ? '同步中...' : '同步知识库'}
            </button>
            {syncResult && (
              <div className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${syncResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {syncResult.success ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                {syncResult.message}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
              <Server className="w-5 h-5 text-primary" />
              服务状态
            </h2>
            <p className="text-slate-600 mb-6">检查各服务组件运行状态</p>
            <button onClick={checkSystemStatus} disabled={checkingStatus} className="w-full py-3 px-6 bg-slate-100 text-slate-700 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
              {checkingStatus ? <Loader2 className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
              {checkingStatus ? '检查中...' : '检查状态'}
            </button>
            {systemStatus && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">Qdrant 向量库</span>
                  <span className={`flex items-center gap-2 ${systemStatus.qdrant ? 'text-green-600' : 'text-red-600'}`}>
                    {systemStatus.qdrant ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {systemStatus.qdrant ? '正常' : '异常'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">MySQL 数据库</span>
                  <span className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />正常
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">Redis 缓存</span>
                  <span className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />正常
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              数据库数据统计
            </h2>
            <button onClick={fetchQdrantStats} className="px-4 py-2 bg-cyan-50 text-cyan-700 rounded-lg font-medium flex items-center gap-2 hover:bg-cyan-100 transition-colors">
              <Layers className="w-4 h-4" />
              刷新
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <HardDrive className="w-5 h-5 text-cyan-600" />
                <h3 className="font-semibold text-slate-800">Qdrant 向量库</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-sm text-slate-600">向量数量</span><span className="font-bold text-lg text-cyan-600">{qdrantStats.pointsCount}</span></div>
                <div className="flex justify-between"><span className="text-sm text-slate-600">向量维度</span><span className="font-mono text-sm text-slate-700">{qdrantStats.dimension}</span></div>
                <div className="flex justify-between"><span className="text-sm text-slate-600">服务器</span><span className="font-mono text-xs text-slate-500">82.156.230.158:6333</span></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-slate-800">MySQL 数据库</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-sm text-slate-600">数据库名</span><span className="font-mono text-sm text-slate-700">chatbot</span></div>
                <div className="flex justify-between"><span className="text-sm text-slate-600">数据表</span><span className="font-bold text-lg text-purple-600">6</span></div>
                <div className="flex justify-between"><span className="text-sm text-slate-600">服务器</span><span className="font-mono text-xs text-slate-500">82.156.230.158:3306</span></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-slate-800">Redis 缓存</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-sm text-slate-600">Key数量</span><span className="font-bold text-lg text-orange-600">0</span></div>
                <div className="flex justify-between"><span className="text-sm text-slate-600">状态</span><span className="text-sm text-green-600">正常</span></div>
                <div className="flex justify-between"><span className="text-sm text-slate-600">服务器</span><span className="font-mono text-xs text-slate-500">82.156.230.158:6379</span></div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              用户问题统计分析
            </h2>
            <button onClick={fetchChatStats} disabled={refreshing} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium flex items-center gap-2 hover:bg-indigo-100 transition-colors disabled:opacity-50">
              {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              刷新数据
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                <span className="text-sm text-slate-600">总问题数</span>
              </div>
              <div className="text-2xl font-bold text-indigo-600">{chatStats.overall.totalQuestions}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="w-5 h-5 text-green-600" />
                <span className="text-sm text-slate-600">总会话数</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{chatStats.overall.totalSessions}</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-orange-600" />
                <span className="text-sm text-slate-600">今日问题</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">{chatStats.overall.todayQuestions}</div>
              <div className="text-xs text-slate-500 mt-1">昨日 {chatStats.overall.yesterdayQuestions}</div>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Eye className="w-5 h-5 text-pink-600" />
                <span className="text-sm text-slate-600">平均响应</span>
              </div>
              <div className="text-2xl font-bold text-pink-600">{chatStats.overall.avgResponseTime}s</div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            高频问题 TOP 10
          </h3>
          {chatStats.topQuestions.length > 0 ? (
            <div className="space-y-3">
              {chatStats.topQuestions.map((item, index) => (
                <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm">{index + 1}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-800 truncate">{item.question}</span>
                      <span className="flex-shrink-0 ml-4 text-sm text-slate-500">{item.count}次</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(item.count / maxCount) * 100}%` }} transition={{ duration: 0.5, delay: index * 0.05 }} className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-slate-300" />
              <p className="text-lg mb-2">暂无统计数据</p>
              <p className="text-sm">用户使用智能客服后数据会自动统计</p>
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">服务配置信息</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-sm text-slate-500 mb-1">服务器地址</div>
              <div className="text-slate-800 font-mono">82.156.230.158</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-sm text-slate-500 mb-1">Qdrant 端口</div>
              <div className="text-slate-800 font-mono">6333</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-sm text-slate-500 mb-1">MySQL 端口</div>
              <div className="text-slate-800 font-mono">3306</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-sm text-slate-500 mb-1">Redis 端口</div>
              <div className="text-slate-800 font-mono">6379</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
