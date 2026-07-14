'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ExternalLink, Play, Bot, Sparkles, Code, BarChart3, Gamepad2, Globe } from 'lucide-react'

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

  const getCategoryColor = (category: string) => {
    return categoryColors[category] || categoryColors['其他']
  }

  const getCategoryIcon = (category: string) => {
    return categoryIcons[category] || Sparkles
  }

  if (loading) {
    return (
      <section id="portfolio" className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center pt-16">
        <div className="text-center px-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-600 text-sm">加载作品中...</p>
        </div>
      </section>
    )
  }

  if (error || portfolios.length === 0) {
    return (
      <section id="portfolio" className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center pt-16">
        <div className="text-center px-4">
          <p className="text-slate-600 text-sm mb-3">{error || '暂无作品数据'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors text-sm"
          >
            重新加载
          </button>
        </div>
      </section>
    )
  }

  return (
    <section id="portfolio" className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 pt-16">
      <style>{`
        :root {
          --scale-factor: 1;
        }
        
        @media (max-width: 360px) {
          :root { --scale-factor: 0.75; }
        }
        
        @media (min-width: 361px) and (max-width: 480px) {
          :root { --scale-factor: 0.85; }
        }
        
        @media (min-width: 481px) and (max-width: 640px) {
          :root { --scale-factor: 0.92; }
        }
        
        @media (min-width: 641px) and (max-width: 768px) {
          :root { --scale-factor: 0.96; }
        }
        
        @media (min-width: 769px) and (max-width: 1024px) {
          :root { --scale-factor: 1; }
        }
        
        @media (min-width: 1025px) and (max-width: 1280px) {
          :root { --scale-factor: 1.05; }
        }
        
        @media (min-width: 1281px) {
          :root { --scale-factor: 1.1; }
        }
      `}</style>
      
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
              className="min-w-full h-full relative"
            >
              <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 min-h-[calc(100vh-64px)]">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-center gap-4 sm:gap-6 lg:gap-8">
                  <div className="w-full lg:w-2/5 order-2 lg:order-1">
                    <div className={`inline-flex items-center px-2.5 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 lg:px-5 lg:py-2.5 mb-2 sm:mb-3 md:mb-4 lg:mb-6 rounded-full text-[10px] sm:text-xs md:text-sm font-medium ${portfolioColors.lightBg} ${portfolioColors.text}`}>
                      <PortfolioIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 mr-1.5 sm:mr-2" />
                      {portfolio.fields.作品分类}
                    </div>
                    
                    <h2 className="text-[18px] sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 lg:mb-6 text-slate-900 leading-tight">
                      {portfolio.fields.作品名称}
                    </h2>
                    
                    <p className="text-[13px] sm:text-sm md:text-base lg:text-lg text-slate-600 mb-2 sm:mb-3 md:mb-4 lg:mb-6 leading-relaxed">
                      {portfolio.fields.作品简介}
                    </p>

                    {portfolio.fields.开发者 && (
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 ${portfolioColors.lightBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                          <span className={`text-xs sm:text-sm md:text-lg lg:text-xl font-bold ${portfolioColors.text}`}>
                            {portfolio.fields.开发者.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-[13px] sm:text-sm md:text-base lg:text-lg text-slate-900">
                            {portfolio.fields.开发者}
                          </div>
                          <div className="text-slate-500 text-[11px] sm:text-xs md:text-sm">开发者</div>
                        </div>
                      </div>
                    )}

                    {portfolio.fields.AI工具 && (
                      <div className="mb-2 sm:mb-3 md:mb-4">
                        <div className="text-[11px] sm:text-xs text-slate-500 mb-1.5 sm:mb-2">AI工具</div>
                        <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2">
                          {portfolio.fields.AI工具.split(/[,，]/).slice(0, 3).map((tool, index) => (
                            <span 
                              key={index}
                              className={`px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 ${portfolioColors.lightBg} ${portfolioColors.text} rounded-full text-[10px] sm:text-xs font-medium`}
                            >
                              {tool.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {portfolio.fields.功能特性 && (
                      <div className="mb-3 sm:mb-4 md:mb-6">
                        <div className="text-[11px] sm:text-xs text-slate-500 mb-1.5 sm:mb-2">核心功能</div>
                        <div className="text-[12px] sm:text-xs md:text-sm text-slate-700 leading-relaxed"
                             style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {portfolio.fields.功能特性.split(/[,，]/).slice(0, 4).join('、')}
                        </div>
                      </div>
                    )}

                    {portfolio.fields.作品跳转链接 && (
                      <a 
                        href={portfolio.fields.作品跳转链接}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 md:py-2.5 lg:py-3 ${portfolioColors.bg} text-white rounded-full text-[12px] sm:text-xs md:text-sm font-medium hover:opacity-90 transition-opacity`}
                      >
                        <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                        访问作品
                      </a>
                    )}
                  </div>
                  
                  <div className="w-full lg:w-3/5 order-1 lg:order-2">
                    <div className={`w-full aspect-[16/10] sm:aspect-[4/3] lg:aspect-[16/10] xl:aspect-[4/3] max-h-[300px] sm:max-h-[350px] md:max-h-[400px] lg:max-h-[500px] xl:max-h-[550px] bg-gradient-to-br ${portfolioColors.gradient} flex items-center justify-center border border-slate-200 relative overflow-hidden shadow-xl rounded-2xl`}>
                      {coverImage ? (
                        <img 
                          src={coverImage} 
                          alt={portfolio.fields.作品名称}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-3 sm:p-4 md:p-6">
                          <PortfolioIcon className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 ${portfolioColors.text} mx-auto mb-1.5 sm:mb-2`} />
                          <p className="text-slate-500 text-[11px] sm:text-xs md:text-sm">暂无预览图</p>
                        </div>
                      )}
                      
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
                          <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 ${portfolioColors.bg} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                            <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 text-white ml-0.5 sm:ml-1" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <button 
        onClick={() => setCurrentSlide((prev) => prev === 0 ? portfolios.length - 1 : prev - 1)}
        className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all z-20 active:scale-95"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </button>
      <button 
        onClick={() => setCurrentSlide((prev) => prev === portfolios.length - 1 ? 0 : prev + 1)}
        className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all z-20 active:scale-95"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </button>

      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-1.5 md:gap-2 z-20">
        {portfolios.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 rounded-full transition-all ${
              index === currentSlide ? 'w-4 sm:w-6 md:w-8 bg-orange-500' : 'bg-slate-300 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-3 sm:left-4 md:left-8 z-20 hidden lg:block">
        <div className="text-[10px] sm:text-xs md:text-sm text-slate-500">
          {currentSlide + 1} / {portfolios.length}
        </div>
      </div>
    </section>
  )
}
