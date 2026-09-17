'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Check, Crown, ShieldCheck, Gift, Users, Sparkles, CalendarClock, Brain } from 'lucide-react'

const DEFAULT_PRICING = { month: 98, quarter: 258, year: 828 }

// 根据云端定价动态生成本地展示数据
function buildPlans(p: { month: number; quarter: number; year: number }) {
  const m = Number(p.month) || 0
  const qm = Math.round(Number(p.quarter) / 3)
  const ym = Math.round(Number(p.year) / 12)
  const qSave = Math.round(m * 3 - Number(p.quarter))
  const ySave = Math.round(m * 12 - Number(p.year))
  return [
    {
      name: '1 个月',
      team: '按月续，最灵活',
      price: `¥${m}`,
      unit: '/ 人 / 月',
      monthly: `折合 ¥${m} / 人 / 月`,
      features: ['全部 7 大模块', '客户 / 商机不限数量', '订阅期内免费升级 + 自动更新', '随时可停，不续费即到期'],
      highlight: false,
    },
    {
      name: '3 个月',
      team: '小步试水，比月付省',
      price: `¥${Number(p.quarter)}`,
      unit: '/ 人 / 3 个月',
      monthly: `折合 ¥${qm} / 人 / 月` + (qSave > 0 ? ` · 比月付省 ¥${qSave}` : ''),
      features: ['全部 7 大模块', '客户 / 商机不限数量', '订阅期内免费升级 + 自动更新', '随时可停，不续费即到期'],
      highlight: false,
    },
    {
      name: '1 年',
      team: '最划算，主推',
      price: `¥${Number(p.year)}`,
      unit: '/ 人 / 年',
      monthly: `折合 ¥${ym} / 人 / 月` + (ySave > 0 ? ` · 比月付省 ¥${ySave}` : ''),
      features: [
        '全部 7 大模块',
        '客户 / 商机不限数量',
        '订阅期内免费升级 + 自动更新',
        '远程安装 1 次（≥3 人）',
      ],
      highlight: true,
    },
  ]
}

const notes = [
  { icon: ShieldCheck, text: '数据始终存放在你自己的飞书多维表格里，我们不存储你的业务数据' },
  { icon: Users, text: '价格按人计，团队增减席位随时调整' },
  { icon: Sparkles, text: '15 天试用 ¥0，含全部功能，自助安装（提供图文指引）；正式订阅不含人工服务，需要上手陪跑 / 深度定制可单独购买' },
  { icon: CalendarClock, text: '订阅到期不续费即停用，不自动扣费；订阅期内功能更新免费升级' },
]

export default function CrmPricing() {
  const [pricing] = useState<{ month: number; quarter: number; year: number }>(DEFAULT_PRICING)
  const plans = buildPlans(pricing)

  return (
    <section id="pricing" className="py-24 lg:py-32 bg-astro-bgAlt">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-astro-orange/10 text-astro-orange text-xs font-bold tracking-[0.2em] uppercase mb-6">
            Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-astro-ink mb-5 tracking-tight">
            按人订阅，<span className="text-astro-orange">先免费用 15 天</span>
          </h2>
          <p className="text-lg text-astro-inkSoft max-w-2xl mx-auto leading-relaxed mb-8">
            不绑定年费，也不强制长周期——按月也能用，觉得值再续。数据始终在你自己手里。
          </p>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-astro-orange/10 border border-astro-orange/25 text-astro-orange text-sm font-semibold">
            <Gift className="w-4 h-4" />
            15 天试用 · ¥0（自助安装，不含人工）
          </div>
        </motion.div>

        {/* 试用保障 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <div className="relative bg-gradient-to-r from-astro-green/[0.08] to-white border-2 border-astro-green/30 rounded-3xl p-6 lg:p-7 shadow-card overflow-hidden">
            <div className="absolute -right-8 -top-8 opacity-[0.06] rotate-12">
              <Gift className="w-40 h-40 text-astro-green" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-astro-green text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-astro-green/25">
                <ShieldCheck className="w-7 h-7" strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <div className="font-bold text-astro-ink text-lg lg:text-xl mb-1">
                  先免费试用 15 天，<span className="text-astro-green">¥0，自助安装</span>
                </div>
                <p className="text-sm text-astro-inkSoft leading-relaxed">
                  试用价 <span className="font-semibold text-astro-ink">¥0</span>，含全部功能，<span className="font-semibold text-astro-ink">自助安装（提供图文指引），不含人工服务</span>。试用期满后按所选周期计费，到期不续费即停用，不自动扣费。
                </p>
              </div>
              <div className="flex sm:flex-col gap-2 sm:gap-1.5 items-center sm:items-end flex-shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-astro-green/10 text-astro-green text-xs font-bold">
                  <Gift className="w-3.5 h-3.5" />
                  15 天 · ¥0
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-astro-orange/10 text-astro-orange text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  不自动续费
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-3xl p-8 flex flex-col transition-all ${
                plan.highlight
                  ? 'bg-white border-2 border-astro-orange shadow-softLg lg:-translate-y-3'
                  : 'bg-white border border-astro-line shadow-card hover:shadow-soft hover:-translate-y-1'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-astro-orange text-white text-xs font-bold shadow-md shadow-astro-orange/30 inline-flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" />
                  最划算
                </div>
              )}

              <div className="text-sm text-astro-inkSoft mb-1.5 font-medium">{plan.team}</div>
              <h3 className={`text-2xl font-bold mb-6 ${plan.highlight ? 'text-astro-orange' : 'text-astro-ink'}`}>
                {plan.name}
              </h3>
              <div className="mb-7">
                <div>
                  <span className={`text-4xl font-bold tracking-tight ${plan.highlight ? 'text-astro-orange' : 'text-astro-ink'}`}>
                    {plan.price}
                  </span>
                  <span className="text-sm text-astro-inkSoft ml-1.5">{plan.unit}</span>
                </div>
                <div className={`mt-1 text-xs font-semibold ${plan.highlight ? 'text-astro-orange/80' : 'text-astro-muted'}`}>
                  {plan.monthly}
                </div>
              </div>

              <ul className="space-y-3.5 mb-8 flex-1">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm text-astro-ink">
                    <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-astro-orange' : 'text-astro-green'}`} strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`inline-flex items-center justify-center px-6 py-3.5 rounded-full font-semibold transition-all ${
                  plan.highlight
                    ? 'bg-astro-orange hover:bg-astro-orangeDark text-white shadow-lg shadow-astro-orange/25 hover:shadow-astro-orange/40'
                    : 'bg-astro-bgAlt hover:bg-astro-ink hover:text-white text-astro-ink border border-astro-line'
                }`}
              >
                开始 15 天免费试用
              </a>
            </motion.div>
          ))}
        </div>

        {/* 策略引擎强调（所有周期都含） */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="max-w-4xl mx-auto mt-10"
        >
          <div className="relative bg-gradient-to-r from-astro-orange/[0.08] via-white to-astro-orange/[0.04] border-2 border-astro-orange/30 rounded-3xl p-7 lg:p-8 overflow-hidden">
            <div className="absolute -right-6 -top-8 opacity-[0.07] rotate-12">
              <Brain className="w-40 h-40 text-astro-orange" />
            </div>
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-astro-orange text-white text-xs font-bold tracking-[0.15em] uppercase mb-4">
                <Brain className="w-3.5 h-3.5" />
                Strategy Engine
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-astro-ink mb-2 leading-snug">
                所有周期都包含<span className="text-astro-orange">「策略引擎」</span>
              </h3>
              <p className="text-base lg:text-lg text-astro-inkSoft mb-6 leading-relaxed">
                基础版让你看懂一单，<span className="font-semibold text-astro-ink">策略引擎让全团队看懂一百单</span>。
              </p>

              {/* 运行链路 */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-2 mb-5">
                {['赢单后自动复盘', '提取 6 类成功因子', '多单聚合成模式', '置信度达标才生效', '回写结果，有效升级 / 无效淘汰'].map((step, i, arr) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-lg bg-white border border-astro-orange/25 text-[11px] font-semibold text-astro-ink shadow-sm">{step}</span>
                    {i < arr.length - 1 && <span className="text-astro-orange font-black text-xs">→</span>}
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/80 border border-astro-line px-4 py-3">
                  <div className="text-[11px] font-bold text-astro-orange mb-1">生效门槛（样本不足不更新）</div>
                  <div className="text-[11px] text-astro-inkSoft leading-relaxed">
                    行业 / 规模 / 阶段各 ≥5 单、竞品 ≥3 单，且出现率 ≥60%；置信度分三档：高（≥10 单且 ≥70%）/ 中（5–9 单）/ 低（&lt;5 单）
                  </div>
                </div>
                <div className="rounded-xl bg-white/80 border border-astro-line px-4 py-3">
                  <div className="text-[11px] font-bold text-astro-orange mb-1">安全机制（防止被偶然数据带偏）</div>
                  <div className="text-[11px] text-astro-inkSoft leading-relaxed">
                    单次限幅（渠道 ≤2、场景 ≤1）+ 策略僵化保护 + 版本号可追溯、可回滚
                  </div>
                </div>
              </div>

              <p className="mt-4 text-[11px] text-astro-muted leading-relaxed">
                说明：策略引擎靠真实赢单积累，单量稳定、复盘认真的团队通常 3–6 个月开始看到可用模式；我们不做因果承诺，样本不足时会明确标注「仅供参考」。
              </p>
            </div>
          </div>
        </motion.div>

        {/* 价格说明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl mx-auto mt-10 space-y-3"
        >
          {notes.map((n, i) => (
            <div key={i} className="flex items-start gap-3 text-sm text-astro-inkSoft">
              <n.icon className="w-4 h-4 text-astro-orange flex-shrink-0 mt-0.5" strokeWidth={2} />
              <span>{n.text}</span>
            </div>
          ))}
          <div className="pt-3 border-t border-astro-line text-sm text-astro-inkSoft">
            <span className="font-semibold text-astro-ink">50 人以上 / 私有化 / 深度定制</span>：请联系我们单独报价。
          </div>
        </motion.div>
      </div>
    </section>
  )
}
