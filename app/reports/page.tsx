import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import AmumuBot from '@/components/AmumuBot'
import { reports } from './ReportsData'

export const metadata = {
  title: '销售报告预览',
  description: '阿木木AI CRM 生成的各类销售报告一览：线索、计划书、360画像、跟进、复盘、SOP优化、策略大脑运营等。',
}

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 顶部条 */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-astro-line">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <AmumuBot size={34} />
            <div className="min-w-0">
              <div className="text-astro-ink font-bold text-base leading-tight truncate">销售报告预览</div>
              <div className="text-astro-muted text-[10px] tracking-[0.18em] uppercase leading-tight">
                Reports Preview
              </div>
            </div>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-astro-line text-astro-inkSoft text-sm font-medium hover:border-astro-orange/40 hover:text-astro-orange transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-10">
        {/* 页头 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-astro-orange/10 text-astro-orange text-xs font-bold tracking-[0.2em] uppercase mb-4">
            What You'll Get
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-astro-ink mb-3 tracking-tight">
            阿木木生成的<span className="text-astro-orange">销售报告</span>
          </h1>
          <p className="text-astro-inkSoft max-w-2xl mx-auto leading-relaxed">
            开口说一句，就自动产出这些结构化报告（云文档链接，点开即看）。下面按类展示每份报告的真实结构与样例。
          </p>
        </div>

        {/* 报告卡片网格 */}
        <div className="grid gap-6 md:grid-cols-2">
          {reports.map((r) => {
            const Icon = r.icon
            return (
              <div
                key={r.id}
                className="group flex flex-col rounded-3xl border border-astro-line bg-white shadow-card overflow-hidden hover:shadow-softLg hover:-translate-y-1 transition-all"
              >
                {/* 头 */}
                <div className={`bg-gradient-to-r ${r.color} px-6 py-4 flex items-center gap-3`}>
                  <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white flex-shrink-0">
                    <Icon className="w-5 h-5" strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-bold text-base leading-tight">{r.name}</div>
                    <div className="text-white/80 text-[11px] mt-0.5">AC：{r.ag.join(' / ')}</div>
                  </div>
                </div>

                {/* 说明 */}
                <div className="px-6 pt-4 text-[13px] text-astro-inkSoft leading-relaxed">{r.desc}</div>

                {/* 文档式结构预览 */}
                <div className="mx-6 my-4 rounded-2xl border border-astro-line bg-astro-bgAlt/40 overflow-hidden">
                  <div className="flex items-center gap-1.5 px-4 py-2 bg-white border-b border-astro-line">
                    <span className="w-2 h-2 rounded-full bg-red-300" />
                    <span className="w-2 h-2 rounded-full bg-yellow-300" />
                    <span className="w-2 h-2 rounded-full bg-green-300" />
                    <span className="ml-2 text-[10px] text-astro-muted truncate">阿木木 AI CRM · {r.name}</span>
                  </div>
                  <ul className="p-4 space-y-1.5">
                    {r.sections.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-[12px] text-astro-inkSoft">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-astro-orange flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 样例 */}
                <div className="px-6 pb-5 border-t border-astro-line pt-3 -mt-1">
                  <div className="flex items-start gap-2 text-[12px] text-astro-muted leading-relaxed">
                    <Sparkles className="w-3.5 h-3.5 text-astro-orange flex-shrink-0 mt-0.5" />
                    <span>{r.sample}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <p className="mt-10 text-center text-[12px] text-astro-muted">
          每份报告均来自真实示例（示例-开头，随时间内置到你的技能库）；实际你拿到的是可点开的云文档链接。
        </p>
      </main>

      <footer className="border-t border-astro-line py-8">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 text-sm text-astro-muted">
          <span>阿木木AI CRM · 销售报告预览</span>
          <Link href="/" className="text-astro-orange font-medium hover:underline underline-offset-2">返回首页</Link>
        </div>
      </footer>
    </div>
  )
}