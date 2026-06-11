'use client'

import { motion } from 'framer-motion'
import { Bot, Sparkles, Database, Brain, Zap, MessageSquare, BarChart3, Users, Clock, CheckCircle, ArrowRight, Layers, Cpu } from 'lucide-react'

export default function CasesPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary" />
            金博士AI实验室企业案例
          </h1>
          <p className="text-slate-600 mt-2">基于金博士AI技术打造的智能应用案例展示</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-purple-600 p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">智能客服系统</h2>
                  <p className="text-white/80 mt-1">AI-Powered Customer Service</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">已上线</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">核心产品</span>
              </div>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">项目概述</h3>
              <p className="text-slate-600 mb-6">
                基于RAG技术打造的智能客服系统，为用户提供7x24小时的课程咨询和技术答疑服务。
                结合知识库向量检索和大语言模型对话能力，提供精准、高效的智能问答体验。
              </p>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">核心技术</h3>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                  <Brain className="w-5 h-5 text-primary" />
                  <span className="text-sm text-slate-700">RAG检索增强</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                  <Layers className="w-5 h-5 text-primary" />
                  <span className="text-sm text-slate-700">向量数据库</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                  <Cpu className="w-5 h-5 text-primary" />
                  <span className="text-sm text-slate-700">MiniMax大模型</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                  <Zap className="w-5 h-5 text-primary" />
                  <span className="text-sm text-slate-700">Redis缓存</span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">技术架构</h3>
              <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm">
                <div className="text-slate-400 mb-2">用户提问 → Redis缓存 → 向量库 → 大模型 → MySQL</div>
                <div className="grid grid-cols-5 gap-2 text-xs">
                  <div className="bg-slate-800 text-center py-2 rounded text-cyan-400">前端</div>
                  <div className="bg-slate-800 text-center py-2 rounded text-orange-400">缓存</div>
                  <div className="bg-slate-800 text-center py-2 rounded text-green-400">Qdrant</div>
                  <div className="bg-slate-800 text-center py-2 rounded text-purple-400">LLM</div>
                  <div className="bg-slate-800 text-center py-2 rounded text-blue-400">MySQL</div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-slate-800 mb-3 mt-6">性能指标</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl">
                  <div className="text-2xl font-bold text-cyan-600">99.7%</div>
                  <div className="text-xs text-slate-500 mt-1">响应速度提升</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">4s → 11ms</div>
                  <div className="text-xs text-slate-500 mt-1">缓存命中</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">10条</div>
                  <div className="text-xs text-slate-500 mt-1">核心知识库</div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-slate-800 mb-3 mt-6">功能特性</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-800">RAG智能检索</div>
                    <div className="text-sm text-slate-500">基于语义理解的精准回答</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-800">Redis缓存加速</div>
                    <div className="text-sm text-slate-500">重复问题响应&lt;20ms</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-800">MySQL持久化</div>
                    <div className="text-sm text-slate-500">对话记录统计分析</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-slate-800">后台管理</div>
                    <div className="text-sm text-slate-500">知识库同步、状态监控</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Users className="w-4 h-4" />
                      <span>金博士AI</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="w-4 h-4" />
                      <span>2026-06</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors">
                    查看详情
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-semibold text-slate-400 mb-2">更多案例</h3>
              <p className="text-slate-400">持续更新中...</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}