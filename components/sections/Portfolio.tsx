'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Palette, Bot, ScanFace, BarChart3, Sparkles, Code, Brain, Image as ImageIcon, Play, X } from 'lucide-react'

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  palette: Palette,
  bot: Bot,
  'scan-face': ScanFace,
  'bar-chart-3': BarChart3,
  sparkles: Sparkles,
  code: Code,
  brain: Brain,
  image: ImageIcon,
}

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

export default function Portfolio() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [videoModal, setVideoModal] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: '',
  })

  // Fetch portfolios from API
  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        // 添加时间戳防止缓存
        const timestamp = new Date().getTime()
        const response = await fetch(`/api/portfolios?t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
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
    }

    fetchPortfolios()
  }, [])

  const nextSlide = () => {
    if (portfolios.length === 0) return
    setCurrentSlide((prev) => (prev === portfolios.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    if (portfolios.length === 0) return
    setCurrentSlide((prev) => (prev === 0 ? portfolios.length - 1 : prev - 1))
  }

  useEffect(() => {
    if (!isAutoPlaying || portfolios.length === 0) return
    
    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, portfolios.length])

  // Open video modal
  const openVideoModal = (portfolio: Portfolio) => {
    setVideoModal({
      isOpen: true,
      url: portfolio.media_url,
      title: portfolio.title,
    })
    setIsAutoPlaying(false)
  }

  // Close video modal
  const closeVideoModal = () => {
    setVideoModal({
      isOpen: false,
      url: '',
      title: '',
    })
    setIsAutoPlaying(true)
  }

  // Get color classes based on category_color
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string; lightBg: string; gradient: string }> = {
      blue: { 
        bg: 'bg-blue-500', 
        text: 'text-blue-600', 
        lightBg: 'bg-blue-100',
        gradient: 'from-blue-50 to-indigo-50'
      },
      green: { 
        bg: 'bg-green-500', 
        text: 'text-green-600', 
        lightBg: 'bg-green-100',
        gradient: 'from-green-50 to-emerald-50'
      },
      purple: { 
        bg: 'bg-purple-500', 
        text: 'text-purple-600', 
        lightBg: 'bg-purple-100',
        gradient: 'from-purple-50 to-pink-50'
      },
      orange: { 
        bg: 'bg-orange-500', 
        text: 'text-orange-600', 
        lightBg: 'bg-orange-100',
        gradient: 'from-orange-50 to-amber-50'
      },
      red: { 
        bg: 'bg-red-500', 
        text: 'text-red-600', 
        lightBg: 'bg-red-100',
        gradient: 'from-red-50 to-rose-50'
      },
      pink: { 
        bg: 'bg-pink-500', 
        text: 'text-pink-600', 
        lightBg: 'bg-pink-100',
        gradient: 'from-pink-50 to-rose-50'
      },
    }
    return colorMap[color] || colorMap.blue
  }

  if (loading) {
    return (
      <section id="home" className="relative min-h-screen overflow-hidden bg-white flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">加载作品中...</p>
        </div>
      </section>
    )
  }

  if (error || portfolios.length === 0) {
    return (
      <section id="home" className="relative min-h-screen overflow-hidden bg-white flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-slate-600 mb-4">{error || '暂无作品数据'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
          >
            重新加载
          </button>
        </div>
      </section>
    )
  }

  const currentPortfolio = portfolios[currentSlide]
  const colors = getColorClasses(currentPortfolio.category_color)
  const IconComponent = iconMap[currentPortfolio.category_icon] || Palette

  return (
    <>
      <section id="portfolio" className="relative min-h-screen overflow-hidden bg-white pt-20">
        {/* 全屏横向滚动容器 */}
        <div 
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {portfolios.map((portfolio) => {
            const portfolioColors = getColorClasses(portfolio.category_color)
            const PortfolioIcon = iconMap[portfolio.category_icon] || Palette
            const isVideo = portfolio.media_type === 'video'
            
            return (
              <div 
                key={portfolio.id}
                className="min-w-full h-full flex items-center justify-center relative bg-white"
              >
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-12 gap-6 sm:gap-8 items-center">
                  {/* 左侧文本内容 - 3列 */}
                  <div className="col-span-12 lg:col-span-3 text-slate-800">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                      className={`inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 ${portfolioColors.lightBg} ${portfolioColors.text} rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6`}
                    >
                      <PortfolioIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      {portfolio.category_name}
                    </motion.div>
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      viewport={{ once: true }}
                      className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 text-slate-900"
                    >
                      {portfolio.title}
                    </motion.h2>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      viewport={{ once: true }}
                      className="text-base sm:text-lg lg:text-xl text-slate-600 mb-4 sm:mb-8 leading-relaxed"
                    >
                      {portfolio.description}
                    </motion.p>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-4 mb-8"
                    >
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 ${portfolioColors.lightBg} rounded-full flex items-center justify-center text-lg sm:text-xl font-bold ${portfolioColors.text}`}>
                        {portfolio.author_avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-lg text-slate-900">
                          {portfolio.author_name}
                        </div>
                        <div className="text-slate-500">
                          {portfolio.author_title}
                        </div>
                      </div>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      viewport={{ once: true }}
                      className="flex flex-wrap gap-3"
                    >
                      {portfolio.tags?.split(',').map((tag, tagIndex) => (
                        <motion.span 
                          key={tagIndex} 
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: 0.1 * tagIndex }}
                          viewport={{ once: true }}
                          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-100 rounded-full text-xs sm:text-sm text-slate-600"
                        >
                          {tag.trim()}
                        </motion.span>
                      ))}
                    </motion.div>
                  </div>
                  
                  {/* 右侧媒体展示 - 9列 */}
                  <div className="col-span-12 lg:col-span-9 flex items-center justify-center">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                      className={`w-full max-w-3xl h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[600px] bg-gradient-to-br ${portfolioColors.gradient} rounded-3xl flex items-center justify-center border border-slate-100 relative overflow-hidden ${isVideo ? 'cursor-pointer group' : ''}`}
                      onClick={() => isVideo && openVideoModal(portfolio)}
                    >
                      {/* 视频封面或图标 */}
                      {portfolio.media_cover ? (
                        <img 
                          src={portfolio.media_cover} 
                          alt={portfolio.title}
                          className="w-full h-full object-cover rounded-3xl"
                        />
                      ) : (
                        <PortfolioIcon className={`w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 ${portfolioColors.text} opacity-40`} />
                      )}
                      
                      {/* 视频播放按钮 */}
                      {isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors rounded-3xl">
                          <div className={`w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 ${portfolioColors.bg} rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
                            <Play className="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-white ml-1" fill="white" />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 导航指示器 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {portfolios.map((_, index) => (
            <motion.button 
              key={index}
              onClick={() => setCurrentSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-primary w-8' : 'bg-slate-300 hover:bg-slate-400'}`}
            />
          ))}
        </div>

        {/* 左右箭头 - 移动端隐藏 */}
        <motion.button 
          onClick={prevSlide}
          whileHover={{ scale: 1.1, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all z-20 shadow-lg"
        >
          <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8" />
        </motion.button>
        <motion.button 
          onClick={nextSlide}
          whileHover={{ scale: 1.1, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all z-20 shadow-lg"
        >
          <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8" />
        </motion.button>

      </section>

      {/* 视频播放弹窗 */}
      {videoModal.isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeVideoModal}
        >
          <div 
            className="relative w-full max-w-6xl mx-4 bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button 
              onClick={closeVideoModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            {/* 视频标题 */}
            <div className="absolute top-4 left-4 z-10">
              <h3 className="text-white text-lg font-semibold">{videoModal.title}</h3>
            </div>
            
            {/* 视频播放器 */}
            <div className="aspect-video">
              {videoModal.url ? (
                <video 
                  src={videoModal.url}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  playsInline
                >
                  您的浏览器不支持视频播放
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-white/60">视频地址不可用</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}