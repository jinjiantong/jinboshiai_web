'use client'

import { motion } from 'framer-motion'
import { BookOpen, Calendar, Sparkles, GraduationCap, Award, Rocket, CheckCircle2, ArrowRight } from 'lucide-react'

const courses = [
  {
    id: 1,
    number: '01',
    title: 'AI知识体系构建与实战',
    icon: GraduationCap,
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
    <section id="courses" className="py-20 lg:py-28 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-primary"></div>
            <span className="text-xs font-medium text-primary tracking-widest uppercase">Curriculum</span>
            <div className="w-8 h-px bg-primary"></div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-3">
            0基础进场，带着<span className="text-primary">企业级项目</span>出场
          </h2>
          <p className="text-base text-slate-500 max-w-xl mx-auto">
            拒绝纸上谈兵，8人小班，手把手带你做真实企业项目
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-xs text-primary font-medium uppercase tracking-wider">课程内容</div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course, index) => {
              const IconComponent = course.icon
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="h-0.5 bg-gradient-to-r from-primary via-primary to-transparent"></div>
                  
                  <div className="p-5">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                        <IconComponent className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-slate-200">{course.number}</div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{course.title}</h3>
                    {course.subtitle && (
                      <p className="text-sm text-primary/70 mb-4">{course.subtitle}</p>
                    )}
                    
                    <div className="space-y-4">
                      {course.sections.map((section, sIndex) => (
                        <div key={sIndex}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-5 h-5 rounded text-[10px] font-medium bg-primary text-white flex items-center justify-center">
                              {sIndex + 1}
                            </div>
                            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">{section.title}</div>
                          </div>
                          <div className="space-y-1.5 pl-7">
                            {section.lessons.map((lesson, lIndex) => (
                              <div key={lIndex} className="flex items-start gap-2 text-[13px] text-slate-600">
                                <span className="w-1 h-1 rounded-full bg-primary/40 mt-2 flex-shrink-0"></span>
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

        <div className="grid md:grid-cols-3 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl p-5 border border-slate-200 hover:border-primary/30 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold text-slate-800">上课安排</h4>
            </div>
            <ul className="space-y-2">
              {schedule.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-[13px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></span>
                  <div>
                    <span className="font-medium text-primary">{item.label}：</span>
                    <span className="text-slate-500">{item.value}</span>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary to-blue-700 rounded-xl p-5 text-white shadow-lg shadow-primary/30"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold">欢迎咨询</h4>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-sm text-white/80">课程详细价格及优惠信息，请联系我们获取最新报价。</p>
            </div>
            <div className="space-y-2 text-sm">
              {[
                '首节不满意，全额退款保障',
                '8人小班，一对一指导',
                '企业级项目实战'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-white/90">
                  <CheckCircle2 className="w-4 h-4 text-white/70" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-white/20">
              <div className="flex items-center gap-2 text-white text-sm">
                <span className="font-semibold">130 5120 2991</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl p-5 border border-slate-200 hover:border-primary/30 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center shadow-md shadow-primary/20">
                <Award className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold text-slate-800">专属护航服务</h4>
            </div>
            <ul className="space-y-3">
              {services.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded text-[10px] font-medium bg-primary text-white flex items-center justify-center shadow-sm flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div>
                    <span className="font-medium text-primary text-[13px]">{item.label}</span>
                    <p className="text-[12px] text-slate-500 mt-0.5">{item.value}</p>
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
