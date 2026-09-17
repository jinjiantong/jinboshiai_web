'use client'

import { motion } from 'framer-motion'

export default function CrmTechArchitecture() {
  return (
    <section id="architecture" className="py-24 lg:py-32 bg-astro-bgAlt">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* 标题区 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-astro-orange/10 text-astro-orange text-xs font-bold tracking-[0.2em] uppercase mb-6">
            Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-astro-ink mb-5 tracking-tight">
            一个大脑 · 四层能力 · <span className="text-astro-orange">八个模块</span>
          </h2>
          <p className="text-lg text-astro-inkSoft max-w-2xl mx-auto leading-relaxed">
            一条持续学习的策略循环——这就是阿木木 AI 技能的技术架构。
          </p>
        </motion.div>

        {/* 架构图 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl border border-astro-line shadow-card p-4 sm:p-6 lg:p-8"
        >
          <img
            src="/images/amumu-architecture.svg"
            alt="阿木木AI 技能技术架构图：主动大脑 + 四层能力（记忆/识别/建议/提醒）+ 八个模块 + 策略循环"
            className="w-full h-auto block"
            loading="lazy"
          />
        </motion.div>

        {/* 底座说明 */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-astro-inkSoft">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-astro-line shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-astro-orange" />
            支撑底座：飞书数据空间 · 云端决策引擎 · 授权服务 · 后台管理
          </span>
        </div>
      </div>
    </section>
  )
}