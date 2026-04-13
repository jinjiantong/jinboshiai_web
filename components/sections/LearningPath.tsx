'use client'

import { motion } from 'framer-motion'
import { Zap, Brain, Rocket, Globe, Check } from 'lucide-react'

export default function LearningPath() {
  const steps = [
    {
      icon: Zap,
      title: '会用 AI 工具',
      description: '把 AI 变成日常效率神器',
      color: 'primary',
      items: [
        '主流大模型、文生图、AI 写作',
        '精准提示词（Prompt）',
        '工作/学习效率翻倍'
      ],
      result: '用 AI 解决 80% 基础问题'
    },
    {
      icon: Brain,
      title: '懂 AI 逻辑',
      description: '知道 AI 能做什么、不能做什么',
      color: 'secondary',
      items: [
        '大模型原理、RAG、Agent',
        '设计 AI 工作流',
        '判断需求可行性与技术路径'
      ],
      result: '能独立规划 AI 项目'
    },
    {
      icon: Rocket,
      title: '能做 AI 应用',
      description: '从零做出带 AI 能力的可演示产品',
      color: 'accent',
      items: [
        'AI 接口调用、低代码/AI IDE',
        '智能知识库、AI 绘图工具',
        '数据库 + 云存储、上线部署'
      ],
      result: '拥有 AI 应用作品集'
    },
    {
      icon: Globe,
      title: '用 AI 创造价值',
      description: '让 AI 真正落地、产生价值、影响行业',
      color: 'orange',
      items: [
        'AI 副业、企业解决方案',
        '独立产品、流程自动化',
        '想法→设计→开发→上线→迭代'
      ],
      result: '全流程闭环'
    }
  ]

  return (
    <section id="path" className="py-20 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-green-100 text-secondary rounded-full text-sm font-medium mb-4">
            学习路径
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            四步成为AI达人
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            科学的学习路径，循序渐进掌握AI技能
          </p>
        </div>

        {/* Learning Path Timeline */}
        <div className="relative">
          {/* Desktop Timeline Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2"></div>

          {/* Steps */}
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              const colorClasses: Record<string, { bg: string; text: string; lightBg: string }> = {
                primary: { bg: 'bg-primary', text: 'text-primary', lightBg: 'bg-blue-50' },
                secondary: { bg: 'bg-secondary', text: 'text-secondary', lightBg: 'bg-green-50' },
                accent: { bg: 'bg-accent', text: 'text-accent', lightBg: 'bg-purple-50' },
                orange: { bg: 'bg-orange-500', text: 'text-orange-600', lightBg: 'bg-orange-50' }
              }
              const colors = colorClasses[step.color]

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="bg-white rounded-2xl shadow-lg p-8 lg:pt-14 relative h-full flex flex-col">
                    {/* Step Number */}
                    <div className={`hidden xl:flex absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 ${colors.bg} text-white rounded-full items-center justify-center text-xl font-bold shadow-lg`}>
                      {index + 1}
                    </div>
                    <div className={`xl:hidden w-12 h-12 ${colors.bg} text-white rounded-full flex items-center justify-center text-xl font-bold mb-4`}>
                      {index + 1}
                    </div>

                    <div className={`w-16 h-16 ${colors.lightBg} rounded-xl flex items-center justify-center mb-5`}>
                      <Icon className={`w-8 h-8 ${colors.text}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{step.title}</h3>
                    <p className="text-slate-600 mb-5 text-base">{step.description}</p>
                    <ul className="space-y-3 text-sm text-slate-500 flex-grow">
                      {step.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <Check className="w-4 h-4 text-secondary mr-2 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 pt-5 border-t border-slate-100">
                      <span className={`text-sm font-medium ${colors.text} ${colors.lightBg} px-4 py-2 rounded-full`}>
                        成果：{step.result}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
