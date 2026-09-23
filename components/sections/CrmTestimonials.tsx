'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote, MessageSquareQuote, X, ZoomIn } from 'lucide-react'

/* 用户评价截图 */
const testimonials = [
  {
    image: '/testimonials/review-1.png',
    user: 'Super小施-龙虾',
    tag: '外资药企超级销售视角',
    score: '5.0',
    date: '2026/9/22',
  },
  {
    image: '/testimonials/review-2.png',
    user: '阿尼',
    tag: '开发者 · 专业测评',
    score: '5.0',
    date: '2026/9/22',
  },
  {
    image: '/testimonials/review-3.png',
    user: 'kouxiaozi-stock',
    tag: '金融投资领域 · 专业测评',
    score: '5.0',
    date: '2026/9/22',
  },
]

export default function CrmTestimonials() {
  const [viewer, setViewer] = useState<{ image: string; user: string } | null>(null)

  const closeViewer = () => setViewer(null)

  return (
    <section id="testimonials" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-astro-orange/10 text-astro-orange text-xs font-bold tracking-[0.2em] uppercase mb-6">
            <Quote className="w-3.5 h-3.5" />
            用户评价
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-astro-ink mb-5 tracking-tight">
            真实买家 <span className="text-astro-orange">五星好评</span>
          </h2>
          <div className="inline-flex items-center gap-2 justify-center">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6" fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <span className="text-astro-inkSoft font-medium">平台精选专业测评 · 综合 5.0 分</span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((item, i) => (
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white border border-astro-line rounded-[2rem] overflow-hidden shadow-softLg hover:shadow-brand transition-shadow"
            >
              {/* 头部：用户信息 + 评分 */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-astro-line">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-astro-orange/80 to-astro-orange/40 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    <MessageSquareQuote className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-astro-ink leading-tight">{item.user}</div>
                    <div className="text-xs text-astro-inkSoft mt-0.5">{item.tag}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4" fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-astro-ink">{item.score}/5</span>
                </div>
              </div>

              {/* 评价截图 */}
              <div className="p-5 sm:p-6 bg-astro-bgAlt/50">
                <button
                  type="button"
                  onClick={() => setViewer({ image: item.image, user: item.user })}
                  className="group/img relative block w-full overflow-hidden rounded-xl border border-astro-line bg-white cursor-zoom-in text-left"
                  aria-label={`放大查看 ${item.user} 的评价截图`}
                >
                  <img
                    src={item.image}
                    alt={`${item.user} 的五星评价截图`}
                    className="w-full h-auto object-contain transition-transform duration-300 group-hover/img:scale-[1.02]"
                    loading="lazy"
                  />
                  <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-astro-ink/70 text-white text-xs font-medium backdrop-blur-sm opacity-0 group-hover/img:opacity-100 transition-opacity">
                    <ZoomIn className="w-3.5 h-3.5" />
                    点击放大
                  </span>
                </button>
              </div>

              {/* 底部：日期 + 综合评分 */}
              <div className="flex items-center justify-between px-6 py-4">
                <span className="text-xs text-astro-inkSoft">{item.date} · 平台精选</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-astro-green/10 text-astro-green text-xs font-bold">
                  <Star className="w-3.5 h-3.5" fill="currentColor" strokeWidth={0} />
                  综合 5 星
                </span>
              </div>
            </motion.figure>
          ))}
        </div>
      </div>

      {/* 图片放大预览 Lightbox */}
      {viewer && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-astro-ink/90 backdrop-blur-sm"
          onClick={closeViewer}
          role="dialog"
          aria-modal="true"
          aria-label="评价截图预览"
        >
          {/* 关闭按钮 */}
          <button
            type="button"
            onClick={closeViewer}
            className="absolute top-5 right-5 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white hover:bg-astro-orange transition-colors"
            aria-label="关闭预览"
          >
            <X className="w-6 h-6" />
          </button>

          {/* 大图 */}
          <motion.figure
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="relative max-w-4xl w-full mx-4 bg-white rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-astro-line bg-white">
              <div className="text-sm font-semibold text-astro-ink">
                {viewer.user} · 评价截图
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-astro-green/10 text-astro-green text-xs font-bold">
                <Star className="w-3.5 h-3.5" fill="currentColor" strokeWidth={0} />
                综合 5 星
              </span>
            </div>
            <div className="max-h-[80vh] overflow-auto p-2 bg-astro-bgAlt/50">
              <img
                src={viewer.image}
                alt={`${viewer.user} 的五星评价截图（放大预览）`}
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>
          </motion.figure>
        </div>
      )}
    </section>
  )
}