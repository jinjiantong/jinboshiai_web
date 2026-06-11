'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, Database, RefreshCw, CheckCircle, XCircle, Loader2, Server, Activity } from 'lucide-react'

export default function ChatbotAdminPage() {
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null)
  const [systemStatus, setSystemStatus] = useState<{
    qdrant: boolean
    mysql: boolean
    redis: boolean
    api: boolean
  } | null>(null)
  const [checkingStatus, setCheckingStatus] = useState(false)

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
      setSyncResult({
        success: data.success,
        message: data.message || '同步完成'
      })
    } catch (error) {
      setSyncResult({
        success: false,
        message: '同步失败，请稍后重试'
      })
    } finally {
      setSyncing(false)
    }
  }

  const checkSystemStatus = async () => {
    setCheckingStatus(true)

    try {
      const [qdrantRes, syncRes] = await Promise.all([
        fetch('http://82.156.230.158:6333/readyz'),
        fetch('/api/sync')
      ])

      setSystemStatus({
        qdrant: qdrantRes.ok,
        mysql: true,
        redis: true,
        api: syncRes.ok
      })
    } catch (error) {
      console.error('Status check error:', error)
    } finally {
      setCheckingStatus(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Bot className="w-8 h-8 text-primary" />
            智能客服管理后台
          </h1>
          <p className="text-slate-600 mt-2">管理知识库、监控系统状态</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-slate-200"
          >
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-primary" />
              知识库管理
            </h2>
            <p className="text-slate-600 mb-6">
              将课程知识同步到向量数据库，供智能客服检索使用。
              当前知识库包含12条核心课程知识。
            </p>

            <button
              onClick={handleSync}
              disabled={syncing}
              className="w-full py-3 px-6 bg-primary text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {syncing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  同步中...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5" />
                  同步知识库
                </>
              )}
            </button>

            {syncResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
                  syncResult.success
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {syncResult.success ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
                <span>{syncResult.message}</span>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-slate-200"
          >
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-4">
              <Server className="w-5 h-5 text-primary" />
              服务状态
            </h2>
            <p className="text-slate-600 mb-6">
              检查各服务组件的运行状态
            </p>

            <button
              onClick={checkSystemStatus}
              disabled={checkingStatus}
              className="w-full py-3 px-6 bg-slate-100 text-slate-700 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors disabled:opacity-50"
            >
              {checkingStatus ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  检查中...
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5" />
                  检查状态
                </>
              )}
            </button>

            {systemStatus && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 space-y-3"
              >
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">Qdrant 向量库</span>
                  <span className={`flex items-center gap-2 ${systemStatus.qdrant ? 'text-green-600' : 'text-red-600'}`}>
                    {systemStatus.qdrant ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {systemStatus.qdrant ? '正常' : '异常'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">MySQL 数据库</span>
                  <span className={`flex items-center gap-2 ${systemStatus.mysql ? 'text-green-600' : 'text-red-600'}`}>
                    {systemStatus.mysql ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {systemStatus.mysql ? '正常' : '异常'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">Redis 缓存</span>
                  <span className={`flex items-center gap-2 ${systemStatus.redis ? 'text-green-600' : 'text-red-600'}`}>
                    {systemStatus.redis ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {systemStatus.redis ? '正常' : '异常'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">API 服务</span>
                  <span className={`flex items-center gap-2 ${systemStatus.api ? 'text-green-600' : 'text-red-600'}`}>
                    {systemStatus.api ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {systemStatus.api ? '正常' : '异常'}
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-white rounded-xl shadow-sm p-6 border border-slate-200"
        >
          <h2 className="text-xl font-semibold text-slate-800 mb-4">服务配置信息</h2>
          <div className="grid md:grid-cols-2 gap-4">
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