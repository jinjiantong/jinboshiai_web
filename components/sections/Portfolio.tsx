'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink, Play, RefreshCw, Bot, Sparkles, Code, BarChart3, Gamepad2, Globe } from 'lucide-react'

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

const MAX_RETRY_ATTEMPTS = 3
const RETRY_DELAY_MS = 2000

export default function Portfolio() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying] = useState(true)
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [hasLoaded, setHasLoaded] = useState(false)
  const observerRef = useRef<HTMLDivElement>(null)

  const fetchPortfolios = useCallback(async (isRetry: boolean = false) => {
    if (!isRetry) {
      setLoading(true)
      setError(null)
    }
    
    try {
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/portfolios?type=home&t=${timestamp}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      })
      const result = await response.json()
      
      if (result.success && result.data.length > 0) {
        setPortfolios(result.data)
        setHasLoaded(true)
        setRetryCount(0)
      } else {
        setError('暂无作品数据')
        setHasLoaded(true)
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '网络错误'
      console.error('Fetch error:', errorMsg)
      
      if (!isRetry && retryCount < MAX_RETRY_ATTEMPTS) {
        setRetryCount(prev => prev + 1)
        console.log(`Retrying... attempt ${retryCount + 1}/${MAX_RETRY_ATTEMPTS}`)
        setTimeout(() => {
          fetchPortfolios(true)
        }, RETRY_DELAY_MS * (retryCount + 1))
      } else {
        setError('加载失败，请检查网络或稍后重试')
        setHasLoaded(true)
      }
    } finally {
      setLoading(false)
    }
  }, [retryCount])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasLoaded && !loading) {
            fetchPortfolios()
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '200px',
        threshold: 0.1,
      }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [hasLoaded, loading, fetchPortfolios])

  useEffect(() => {
    if (!isAutoPlaying || portfolios.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === portfolios.length - 1 ? 0 : prev + 1))
    }, 6000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, portfolios.length])

  const handleRetry = () => {
    setRetryCount(0)
    setError(null)
    setHasLoaded(false)
    fetchPortfolios()
  }

  const getCategoryColor = (category: string) => {
    return categoryColors[category] || categoryColors['其他']
  }

  const getCategoryIcon = (category: string) => {
    return categoryIcons[category] || Sparkles
  }

  if (!hasLoaded && !loading) {
    return (
      <section id="portfolio" className="relative min-h-[50vh] flex items-center justify-center pt-16 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center px-4">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-500 text-sm">即将加载作品...</p>
        </div>
      </section>
    )
  }

  if (loading) {
    return (
      <section id="portfolio" className="relative min-h-[50vh] flex items-center justify-center pt-16 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center px-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-600 text-sm">加载作品中{retryCount > 0 ? ` (重试 ${retryCount})` : ''}...</p>
        </div>
      </section>
    )
  }

  if (error || portfolios.length === 0) {
    return (
      <section id="portfolio" className="relative min-h-[50vh] flex items-center justify-center pt-16 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center px-4 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-slate-600 text-sm mb-4">{error || '暂无作品数据'}</p>
          <button 
            onClick={handleRetry}
            className="inline-flex items-center px-6 py-2.5 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            重新加载
          </button>
        </div>
      </section>
    )
  }

  return (
    <section id="portfolio" className="relative py-6 md:py-10 lg:py-14 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6" ref={observerRef}>
        <div className="flex overflow-hidden relative">
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {portfolios.map((portfolio) => {
              const colors = getCategoryColor(portfolio.fields.作品分类)
              const Icon = getCategoryIcon(portfolio.fields.作品分类)
              const isVideo = portfolio.fields.作品附件类型 === '视频'
              const hasVideo = portfolio.fields.演示视频 && portfolio.fields.演示视频.length > 0
              const coverImage = isVideo 
                ? portfolio.fields.演示视频?.[0]?.download_url || ''
                : portfolio.fields.作品附件?.[0]?.download_url || ''
              
              return (
                <div key={portfolio.record_id} className="min-w-full px-1 sm:px-2">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="relative">
                      <div className={`aspect-video sm:aspect-[4/3] lg:aspect-[16/10] bg-gradient-to-br ${colors.gradient}`}>
                        {coverImage ? (
                          <img 
                            src={coverImage} 
                            alt={portfolio.fields.作品名称}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center">
                            <Icon className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mb-2" />
                            <p className="text-slate-400 text-sm">暂无预览图</p>
                          </div>
                        )}
                      </div>
                      
                      {isVideo && hasVideo && (
                        <button 
                          onClick={() => {
                            const url = portfolio.fields.演示视频?.[0]?.download_url || ''
                            if (url) window.open(url, '_blank')
                          }}
                          className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity"
                        >
                          <div className={`w-16 h-16 sm:w-20 sm:h-20 ${colors.bg} rounded-full flex items-center justify-center shadow-lg`}>
                            <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" />
                          </div>
                        </button>
                      )}

                      <div className={`absolute top-3 left-3 px-3 py-1.5 ${colors.lightBg} ${colors.text} rounded-full text-xs font-medium flex items-center gap-1.5`}>
                        <Icon className="w-3.5 h-3.5" />
                        {portfolio.fields.作品分类}
                      </div>
                    </div>
                    
                    <div className="p-4 sm:p-5 lg:p-6">
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-2 sm:mb-3">
                        {portfolio.fields.作品名称}
                      </h3>
                      
                      <p className="text-sm sm:text-base text-slate-600 mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                        {portfolio.fields.作品简介}
                      </p>
                      
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 ${colors.lightBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <span className={`text-sm sm:text-base font-bold ${colors.text}`}>
                            {portfolio.fields.开发者.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-sm sm:text-base text-slate-900">
                            {portfolio.fields.开发者}
                          </div>
                        </div>
                      </div>
                      
                      {portfolio.fields.AI工具 && (
                        <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-4">
                          {portfolio.fields.AI工具.split(/[,，]/).slice(0, 3).map((tool, index) => (
                            <span 
                              key={index}
                              className={`px-2.5 py-1 ${colors.lightBg} ${colors.text} rounded-full text-xs font-medium`}
                            >
                              {tool.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {portfolio.fields.作品跳转链接 && (
                        <a 
                          href={portfolio.fields.作品跳转链接}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center px-4 py-2 sm:px-5 sm:py-2.5 ${colors.bg} text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity`}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          访问作品
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <button 
          onClick={() => setCurrentSlide((prev) => prev === 0 ? portfolios.length - 1 : prev - 1)}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all z-10 active:scale-95"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button 
          onClick={() => setCurrentSlide((prev) => prev === portfolios.length - 1 ? 0 : prev + 1)}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all z-10 active:scale-95"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="flex justify-center gap-2 mt-4 sm:mt-6">
          {portfolios.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                index === currentSlide ? 'w-8 sm:w-10 bg-orange-500' : 'bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
