'use client'

import { motion } from 'framer-motion'
import { HelpCircle } from 'lucide-react'

const faqs = [
  {
    q: '怎么收费？',
    a: '按人订阅。15 天试用 ¥0（自助安装，不含人工）；正式使用可选：1 个月 ¥98 / 人、3 个月 ¥258 / 人、1 年 ¥828 / 人。到期不续费即停用，不自动扣费。',
  },
  {
    q: '支持哪些平台 / 智能体？',
    a: '支持飞书、龙虾、WorkBuddy 等主流智能体——只要该智能体能安装技能、并能连接飞书多维表格，就能跑起来。数据始终存在你自己的飞书多维表格里。',
  },
  {
    q: '数据归谁？',
    a: '数据存放在你自己的飞书多维表格里，完全归你所有、随时可导出；我们不会把数据提供给第三方，也不会用于训练模型。',
  },
  {
    q: '话术会不会瞎编？',
    a: '不会。所有话术都从你公司的 SOP 里检索，标清来源；SOP 没覆盖的场景会如实告诉你「未覆盖」。',
  },
  {
    q: '我不会用怎么办？',
    a: '三步就上手：拿到激活码 → 填你的飞书表格链接（公司 SOP 知识库可选，后补也行）→ 完成授权。之后不用学模块名，开口说事就行。安装有图文指引可自助完成，需要专人陪跑 / 培训可单独购买。',
  },
]

export default function CrmFaq() {
  return (
    <section id="faq" className="py-24 lg:py-32 bg-white">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-astro-orange/10 text-astro-orange text-xs font-bold tracking-[0.2em] uppercase mb-6">
            FAQ
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-astro-ink mb-5 tracking-tight">
            常见问题
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white border border-astro-line rounded-2xl p-6 hover:shadow-soft transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-astro-orange/10 text-astro-orange flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-4 h-4" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-astro-ink mb-2 text-lg">{item.q}</h3>
                  <p className="text-sm text-astro-inkSoft leading-relaxed">{item.a}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
