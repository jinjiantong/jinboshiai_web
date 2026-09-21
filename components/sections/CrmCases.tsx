'use client'

import { motion } from 'framer-motion'
import { Mic, Target, MessageSquareQuote, Briefcase, TrendingUp, Clock, Sparkles } from 'lucide-react'

/* 案例数据：基于产品真实场景与收益点 */
const cases = [
  {
    icon: Mic,
    tag: '场景一 · 录入',
    title: '聊完客户，不用再填半小时表',
    desc: '通完电话说一段话，AI 自动整理客户、商机、跟进内容、待办和风险信号，字段全自动。',
    stat: '减少重复录入',
    statIcon: Clock,
  },
  {
    icon: Target,
    tag: '场景二 · 优先级',
    title: '100 个客户，先攻最该攻的',
    desc: 'AI 按「金额 × 赢率」智能排出成交冲刺 TOP3，把有限时间砸在最可能成交的客户上。',
    stat: 'TOP3 智能排序',
    statIcon: TrendingUp,
  },
  {
    icon: MessageSquareQuote,
    tag: '场景三 · 话术',
    title: '客户说「太贵了」，不再只会降价',
    desc: '从公司 SOP 里检索出标准话术全文，结合客户行业、场景、产品亮点给出回应和谈判思路。',
    stat: '快速调用 SOP 话术',
    statIcon: Sparkles,
  },
  {
    icon: Briefcase,
    tag: '场景四 · 方案',
    title: '新商机，快速整理销售方案',
    desc: '录入商机即自动完成客户画像分析（先联网调研后入库）+ 跟进策略推荐 + 成交概率预测，一键生成销售计划书（含作战指令卡）与审核报告。',
    stat: '录入即出全套方案',
    statIcon: Sparkles,
  },
]

export default function CrmCases() {
  return (
    <section id="cases" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* 标题区 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-astro-orange/10 text-astro-orange text-xs font-bold tracking-[0.2em] uppercase mb-6">
            Success Stories
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-astro-ink mb-5 tracking-tight">
            他们把 CRM，<span className="text-astro-orange">用成了 AI 老师</span>
          </h2>
          <p className="text-lg text-astro-inkSoft max-w-2xl mx-auto leading-relaxed">
            以下为模拟销售场景，用于说明典型操作方式；实际效果取决于数据完整度和团队执行。
          </p>
        </motion.div>

        {/* 案例卡片网格 */}
        <div className="grid sm:grid-cols-2 gap-6">
          {cases.map((item, i) => {
            const Icon = item.icon
            const StatIcon = item.statIcon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 2) * 0.1 }}
                className="group relative bg-astro-bgAlt border border-astro-line rounded-3xl p-7 lg:p-8 shadow-card hover:shadow-softLg hover:-translate-y-1 transition-all overflow-hidden"
              >
                {/* 序号水印 */}
                <div className="absolute -right-2 -top-6 text-8xl font-black text-astro-orange/10 select-none">0{i + 1}</div>

                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-astro-orange/10 text-astro-orange flex items-center justify-center">
                    <Icon className="w-6 h-6" strokeWidth={1.8} />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-white border border-astro-line text-astro-inkSoft text-xs font-semibold">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-astro-ink mb-2 leading-snug">{item.title}</h3>
                <p className="text-sm text-astro-inkSoft leading-relaxed mb-5">{item.desc}</p>

                {/* 收益条 */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-astro-orange/10 border border-astro-orange/20 text-astro-orange text-sm font-bold">
                  <StatIcon className="w-4 h-4" />
                  {item.stat}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* 底部一句话 */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10 text-astro-ink font-medium flex items-center justify-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-astro-orange" />
          示例使用模拟数据；正式使用时，系统会基于你的飞书数据与企业 SOP 给出建议。
        </motion.p>
      </div>
    </section>
  )
}
