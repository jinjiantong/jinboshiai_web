'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play, Maximize2, ExternalLink, Calendar, Tag, User, Sparkles } from 'lucide-react'
import { createPortal } from 'react-dom'

interface Portfolio {
  record_id: string
  fields: {
    作品名称: string
    作品简介: string
    应用场景: string
    功能特性: string
    技术方案: string
    开发者: string
    作品跳转链接: string
    作品分类: string
    作品展示平台: string
    作品附件类型: string
    是否展示: boolean
    作品附件: Array<{ name: string; size: number; token: string }>
    架构图: Array<{ name: string; size: number; token: string }>
    创建日期: number
  }
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  'AI智能体': { bg: '#3B82F6', text: '蓝色' },
  'AI游戏': { bg: '#F59E0B', text: '橙色' },
  'AI应用': { bg: '#06B6D4', text: '青色' },
  'AI架构': { bg: '#EAB308', text: '黄色' },
  'AI数据分析': { bg: '#14B8A6', text: '绿色' },
  'AI监控': { bg: '#EF4444', text: '红色' },
}

const platformLabels: Record<string, { label: string; color: string }> = {
  '官网': { label: '官网', color: '#3B82F6' },
  '展示台': { label: '展示台', color: '#F59E0B' },
  '学员作品': { label: '学员作品', color: '#06B6D4' },
}

export default function PortfolioPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const [autoPlayInterval, setAutoPlayInterval] = useState(6000)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const chatButtons = document.querySelectorAll('[class*="fixed"][class*="bottom"]')
    chatButtons.forEach(btn => {
      (btn as HTMLElement).style.display = 'none'
    })
    
    return () => {
      chatButtons.forEach(btn => {
        (btn as HTMLElement).style.display = ''
      })
    }
  }, [])

  const fetchPortfolios = useCallback(async () => {
    try {
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/portfolios?t=${timestamp}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      })
      const result = await response.json()
      
      if (result.success) {
        const filtered = result.data.filter((item: any) => 
          item.fields.是否展示 === true || item.fields.是否展示 === 'true'
        )
        setPortfolios(filtered)
      } else {
        setError(result.message || 'Failed to fetch portfolios')
      }
    } catch (err) {
      setError('Network error')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPortfolios()
  }, [fetchPortfolios])

  const nextSlide = useCallback(() => {
    if (portfolios.length === 0) return
    setCurrentIndex((prev) => (prev === portfolios.length - 1 ? 0 : prev + 1))
  }, [portfolios.length])

  const prevSlide = useCallback(() => {
    if (portfolios.length === 0) return
    setCurrentIndex((prev) => (prev === 0 ? portfolios.length - 1 : prev - 1))
  }, [portfolios.length])

  useEffect(() => {
    if (!isAutoPlaying || portfolios.length === 0) return
    
    autoPlayRef.current = setInterval(() => {
      nextSlide()
    }, autoPlayInterval)

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlaying, portfolios.length, autoPlayInterval, nextSlide])

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const minSwipeDistance = 50
    if (distance > minSwipeDistance) {
      nextSlide()
    } else if (distance < -minSwipeDistance) {
      prevSlide()
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide()
      if (e.key === 'ArrowRight') nextSlide()
      if (e.key === ' ') toggleAutoPlay()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide])

  if (!mounted) return null

  const currentPortfolio = portfolios[currentIndex]
  const categoryColor = currentPortfolio?.fields.作品分类 
    ? categoryColors[currentPortfolio.fields.作品分类] || { bg: '#6366F1', text: '默认' }
    : { bg: '#6366F1', text: '默认' }

  if (loading) {
    return createPortal(
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-[9999]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60 text-sm">加载作品数据中...</p>
        </div>
      </div>,
      document.body
    )
  }

  if (error || portfolios.length === 0) {
    return createPortal(
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-[9999]">
        <div className="text-center">
          <p className="text-white/60 mb-4">{error || '暂无展示作品'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
          >
            重新加载
          </button>
        </div>
      </div>,
      document.body
    )
  }

  const currentAttachment = currentPortfolio?.fields.作品附件?.[0]
  const currentCover = currentAttachment 
    ? `https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/v2/cover/${currentAttachment.token}/?height=1080&width=1920`
    : null

  const PortfolioContent = () => (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden select-none"
      style={{ 
        background: currentCover 
          ? `url(${currentCover}) center/cover no-repeat` 
          : 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0 backdrop-blur-xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/90" />
      
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPortfolio.record_id}
            initial={{ opacity: 0, x: 100, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -100, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0 flex items-center justify-center p-6 lg:p-12"
          >
            <div className="w-full max-w-6xl h-full flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative w-full lg:w-3/5 h-[35vh] lg:h-full"
              >
                <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl relative">
                  {currentCover ? (
                    <img 
                      src={currentCover} 
                      alt={currentPortfolio.fields.作品名称}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                      <div className="text-center">
                        <Sparkles className="w-20 h-20 text-white/30 mx-auto mb-4" />
                        <p className="text-white/40">暂无封面</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span 
                        className="px-4 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg"
                        style={{ backgroundColor: categoryColor.bg }}
                      >
                        {currentPortfolio.fields.作品分类 || 'AI应用'}
                      </span>
                      {currentPortfolio.fields.作品附件类型 && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
                          {currentPortfolio.fields.作品附件类型}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl lg:text-4xl font-bold text-white mb-2">
                      {currentPortfolio.fields.作品名称}
                    </h2>
                    {currentPortfolio.fields.开发者 && (
                      <p className="text-white/70 text-sm flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {currentPortfolio.fields.开发者}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-full lg:w-2/5 flex flex-col justify-center max-h-[55vh] lg:max-h-none overflow-y-auto custom-scrollbar"
              >
                <div className="space-y-6">
                  {currentPortfolio.fields.作品简介 && (
                    <div>
                      <h3 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">作品简介</h3>
                      <p className="text-white/90 text-sm lg:text-base leading-relaxed">
                        {currentPortfolio.fields.作品简介}
                      </p>
                    </div>
                  )}

                  {currentPortfolio.fields.应用场景 && (
                    <div>
                      <h3 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">应用场景</h3>
                      <p className="text-white/80 text-sm">
                        {currentPortfolio.fields.应用场景}
                      </p>
                    </div>
                  )}

                  {currentPortfolio.fields.功能特性 && (
                    <div>
                      <h3 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">功能特性</h3>
                      <p className="text-white/80 text-sm">
                        {currentPortfolio.fields.功能特性}
                      </p>
                    </div>
                  )}

                  {currentPortfolio.fields.技术方案 && (
                    <div>
                      <h3 className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2">技术方案</h3>
                      <p className="text-white/80 text-sm">
                        {currentPortfolio.fields.技术方案}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                    {currentPortfolio.fields.作品展示平台 && (
                      <span 
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 text-white/80"
                        style={{ borderLeft: `3px solid ${platformLabels[currentPortfolio.fields.作品展示平台]?.color || '#6366F1'}` }}
                      >
                        {currentPortfolio.fields.作品展示平台}
                      </span>
                    )}
                    {currentPortfolio.fields.创建日期 && (
                      <span className="text-white/40 text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(currentPortfolio.fields.创建日期).toLocaleDateString('zh-CN')}
                      </span>
                    )}
                  </div>

                  {currentPortfolio.fields.作品跳转链接 && (
                    <a 
                      href={currentPortfolio.fields.作品跳转链接}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all mt-4"
                      style={{ backgroundColor: categoryColor.bg }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      访问作品
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.button 
          onClick={prevSlide}
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.95 }}
          className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-md z-20 border border-white/10"
        >
          <ChevronLeft className="w-7 h-7" />
        </motion.button>

        <motion.button 
          onClick={nextSlide}
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.95 }}
          className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-md z-20 border border-white/10"
        >
          <ChevronRight className="w-7 h-7" />
        </motion.button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          {portfolios.map((_, index) => (
            <motion.button 
              key={index}
              onClick={() => goToSlide(index)}
              whileHover={{ scale: 1.3 }}
              className={`rounded-full transition-all duration-300 ${
                currentIndex === index 
                  ? 'w-8 h-2 bg-white shadow-lg' 
                  : 'w-2 h-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
            <button
              onClick={() => setAutoPlayInterval(prev => prev > 2000 ? prev - 1000 : prev)}
              className="text-white/60 hover:text-white text-sm w-6 h-6 flex items-center justify-center"
            >
              -
            </button>
            <span className="text-white/80 text-xs font-mono w-8 text-center">{autoPlayInterval / 1000}s</span>
            <button
              onClick={() => setAutoPlayInterval(prev => prev < 15000 ? prev + 1000 : prev)}
              className="text-white/60 hover:text-white text-sm w-6 h-6 flex items-center justify-center"
            >
              +
            </button>
          </div>

          <motion.button
            onClick={toggleAutoPlay}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-md border border-white/10"
          >
            {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </motion.button>

          <motion.button
            onClick={toggleFullscreen}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-md border border-white/10"
          >
            <Maximize2 className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="absolute bottom-6 left-6 z-20">
          <div className="text-white/30 text-sm font-mono tracking-wider">
            {String(currentIndex + 1).padStart(2, '0')} / {String(portfolios.length).padStart(2, '0')}
          </div>
        </div>

        <div className="absolute top-6 left-6 z-20">
          <div className="text-white/50 text-xs">
            左右滑动或按方向键切换作品
          </div>
        </div>
      </div>

      <style jsx global>{`
        body {
          overflow: hidden !important;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  )

  return createPortal(<PortfolioContent />, document.body)
}
