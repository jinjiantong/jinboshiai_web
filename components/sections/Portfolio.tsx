'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ExternalLink, Play, X, Bot, Sparkles, Code, BarChart3, Gamepad2, Globe } from 'lucide-react'

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
    作品展示平台: string
  }
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'AI智能体': Bot,
  'AI游戏': Gamepad2,
  'AI应用': Globe,
  'AI架构': Code,
  'AI数据分析': BarChart3,
  'AI监控': Sparkles,
  'AI编程': Code,
  'AI工作流': Sparkles,
  '其他': Sparkles,
}

const categoryColors: Record<string, { bg: string; text: string; lightBg: string; gradient: string }> = {
  'AI智能体': { bg: 'bg-orange-500', text: 'text-orange-600', lightBg: 'bg-orange-100', gradient: 'from-orange-50 to-amber-50' },
  'AI游戏': { bg: 'bg-green-500', text: 'text-green-600', lightBg: 'bg-green-100', gradient: 'from-green-50 to-emerald-50' },
  'AI应用': { bg: 'bg-blue-500', text: 'text-blue-600', lightBg: 'bg-blue-100', gradient: 'from-blue-50 to-indigo-50' },
  'AI架构': { bg: 'bg-purple-500', text: 'text-purple-600', lightBg: 'bg-purple-100', gradient: 'from-purple-50 to-pink-50' },
  'AI数据分析': { bg: 'bg-cyan-500', text: 'text-cyan-600', lightBg: 'bg-cyan-100', gradient: 'from-cyan-50 to-sky-50' },
  'AI监控': { bg: 'bg-red-500', text: 'text-red-600', lightBg: 'bg-red-100', gradient: 'from-red-50 to-rose-50' },
  'AI编程': { bg: 'bg-indigo-500', text: 'text-indigo-600', lightBg: 'bg-indigo-100', gradient: 'from-indigo-50 to-violet-50' },
  'AI工作流': { bg: 'bg-pink-500', text: 'text-pink-600', lightBg: 'bg-pink-100', gradient: 'from-pink-50 to-rose-50' },
  '其他': { bg: 'bg-slate-500', text: 'text-slate-600', lightBg: 'bg-slate-100', gradient: 'from-slate-50 to-gray-50' },
}

export default function Portfolio() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying] = useState(true)
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [videoModal, setVideoModal] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: '',
  })

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const timestamp = new Date().getTime()
        const response = await fetch(`/api/portfolios?type=home&t=${timestamp}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        })
        const result = await response.json()
        
        if (result.success && result.data.length > 0) {
          setPortfolios(result.data)
        } else {
          setError('暂无作品数据')
        }
      } catch (err) {
        setError('网络错误')
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPortfolios()
  }, [])

  useEffect(() => {
    if (!isAutoPlaying || portfolios.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === portfolios.length - 1 ? 0 : prev + 1))
    }, 6000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, portfolios.length])

  const openVideoModal = (portfolio: Portfolio) => {
    const videoUrl = portfolio.fields.演示视频?.[0]?.download_url || ''
    if (videoUrl) {
      setVideoModal({
        isOpen: true,
        url: videoUrl,
        title: portfolio.fields.作品名称,
      })
    }
  }

  const closeVideoModal = () => {
    setVideoModal({ isOpen: false, url: '', title: '' })
  }

  const getCategoryColor = (category: string) => {
    return categoryColors[category] || categoryColors['其他']
  }

  const getCategoryIcon = (category: string) => {
    return categoryIcons[category] || Sparkles
  }

  if (loading) {
    return (
      <section id="portfolio" className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">加载作品中...</p>
        </div>
      </section>
    )
  }

  if (error || portfolios.length === 0) {
    return (
      <section id="portfolio" className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-slate-600 mb-4">{error || '暂无作品数据'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
          >
            重新加载
          </button>
        </div>
      </section>
    )
  }

  const currentPortfolio = portfolios[currentSlide]
  const colors = getCategoryColor(currentPortfolio.fields.作品分类)
  const CategoryIcon = getCategoryIcon(currentPortfolio.fields.作品分类)
  const isVideo = currentPortfolio.fields.作品附件类型 === '视频'
  const hasVideo = currentPortfolio.fields.演示视频 && currentPortfolio.fields.演示视频.length > 0

  return (
    <>
      <section id="portfolio" className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 pt-20">
        {/* 全屏横向滚动容器 */}
        <div 
          className="flex h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {portfolios.map((portfolio) => {
            const portfolioColors = getCategoryColor(portfolio.fields.作品分类)
            const PortfolioIcon = getCategoryIcon(portfolio.fields.作品分类)
            const portfolioIsVideo = portfolio.fields.作品附件类型 === '视频'
            const portfolioHasVideo = portfolio.fields.演示视频 && portfolio.fields.演示视频.length > 0
            const coverImage = portfolioIsVideo 
              ? portfolio.fields.演示视频?.[0]?.download_url || ''
              : portfolio.fields.作品附件?.[0]?.download_url || ''
            
            return (
              <div 
                key={portfolio.record_id}
                className="min-w-full h-full flex items-center justify-center relative"
              >
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid lg:grid-cols-12 gap-6 sm:gap-8 items-center">
                  {/* 左侧文本内容 - 4列 */}
                  <div className="col-span-12 lg:col-span-4 text-slate-800">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      viewport={{ once: true }}
                      className={`inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 ${portfolioColors.lightBg} ${portfolioColors.text} rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6`}
                    >
                      <PortfolioIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
                      {portfolio.fields.作品分类}
                    </motion.div>
                    
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                      viewport={{ once: true }}
                      className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 text-slate-900 leading-tight"
                    >
                      {portfolio.fields.作品名称}
                    </motion.h2>
                    
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      viewport={{ once: true }}
                      className="text-base sm:text-lg lg:text-xl text-slate-600 mb-4 sm:mb-6 leading-relaxed"
                    >
                      {portfolio.fields.作品简介}
                    </motion.p>

                    {/* 开发者信息 */}
                    {portfolio.fields.开发者 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3 mb-4"
                      >
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 ${portfolioColors.lightBg} rounded-full flex items-center justify-center`}>
                          <span className={`text-lg sm:text-xl font-bold ${portfolioColors.text}`}>
                            {portfolio.fields.开发者.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-lg text-slate-900">
                            {portfolio.fields.开发者}
                          </div>
                          <div className="text-slate-500 text-sm">
                            开发者
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* AI工具 */}
                    {portfolio.fields.AI工具 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="mb-3"
                      >
                        <div className="text-xs text-slate-500 mb-2">AI工具</div>
                        <div className="flex flex-wrap gap-2">
                          {portfolio.fields.AI工具.split(/[,，]/).slice(0, 3).map((tool, index) => (
                            <span 
                              key={index}
                              className={`px-3 py-1.5 ${portfolioColors.lightBg} ${portfolioColors.text} rounded-full text-xs font-medium`}
                            >
                              {tool.trim()}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* 核心功能 */}
                    {portfolio.fields.功能特性 && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.35 }}
                        viewport={{ once: true }}
                        className="mb-4"
                      >
                        <div className="text-xs text-slate-500 mb-2">核心功能</div>
                        <div 
                          className="text-sm text-slate-700 leading-relaxed"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {portfolio.fields.功能特性.split(/[,，]/).slice(0, 5).join('、')}
                        </div>
                      </motion.div>
                    )}

                    {/* 操作按钮 */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                      viewport={{ once: true }}
                      className="flex flex-wrap gap-3"
                    >
                      {portfolio.fields.作品跳转链接 && (
                        <a 
                          href={portfolio.fields.作品跳转链接}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center px-5 py-2.5 ${portfolioColors.bg} text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity`}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          访问作品
                        </a>
                      )}
                    </motion.div>
                  </div>
                  
                  {/* 右侧媒体展示 - 8列 */}
                  <div className="col-span-12 lg:col-span-8 flex items-center justify-center">
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                      className={`w-full h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[550px] bg-gradient-to-br ${portfolioColors.gradient} rounded-3xl flex items-center justify-center border border-slate-200 relative overflow-hidden shadow-xl`}
                    >
                      {coverImage ? (
                        <img 
                          src={coverImage} 
                          alt={portfolio.fields.作品名称}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-8">
                          <PortfolioIcon className={`w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 ${portfolioColors.text} mx-auto mb-4`} />
                          <p className="text-slate-500 text-sm">暂无预览图</p>
                        </div>
                      )}
                      
                      {/* 视频播放按钮 */}
                      {portfolioIsVideo && portfolioHasVideo && (
                        <div 
                          className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer group"
                          onClick={() => {
                            const url = portfolio.fields.演示视频?.[0]?.download_url || ''
                            if (url) {
                              window.open(url, '_blank')
                            }
                          }}
                        >
                          <div className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 ${portfolioColors.bg} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                            <Play className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white ml-1" />
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

        {/* 左右切换按钮 */}
        <button 
          onClick={() => setCurrentSlide((prev) => prev === 0 ? portfolios.length - 1 : prev - 1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all z-20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setCurrentSlide((prev) => prev === portfolios.length - 1 ? 0 : prev + 1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all z-20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* 底部指示器 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {portfolios.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide ? 'w-8 bg-orange-500' : 'bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        {/* 当前作品信息 */}
        <div className="absolute bottom-8 left-8 z-20 hidden lg:block">
          <div className="text-sm text-slate-500">
            {currentSlide + 1} / {portfolios.length}
          </div>
        </div>
      </section>

      {/* 视频弹窗 */}
      {videoModal.isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={closeVideoModal}
        >
          <div 
            className="relative max-w-4xl w-full mx-4 bg-black rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeVideoModal}
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <video 
              src={videoModal.url}
              controls
              autoPlay
              className="w-full aspect-video"
            />
          </div>
        </div>
      )}
    </>
  )
}
