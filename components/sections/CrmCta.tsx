'use client'

import { motion } from 'framer-motion'
import { Phone, MessageCircle, ArrowRight } from 'lucide-react'
import AmumuBot from '@/components/AmumuBot'

export default function CrmCta() {
  return (
    <section id="contact" className="py-24 lg:py-32 bg-white">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-astro-orange to-astro-orangeDark p-10 lg:p-16 text-center shadow-softLg"
        >
          {/* 背景装饰 */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10" />
            <div className="absolute -bottom-28 -left-24 w-96 h-96 rounded-full bg-white/5" />
            <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '28px 28px' }} />
          </div>

          <div className="relative">
            <div className="flex justify-center mb-8">
              <div className="bg-white/15 border border-white/30 rounded-full p-3">
                <AmumuBot size={84} />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">
              你的 AI 销售老师，越用越会卖
            </h2>
            <p className="text-lg text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">
              按人订阅，15 天试用 ¥0。预约免费演示，看看阿木木怎么教你越卖越好。
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="tel:13051202991"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white text-astro-orange font-bold hover:bg-astro-bgAlt transition-colors shadow-lg"
              >
                <Phone className="w-5 h-5" strokeWidth={2.5} />
                13051202991
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold border border-white/40 transition-colors"
              >
                <MessageCircle className="w-5 h-5" strokeWidth={2.5} />
                微信：jinboshiai
              </a>
              <a
                href="#hero"
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full text-white font-semibold hover:bg-white/10 transition-colors"
              >
                回到顶部
                <ArrowRight className="w-5 h-5 -rotate-90" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
