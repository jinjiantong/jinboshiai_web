'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar, Users, MapPin, Image as ImageIcon } from 'lucide-react'

interface Activity {
  id: number
  title: string
  date: string
  location: string
  participants: number
  description: string
  coverImage: string
  category: string
}

const activities: Activity[] = [
  {
    id: 1,
    title: 'AI实战训练营第一期',
    date: '2024年3月15日',
    location: '北京顺义校区',
    participants: 48,
    description: '为期两周的AI实战训练营，学员们完成了从入门到实战的全方位学习。',
    coverImage: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=600&h=400&fit=crop',
    category: '训练营'
  },
  {
    id: 2,
    title: '企业AI转型分享会',
    date: '2024年4月20日',
    location: '北京朝阳区',
    participants: 120,
    description: '邀请多位企业高管分享AI在各自领域的应用实践与成功案例。',
    coverImage: 'https://images.unsplash.com/photo-1558403194-611308249627?w=600&h=400&fit=crop',
    category: '分享会'
  },
  {
    id: 3,
    title: 'AI创业路演大赛',
    date: '2024年5月10日',
    location: '北京中关村',
    participants: 35,
    description: '学员们展示自己的AI创业项目，由投资人进行点评与指导。',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
    category: '大赛'
  },
  {
    id: 4,
    title: 'AI技能工作坊',
    date: '2024年6月5日',
    location: '线上直播',
    participants: 200,
    description: '手把手教学员掌握龙虾智能体搭建技能，现场答疑互动。',
    coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop',
    category: '工作坊'
  },
  {
    id: 5,
    title: 'AI教育研讨会',
    date: '2024年6月18日',
    location: '北京海淀区',
    participants: 80,
    description: '探讨AI在教育领域的应用趋势，分享最新的教学方法和案例。',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop',
    category: '研讨会'
  },
  {
    id: 6,
    title: 'AI项目成果展',
    date: '2024年7月1日',
    location: '北京顺义校区',
    participants: 60,
    description: '学员们展示自己完成的企业级AI项目，优秀项目获得投资意向。',
    coverImage: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=400&fit=crop',
    category: '成果展'
  }
]

export default function Activities() {
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScroll)
      window.addEventListener('resize', checkScroll)
      return () => {
        scrollElement.removeEventListener('scroll', checkScroll)
        window.removeEventListener('resize', checkScroll)
      }
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  return (
    <section id="activities" className="py-16 lg:py-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-primary"></div>
            <span className="text-xs font-medium text-primary tracking-widest uppercase">Activities</span>
            <div className="w-8 h-px bg-primary"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
            往期精彩活动
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto">
            记录每一次学习的精彩瞬间，见证每一位学员的成长足迹
          </p>
        </motion.div>

        <div className="relative">
          <div 
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-80 snap-start"
              >
                <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                  <div className="relative h-44 overflow-hidden">
                    <img 
                      src={activity.coverImage} 
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-primary/90 text-white text-xs font-medium rounded-full">
                      {activity.category}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {activity.title}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary/70" />
                        <span>{activity.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary/70" />
                        <span className="truncate">{activity.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary/70" />
                        <span>{activity.participants}人参与</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                      {activity.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {canScrollLeft && (
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-primary/30 hover:text-primary transition-all shadow-md z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          
          {canScrollRight && (
            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-primary/30 hover:text-primary transition-all shadow-md z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
