'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Rocket, Clock, Calendar, Award, Sparkles } from 'lucide-react'

const vibeCodingCourse = {
  gradient: 'from-indigo-600 via-purple-600 to-pink-500',
  color: '#7c3aed',
  tagline: '2026 用说话的方式搞定AI编程！',
  subtitle: '青少年 Vibe Coding（氛围编程）3日创造营',
 门槛: '我们唯一的门槛：会打字 · 会上网',
  courseResult: {
    badge: '课程成果',
    highlight: '3天，带走',
    items: ['属于自己的 网站', '小程序游戏', '手机App'],
  },
  eraCompare: {
    title: '时代对比',
    old: {
      era: '互联网时代',
      content: '老板 + 产品 + 开发 + 设计 + 后台 + 运营 + 数据，\n一个月上线',
    },
    new: {
      era: 'AI时代',
      content: '1个人 + AI工具，\n3天上线',
    },
  },
  philosophy: {
    title: '核心理念',
    text: 'AI无限放大你的能力。过去我们学知识，现在我们学如何用别人的知识。',
  },
  curriculum: [
    {
      day: 'Day 1',
      items: [
        '企业级产品开发流程介绍',
        'AI编程工具介绍',
        '创意讨论',
        '产品文档撰写',
        '产品设计稿制作',
        '技术设计方案撰写',
      ],
    },
    {
      day: 'Day 2',
      items: ['产品开发（含服务端开发）', '调试', '测试'],
    },
    {
      day: 'Day 3',
      items: ['产品部署', '数据分析', '增长运营'],
    },
  ],
  whyUs: [
    {
      icon: Users,
      tag: '真·小班',
      desc: '不超过8人，确保老师看见每个创意',
    },
    {
      icon: Rocket,
      tag: '真产品',
      desc: '可带走的网站、游戏、App，不是Demo，是能上线能用的真东西',
    },
    {
      icon: Award,
      tag: '真交付',
      desc: 'Vibe Coding降低创造门槛，我们补上部署、服务端、运营的硬核闭环',
    },
    {
      icon: Sparkles,
      tag: '硬核老师',
      desc: '老师深耕AI多领域，课堂中穿插前沿视野拓展。不止教做产品，更帮孩子看见AI的全貌。',
    },
  ],
  schedule: {
    badge: '限前8席',
    time: '每周一、三、五 下午 1:30～4:00',
  },
}

const aiCourse = {
  title: 'AI应用落地实战课',
  subtitle: '零基础入门，打造企业级AI解决方案',
  gradient: 'from-blue-600 via-blue-500 to-cyan-500',
  sections: [
    {
      title: 'AI知识体系构建与实战',
      content: [
        '龙虾、Skill、Agent、Token、MCP，大模型等 AI 基础讲解',
        '借助豆包搭建专属提示词',
        '巧用 AI 工具撰写儿童故事，花草识别、智能客服等各类场景提示词',
        '借助大模型深度研讨创业思路与项目规划',
        '五分钟快速搭建全网比价实用技能',
      ],
    },
    {
      title: 'AI办公自动化实战',
      content: [
        'Python基础与AI助手协同工作流',
        'Excel数据处理自动化，AI批量处理报表',
        'Word文档智能写作与格式处理',
        'PPT一键生成，从大纲到成品',
        '企业知识库搭建与智能问答系统',
      ],
    },
    {
      title: 'AI与行业解决方案',
      content: [
        'AI客服系统搭建与多平台接入',
        '私域流量运营与用户画像分析',
        '新媒体内容创作与自动化发布',
        '数据可视化与商业智能报表',
        'AI时代企业转型与效率提升方法论',
      ],
    },
  ],
  schedule: {
    A班: '周一、三、五 晚上 7:00～9:00',
    B班: '周六、日 下午 2:00～5:00',
    总课时: '8节',
    上课模式: '线上直播 + 录播回放',
    班级规模: '8人小班',
  },
  services: [
    '专属学习群，老师实时答疑',
    '配套源码与数据集，实战无忧',
    '结课后90天技术咨询支持',
  ],
}

type ActiveTab = 'ai' | 'vibe'

export default function Courses() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('ai')

  return (
    <section id="courses" className="pt-24 pb-20 lg:pt-32 lg:pb-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-[#387EF5]"></div>
            <span className="text-sm font-medium text-[#387EF5] tracking-wider uppercase">Curriculum</span>
            <div className="w-8 h-px bg-[#387EF5]"></div>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            零基础，也能打造企业级解决方案
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            从入门到实战，循序渐进掌握AI核心技能，开启智能办公新时代
          </p>
        </motion.div>

        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-slate-100 rounded-full p-1 gap-1">
            {[
              { key: 'ai', label: 'AI应用落地实战课', tag: '职场人 · 创业者 · 大学生' },
              { key: 'vibe', label: 'Vibe Coding实战课', tag: '学生 · AI爱好者' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as ActiveTab)}
                className={`px-5 py-3 rounded-full text-sm transition-all flex flex-col items-center gap-0.5 ${
                  activeTab === tab.key
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <span className="font-medium">{tab.label}</span>
                <span className="text-xs font-medium text-orange-500">
                  适用人群：{tab.tag}
                </span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`bg-gradient-to-br ${aiCourse.gradient} rounded-3xl p-8 lg:p-10 text-white`}
                >
                  <div className="mb-6">
                    <h3 className="text-2xl lg:text-3xl font-bold mb-2">{aiCourse.title}</h3>
                    <p className="text-white/80 text-lg">{aiCourse.subtitle}</p>
                  </div>

                  <div className="space-y-6">
                    {aiCourse.sections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                            {sectionIndex + 1}
                          </span>
                          {section.title}
                        </h4>
                        <ul className="space-y-2">
                          {section.content.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start gap-3 text-white/90">
                              <span className="text-white/60 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-12"
              >
                <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 rounded-3xl p-8 lg:p-12 border border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">上课安排</h3>

                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                      <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">A班</div>
                        <div className="font-semibold text-slate-900">{aiCourse.schedule.A班}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                      <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-slate-500">B班</div>
                        <div className="font-semibold text-slate-900">{aiCourse.schedule.B班}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                      <div className="text-3xl font-bold text-[#387EF5]">{aiCourse.schedule.总课时}</div>
                      <div className="text-sm text-slate-500">节</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-xl md:col-span-2">
                      <div className="text-sm text-slate-500 mb-1">上课模式</div>
                      <div className="font-semibold text-slate-900">{aiCourse.schedule.上课模式}</div>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-xl">
                      <div className="text-3xl font-bold text-[#387EF5]">{aiCourse.schedule.班级规模}</div>
                      <div className="text-sm text-slate-500">人小班</div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-8">
                    <h4 className="text-lg font-semibold text-slate-900 mb-6 text-center">专属护航服务</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      {aiCourse.services.map((service, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl">
                          {index === 0 && <Clock className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />}
                          {index === 1 && <Users className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />}
                          {index === 2 && <Award className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />}
                          <span className="text-sm text-slate-700">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'vibe' && (
            <motion.div
              key="vibe"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-gradient-to-br ${vibeCodingCourse.gradient} rounded-3xl p-8 lg:p-10 text-white mb-8`}
              >
                <div className="text-center mb-6">
                  <span className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium mb-4">
                    🔥 {vibeCodingCourse.tagline}
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-bold mb-2">{vibeCodingCourse.subtitle}</h3>
                  <p className="text-white/80 text-lg">{vibeCodingCourse.门槛}</p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="text-center p-4 bg-white/10 rounded-2xl">
                    <div className="text-sm text-white/60 mb-2">{vibeCodingCourse.courseResult.badge}</div>
                    <div className="text-xl font-bold mb-1">{vibeCodingCourse.courseResult.highlight}</div>
                    <div className="text-sm text-white/80">
                      {vibeCodingCourse.courseResult.items.map((item, i) => (
                        <span key={i}>
                          {i > 0 && ' · '}
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-white/10 rounded-2xl md:col-span-2">
                    <div className="grid grid-cols-2 gap-6 text-center">
                      <div>
                        <div className="text-white/60 text-xs uppercase tracking-wider mb-1">
                          {vibeCodingCourse.eraCompare.old.era}
                        </div>
                        <div className="text-sm text-white/90 whitespace-pre-line">
                          {vibeCodingCourse.eraCompare.old.content}
                        </div>
                      </div>
                      <div>
                        <div className="text-white/60 text-xs uppercase tracking-wider mb-1">
                          {vibeCodingCourse.eraCompare.new.era}
                        </div>
                        <div className="text-sm text-white/90 whitespace-pre-line">
                          {vibeCodingCourse.eraCompare.new.content}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                  <div className="text-sm text-white/60 uppercase tracking-wider mb-2">
                    {vibeCodingCourse.philosophy.title}
                  </div>
                  <p className="text-white/90 text-base">
                    {vibeCodingCourse.philosophy.text}
                  </p>
                </div>

                <div className="text-center">
                  <div className="text-sm text-white/60 uppercase tracking-wider mb-4">3天课程大纲</div>
                  <div className="grid md:grid-cols-3 gap-4">
                    {vibeCodingCourse.curriculum.map((day, i) => (
                      <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
                        <div className="text-sm font-bold mb-3 text-white/90">{day.day}</div>
                        <ul className="space-y-1.5">
                          {day.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-white/80">
                              <span className="text-white/50 mt-0.5">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <div className="text-center mb-6">
                  <span className="text-sm text-slate-500 uppercase tracking-wider">选择理由</span>
                  <h3 className="text-2xl font-bold text-slate-900 mt-2">为什么选择我们</h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {vibeCodingCourse.whyUs.map((item, i) => (
                    <div key={i} className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-5 border border-slate-100 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-3">
                        <item.icon className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="text-sm font-bold text-slate-900 mb-1">{item.tag}</div>
                      <div className="text-xs text-slate-500 leading-relaxed">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-6 text-center"
              >
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-orange-500" />
                    <span className="text-orange-600 font-bold">{vibeCodingCourse.schedule.badge}</span>
                  </div>
                  <span className="hidden sm:block text-slate-300">|</span>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    <span className="text-slate-700">{vibeCodingCourse.schedule.time}</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
