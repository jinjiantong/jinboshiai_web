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
    <section id="activities" className="pt-24 pb-16 lg:pt-32 lg:pb-20" style={{ background: '#fafaf8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-px" style={{ background: '#FF6B35' }}></div>
            <span className="text-xs font-medium tracking-widest uppercase" style={{ color: '#FF6B35' }}>Activities</span>
            <div className="w-8 h-px" style={{ background: '#FF6B35' }}></div>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3" style={{ color: '#0a0a0a' }}>
            往期精彩活动
          </h2>
          <p className="text-sm max-w-lg mx-auto" style={{ color: '#737373' }}>
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
              <div className="relative rounded-xl overflow-hidden h-full min-h-[360px] flex flex-col p-6" style={{ background: '#fafaf8' }}>
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full border" style={{ borderColor: 'rgba(255,107,53,0.15)', transform: 'translate(30%, -30%)' }}></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full border" style={{ borderColor: 'rgba(255,107,53,0.15)', transform: 'translate(-30%, 30%)' }}></div>
                
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: 'rgba(255,107,53,0.1)' }}>
                    <Sparkles className="w-5 h-5" style={{ color: '#FF6B35' }} />
                  </div>
                  
                  <h3 className="text-xl font-light mb-3 leading-snug" style={{ color: '#0a0a0a' }}>
                    <span className="font-bold" style={{ color: '#FF6B35' }}>学生怕没工作</span>
                    <br />
                    <span className="font-bold" style={{ color: '#FF6B35' }}>职场人怕被裁</span>
                    <br />
                    <span className="font-bold" style={{ color: '#FF6B35' }}>老板怕被颠覆</span>
                  </h3>
                  
                  <p className="text-base font-light mb-4" style={{ color: '#737373' }}>
                    AI 落地的真问题，我们坐下来聊聊
                  </p>
                  
                  <div className="w-16 h-0.5 mb-4" style={{ background: '#FF6B35' }}></div>
                  
                  <div className="mt-auto pt-4 border-t" style={{ borderColor: '#e0e0e0' }}>
                    <div className="text-xs mb-3 font-mono" style={{ color: '#737373', letterSpacing: '0.05em' }}>
                      7月20号开始分享 · jinboshiai.com
                    </div>
                    <a href="#join" className="inline-block px-5 py-2 text-xs font-semibold rounded cursor-pointer" style={{ background: '#FF6B35', color: 'white', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      立即报名
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {canScrollLeft && (
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-10 h-10 bg-white rounded-full flex items-center justify-center transition-all shadow-md z-10"
              style={{ border: '1px solid #e0e0e0' }}
            >
              <ChevronLeft className="w-5 h-5" style={{ color: '#737373' }} />
            </button>
          )}
          
          {canScrollRight && (
            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-10 bg-white rounded-full flex items-center justify-center transition-all shadow-md z-10"
              style={{ border: '1px solid #e0e0e0' }}
            >
              <ChevronRight className="w-5 h-5" style={{ color: '#737373' }} />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
