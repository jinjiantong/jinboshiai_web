'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Send, ArrowRight, MessageCircle, Users, BookOpen, HelpCircle } from 'lucide-react'

export default function Contact() {
  const services = [
    { icon: MessageCircle, title: '企业咨询', description: 'AI转型解决方案' },
    { icon: BookOpen, title: 'AI教学', description: '零基础实战培训' },
    { icon: Users, title: '公益演讲', description: 'AI知识普及分享' },
    { icon: HelpCircle, title: '答疑交流', description: '技术问题解答' }
  ]

  return (
    <section id="join" className="py-20 lg:py-32 bg-gradient-to-br from-primary to-primary-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium mb-4">
            联系我们
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            加入金博士AI，成为AI达人
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            开启您的AI学习之旅，让AI成为您的职场利器
          </p>
        </div>

        <div className="flex justify-center">
          {/* Services & Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full max-w-4xl"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-2xl font-bold text-slate-900 mb-6"
              >
                我们能做什么？
              </motion.h3>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {services.map((service, index) => {
                  const Icon = service.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-slate-50 rounded-xl p-5 border border-slate-100 hover:shadow-md transition-shadow"
                    >
                      <motion.div 
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                        className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3"
                      >
                        <Icon className="w-5 h-5 text-primary" />
                      </motion.div>
                      <h4 className="font-semibold text-slate-900 mb-1">{service.title}</h4>
                      <p className="text-sm text-slate-600">{service.description}</p>
                    </motion.div>
                  )
                })}
              </div>

              <motion.h4 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-xl font-bold text-slate-900 mb-4"
              >
                联系方式
              </motion.h4>
              <ul className="space-y-4">
                {[
                  { icon: Phone, label: '电话', value: '15811055744' },
                  { icon: Mail, label: '邮箱', value: '26256649@qq.com' },
                  { icon: MapPin, label: '地址', value: 'XXXXX' }
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      viewport={{ once: true }}
                      className="flex items-center gap-4"
                    >
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">{item.label}</p>
                        <p className="font-semibold text-slate-900">{item.value}</p>
                      </div>
                    </motion.li>
                  )
                })}
              </ul>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="mt-8 bg-primary/5 rounded-xl p-6 border border-primary/10"
              >
                <h4 className="font-semibold text-slate-900 mb-3">欢迎咨询</h4>
                <p className="text-slate-600 text-sm mb-4">
                  微信：jinboshi-ai
                </p>
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ duration: 0.2 }}
                  className="w-24 h-24 bg-slate-200 rounded-lg flex items-center justify-center mx-auto"
                >
                  <p className="text-slate-400 text-xs">二维码占位</p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
