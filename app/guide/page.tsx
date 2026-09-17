import fs from 'fs'
import path from 'path'
import Link from 'next/link'
import { ArrowLeft, Files } from 'lucide-react'
import AmumuBot from '@/components/AmumuBot'
import GuideContent from './GuideContent'

export const metadata = {
  title: '使用说明',
  description:
    '阿木木AI CRM 用户安装使用手册：安装激活、5 站初始化、8 大模块用法、策略大脑原理与常见问题。',
}

export default function GuidePage() {
  const markdown = fs.readFileSync(path.join(process.cwd(), 'content', 'guide.md'), 'utf-8')

  return (
    <div className="min-h-screen bg-white">
      {/* 顶部条 */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-astro-line">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <AmumuBot size={34} />
            <div className="min-w-0">
              <div className="text-astro-ink font-bold text-base leading-tight truncate">使用说明</div>
              <div className="text-astro-muted text-[10px] tracking-[0.18em] uppercase leading-tight">
                User Manual
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/reports"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-astro-orange text-white text-sm font-semibold hover:bg-astro-orangeDark transition-colors shadow-brand flex-shrink-0"
            >
              <Files className="w-4 h-4" />
              销售报告预览
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-astro-line text-astro-inkSoft text-sm font-medium hover:border-astro-orange/40 hover:text-astro-orange transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              返回首页
            </Link>
          </div>
        </div>
      </header>

      {/* 正文 */}
      <main className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 pb-16">
        <GuideContent markdown={markdown} />
      </main>

      {/* 页脚 */}
      <footer className="border-t border-astro-line py-8">
        <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 text-sm text-astro-muted">
          <span>阿木木知晓AI CRM · 用户安装使用手册</span>
          <Link href="/" className="text-astro-orange font-medium hover:underline underline-offset-2">
            返回首页
          </Link>
        </div>
      </footer>
    </div>
  )
}
