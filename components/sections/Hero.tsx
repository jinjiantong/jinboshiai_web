'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Brain, Sparkles, Zap, Code, Award, Users, TrendingUp } from 'lucide-react'

export default function Hero() {
  const features = [
    { icon: Brain, title: 'AI技能培训', description: '零基础入门，快速掌握AI核心技能' },
    { icon: Sparkles, title: '实战项目', description: '真实项目驱动，边学边做' },
    { icon: Zap, title: '效率提升', description: '10分钟完成以往1小时工作' },
    { icon: Code, title: '应用开发', description: '从工具到应用的完整链路' },
  ]

  const stats = [
    { value: '500+', label: '学员培训', icon: Users },
    { value: '30+', label: '企业培训', icon: TrendingUp },
    { value: '95%', label: '满意度', icon: Award },
  ]

  const services = [
    '北京顺义AI培训',
    'AI编程培训',
    '企业AI内训',
    '企业AI咨询',
    'AI落地指导',
    'AI应用培训',
  ]

  return (
    <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 左侧文本 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              🔥 2026全新AI培训课程 | 北京顺义AI培训专家
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              零基础<span className="text-primary">AI人工智能</span>培训
            </h1>
            <p className="text-lg text-slate-600 mb-4 max-w-lg mx-auto lg:mx-0">
              金博士AI实战训练营，手把手教你掌握人工智能核心技能，从零基础到项目实战，开启AI时代的职业新篇章。
            </p>
            <p className="text-base text-slate-500 mb-6 max-w-lg mx-auto lg:mx-0">
              专注<span className="font-semibold text-slate-700">AI编程培训、企业AI培训、企业AI咨询、AI应用培训</span>，提供从培训到落地的全流程服务。
            </p>
            
            {/* 服务标签 */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center lg:justify-start">
              {services.map((service) => (
                <span 
                  key={service}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm"
                >
                  {service}
                </span>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link 
                href="#courses"
                className="bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
              >
                开始学习
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="#portfolio"
                className="border border-slate-300 text-slate-700 px-8 py-4 rounded-full font-medium hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                查看作品
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* 数据统计 */}
            <div className="grid grid-cols-3 gap-4 mt-10 pt-6 border-t border-slate-200">
              {stats.map(({ value, label, icon: Icon }) => (
                <div key={label} className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-primary">{value}</div>
                  <div className="text-sm text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 右侧特性 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="grid grid-cols-2 gap-6">
              {features.map(({ icon: Icon, title, description }, index) => (
                <motion.div 
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-slate-100"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{title}</h3>
                  <p className="text-slate-600 text-sm">{description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* 背景装饰 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>
    </section>
  )
}
