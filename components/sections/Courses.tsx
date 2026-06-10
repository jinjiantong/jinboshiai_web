'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Brain, Lightbulb, Wrench, Monitor, Bot, Code, Building2, Loader2 } from 'lucide-react'

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

const iconMap: { [key: string]: any } = {
  BookOpen,
  Brain,
  Lightbulb,
  Wrench,
  Monitor,
  Bot,
  Code,
  Building2
}

const defaultCourses: Course[] = []

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
    <section id="courses" className="py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-blue-100 text-primary rounded-full text-sm font-medium mb-4">
            精品课程
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            系统化课程体系
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            从入门到实战，8个章节循序渐进掌握AI核心技能
          </p>
        </div>

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
            {courses.map((course, index) => {
              const iconKey = `BookOpen`
              const IconComponent = iconMap[iconKey]

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100 hover:shadow-xl transition-all"
                >
                  <div className={`bg-gradient-to-br ${course.gradient} p-4`}>
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-2">
                      {IconComponent && <IconComponent className="w-5 h-5 text-white" />}
                    </div>
                    <h3 className="text-base font-bold text-white mb-1 leading-tight">{course.title}</h3>
                    <p className="text-sm text-white/80 leading-relaxed">{course.subtitle}</p>
                  </div>

                  <div className="p-3">
                    <div className="space-y-1.5">
                      {course.modules.map((module: any, moduleIndex: number) => (
                        <div key={moduleIndex} className="flex items-start">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center mr-1.5 flex-shrink-0 mt-0.5 ${
                            course.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                            course.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                            course.color === 'green' ? 'bg-green-100 text-green-600' :
                            course.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
                            course.color === 'cyan' ? 'bg-cyan-100 text-cyan-600' :
                            course.color === 'rose' ? 'bg-rose-100 text-rose-600' :
                            course.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
                            'bg-amber-100 text-amber-600'
                          }`}>
                            <span className="text-xs font-bold">{moduleIndex + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-slate-700 leading-snug">{module.title}</p>
                            {module.tags && module.tags.length > 0 && (
                              <div className="flex gap-1 mt-0.5">
                                {module.tags.map((tag: string, tagIndex: number) => (
                                  <span key={tagIndex} className={`text-xs px-1 py-0.5 rounded ${
                                    tag === '实战' ? 'bg-green-100 text-green-600' : 'bg-purple-100 text-purple-600'
                                  }`}>
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={`pt-2 mt-2 border-t border-slate-100`}>
                      <div className="flex items-start text-xs text-slate-500 leading-snug">
                        <span className={`font-medium flex-shrink-0 ${
                          course.color === 'blue' ? 'text-blue-600' :
                          course.color === 'purple' ? 'text-purple-600' :
                          course.color === 'green' ? 'text-green-600' :
                          course.color === 'yellow' ? 'text-yellow-600' :
                          course.color === 'cyan' ? 'text-cyan-600' :
                          course.color === 'rose' ? 'text-rose-600' :
                          course.color === 'indigo' ? 'text-indigo-600' :
                          'text-amber-600'
                        }`}>
                          {course.modules.length}个
                        </span>
                        <span className="mx-1 flex-shrink-0">•</span>
                        <span className="whitespace-normal">{course.result}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}