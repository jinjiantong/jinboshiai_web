'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Clock, Users, Calendar, Award, MessageCircle } from 'lucide-react'

interface Section {
  title: string
  content: string[]
}

interface Course {
  id: number
  title: string
  subtitle: string
  sections: Section[]
  gradient: string
  color: string
}

interface CourseData {
  title: string
  courses: Course[]
  schedule?: {
    A班?: string
    B班?: string
    总课时?: string
    上课模式?: string
    班级规模?: string
  }
  services?: string[]
}

export default function Courses() {
  const [data, setData] = useState<CourseData | null>(null)
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

      if (result.success && result.data) {
        setData(result.data)
      } else {
        setError('暂无课程数据')
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      setError('获取课程数据失败')
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

  if (!data) {
    return (
      <section id="courses" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">暂无课程数据</h3>
            <p className="text-slate-600">课程内容正在整理中，请稍后再试</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="courses" className="pt-24 pb-20 lg:pt-32 lg:pb-32 bg-white relative overflow-hidden">
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
            零基础，也能打造企业级解决方案
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            从入门到实战，循序渐进掌握AI核心技能，开启智能办公新时代
          </p>
        </motion.div>

        <div className="space-y-8">
          {data.courses.map((course, courseIndex) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: courseIndex * 0.1 }}
              className={`bg-gradient-to-br ${course.gradient} rounded-3xl p-8 lg:p-10 text-white`}
            >
              <div className="mb-6">
                <h3 className="text-2xl lg:text-3xl font-bold mb-2">{course.title}</h3>
                <p className="text-white/80 text-lg">{course.subtitle}</p>
              </div>

              <div className="space-y-6">
                {course.sections.map((section, sectionIndex) => (
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
          ))}
        </div>

        {data.schedule && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 rounded-3xl p-8 lg:p-12 border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">上课安排</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {data.schedule.A班 && (
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
                    <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">A班</div>
                      <div className="font-semibold text-slate-900">{data.schedule.A班}</div>
                    </div>
                  </div>
                )}
                {data.schedule.B班 && (
                  <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
                    <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">B班</div>
                      <div className="font-semibold text-slate-900">{data.schedule.B班}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {data.schedule.总课时 && (
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="text-3xl font-bold text-[#387EF5]">8</div>
                    <div className="text-sm text-slate-500">节</div>
                  </div>
                )}
                {data.schedule.上课模式 && (
                  <div className="text-center p-4 bg-slate-50 rounded-xl md:col-span-2">
                    <div className="text-sm text-slate-500 mb-1">上课模式</div>
                    <div className="font-semibold text-slate-900">{data.schedule.上课模式}</div>
                  </div>
                )}
                {data.schedule.班级规模 && (
                  <div className="text-center p-4 bg-slate-50 rounded-xl">
                    <div className="text-3xl font-bold text-[#387EF5]">8</div>
                    <div className="text-sm text-slate-500">人小班</div>
                  </div>
                )}
              </div>

              {data.services && (
                <div className="border-t border-slate-200 pt-8">
                  <h4 className="text-lg font-semibold text-slate-900 mb-6 text-center">专属护航服务</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    {data.services.map((service, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl">
                        {index === 0 && <Clock className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />}
                        {index === 1 && <Users className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />}
                        {index === 2 && <MessageCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />}
                        <span className="text-sm text-slate-700">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
