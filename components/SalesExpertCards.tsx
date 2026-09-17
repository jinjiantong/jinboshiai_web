'use client'

import { motion } from 'framer-motion'
import AmumuBot from '@/components/AmumuBot'

interface ExpertCard {
  title: string
  days: number
  tasks: number
  badge?: '队长' | 'New'
  accent: string // tailwind classes for avatar ring + bg
}

const experts: ExpertCard[] = [
  { title: '线索获取', days: 11, tasks: 10, badge: '队长', accent: 'ring-astro-orange/30 bg-astro-orange/10' },
  { title: '商机管理', days: 10, tasks: 0, accent: 'ring-astro-yellow/30 bg-astro-yellow/10' },
  { title: '跟进管理', days: 8, tasks: 15, accent: 'ring-astro-green/30 bg-astro-green/10' },
  { title: '话术复盘', days: 8, tasks: 0, badge: 'New', accent: 'ring-astro-pink/30 bg-astro-pink/10' },
]

export default function SalesExpertCards() {
  return (
    <div className="w-full h-full flex flex-col">
      {/* 标题 */}
      <div className="flex items-center gap-2 mb-2 px-0.5 flex-shrink-0">
        <div className="flex -space-x-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-5 h-5 rounded-full bg-astro-orange/15 flex items-center justify-center ring-2 ring-white">
              <AmumuBot size={14} />
            </div>
          ))}
        </div>
        <span className="font-bold text-[12px] text-astro-ink">阿木木销售专家团</span>
        <span className="text-[10px] text-astro-muted">· 4 位 AI 老师</span>
      </div>

      {/* 四列卡片：撑满可用空间 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 flex-1">
        {experts.map((expert, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="relative h-full bg-white rounded-xl border border-astro-line px-2 py-3 flex flex-col items-center justify-center text-center hover:border-astro-orange/30 hover:shadow-sm transition-all"
          >
            {expert.badge && (
              <span className={`absolute top-1 right-1 px-1.5 rounded-full text-[9px] font-bold text-white ${expert.badge === '队长' ? 'bg-astro-orange' : 'bg-astro-green'}`}>
                {expert.badge}
              </span>
            )}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ring-2 ${expert.accent} overflow-hidden flex-shrink-0`}>
              <AmumuBot size={34} />
            </div>
            <div className="mt-1.5 font-semibold text-astro-ink text-[13px] leading-tight truncate max-w-full">{expert.title}</div>
            <div className="mt-0.5 text-[10px] text-astro-muted leading-tight truncate max-w-full">
              {expert.days} 天 · {expert.tasks} 任务
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
