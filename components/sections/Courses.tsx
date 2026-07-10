'use client'

import { motion } from 'framer-motion'
import { BookOpen, Clock, Users, Calendar, Sparkles, GraduationCap, Award, Rocket, CheckCircle2, ArrowRight } from 'lucide-react'

const courses = [
  {
    id: 1,
    number: '01',
    title: 'AI知识体系构建与实战',
    icon: GraduationCap,
    gradient: 'from-blue-500 to-cyan-400',
    sections: [
      {
        title: '第一节',
        lessons: [
          '龙虾、Skill、Agent、Token、MCP，大模型等 AI 基础讲解',
          '借助豆包搭建专属提示词',
          '巧用 AI 工具撰写儿童故事，花草识别、智能客服等各类场景提示词',
          '借助大模型深度研讨创业思路与项目规划',
          '五分钟快速搭建全网比价实用技能',
          '搭建销售线索获取工作流',
          '搭建自媒体智能体，自动化创作故事、情感短视频'
        ]
      },
      {
        title: '第二节',
        lessons: [
          'WPS AI 全场景办公实操演练',
          '飞书 Agent 办公实战（项目管理系统全链路搭建）',
          'Trae 企业级一站式办公解决方案'
        ]
      },
      {
        title: '第三节',
        lessons: [
          '龙虾云端安装配置 + MiniMax TokenPlan',
          '龙虾本地安装（Trae）+ 打通飞书通道',
          '龙虾标准化创建技能（一站式销售管理技能）',
          '龙虾使用自动化发布技能'
        ]
      }
    ]
  },
  {
    id: 2,
    number: '02',
    title: 'AI企业级解决方案',
    icon: Rocket,
    gradient: 'from-purple-500 to-pink-400',
    sections: [
      {
        title: '第一节',
        lessons: [
          '通过飞书多维表格，知识库、扣子知识库搭建 AI 数据中台',
          '涵盖结构化数据表、标签化字段、AI字段，工作流、旧数据清洗迁移等核心功能实战',
          '融合飞书、龙虾、扣子搭建智能客服智能体',
          '客服数据采集、仪表盘展示、紧急问题监控处理工作流',
          '技术架构总结，通用方案案例说明'
        ]
      },
      {
        title: '第二节',
        lessons: [
          '搭建销量预测智能体',
          '每日晚报、库存巡检、现场巡检、会员生日提醒，销售统计，统一话术等企业智能体',
          '搭建自媒体线上营销智能体',
          '搭建销售过程管理智能体'
        ]
      },
      {
        title: '第三节',
        lessons: [
          '企业产品官网开发部署',
          '企业营销小游戏开发发布'
        ]
      }
    ]
  },
  {
    id: 3,
    number: '03',
    title: 'AI实验室项目',
    icon: Award,
    gradient: 'from-amber-500 to-orange-400',
    subtitle: '学员主导完成项目',
    sections: [
      {
        title: '第一节',
        lessons: [
          '项目规划：项目分析、流程分析、盘点资产、技术方案',
          '搭建数据：数据中台、数据迁移、数据治理，知识库',
          '搭建应用：龙虾、扣子、Trae应用'
        ]
      },
      {
        title: '第二节',
        lessons: [
          '跑通流程',
          '沉淀技能',
          '项目发布说明会'
        ]
      }
    ]
  }
]

const schedule = [
  { label: 'A班', value: '每周一/二/三 晚7-9点' },
  { label: 'B班', value: '每周二/四/六 晚7-9点' },
  { label: '总课时', value: '8节（3节知识体系 + 3节企业方案 + 2节实验室项目）' },
  { label: '上课模式', value: '圆桌实战模式，每节课2小时，拒绝纯理论' },
  { label: '班级规模', value: '满4人开班，严格8人小班，确保一对一指导质量' }
]

const services = [
  { label: '周末加练场', value: '课程期间每周末教室免费开放，提供设备和环境' },
  { label: '2个月技术顾问', value: '结课后享有一对一深度技术支持，帮你真正落地' },
  { label: '永久学习社群', value: '答疑、资源分享，行业动态，持续成长不断线' }
]

export default function Courses() {
  return (
    <section id="courses" className="py-20 lg:py-32 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary"></div>
            <span className="text-sm font-medium text-primary tracking-wider uppercase">Curriculum</span>
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary"></div>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            0基础进场，带着<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">企业级项目</span>出场
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            拒绝纸上谈兵，8人小班，手把手带你做真实企业项目
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/25">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xs font-mono tracking-widest uppercase text-slate-400">课程内容</div>
              <h3 className="text-xl font-bold text-slate-900">系统化学习路径</h3>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => {
              const IconComponent = course.icon
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className={`h-2 bg-gradient-to-r ${course.gradient}`}></div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${course.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <div className="text-4xl font-bold text-slate-200 group-hover:text-primary/20 transition-colors">{course.number}</div>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                    {course.subtitle && (
                      <p className="text-sm text-slate-500 mb-6">{course.subtitle}</p>
                    )}
                    
                    <div className="space-y-5">
                      {course.sections.map((section, sIndex) => (
                        <div key={sIndex} className="relative">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${course.gradient} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                              {sIndex + 1}
                            </div>
                            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{section.title}</div>
                          </div>
                          <div className="space-y-2 pl-11">
                            {section.lessons.map((lesson, lIndex) => (
                              <div key={lIndex} className="flex items-start gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
                                <CheckCircle2 className="w-4 h-4 text-primary/50 mt-0.5 flex-shrink-0 group-hover:text-primary transition-colors" />
                                <span className="leading-relaxed">{lesson}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-slate-900 text-lg">上课安排</h4>
            </div>
            <ul className="space-y-3">
              {schedule.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                  <div className="text-sm">
                    <span className="font-semibold text-primary">{item.label}</span>
                    <span className="text-slate-500 ml-1">{item.value}</span>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary to-purple-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-lg">欢迎咨询</h4>
            </div>
            <div className="space-y-3 mb-6">
              <p className="text-white/80 text-sm">课程详细价格及优惠信息，请联系我们获取最新报价。</p>
            </div>
            <div className="space-y-2">
              {[
                '首节不满意，全额退款保障',
                '8人小班，一对一指导',
                '企业级项目实战'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-white/80" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-white/20">
              <div className="flex items-center gap-2 text-white/90 text-sm">
                <span className="font-semibold">130 5120 2991</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center shadow-lg shadow-amber-500/25">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-slate-900 text-lg">专属护航服务</h4>
            </div>
            <ul className="space-y-4">
              {services.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-amber-500 text-xs font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-amber-600">{item.label}</span>
                    <p className="text-sm text-slate-500 mt-0.5">{item.value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
