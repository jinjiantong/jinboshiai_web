'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

interface Portfolio {
  record_id: string
  fields: {
    作品名称: string
    作品简介: string
    应用场景: string
    功能特性: string
    技术方案: string
    AI工具: string
    开发者: string
    作品跳转链接: string
    作品分类: string
    作品附件类型: string
    是否展示: boolean
    作品附件: Array<{ name: string; size: number; file_token: string; type: string; download_url: string }>
    演示视频: Array<{ name: string; size: number; file_token: string; type: string; download_url: string }>
    架构图: Array<{ name: string; size: number; file_token: string; type: string; download_url: string }>
    创建日期: number
    cover_image: string | null
  }
}

type ThemeType = 'orange' | 'tech' | 'elegant' | 'vibrant'

interface Theme {
  name: string
  primary: string
  secondary: string
  accent: string
  accentLight: string
  cardBg: string
  cardBgAlt: string
  textPrimary: string
  textSecondary: string
  overlay: string
  border: string
  glassBg: string
}

const themes: Record<ThemeType, Theme> = {
  orange: {
    name: '经典橙',
    primary: '#f97316',
    secondary: '#fb923c',
    accent: '#f97316',
    accentLight: '#fb923c',
    cardBg: 'rgba(40, 25, 15, 0.45)',
    cardBgAlt: 'rgba(249, 115, 22, 0.12)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.9)',
    overlay: 'radial-gradient(circle at 80% 20%, rgba(249, 115, 22, 0.12) 0%, transparent 40%), radial-gradient(circle at 20% 80%, rgba(251, 146, 60, 0.08) 0%, transparent 40%), linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)',
    border: 'rgba(249, 115, 22, 0.15)',
    glassBg: 'rgba(124, 45, 18, 0.5)'
  },
  tech: {
    name: '科技风',
    primary: '#6366F1',
    secondary: '#22D3EE',
    accent: '#22D3EE',
    accentLight: '#67E8F9',
    cardBg: 'rgba(15, 23, 42, 0.45)',
    cardBgAlt: 'rgba(34, 211, 238, 0.12)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.9)',
    overlay: 'radial-gradient(circle at 80% 20%, rgba(34, 211, 238, 0.12) 0%, transparent 40%), radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 40%), linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)',
    border: 'rgba(34, 211, 238, 0.15)',
    glassBg: 'rgba(30, 27, 75, 0.5)'
  },
  elegant: {
    name: '优雅风',
    primary: '#B45309',
    secondary: '#F59E0B',
    accent: '#F59E0B',
    accentLight: '#FCD34D',
    cardBg: 'rgba(40, 30, 20, 0.45)',
    cardBgAlt: 'rgba(245, 158, 11, 0.12)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.9)',
    overlay: 'radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.12) 0%, transparent 40%), radial-gradient(circle at 20% 80%, rgba(180, 83, 9, 0.1) 0%, transparent 40%), linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)',
    border: 'rgba(245, 158, 11, 0.15)',
    glassBg: 'rgba(41, 37, 36, 0.5)'
  },
  vibrant: {
    name: '活力风',
    primary: '#10B981',
    secondary: '#A3E635',
    accent: '#A3E635',
    accentLight: '#D9F99D',
    cardBg: 'rgba(10, 40, 25, 0.45)',
    cardBgAlt: 'rgba(163, 230, 53, 0.12)',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.9)',
    overlay: 'radial-gradient(circle at 80% 20%, rgba(163, 230, 53, 0.12) 0%, transparent 40%), radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 40%), linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)',
    border: 'rgba(163, 230, 53, 0.15)',
    glassBg: 'rgba(6, 78, 59, 0.5)'
  }
}

const typeIcons: Record<string, string> = {
  'AI智能体': '🤖',
  'AI游戏': '🎮',
  'AI应用': '🌐',
  'AI架构': '🏗️',
  'AI数据分析': '📊',
  'AI监控': '📡',
  '智能体': '🤖',
  '游戏': '🎮',
  '网站': '🌐',
  '应用': '🌐',
  '架构': '🏗️',
  '数据分析': '📊',
  '监控': '📡',
  '其他': '📦'
}

const typeColors: Record<string, string> = {
  'AI智能体': '#f97316',
  'AI游戏': '#10B981',
  'AI应用': '#3B82F6',
  'AI架构': '#8B5CF6',
  'AI数据分析': '#06B6D4',
  'AI监控': '#EF4444',
  '智能体': '#f97316',
  '游戏': '#10B981',
  '网站': '#3B82F6',
  '应用': '#3B82F6',
  '架构': '#8B5CF6',
  '数据分析': '#06B6D4',
  '监控': '#EF4444',
  '其他': '#6B7280'
}

export default function PortfolioPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [autoPlayInterval, setAutoPlayIntervalState] = useState(6000)
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('orange')
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showIntervalSelector, setShowIntervalSelector] = useState(false)
  const [lightbox, setLightbox] = useState<{ isOpen: boolean; type: 'image' | 'video'; src: string }>({ isOpen: false, type: 'image', src: '' })
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const themeSelectorRef = useRef<HTMLDivElement>(null)
  const intervalSelectorRef = useRef<HTMLDivElement>(null)
  const themeButtonRef = useRef<HTMLButtonElement>(null)
  const intervalButtonRef = useRef<HTMLButtonElement>(null)

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        showThemeSelector &&
        themeSelectorRef.current &&
        !themeSelectorRef.current.contains(target) &&
        themeButtonRef.current &&
        !themeButtonRef.current.contains(target)
      ) {
        setShowThemeSelector(false)
      }
      if (
        showIntervalSelector &&
        intervalSelectorRef.current &&
        !intervalSelectorRef.current.contains(target) &&
        intervalButtonRef.current &&
        !intervalButtonRef.current.contains(target)
      ) {
        setShowIntervalSelector(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showThemeSelector, showIntervalSelector])

  const fetchPortfolios = useCallback(async () => {
    try {
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/portfolios?type=showcase&t=${timestamp}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      })
      const result = await response.json()
      
      if (result.success) {
        const filtered = result.data.filter((item: Portfolio) =>
          item.fields.是否展示 === true
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

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

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
  }, [isAutoPlaying, portfolios.length, nextSlide, autoPlayInterval])

  const toggleAutoPlay = () => setIsAutoPlaying(!isAutoPlaying)

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
    if (isAutoPlaying) {
      autoPlayRef.current && clearInterval(autoPlayRef.current)
      autoPlayRef.current = setInterval(nextSlide, autoPlayInterval)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide()
        if (isAutoPlaying) {
          autoPlayRef.current && clearInterval(autoPlayRef.current)
          autoPlayRef.current = setInterval(nextSlide, autoPlayInterval)
        }
      }
      if (e.key === 'ArrowRight' || e.key === ' ') { 
        e.preventDefault()
        nextSlide()
        if (isAutoPlaying) {
          autoPlayRef.current && clearInterval(autoPlayRef.current)
          autoPlayRef.current = setInterval(nextSlide, autoPlayInterval)
        }
      }
      if (e.key === 'Escape') {
        if (lightbox.isOpen) {
          setLightbox({ isOpen: false, type: 'image', src: '' })
        } else if (showThemeSelector || showIntervalSelector) {
          setShowThemeSelector(false)
          setShowIntervalSelector(false)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide, isAutoPlaying, autoPlayInterval, lightbox.isOpen, showThemeSelector, showIntervalSelector])

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
      <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black">
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
      <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black">
        <div className="text-center">
          <p className="text-white/60 mb-4">{error || '暂无展示作品'}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors">重新加载</button>
        </div>
      </div>,
      document.body
    )
  }

  const getPortfolioType = () => {
    const category = currentPortfolio.fields.作品分类
    return category || '其他'
  }

  const PortfolioContent = () => (
    <div 
      className="fixed inset-0 overflow-hidden select-none"
      style={{ background: '#000', fontFamily: "'Noto Sans SC', sans-serif" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 右上角标题 */}
      <div 
        className="fixed top-8 right-8 z-50"
        style={{ pointerEvents: 'none' }}
      >
        <div 
          className="px-6 py-3 rounded-2xl backdrop-blur-md"
          style={{ 
            background: `${theme.accent}15`,
            border: `1px solid ${theme.accent}30`
          }}
        >
          <div className="text-lg font-bold" style={{ color: theme.accent }}>
            作品展示台
          </div>
          <div className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
            所有的作品通过AI独立完成
          </div>
        </div>
      </div>

      {/* 背景 - 主题色氛围 */}
      <div 
        className="absolute inset-0 transition-all duration-700"
        style={{ background: '#0a0a0a' }} 
      />
      <div className="absolute inset-0 transition-all duration-700" style={{ background: theme.overlay }} />

      {/* 主内容区 */}
      <div className="absolute inset-0 flex items-center" style={{ paddingRight: '640px' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPortfolio.record_id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.3 }}
            className="max-w-5xl w-full rounded-3xl"
            style={{ 
              background: theme.cardBg,
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              border: `1px solid ${theme.border}`,
              padding: '48px 64px',
              marginLeft: '5%',
              transition: 'background 0.5s ease, border-color 0.5s ease'
            }}
          >
            {/* 作品类型 */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold mb-3"
              style={{ 
                background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`,
                color: '#000',
                boxShadow: `0 4px 15px ${theme.accent}40`,
                transition: 'background 0.5s ease, box-shadow 0.5s ease'
              }}
            >
              <span>{typeIcons[getPortfolioType()] || '📦'}</span>
              <span>{getPortfolioType()}</span>
            </div>

            {/* 标题 */}
            <h1 
              className="mb-3"
              style={{ 
                fontFamily: "'Noto Serif SC', serif",
                fontSize: 'clamp(48px, 6vw, 64px)',
                fontWeight: 900,
                lineHeight: 1.1,
                color: theme.textPrimary,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
              }}
            >
              {currentPortfolio.fields.作品名称}
            </h1>

            {/* 演示按钮 */}
            <div className="flex items-center gap-3 mb-3">
              <button 
                onClick={() => openLightbox(isVideoType ? 'video' : 'image', currentPortfolio.fields.cover_image || '')}
                className="inline-block px-4 py-2 rounded-full text-base font-semibold transition-all hover:-translate-y-0.5 hover:shadow-2xl"
                style={{ 
                  background: `linear-gradient(135deg, ${theme.accent}, ${theme.accentLight})`,
                  color: '#000'
                }}
              >
                🚀 体验演示
              </button>
              
              {currentPortfolio.fields.作品跳转链接 && (
                <a 
                  href={currentPortfolio.fields.作品跳转链接}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-3 py-1.5 rounded-xl text-sm font-medium transition-all hover:-translate-y-1 hover:shadow-xl"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  访问作品
                </a>
              )}
            </div>

            {/* 描述 */}
            <p 
              className="text-lg leading-relaxed mb-4"
              style={{ color: 'rgba(255, 255, 255, 0.9)' }}
            >
              {currentPortfolio.fields.作品简介}
            </p>

            {/* AI工具 & 应用场景 & 开发者 模块 */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {currentPortfolio.fields.开发者 && (
                <div 
                  className="p-3 rounded-lg"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <div 
                    className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: '#ffffff' }}
                  >
                    开发者
                  </div>
                  <div className="text-sm font-medium" style={{ color: theme.accent }}>
                    {currentPortfolio.fields.开发者}
                  </div>
                </div>
              )}

              {currentPortfolio.fields.AI工具 && (
                <div 
                  className="p-3 rounded-lg"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <div 
                    className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: '#ffffff' }}
                  >
                    AI工具
                  </div>
                  <div className="text-xs" style={{ color: '#ffffff', lineHeight: 1.4 }}>
                    {currentPortfolio.fields.AI工具}
                  </div>
                </div>
              )}

              {currentPortfolio.fields.应用场景 && (
                <div 
                  className="p-3 rounded-lg"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <div 
                    className="text-xs uppercase tracking-wider mb-1"
                    style={{ color: '#ffffff' }}
                  >
                    应用场景
                  </div>
                  <div className="text-xs" style={{ color: '#ffffff', lineHeight: 1.4 }}>
                    {currentPortfolio.fields.应用场景}
                  </div>
                </div>
              )}
            </div>

            {/* 信息网格 */}
            <div className="grid grid-cols-2 gap-4">
              {/* 核心技术 */}
              <div 
                className="p-4 rounded-2xl"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.06)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div 
                  className="text-xs uppercase tracking-wider mb-2"
                  style={{ color: 'rgba(255, 255, 255, 0.55)' }}
                >
                  核心技术
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentPortfolio.fields.技术方案 && currentPortfolio.fields.技术方案.split(/[,，、]/).filter(Boolean).map((tech, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 rounded-lg text-sm"
                      style={{ 
                        background: `${theme.accent}26`,
                        border: `1px solid ${theme.accent}40`,
                        color: theme.accentLight
                      }}
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* 核心功能 */}
              <div 
                className="p-4 rounded-2xl"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.06)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <div 
                  className="text-xs uppercase tracking-wider mb-2"
                  style={{ color: theme.accent }}
                >
                  核心功能
                </div>
                <div className="flex flex-col gap-2">
                  {currentPortfolio.fields.功能特性 && currentPortfolio.fields.功能特性.split(/[,，、]/).filter(Boolean).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                      <div 
                        className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: theme.accent, color: '#000' }}
                      >
                        ✓
                      </div>
                      <span style={{ color: '#ffffff' }}>{feature.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 右侧缩略图 - 3D垂直轮播 */}
      <div 
        className="fixed top-0 bottom-0 z-40 flex items-center justify-center"
        style={{ right: '28px', width: '520px', pointerEvents: 'none', perspective: '1600px' }}
      >
        <div 
          className="relative"
          style={{ 
            width: '450px', 
            height: '253px',
            transformStyle: 'preserve-3d',
            pointerEvents: 'none'
          }}
        >
          {portfolios.map((item, index) => {
            // 计算相对位置
            const offset = index - currentIndex
            const total = portfolios.length
            let normalizedOffset = offset
            if (normalizedOffset > total / 2) normalizedOffset -= total
            if (normalizedOffset < -total / 2) normalizedOffset += total
            
            const absOffset = Math.abs(normalizedOffset)
            if (absOffset > 3) return null
            
            const isActive = normalizedOffset === 0
            const distance = absOffset
            
            // 3D轮播参数
            const angle = normalizedOffset * 25  // 每个缩略图间隔25度
            const radius = 400
            const rotateX = -angle
            const translateY = Math.sin(angle * Math.PI / 180) * radius
            const translateZ = (Math.cos(angle * Math.PI / 180) - 1) * radius
            const scale = isActive ? 1.0 : (0.67 - distance * 0.06)
            const opacity = isActive ? 1 : (0.7 - distance * 0.12)
            
            return (
              <motion.button
                key={item.record_id}
                onClick={() => goToSlide(index)}
                className="absolute rounded-xl overflow-hidden"
                initial={false}
                animate={{
                  rotateX: rotateX,
                  y: translateY,
                  z: translateZ,
                  scale: scale,
                  opacity: opacity,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 80,
                  damping: 22,
                  mass: 1.2,
                }}
                style={{ 
                  width: '450px',
                  height: '253px',
                  border: isActive ? `3px solid ${theme.accent}` : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: isActive ? `0 20px 60px rgba(0,0,0,0.85), 0 0 60px ${theme.accent}60` : '0 4px 12px rgba(0,0,0,0.4)',
                  pointerEvents: 'auto',
                  top: 0,
                  left: 0,
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  filter: isActive ? 'brightness(1.15)' : `brightness(${0.85 - distance * 0.05})`,
                  willChange: 'transform, opacity',
                  transform: 'translateZ(0)'
                }}
              >
                {item.fields.演示视频 && item.fields.演示视频.length > 0 ? (
                  <video 
                    src={item.fields.演示视频[0].download_url}
                    autoPlay={absOffset <= 1}
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-contain"
                    style={{ backgroundColor: '#0a0a0a' }}
                  />
                ) : item.fields.cover_image ? (
                  <img 
                    src={item.fields.cover_image} 
                    alt={item.fields.作品名称}
                    className="w-full h-full object-contain"
                    style={{ backgroundColor: '#0a0a0a' }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <span className="text-5xl">📦</span>
                  </div>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* 底部控制区 */}
      <div className="absolute bottom-0 left-0 right-0 z-50 px-16 pb-12 pt-8" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
        <div className="flex items-center justify-between">
          {/* 页码 */}
          <div 
            className="text-4xl"
            style={{ 
              fontFamily: "'Noto Serif SC', serif",
              color: theme.textSecondary
            }}
          >
            <span className="text-6xl font-black" style={{ color: theme.accent }}>{currentIndex + 1}</span>
            <span> / </span>
            <span>{portfolios.length}</span>
          </div>

          {/* 控制按钮 */}
          <div className="flex items-center gap-5">
            {/* 自动播放指示器 */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: theme.accent }} />
              <span className="text-sm" style={{ color: theme.textSecondary }}>自动轮播</span>
            </div>

            {/* 上一个 */}
            <button
              onClick={() => {
                prevSlide()
                if (isAutoPlaying) {
                  autoPlayRef.current && clearInterval(autoPlayRef.current)
                  autoPlayRef.current = setInterval(nextSlide, autoPlayInterval)
                }
              }}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                fontSize: '20px'
              }}
            >
              ◀
            </button>

            {/* 下一个 */}
            <button
              onClick={() => {
                nextSlide()
                if (isAutoPlaying) {
                  autoPlayRef.current && clearInterval(autoPlayRef.current)
                  autoPlayRef.current = setInterval(nextSlide, autoPlayInterval)
                }
              }}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                fontSize: '20px'
              }}
            >
              ▶
            </button>

            {/* 暂停 */}
            <button
              onClick={toggleAutoPlay}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ 
                background: isAutoPlaying ? theme.accent : 'rgba(255, 255, 255, 0.1)',
                border: isAutoPlaying ? theme.accent : '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff',
                fontSize: '20px'
              }}
            >
              {isAutoPlaying ? '⏸' : '▶'}
            </button>

            {/* 间隔设置 */}
            <button
              ref={intervalButtonRef}
              onClick={() => {
                setShowIntervalSelector(!showIntervalSelector)
                setShowThemeSelector(false)
              }}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 text-sm font-bold"
              style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#fff'
              }}
            >
              {autoPlayInterval / 1000}s
            </button>

            {/* 主题切换 */}
            <button
              ref={themeButtonRef}
              onClick={() => {
                setShowThemeSelector(!showThemeSelector)
                setShowIntervalSelector(false)
              }}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 text-2xl"
              style={{ 
                background: `${theme.accent}20`,
                border: `2px solid ${theme.accent}`,
                color: theme.accent,
                boxShadow: `0 0 20px ${theme.accent}40`
              }}
            >
              🎨
            </button>
          </div>
        </div>
      </div>

      {/* 间隔选择器 */}
      <AnimatePresence>
        {showIntervalSelector && (
          <motion.div
            ref={intervalSelectorRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-28 right-16 z-50 p-5 rounded-2xl backdrop-blur-xl"
            style={{ 
              background: 'rgba(0, 0, 0, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="text-xs font-semibold text-white/60 mb-3">自动播放间隔</div>
            <div className="space-y-2">
              {[3000, 5000, 8000, 10000, 15000].map((interval) => (
                <button
                  key={interval}
                  onClick={() => { 
                    setAutoPlayIntervalState(interval)
                    setShowIntervalSelector(false)
                    if (isAutoPlaying) {
                      autoPlayRef.current && clearInterval(autoPlayRef.current)
                      autoPlayRef.current = setInterval(nextSlide, interval)
                    }
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-white/10 text-white text-sm"
                >
                  <span>{interval / 1000} 秒</span>
                  {autoPlayInterval === interval && (
                    <div className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: theme.accent }} />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 主题选择器 */}
      <AnimatePresence>
        {showThemeSelector && (
          <motion.div
            ref={themeSelectorRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-28 right-16 z-50 p-5 rounded-2xl backdrop-blur-xl"
            style={{ 
              background: 'rgba(0, 0, 0, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <div className="text-xs font-semibold mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>选择主题</div>
            <div className="space-y-2">
              {(Object.keys(themes) as ThemeType[]).map((key) => (
                <button
                  key={key}
                  onClick={() => { 
                    setCurrentTheme(key)
                    setShowThemeSelector(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-white/10"
                >
                  <div 
                    className="w-10 h-10 rounded-lg"
                    style={{ 
                      background: `linear-gradient(135deg, ${themes[key].primary}, ${themes[key].secondary})`
                    }}
                  />
                  <span className="text-base font-medium" style={{ color: '#ffffff' }}>{themes[key].name}</span>
                  {currentTheme === key && (
                    <div className="ml-auto w-2 h-2 rounded-full" style={{ backgroundColor: themes[key].accent }} />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 灯箱 */}
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
              className="absolute top-6 right-6 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-2xl"
            >
              ✕
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
                <img src={lightbox.src} alt="" className="max-w-full max-h-[90vh] object-contain rounded-2xl" style={{ imageRendering: '-webkit-optimize-contrast' }} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&family=Noto+Serif+SC:wght@400;600;700;900&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body { 
          overflow: hidden !important; 
        }
      `}</style>
    </div>
  )

  return createPortal(<PortfolioContent />, document.body)
}
