'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Phone, MapPin, Globe, MessageCircle } from 'lucide-react'
import AmumuBot from '@/components/AmumuBot'
import PrivacyModal from '@/components/PrivacyModal'
import TermsModal from '@/components/TermsModal'

export default function Footer() {
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false)
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)

  const navLinks = [
    { name: '核心模块', href: '#problem' },
    { name: '价格', href: '#pricing' },
    { name: '常见问题', href: '#faq' },
  ]

  return (
    <>
      <footer className="bg-[#0F172A] text-white pt-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12">
            {/* 品牌信息 */}
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <AmumuBot size={46} />
                <div>
                  <div className="text-lg font-bold text-white">阿木木AI外挂</div>
                  <div className="text-xs text-white/40 tracking-[0.2em] uppercase">AI Sales Teacher</div>
                </div>
              </div>
              <p className="text-white/50 mb-6 leading-relaxed text-sm">
                你的 AI 销售老师，越用越会卖。会管客户、会教销售、还会自己进化——开口就能用，按人订阅，15 天免费用。
              </p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-white/8 border border-white/15 text-white/70 text-xs font-medium rounded-full">按人订阅，随时可停</span>
                <span className="px-3 py-1 bg-white/8 border border-white/15 text-white/70 text-xs font-medium rounded-full">支持主流智能体</span>
                <span className="px-3 py-1 bg-white/8 border border-white/15 text-white/70 text-xs font-medium rounded-full">越用越会卖</span>
              </div>
            </div>

            {/* 快速链接 */}
            <div>
              <h3 className="text-sm font-semibold mb-5 text-white">快速导航</h3>
              <ul className="space-y-3">
                {navLinks.map(({ name, href }) => (
                  <li key={name}>
                    <Link href={href} className="text-white/50 hover:text-white transition-colors text-sm">
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* 联系信息 */}
            <div>
              <h3 className="text-sm font-semibold mb-5 text-white">联系我们</h3>
              <ul className="space-y-3.5">
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-astro-orange mt-0.5" />
                  <div className="text-white/60 text-sm">
                    <div>13051202991</div>
                    <div className="inline-flex items-center gap-1.5 text-white/40 text-xs mt-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      微信：jinboshiai
                    </div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-astro-orange mt-0.5" />
                  <span className="text-white/60 text-sm">jinboshiai.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-astro-orange mt-0.5" />
                  <span className="text-white/60 text-sm">北京市顺义区临空经济核心区安庆大街7号良基科技广场A座316室</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 py-7 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white/30 text-xs text-center md:text-left">
              <p>© 2026 阿木木AI外挂. All rights reserved.</p>
              <p className="mt-1">吉ICP备2024020391号</p>
            </div>
            <div className="flex space-x-6">
              <button onClick={() => setIsPrivacyModalOpen(true)} className="text-white/40 hover:text-white text-xs transition-colors">
                隐私政策
              </button>
              <button onClick={() => setIsTermsModalOpen(true)} className="text-white/40 hover:text-white text-xs transition-colors">
                服务条款
              </button>
              <Link href="/dashboard" className="text-white/40 hover:text-white text-xs transition-colors">
                后台管理
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <PrivacyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
      <TermsModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />
    </>
  )
}
