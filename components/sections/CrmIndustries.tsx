'use client'

import { motion } from 'framer-motion'
import { Building2, UserRound, Users, HeartHandshake, Sparkles } from 'lucide-react'

/* A. 企业服务类（B2B） */
const groupA = [
  { name: 'SaaS / 企业软件', why: '长周期、多角色决策、需要方案跟进' },
  { name: '专业服务（咨询 / 法律 / 财税 / 人力 / 猎头 / 广告 / IT）', why: '卖「信任 + 方案」，顾问式销售' },
  { name: '工业品 / 设备 / 制造解决方案', why: '大额、需定制、决策链复杂' },
  { name: '供应链 / 大宗贸易', why: '关系型、多轮谈判' },
  { name: '招商加盟 / 渠道分销', why: '要管理大量潜在加盟商 / 代理商' },
]

/* B. 高客单价个人服务类（B2C） */
const groupB = [
  { name: '保险', why: '一对一、话术密集、复购转介绍' },
  { name: '房产', why: '高客单、多轮带看 / 跟进' },
  { name: '教育 / 课程 / 留学', why: '顾问式、需长期跟进转化' },
  { name: '医美 / 健康管理 / 高端医疗', why: '信任品、话术敏感、需维护' },
  { name: '金融理财 / 财富管理', why: '高客单、强信任、周期长' },
  { name: '高端消费（汽车 / 家装 / 定制家居 / 旅游 / 移民）', why: '客单高、需方案 + 多次沟通' },
]

/* C. 私域 / 社群运营类（DTC） */
const groupC = ['微商', '私域电商', '会员制 / 订阅制', '社群团购', '知识付费']

/* D. 客户成功 / 续费类 */
const groupD = ['客户成功（CSM）', '售后服务', '续费 / 复购型业务']

export default function CrmIndustries() {
  return (
    <section id="industries" className="py-24 lg:py-32 bg-astro-bgAlt">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* 标题区 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-astro-orange/10 text-astro-orange text-xs font-bold tracking-[0.2em] uppercase mb-6">
            Industries
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-astro-ink mb-5 tracking-tight">
            使用场景与<span className="text-astro-orange">适用行业</span>
          </h2>
          <p className="text-lg text-astro-inkSoft max-w-2xl mx-auto leading-relaxed">
            从 B2B 到 DTC，从顾问式销售到续费维护——所有「靠人跟单」的生意，都适合阿木木。
          </p>
        </motion.div>

        {/* A. 企业服务类（B2B） */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border border-astro-line rounded-3xl p-7 lg:p-9 shadow-card mb-8"
        >
          <div className="flex flex-wrap items-center gap-3 mb-7">
            <div className="w-11 h-11 rounded-2xl bg-astro-orange/10 text-astro-orange flex items-center justify-center">
              <Building2 className="w-6 h-6" strokeWidth={1.8} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-astro-ink">A. 企业服务类</h3>
              <div className="text-xs text-astro-muted font-semibold tracking-wider">B2B · 原生主战场</div>
            </div>
            <span className="ml-auto px-3.5 py-1.5 rounded-full bg-astro-orange/10 border border-astro-orange/25 text-astro-orange text-xs font-bold">
              原生主战场
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {groupA.map((item, i) => (
              <div key={i} className="group rounded-2xl border border-astro-line bg-astro-bgAlt/60 p-4 hover:border-astro-orange/40 hover:bg-astro-orange/[0.03] transition-all">
                <div className="font-semibold text-astro-ink text-sm leading-snug mb-1.5">{item.name}</div>
                <div className="text-xs text-astro-inkSoft leading-relaxed">{item.why}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* B. 高客单价个人服务类（B2C） */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-astro-line rounded-3xl p-7 lg:p-9 shadow-card mb-8"
        >
          <div className="flex flex-wrap items-center gap-3 mb-7">
            <div className="w-11 h-11 rounded-2xl bg-astro-green/10 text-astro-green flex items-center justify-center">
              <UserRound className="w-6 h-6" strokeWidth={1.8} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-astro-ink">B. 高客单价个人服务类</h3>
              <div className="text-xs text-astro-muted font-semibold tracking-wider">B2C 顾问式 · 最易迁移</div>
            </div>
            <span className="ml-auto px-3.5 py-1.5 rounded-full bg-astro-green/10 border border-astro-green/25 text-astro-green text-xs font-bold">
              最易迁移
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {groupB.map((item, i) => (
              <div key={i} className="group rounded-2xl border border-astro-line bg-astro-bgAlt/60 p-4 hover:border-astro-green/40 hover:bg-astro-green/[0.03] transition-all">
                <div className="font-semibold text-astro-ink text-sm leading-snug mb-1.5">{item.name}</div>
                <div className="text-xs text-astro-inkSoft leading-relaxed">{item.why}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* C. 私域 / 社群运营类（DTC） */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="bg-white border border-astro-line rounded-3xl p-7 lg:p-9 shadow-card mb-8"
        >
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-astro-pink/10 text-astro-pink flex items-center justify-center">
              <Users className="w-6 h-6" strokeWidth={1.8} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-astro-ink">C. 私域 / 社群运营类</h3>
              <div className="text-xs text-astro-muted font-semibold tracking-wider">DTC</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5 mb-5">
            {groupC.map((item, i) => (
              <span key={i} className="px-3.5 py-1.5 rounded-full bg-astro-bgAlt border border-astro-line text-astro-ink text-xs font-semibold">
                {item}
              </span>
            ))}
          </div>
          <p className="text-sm text-astro-inkSoft leading-relaxed">
            一对多，但需要逐个跟进、复购、关系维护——阿木木把「社群里的每个人」都当成客户跟进。
          </p>
        </motion.div>

        {/* D. 客户成功 / 续费类 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-astro-line rounded-3xl p-7 lg:p-9 shadow-card"
        >
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-astro-yellow/15 text-astro-yellow flex items-center justify-center">
              <HeartHandshake className="w-6 h-6" strokeWidth={1.8} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-astro-ink">D. 客户成功 / 续费类</h3>
              <div className="text-xs text-astro-muted font-semibold tracking-wider">CSM · 售后服务</div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5 mb-5">
            {groupD.map((item, i) => (
              <span key={i} className="px-3.5 py-1.5 rounded-full bg-astro-bgAlt border border-astro-line text-astro-ink text-xs font-semibold">
                {item}
              </span>
            ))}
          </div>
          <p className="text-sm text-astro-inkSoft leading-relaxed">
            核心是「持续维护关系 + 防止流失」——正好用上跟进提醒、风险预警、健康度评估。
          </p>
        </motion.div>

        {/* 底部收束 */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12 text-astro-ink font-medium flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-astro-orange" />
          不管你在哪个行业，只要靠「人」跟单，阿木木就能帮上忙。
        </motion.p>
      </div>
    </section>
  )
}
