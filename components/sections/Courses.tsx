'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Loader2, Clock, ArrowRight, Sparkles, FileText, Video, Users, ChevronRight } from 'lucide-react'

interface Module {
  title: string
  description: string
  tags?: string[]
}

interface Course {
  id: number
  title: string
  subtitle: string
  duration: string
  modules: Module[]
  tools?: string
  result: string
  gradient: string
  color: string
}

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/courses')

      if (!response.ok) {
        throw new Error('Failed to fetch courses')
      }

      const result = await response.json()

      if (result.success && result.data?.courses && result.data.courses.length > 0) {
        setCourses(result.data.courses)
      } else {
        setError('暂无课程数据')
        setCourses([])
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      setError('获取课程数据失败')
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section id="courses" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-slate-600">加载课程数据...</span>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="courses" className="py-20 lg:py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-[#387EF5]"></div>
            <span className="text-sm font-medium text-[#387EF5] tracking-wider uppercase">Curriculum</span>
            <div className="w-8 h-px bg-[#387EF5]"></div>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            系统化课程体系
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            从入门到实战，循序渐进掌握AI核心技能，开启智能办公新时代
          </p>
        </motion.div>

        {courses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">📚</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">暂无课程数据</h3>
            <p className="text-slate-600">课程内容正在整理中，请稍后再试</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:border-slate-200"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#387EF5] to-[#6B9FFF] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#387EF5] to-[#6B9FFF] flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs text-slate-500 font-medium">{course.duration}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-[#387EF5] transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-5">
                    {course.subtitle}
                  </p>

                  <div className="space-y-2.5">
                    {course.modules.map((module: any, moduleIndex: number) => (
                      <motion.div
                        key={moduleIndex}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: moduleIndex * 0.03 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3 group/item"
                      >
                        <div className="w-6 h-6 rounded-md bg-blue-50 text-[#387EF5] flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#387EF5] group-hover/item:text-white transition-colors">
                          <span className="text-xs font-semibold">{moduleIndex + 1}</span>
                        </div>
                        <span className="text-sm text-slate-600 group-hover/item:text-slate-900 transition-colors">
                          {module.title}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700">
                          {course.modules.length}
                        </span>
                        <span className="text-xs text-slate-400">个模块</span>
                        <span className="mx-2 text-slate-200">|</span>
                        <span className="text-xs text-slate-500 truncate max-w-[60px]">{course.result}</span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#387EF5] transition-colors">
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 rounded-3xl p-8 lg:p-12 border border-slate-100">
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12 mb-10">
              {[
                { icon: FileText, num: '8+', label: '实战课程', desc: '涵盖AI办公、视觉设计、音视频创作等核心技能' },
                { icon: Video, label: '30+', num: '课时', desc: '随到随学，灵活安排学习时间' },
                { icon: Users, label: '1000+', num: '学员', desc: '学员好评如潮，口碑见证' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <item.icon className="w-6 h-6 text-[#387EF5]" />
                  </div>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-2xl font-bold text-slate-900">{item.num || item.label}</span>
                    {item.num && <span className="text-lg text-slate-500">{item.label}</span>}
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <motion.a
                href="#join"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#387EF5] text-white rounded-full font-medium hover:bg-[#387EF5]/90 transition-all shadow-lg shadow-blue-500/20"
              >
                <Sparkles className="w-5 h-5" />
                <span>立即咨询报名</span>
                <ArrowRight className="w-5 h-5" />
              </motion.a>
              <p className="mt-4 text-sm text-slate-400">限时优惠，名额有限</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}