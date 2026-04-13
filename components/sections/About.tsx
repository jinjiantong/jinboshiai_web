'use client'

import { motion } from 'framer-motion'
import { Users, Award, Clock, Target, Sparkles, Lightbulb, Heart, ArrowRight } from 'lucide-react'

export default function About() {
  const stats = [
    { icon: Clock, value: '10年+', label: '互联网从业者' },
    { icon: Users, value: '100%', label: '用心教学' },
    { icon: Award, value: '50+', label: '实战项目' },
    { icon: Target, value: '1000+', label: '学员成功转型' }
  ]

  const highlights = [
    {
      icon: Sparkles,
      title: '实战导向',
      description: '所有课程都围绕真实项目展开，学完就能用'
    },
    {
      icon: Lightbulb,
      title: '零基础友好',
      description: '无需编程基础，从入门到精通循序渐进'
    },
    {
      icon: Heart,
      title: '持续服务',
      description: '学习社群+答疑服务，陪伴式成长'
    }
  ]

  return (
    <section id="about" className="py-20 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-purple-100 text-accent rounded-full text-sm font-medium mb-4">
            关于我们
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            专注AI实战教育
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            让AI技能普惠大众，助力每个人借助AI提升效率、实现价值
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left - Brand Story */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">品牌简介</h3>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  金博士AI，专注零基础AI技能实战教学，深耕AI办公、AI视觉设计、AI音视频创作、AI编程、AI工作流五大核心赛道。
                </p>
                <p>
                  以实战落地为核心，助力每一位普通人快速掌握AI技能、搭建AI应用、实现AI价值变现，让AI不再是小众技术，而是人人可用的效率与成长工具。
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="text-xl font-bold text-slate-900 mb-4">品牌使命</h4>
                <p className="text-slate-600 leading-relaxed">
                  让AI技能普惠大众，让零基础小白也能轻松迈入AI时代；用专业实战的AI教学，破除技术门槛，助力每个人借助AI提升效率、实现价值、成就自我。
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="text-xl font-bold text-slate-900 mb-4">品牌愿景</h4>
                <p className="text-slate-600 leading-relaxed">
                  成为国内极具口碑的零基础AI实战教育标杆，打造一站式AI学习与落地平台；推动AI技能全民化，培养更多AI应用实战人才，用AI赋能个人成长、职场进阶与行业创新。
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right - Stats & Highlights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl shadow-md p-6 border border-slate-100 text-center"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                    <div className="text-slate-500 text-sm">{stat.label}</div>
                  </motion.div>
                )
              })}
            </div>

            {/* Highlights */}
            <div className="space-y-4">
              {highlights.map((highlight, index) => {
                const Icon = highlight.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl shadow-md p-6 border border-slate-100 flex items-start"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{highlight.title}</h4>
                      <p className="text-slate-600 text-sm">{highlight.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a
            href="#join"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl"
          >
            加入我们
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
