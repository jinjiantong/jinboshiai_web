'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

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
    <section id="activities" className="py-16 lg:py-20 bg-white">
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="flex-shrink-0 w-80 snap-start"
            >
              <div className="relative bg-gradient-to-br from-primary to-blue-700 rounded-xl overflow-hidden h-full min-h-[360px] flex flex-col p-6 text-white shadow-lg shadow-primary/30">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full border border-white/10 -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full border border-white/10 translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center mb-4">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2 text-white leading-snug">
                    <span>学生怕没工作</span>
                    <br />
                    <span>职场人怕被裁</span>
                    <br />
                    <span>老板怕被颠覆</span>
                  </h3>
                  
                  <p className="text-sm text-white/80 mb-4">
                    AI 落地的真问题，我们坐下来聊聊
                  </p>
                  
                  <div className="w-12 h-0.5 bg-white/50 mb-4"></div>
                  
                  <div className="mt-auto pt-4 border-t border-white/20">
                    <div className="text-xs text-white/60 font-mono mb-3">
                      130 5120 2991 · jinboshiai.com
                    </div>
                    <div className="inline-block px-5 py-2 bg-white text-primary text-sm font-semibold rounded-full">
                      立即报名
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
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
