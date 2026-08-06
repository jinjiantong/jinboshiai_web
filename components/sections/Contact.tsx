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
    <section id="join" className="py-20 lg:py-28 bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="section-badge justify-center mb-4">
            <span className="text-blue-400">Contact Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            面向学生、职场人、个体经营者，免费咨询服务开放
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            开启您的AI学习之旅，让AI成为您的职场利器
          </p>
        </div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="w-full max-w-4xl"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 w-full">
              <h3 className="text-xl font-bold text-slate-800 mb-6">
                我们能做什么？
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {services.map((service, index) => {
                  const Icon = service.icon
                  return (
                    <div key={index} className="bg-slate-50 rounded-xl p-5 border border-slate-100 card-hover">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-slate-800 mb-1">{service.title}</h4>
                      <p className="text-sm text-slate-500">{service.description}</p>
                    </div>
                  )
                })}
              </div>

              <h4 className="text-lg font-bold text-slate-800 mb-4">
                联系方式
              </h4>
              <ul className="space-y-4">
                {[
                  { icon: Phone, label: '电话', value: '13051202991、微信：jinboshiai' },
                  { icon: MapPin, label: '地址', value: '北京市顺义区临空经济核心区安庆大街7号良基科技广场A座316室' },
                  { icon: Mail, label: '官网', value: 'https://jinboshiai.com' }
                ].map((item, index) => {
                  const Icon = item.icon
                  return (
                    <li 
                      key={index}
                      className="flex items-center gap-4"
                    >
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">{item.label}</p>
                        <p className="font-semibold text-slate-700 text-sm">{item.value}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>

              <div className="mt-8 bg-blue-50/50 rounded-xl p-6 border border-blue-100">
                <h4 className="font-semibold text-slate-800 mb-3">欢迎咨询</h4>
                <p className="text-slate-500 text-sm mb-4">
                  微信：jinboshiai
                </p>
                <div className="w-40 h-40 bg-white rounded-lg flex items-center justify-center mx-auto shadow-sm border border-slate-100">
                  <img src="/images/erweima.png" alt="微信二维码" className="w-full h-full object-contain p-2" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
