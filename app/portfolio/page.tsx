'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play, Maximize2 } from 'lucide-react'
import { createPortal } from 'react-dom'

interface Portfolio {
  id: number
  category_name: string
  category_icon: string
  category_color: string
  title: string
  description: string
  author_name: string
  author_avatar: string
  author_title: string
  tags: string
  media_type: string
  media_url: string
  media_cover: string | null
  sort_order: number
}

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  palette: ({ className, style }) => <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/></svg>,
  bot: ({ className, style }) => <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>,
  sparkles: ({ className, style }) => <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>,
  code: ({ className, style }) => <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  brain: ({ className, style }) => <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/><path d="M19.967 17.484A4 4 0 0 1 18 18"/></svg>,
}

const colorMap: Record<string, { bg: string; text: string; light: string; gradient: string[] }> = {
  blue: { bg: '#3B82F6', text: '#2563EB', light: '#DBEAFE', gradient: ['#1E40AF', '#3B82F6'] },
  purple: { bg: '#8B5CF6', text: '#7C3AED', light: '#EDE9FE', gradient: ['#5B21B6', '#8B5CF6'] },
  green: { bg: '#10B981', text: '#059669', light: '#D1FAE5', gradient: ['#047857', '#10B981'] },
  orange: { bg: '#F59E0B', text: '#D97706', light: '#FEF3C7', gradient: ['#B45309', '#F59E0B'] },
  pink: { bg: '#EC4899', text: '#DB2777', light: '#FCE7F3', gradient: ['#BE185D', '#EC4899'] },
  red: { bg: '#EF4444', text: '#DC2626', light: '#FEE2E2', gradient: ['#B91C1C', '#EF4444'] },
}

export default function PortfolioPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const [autoPlayInterval, setAutoPlayInterval] = useState(5000)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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
        setPortfolios(result.data)
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

  if (!mounted) return null

  const currentPortfolio = portfolios[currentIndex]
  const colors = currentPortfolio ? (colorMap[currentPortfolio.category_color] || colorMap.blue) : colorMap.blue

  if (loading) {
    return createPortal(
      <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-[9999]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60 text-sm">加载中...</p>
        </div>
      </div>,
      document.body
    )
  }

  if (error || portfolios.length === 0) {
    return createPortal(
      <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-[9999]">
        <div className="text-center">
          <p className="text-white/60 mb-4">{error || '暂无作品数据'}</p>
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

  const PortfolioContent = () => (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-slate-950 overflow-hidden"
      style={{ cursor: isAutoPlaying ? 'none' : 'default' }}
    >
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPortfolio.id}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0 flex items-center justify-center p-8 lg:p-16"
          >
            <div className="relative w-full max-w-7xl h-full flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative w-full lg:w-3/5 h-[40vh] lg:h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl overflow-hidden shadow-2xl group"
              >
                {currentPortfolio.media_cover ? (
                  <img 
                    src={currentPortfolio.media_cover} 
                    alt={currentPortfolio.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div 
                      className="w-32 h-32 rounded-3xl flex items-center justify-center"
                      style={{ backgroundColor: `${colors.bg}20` }}
                    >
                      <svg className="w-16 h-16" style={{ color: colors.bg }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                        <circle cx="9" cy="9" r="2"/>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                      </svg>
                    </div>
                  </div>
                )}
                
                <div className="absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-medium text-white shadow-lg"
                  style={{ backgroundColor: colors.bg }}
                >
                  {currentPortfolio.category_name}
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">{currentPortfolio.title}</h3>
                  <p className="text-white/70 text-sm line-clamp-2">{currentPortfolio.description}</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="w-full lg:w-2/5 flex flex-col justify-center"
              >
                <div className="mb-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold"
                      style={{ backgroundColor: colors.bg }}
                    >
                      {currentPortfolio.author_avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-lg">{currentPortfolio.author_name}</div>
                      <div className="text-white/50 text-sm">{currentPortfolio.author_title}</div>
                    </div>
                  </div>
                </div>

                <p className="text-white/70 text-base lg:text-lg leading-relaxed mb-8">
                  {currentPortfolio.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {currentPortfolio.tags?.split(',').map((tag, tagIndex) => (
                    <span 
                      key={tagIndex} 
                      className="px-4 py-2 rounded-full text-sm text-white/80 border border-white/20 hover:border-white/40 transition-colors"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        <button 
          onClick={prevSlide}
          className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-sm z-20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button 
          onClick={nextSlide}
          className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-sm z-20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          {portfolios.map((_, index) => (
            <button 
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === index 
                  ? 'w-8 bg-white' 
                  : 'w-1.5 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <button
              onClick={() => setAutoPlayInterval(prev => prev > 2000 ? prev - 1000 : prev)}
              className="text-white/60 hover:text-white text-xs"
            >
              -
            </button>
            <span className="text-white/80 text-xs font-mono">{autoPlayInterval / 1000}s</span>
            <button
              onClick={() => setAutoPlayInterval(prev => prev < 10000 ? prev + 1000 : prev)}
              className="text-white/60 hover:text-white text-xs"
            >
              +
            </button>
          </div>

          <button
            onClick={toggleAutoPlay}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-sm"
          >
            {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-sm"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute bottom-6 left-6 z-20">
          <div className="text-white/30 text-sm font-mono">
            {String(currentIndex + 1).padStart(2, '0')} / {String(portfolios.length).padStart(2, '0')}
          </div>
        </div>
      </div>

      <style jsx global>{`
        body {
          overflow: hidden !important;
        }
      `}</style>
    </div>
  )

  return createPortal(<PortfolioContent />, document.body)
}
