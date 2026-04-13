'use client'

import { motion } from 'framer-motion'
import { Zap, Workflow, Rocket, TrendingUp, Briefcase, Palette, Video, Code, CheckCircle, ArrowRight } from 'lucide-react'

export default function Courses() {
  const courses = [
    {
      title: '第一阶段：AI工具全能精通',
      subtitle: '零基础上手各类主流AI工具，轻松玩转AI办公、设计、音视频、编程四大场景',
      duration: '80小时',
      icon: Zap,
      gradient: 'from-primary to-primary-dark',
      modules: [
        {
          icon: Briefcase,
          title: '模块一：AI办公全能实战',
          description: '快速生成文案、汇报稿、邮件；自动整理数据、做表格、思维导图；一键总结长文档；热门小龙虾AI文案生成',
          tags: ['豆包', 'ChatGPT', 'WPS AI', 'Notion AI'],
          bgColor: 'bg-blue-50'
        },
        {
          icon: Palette,
          title: '模块二：AI视觉设计速成',
          description: '零基础生成海报、LOGO、PPT、插画、电商图；热门小龙虾AI视觉创作，一键生成美食海报、菜品宣传图',
          tags: ['Midjourney', 'Stable Diffusion', '可画AI'],
          bgColor: 'bg-purple-50'
        },
        {
          icon: Video,
          title: '模块三：AI音视频快速创作',
          description: '文字转配音、AI数字人视频、短视频脚本、一键剪辑、生成背景音乐；热门小龙虾AI音视频创作',
          tags: ['剪映AI', 'HeyGen', 'Runway'],
          bgColor: 'bg-green-50'
        },
        {
          icon: Code,
          title: '模块四：AI编程入门实操',
          description: '用大白话让AI生成代码、修改错误、加注释；零基础做简单网页、小脚本；搭建小龙虾美食推荐小工具',
          tags: ['Cursor', 'Trae', 'GitHub Copilot'],
          bgColor: 'bg-orange-50'
        }
      ],
      result: '10分钟完成以往1小时办公任务，能独立搞定各类基础AI实操任务',
      color: 'primary'
    },
    {
      title: '第二阶段：AI逻辑与工作流搭建',
      subtitle: '搞懂AI运行逻辑，学会把多个AI工具串联，搭建全自动AI工作流程',
      duration: '60小时',
      icon: Workflow,
      gradient: 'from-secondary to-green-600',
      modules: [
        {
          title: 'AI底层逻辑',
          description: '用大白话讲解大模型、智能助手、工具调用、MCP联动基础知识，理清AI能力边界'
        },
        {
          title: 'AI工作流核心搭建',
          description: '手把手教你串联多个AI工具，搭建办公、设计、短视频创作全自动流程，实战小龙虾美食全流程AI创作工作流'
        },
        {
          title: 'Prompt高阶写法',
          description: '简单易学的指令模板，给AI设定角色、规范输出内容，批量完成AI任务'
        },
        {
          title: '项目可行性判断',
          description: '根据自身需求，快速匹配合适的AI工具，规划简单落地步骤，避开AI使用坑点'
        }
      ],
      tools: 'Make、Automa、Trae工作流、Zapier（国内替代工具）、各类AI工具API联动',
      result: '搭建专属自动化AI工作流，一键完成多步骤复杂任务',
      color: 'secondary'
    },
    {
      title: '第三阶段：AI应用实战开发',
      subtitle: '不用高深编程基础，借助低代码、AI开发工具，从零做出能正常使用的AI小产品',
      duration: '100小时',
      icon: Rocket,
      gradient: 'from-accent to-purple-600',
      modules: [
        {
          title: 'AI接口调用',
          description: '零基础接入AI大模型，简单配置参数、调试功能，不用懂复杂技术'
        },
        {
          title: '低代码实战开发',
          description: '用Trae等AI开发工具，联动数据库、云存储，搭建AI助手、小工具、智能知识库'
        },
        {
          title: '综合项目实战',
          description: '落地AI文案助手、AI设计小工具、全自动短视频工具；重点实战小龙虾AI推广小应用'
        },
        {
          title: '项目调试优化',
          description: '简单修复小问题、优化使用体验，让自己做的AI工具更好用'
        }
      ],
      tools: 'Trae、Cursor、各类AI开放平台、云存储、数据库MCP服务、低代码开发平台',
      result: '完成2-3个可对外展示的AI应用项目，拥有专属AI作品集',
      color: 'accent'
    },
    {
      title: '第四阶段：AI价值落地与变现',
      subtitle: '把学到的AI技能变成实际用处，实现职场提速、副业赚钱、自主做项目',
      duration: '60小时',
      icon: TrendingUp,
      gradient: 'from-orange-500 to-red-500',
      modules: [
        {
          title: 'AI副业变现',
          description: 'AI设计接单、短视频代做、AI文案代写、定制AI小工具；依托小龙虾AI创作等热点项目快速接单'
        },
        {
          title: '企业AI方案落地',
          description: '优化日常工作流程、搭建企业自动化AI工作流，帮职场、店铺提升效率、降低成本'
        },
        {
          title: '独立产品打磨',
          description: '从一个小想法，到做出完整AI产品、上线使用、收集反馈、持续优化'
        },
        {
          title: '技能复用与放大',
          description: '把AI技能标准化、流程化，轻松复制、高效完成各类任务，放大自身竞争力'
        }
      ],
      tools: '接单平台、项目部署工具、商业化AI服务平台、各类AI生态工具',
      result: '实现AI技能变现，具备独立落地商业化AI项目的能力',
      color: 'orange'
    }
  ]

  return (
    <section id="courses" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-blue-100 text-primary rounded-full text-sm font-medium mb-4">
            精品课程
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            系统化课程体系
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            从入门到实战，循序渐进掌握AI核心技能
          </p>
        </div>

        {/* Course Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {courses.map((course, index) => {
            const Icon = course.icon
            const isFirstCourse = index === 0

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 hover:shadow-xl transition-shadow"
              >
                {/* Header */}
                <div className={`bg-gradient-to-br ${course.gradient} p-6`}>
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{course.title}</h3>
                  <p className={`${course.color === 'primary' ? 'text-blue-100' : course.color === 'secondary' ? 'text-green-100' : course.color === 'accent' ? 'text-purple-100' : 'text-orange-100'}`}>
                    {course.subtitle}
                  </p>
                </div>

                {/* Content */}
                <div className="p-6">
                  {isFirstCourse ? (
                    // First course with module cards
                    <div className="space-y-4 mb-6">
                      {course.modules.map((module: any, moduleIndex: number) => {
                        const ModuleIcon = module.icon
                        return (
                          <div key={moduleIndex} className={`${module.bgColor} rounded-lg p-4`}>
                            <h4 className="font-semibold text-slate-900 mb-2 flex items-center">
                              <ModuleIcon className="w-4 h-4 text-primary mr-2" />
                              {module.title}
                            </h4>
                            <p className="text-sm text-slate-600">{module.description}</p>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {module.tags.map((tag: string, tagIndex: number) => (
                                <span key={tagIndex} className="text-xs bg-white px-2 py-1 rounded text-slate-500">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    // Other courses with list items
                    <div className="space-y-3 mb-6">
                      {course.modules.map((module: any, moduleIndex: number) => (
                        <div key={moduleIndex} className="flex items-start">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                            <span className="text-sm font-bold text-secondary">{moduleIndex + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">{module.title}</h4>
                            <p className="text-sm text-slate-600">{module.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tools */}
                  {!isFirstCourse && (
                    <div className="bg-slate-50 rounded-lg p-3 mb-4">
                      <p className="text-sm text-slate-600">
                        <span className="font-medium text-slate-900">核心工具：</span>
                        {course.tools}
                      </p>
                    </div>
                  )}

                  {/* Result */}
                  <div className={`${course.color === 'primary' ? 'bg-blue-50' : course.color === 'secondary' ? 'bg-green-50' : course.color === 'accent' ? 'bg-purple-50' : 'bg-orange-50'} rounded-lg p-4 mb-4`}>
                    <div className="flex items-center text-sm text-slate-700">
                      <CheckCircle className={`w-5 h-5 ${course.color === 'primary' ? 'text-primary' : course.color === 'secondary' ? 'text-secondary' : course.color === 'accent' ? 'text-accent' : 'text-orange-500'} mr-2`} />
                      <span className="font-medium">阶段成果：</span>
                      <span className="ml-1">{course.result}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div className="text-slate-500 text-sm">课时：{course.duration}</div>
                    <motion.a 
                      href="#join" 
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className={`${course.color === 'primary' ? 'text-primary hover:text-primary-dark' : course.color === 'secondary' ? 'text-secondary hover:text-green-600' : course.color === 'accent' ? 'text-accent hover:text-purple-600' : 'text-orange-500 hover:text-orange-600'} font-semibold inline-flex items-center transition-colors`}
                    >
                      了解详情 <ArrowRight className="w-4 h-4 ml-1" />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
