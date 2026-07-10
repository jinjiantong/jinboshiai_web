'use client'

import { motion } from 'framer-motion'
import { BookOpen, Clock, Shield, Users, Calendar, CheckCircle, Phone, Sparkles } from 'lucide-react'

const courses = [
  {
    id: 1,
    number: '01',
    title: 'AI知识体系构建与实战',
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
    <section id="courses" className="py-20 lg:py-32 bg-[#fafaf8] relative">
      <div className="absolute top-0 left-0 right-0 h-3 bg-[#FF6B35]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-[#FF6B35]/10 text-[#FF6B35] rounded-full text-sm font-medium mb-6">
            金博士 AI 实验室
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            0基础进场，带着<span className="text-[#FF6B35]">企业级项目</span>出场
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            拒绝纸上谈兵，8人小班，手把手带你做真实企业项目
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="text-xs font-mono tracking-widest uppercase text-slate-400 mb-6">课程内容</div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden relative"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#FF6B35]"></div>
                
                <div className="p-6 border-b border-slate-200">
                  <div className="text-5xl font-bold text-[#FF6B35] mb-3">{course.number}</div>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">{course.title}</h3>
                  {course.subtitle && (
                    <p className="text-base text-slate-500 mt-2">{course.subtitle}</p>
                  )}
                </div>
                
                <div className="p-6 space-y-5">
                  {course.sections.map((section, sIndex) => (
                    <div key={sIndex}>
                      <div className="text-xs font-mono tracking-wider uppercase text-[#FF6B35] font-semibold mb-3 pb-2 border-b border-dashed border-slate-200">
                        {section.title}
                      </div>
                      <div className="space-y-2">
                        {section.lessons.map((lesson, lIndex) => (
                          <div key={lIndex} className="text-sm text-slate-800 leading-relaxed pl-3 border-l-2 border-[#FF6B35]/30">
                            {lesson}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-slate-100 p-6 border-t-3"
          >
            <h4 className="font-bold text-[#FF6B35] mb-4">上课安排</h4>
            <ul className="space-y-2">
              {schedule.map((item, index) => (
                <li key={index} className="text-sm text-slate-800">
                  <span className="text-[#FF6B35] font-semibold">{item.label}：</span>
                  {item.value}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white border-2 border-[#FF6B35] p-6"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-slate-800">完整课程原价</span>
                <span className="text-lg text-slate-400 font-normal">¥4,980 / 8节</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-slate-800">首期创始班特惠</span>
                <span className="text-2xl font-bold text-[#FF6B35]">¥3,680</span>
              </div>
              <div className="text-xs text-slate-400 pt-3 border-t border-dashed border-slate-200">
                仅此一期，二期起逐步恢复原价
              </div>
            </div>
            <div className="mt-4 bg-[#FF6B35] text-white px-4 py-3 rounded-lg flex items-center gap-2 font-semibold text-sm">
              <Shield className="w-4 h-4 flex-shrink-0" />
              无风险承诺：首节不满意，全额退
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-slate-100 p-6"
          >
            <h4 className="font-bold text-[#FF6B35] mb-4">专属护航服务</h4>
            <ul className="space-y-3">
              {services.map((item, index) => (
                <li key={index} className="text-sm text-slate-800">
                  <span className="text-[#FF6B35] font-semibold">{item.label}：</span>
                  {item.value}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#FF6B35] px-8 py-6 text-center inline-block w-full"
        >
          <p className="text-white/90 text-lg mb-2">立即咨询，开启您的AI学习之旅</p>
          <p className="text-white font-mono text-xl font-semibold flex items-center justify-center gap-2">
            <Phone className="w-5 h-5" />
            130 5120 2991
          </p>
        </motion.div>
      </div>
    </section>
  )
}
