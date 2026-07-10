'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Pause, Play, Maximize2, ExternalLink, Calendar, User, Sparkles, X, Palette, Image, Video } from 'lucide-react'
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
    作品附件类型: string
    是否展示: boolean
    作品附件: Array<{ name: string; size: number; file_token: string; download_url: string }>
    架构图: Array<{ name: string; size: number; token: string }>
    创建日期: number
    cover_image: string | null
  }
}

type ThemeType = 'tech' | 'elegant' | 'vibrant'

interface Theme {
  name: string
  icon: string
  primary: string
  secondary: string
  gradient: string
  cardBg: string
  textPrimary: string
  textSecondary: string
  overlay: string
}

const themes: Record<ThemeType, Theme> = {
  tech: {
    name: '科技风',
    icon: 'tech',
    primary: '#6366F1',
    secondary: '#818CF8',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
    cardBg: 'rgba(30, 27, 75, 0.6)',
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    overlay: 'rgba(15, 23, 42, 0.85)'
  },
  elegant: {
    name: '优雅风',
    icon: 'elegant',
    primary: '#92400E',
    secondary: '#B45309',
    gradient: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #1c1917 100%)',
    cardBg: 'rgba(41, 37, 36, 0.6)',
    textPrimary: '#FAFAF9',
    textSecondary: 'rgba(250, 250, 249, 0.7)',
    overlay: 'rgba(28, 25, 23, 0.85)'
  },
  vibrant: {
    name: '活力风',
    icon: 'vibrant',
    primary: '#059669',
    secondary: '#10B981',
    gradient: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #022c22 100%)',
    cardBg: 'rgba(6, 78, 59, 0.6)',
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    overlay: 'rgba(2, 44, 34, 0.85)'
  }
}

const categoryColors: Record<string, string> = {
  'AI智能体': '#3B82F6',
  'AI游戏': '#F59E0B',
  'AI应用': '#06B6D4',
  'AI架构': '#EAB308',
  'AI数据分析': '#14B8A6',
  'AI监控': '#EF4444',
}

export default function PortfolioPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('tech')
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [lightbox, setLightbox] = useState<{ isOpen: boolean; type: 'image' | 'video'; src: string }>({ isOpen: false, type: 'image', src: '' })
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
        const filtered = result.data.filter((item: Portfolio) => 
          item.fields.是否展示 === true || item.fields.是否展示 === 'true'
        )
        setPortfolios(filtered)
      } else {
        setError(result.message || 'Failed to fetch portfolios')
      }
    } catch (err) {
      setError('Network error')
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

  const toggleAutoPlay = () => setIsAutoPlaying(!isAutoPlaying)
  const goToSlide = (index: number) => setCurrentIndex(index)

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
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX)

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (distance > 50) nextSlide()
    else if (distance < -50) prevSlide()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide()
      if (e.key === 'ArrowRight') nextSlide()
      if (e.key === ' ') { e.preventDefault(); toggleAutoPlay() }
      if (e.key === 'Escape') setLightbox({ isOpen: false, type: 'image', src: '' })
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide])

  const openLightbox = (type: 'image' | 'video', src: string) => {
    setLightbox({ isOpen: true, type, src })
    setIsAutoPlaying(false)
  }

  if (!mounted) return null

  const currentPortfolio = portfolios[currentIndex]
  const theme = themes[currentTheme]
  const isVideoType = currentPortfolio?.fields.作品附件类型 === '视频'

  if (loading) {
    return createPortal(
      <div className="fixed inset-0 flex items-center justify-center z-[9999]" style={{ background: theme.gradient }}>
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
      <div className="fixed inset-0 flex items-center justify-center z-[9999]" style={{ background: theme.gradient }}>
        <div className="text-center">
          <p className="text-white/60 mb-4">{error || '暂无展示作品'}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors">重新加载</button>
        </div>
      </div>,
      document.body
    )
  }

  const PortfolioContent = () => (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden select-none"
      style={{ background: theme.gradient }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)' }} />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPortfolio.record_id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0 flex items-center justify-center p-6 lg:p-12"
        >
          <div className="w-full max-w-7xl h-full flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative w-full lg:w-1/2 h-[45vh] lg:h-full cursor-pointer group"
              onClick={() => openLightbox(isVideoType ? 'video' : 'image', currentPortfolio.fields.cover_image || '')}
            >
              <div 
                className="w-full h-full rounded-3xl overflow-hidden shadow-2xl relative"
                style={{ boxShadow: `0 25px 50px -12px ${theme.primary}40` }}
              >
                {currentPortfolio.fields.cover_image ? (
                  <img 
                    src={currentPortfolio.fields.cover_image} 
                    alt={currentPortfolio.fields.作品名称}
                    className="w-full h-full object-contain"
                    style={{ backgroundColor: theme.cardBg }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: theme.cardBg }}>
                    <div className="text-center">
                      <Sparkles className="w-20 h-20 mx-auto mb-4" style={{ color: theme.textSecondary }} />
                      <p className="text-white/40">暂无封面</p>
                    </div>
                  </div>
                )}
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: theme.overlay }}>
                  <div className="text-center text-white">
                    {isVideoType ? (
                      <>
                        <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
                          <Play className="w-10 h-10 ml-1" fill="white" />
                        </div>
                        <p className="text-sm font-medium">点击播放视频</p>
                      </>
                    ) : (
                      <>
                        <Maximize2 className="w-12 h-12 mx-auto mb-4" style={{ color: theme.primary }} />
                        <p className="text-sm font-medium">点击放大查看</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-2 left-6 flex gap-2">
                <span 
                  className="px-4 py-2 rounded-full text-sm font-semibold text-white shadow-lg"
                  style={{ backgroundColor: categoryColors[currentPortfolio.fields.作品分类] || theme.primary }}
                >
                  {currentPortfolio.fields.作品分类 || 'AI应用'}
                </span>
                <span className="px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-white backdrop-blur-sm flex items-center gap-2">
                  {isVideoType ? <Video className="w-4 h-4" /> : <Image className="w-4 h-4" />}
                  {currentPortfolio.fields.作品附件类型 || '图片'}
                </span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full lg:w-1/2 flex flex-col justify-center max-h-[45vh] lg:max-h-none overflow-y-auto custom-scrollbar pr-4"
            >
              <div className="mb-8">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-4xl lg:text-5xl font-bold mb-4"
                  style={{ color: theme.textPrimary }}
                >
                  {currentPortfolio.fields.作品名称}
                </motion.h1>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-center gap-4 mb-6"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white"
                    style={{ backgroundColor: theme.primary }}
                  >
                    {currentPortfolio.fields.开发者?.[0] || '金'}
                  </div>
                  <div>
                    <div className="font-semibold text-lg" style={{ color: theme.textPrimary }}>{currentPortfolio.fields.开发者}</div>
                    <div className="text-sm" style={{ color: theme.textSecondary }}>开发者</div>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-6">
                {currentPortfolio.fields.作品简介 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="p-4 rounded-2xl"
                    style={{ background: theme.cardBg, backdropFilter: 'blur(10px)' }}
                  >
                    <p className="text-sm leading-relaxed" style={{ color: theme.textSecondary }}>{currentPortfolio.fields.作品简介}</p>
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {currentPortfolio.fields.应用场景 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="p-4 rounded-2xl"
                      style={{ background: theme.cardBg, backdropFilter: 'blur(10px)' }}
                    >
                      <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: theme.primary }}>应用场景</div>
                      <p className="text-sm" style={{ color: theme.textSecondary }}>{currentPortfolio.fields.应用场景}</p>
                    </motion.div>
                  )}
                  
                  {currentPortfolio.fields.功能特性 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.45 }}
                      className="p-4 rounded-2xl"
                      style={{ background: theme.cardBg, backdropFilter: 'blur(10px)' }}
                    >
                      <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: theme.primary }}>功能特性</div>
                      <p className="text-sm" style={{ color: theme.textSecondary }}>{currentPortfolio.fields.功能特性}</p>
                    </motion.div>
                  )}
                </div>

                {currentPortfolio.fields.技术方案 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="p-4 rounded-2xl"
                    style={{ background: theme.cardBg, backdropFilter: 'blur(10px)' }}
                  >
                    <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: theme.primary }}>技术方案</div>
                    <p className="text-sm" style={{ color: theme.textSecondary }}>{currentPortfolio.fields.技术方案}</p>
                  </motion.div>
                )}

                <div className="flex items-center gap-4 pt-4">
                  {currentPortfolio.fields.创建日期 && (
                    <span className="text-xs flex items-center gap-2" style={{ color: theme.textSecondary }}>
                      <Calendar className="w-4 h-4" />
                      {new Date(currentPortfolio.fields.创建日期).toLocaleDateString('zh-CN')}
                    </span>
                  )}
                </div>

                {currentPortfolio.fields.作品跳转链接 && (
                  <motion.a 
                    href={currentPortfolio.fields.作品跳转链接}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-base font-semibold text-white shadow-lg mt-4"
                    style={{ backgroundColor: theme.primary, boxShadow: `0 10px 25px -5px ${theme.primary}50` }}
                  >
                    <ExternalLink className="w-5 h-5" />
                    访问作品
                  </motion.a>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.button onClick={prevSlide} whileHover={{ scale: 1.1, x: -5 }} whileTap={{ scale: 0.95 }} className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center transition-all backdrop-blur-md z-20 border border-white/10" style={{ backgroundColor: theme.cardBg }}>
        <ChevronLeft className="w-7 h-7 text-white" />
      </motion.button>

      <motion.button onClick={nextSlide} whileHover={{ scale: 1.1, x: 5 }} whileTap={{ scale: 0.95 }} className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center transition-all backdrop-blur-md z-20 border border-white/10" style={{ backgroundColor: theme.cardBg }}>
        <ChevronRight className="w-7 h-7 text-white" />
      </motion.button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        {portfolios.map((_, index) => (
          <motion.button key={index} onClick={() => goToSlide(index)} whileHover={{ scale: 1.3 }} className={`rounded-full transition-all duration-300 ${currentIndex === index ? 'w-8 h-2' : 'w-2 h-2'}`} style={{ backgroundColor: currentIndex === index ? 'white' : 'rgba(255,255,255,0.3)' }} />
        ))}
      </div>

      <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
        <motion.button onClick={() => setShowThemeSelector(!showThemeSelector)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-11 h-11 rounded-full flex items-center justify-center transition-all backdrop-blur-md border border-white/10" style={{ backgroundColor: theme.cardBg }}>
          <Palette className="w-5 h-5 text-white" />
        </motion.button>

        <div className="flex items-center gap-2 backdrop-blur-md rounded-full px-4 py-2 border border-white/10" style={{ backgroundColor: theme.cardBg }}>
          <button onClick={() => setAutoPlayInterval(prev => prev > 2000 ? prev - 1000 : prev)} className="text-white/60 hover:text-white text-sm w-6 h-6 flex items-center justify-center">-</button>
          <span className="text-white/80 text-xs font-mono w-8 text-center">{autoPlayInterval / 1000}s</span>
          <button onClick={() => setAutoPlayInterval(prev => prev < 15000 ? prev + 1000 : prev)} className="text-white/60 hover:text-white text-sm w-6 h-6 flex items-center justify-center">+</button>
        </div>

        <motion.button onClick={toggleAutoPlay} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-11 h-11 rounded-full flex items-center justify-center transition-all backdrop-blur-md border border-white/10" style={{ backgroundColor: theme.cardBg }}>
          {isAutoPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
        </motion.button>

        <motion.button onClick={toggleFullscreen} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="w-11 h-11 rounded-full flex items-center justify-center transition-all backdrop-blur-md border border-white/10" style={{ backgroundColor: theme.cardBg }}>
          <Maximize2 className="w-5 h-5 text-white" />
        </motion.button>
      </div>

      <AnimatePresence>
        {showThemeSelector && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-20 right-6 z-30 p-4 rounded-2xl backdrop-blur-xl border border-white/10"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)' }}
          >
            <div className="text-xs font-semibold text-white/60 mb-3">选择主题</div>
            <div className="space-y-2">
              {(Object.keys(themes) as ThemeType[]).map((key) => (
                <button
                  key={key}
                  onClick={() => { setCurrentTheme(key); setShowThemeSelector(false) }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentTheme === key ? 'ring-2' : 'hover:bg-white/5'}`}
                  style={currentTheme === key ? { ringColor: themes[key].primary } : {}}
                >
                  <div className="w-10 h-10 rounded-lg" style={{ background: themes[key].gradient }} />
                  <span className="text-white font-medium">{themes[key].name}</span>
                  {currentTheme === key && (
                    <div className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: themes[key].primary }} />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-6 left-6 z-20">
        <div className="text-white/30 text-sm font-mono tracking-wider">{String(currentIndex + 1).padStart(2, '0')} / {String(portfolios.length).padStart(2, '0')}</div>
      </div>

      <AnimatePresence>
        {lightbox.isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90"
            onClick={() => setLightbox({ isOpen: false, type: 'image', src: '' })}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setLightbox({ isOpen: false, type: 'image', src: '' })}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-[90vw] max-h-[90vh]"
            >
              {lightbox.type === 'video' ? (
                <video src={lightbox.src} controls autoPlay className="max-w-full max-h-[90vh] rounded-2xl" />
              ) : (
                <img src={lightbox.src} alt="" className="max-w-full max-h-[90vh] object-contain rounded-2xl" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        body { overflow: hidden !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
      `}</style>
    </div>
  )

  return createPortal(<PortfolioContent />, document.body)
}
