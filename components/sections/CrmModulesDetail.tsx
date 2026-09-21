'use client'

import { motion } from 'framer-motion'
import {
  Target, Briefcase, ListChecks, BookOpenCheck, CalendarDays, LayoutDashboard, Sparkles, Clock,
} from 'lucide-react'

/* 七大模块完整功能 */
const moduleDetails = [
  {
    no: '一',
    name: '线索管理模块',
    slogan: '自动找到对的客户',
    icon: Target,
    features: [
      { name: '线索获取', desc: '读取你的产品，自动判断目标行业/渠道，联网调研生成客户线索（含联系方式、来源、评分、推荐话术）' },
      { name: '线索转商机', desc: '一键把线索转为商机，自动联动写入商机表 + 客户表' },
      { name: '线索跟进报告', desc: '生成「意向判断卡」（需求/预算/决策权/时间）+ 触达方案 + 开场话术' },
      { name: '单条线索快查', desc: '任意一条线索，一句话即可调出其来源、评分、联系人与推荐动作' },
      { name: '线索池管理', desc: '统一沉淀全部线索，按来源/评分/状态自动归类，避免线索散落丢失' },
      { name: '线索分配', desc: '支持将线索分配给指定销售或团队，接单即跟进、进度留痕' },
    ],
  },
  {
    no: '二',
    name: '商机管理模块',
    slogan: '录入即生成全套销售方案',
    icon: Briefcase,
    features: [
      { name: '商机录入', desc: '自动完成三项：客户画像（先联网调研后入库，7 维画像，查不到如实标注）+ 跟进策略 + 成交概率' },
      { name: '客户 360° 画像', desc: '跨表聚合 9 个维度，全面看清一个客户——AI 不靠猜，先调研再入库' },
      { name: '商机时间线', desc: '输出历史跟进时间线 + 后续跟进节奏（基于 SOP 阶段），不跳阶段、按证据推进' },
      { name: '销售计划书', desc: '含「作战指令卡」，置顶商机评级、赢率、本周必确认清单、关键风险，并匹配产品详情' },
      { name: '审核报告', desc: '自动生成 7 维合规审核报告' },
      { name: '主动赢单', desc: '商机确认成交后手动标记赢单，再发起七章节复盘与成功因子提取' },
      { name: '主动丢单', desc: '商机确认流失后手动标记丢单，再发起七章节复盘与失败原因分析' },
    ],
  },
  {
    no: '三',
    name: '跟进管理模块',
    slogan: '把「记录」升级成「作战」',
    icon: ListChecks,
    features: [
      { name: '自动结构化录入', desc: '语音/文字说一段话，自动结构化（客户、商机、内容、待办、风险信号）' },
      { name: '健康度评估', desc: '综合互动活跃度 + 决策链完整性 + 需求匹配度，输出红/黄/绿灯 + 挽救建议' },
      { name: '下一步行动', desc: '按商机当前阶段，推荐下一步该做什么' },
      { name: '话术推荐', desc: '从 SOP 检索完整话术全文，标清来源' },
      { name: '赢率预测', desc: '按「阶段赢率基准 × 健康度系数」计算，附置信度' },
      { name: '风险预警', desc: '自动识别超期未跟进等风险' },
      { name: '跟进策略报告', desc: '风险预警清单 + 今日优先跟进 Top10 + 团队执行看板' },
      { name: '跟进留痕可追溯', desc: '每次跟进自动生成独立跟进报告（13 节固定结构），历史跟进逐条可跳转原报告——全程留痕、谁都能复盘到哪一步' },
    ],
  },
  {
    no: '四',
    name: '话术 / SOP / 复盘模块',
    slogan: '让销冠经验可复制',
    icon: BookOpenCheck,
    features: [
      { name: '话术-流程查询', desc: '精确/语义/场景三级匹配，从 SOP 检索标准话术和流程' },
      { name: '赢单复盘', desc: '自动生成七章节复盘报告（含成功因子提取）' },
      { name: '丢单复盘', desc: '生成七章节复盘报告（含失败原因 + 改进建议）' },
      { name: '复盘防幻觉', desc: '赢/丢单复盘两段式生成：先聚合真实跟进数据出骨架、再分析成稿——绝不编数据、有据可依' },
      { name: '成功因子沉淀', desc: '从赢单中提取成功因子，聚合为「成功模式库」' },
      { name: 'SOP 优化报告', desc: '基于真实赢单/丢单数据，四维分析 SOP 该补什么、该改什么' },
    ],
  },
  {
    no: '五',
    name: '定时任务管理模块',
    slogan: '到点自动干活，不用盯',
    icon: Clock,
    features: [
      { name: '查看任务', desc: '所有定时任务一目了然：类型、频率、上次/下次运行时间与状态' },
      { name: '创建任务', desc: '支持每日策略大脑优化（每天 12:00：生成策略候选 + 赢/丢单因子打标）、定时日报/周报/月报/日程' },
      { name: '修改 / 暂停 / 恢复', desc: '随时调整频率与内容，不想跑就暂停，想跑就恢复' },
      { name: '删除任务', desc: '不再需要的任务一键删除，不留垃圾任务' },
      { name: '手动触发一次', desc: '不等定点，随时手动跑一次，立即拿到最新结果' },
    ],
  },
  {
    no: '六',
    name: '日历与报告模块',
    slogan: '自动汇报，不写报告',
    icon: CalendarDays,
    features: [
      { name: '今日日程同步', desc: '同步飞书日历 + 关联待跟进商机' },
      { name: '成交冲刺 TOP3', desc: '按「金额 × 赢率」智能排出今天最该攻的 3 个客户' },
      { name: '日报 / 周报 / 月报', desc: '自动汇总数据生成报告，个人和团队都支持，标题统一「报告类型 - 客户/日期」，可直接归档' },
      { name: '定时报告', desc: '设置定时，到点自动生成并推送' },
    ],
  },
  {
    no: '七',
    name: '老板驾驶舱模块',
    slogan: '一眼看懂全局，该找谁该救谁',
    icon: LayoutDashboard,
    features: [
      { name: '综合概览', desc: '核心指标 + 4 周期对比 + 核心发现 TOP3 + 行动建议 TOP3' },
      { name: '团队业绩', desc: '成交额、赢单、目标达成率、管道覆盖率' },
      { name: '销售漏斗', desc: '各阶段商机分布 + 转化率 + 瓶颈识别' },
      { name: '风险预警', desc: '超期商机、流失风险自动汇总到责任人' },
      { name: '团队人效', desc: '跟进量、成单量、人效排行一眼看清' },
      { name: '客户资产', desc: '客户规模与分布盘点，知道家底在哪' },
      { name: '趋势预测', desc: '成交额预测 + 置信区间，提前预判下期' },
      { name: '员工能力', desc: '按技能维度评估每个销售的能力成长' },
      { name: '策略结果', desc: '两个学习引擎每次迭代的效果反馈' },
      { name: '环比比较', desc: '同比/环比口径自动对齐，口径统一' },
      { name: 'SOP 优化建议', desc: '基于真实数据告诉你 SOP 该补什么、改什么' },
      { name: 'AI 大局观', desc: '销量四杠杆拆解，增长卡在哪、先补哪块' },
    ],
  },
]

export default function CrmModulesDetail() {
  return (
    <section id="modules-detail" className="py-24 lg:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* 标题区 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-astro-orange/10 text-astro-orange text-xs font-bold tracking-[0.2em] uppercase mb-6">
            Core Modules
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-astro-ink mb-5 tracking-tight">
            七大模块 <span className="text-astro-orange">完整功能</span>
          </h2>
          <p className="text-lg text-astro-inkSoft max-w-2xl mx-auto leading-relaxed">
            每个模块具体能做什么，逐项拆开讲清楚——从找客户到看全局，一共 50+ 项能力。
          </p>
        </motion.div>

        {/* 七大模块完整功能 */}
        <div className="grid gap-8">
          {moduleDetails.map((mod, mi) => {
            const Icon = mod.icon
            return (
              <motion.div
                key={mi}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white border border-astro-line rounded-3xl shadow-card overflow-hidden"
              >
                {/* 模块头 */}
                <div className="bg-gradient-to-r from-astro-orange to-astro-orangeDark px-6 lg:px-8 py-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white flex-shrink-0">
                    <Icon className="w-6 h-6" strokeWidth={1.8} />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold text-lg leading-tight">
                      {mod.no}、{mod.name}
                    </div>
                    <div className="text-white/80 text-xs mt-0.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-astro-yellow" />
                      {mod.slogan}
                    </div>
                  </div>
                  <span className="hidden sm:block text-4xl font-black text-white/15 select-none">0{mi + 1}</span>
                </div>

                {/* 功能列表 */}
                <div className="divide-y divide-astro-line">
                  {mod.features.map((feat, fi) => (
                    <div key={fi} className="grid md:grid-cols-[220px_1fr] gap-1 md:gap-6 px-6 lg:px-8 py-4 hover:bg-astro-orange/[0.02] transition-colors">
                      <div className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-astro-orange/10 text-astro-orange flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[11px] font-bold">{fi + 1}</span>
                        </div>
                        <span className="font-semibold text-astro-ink text-sm leading-relaxed">{feat.name}</span>
                      </div>
                      <p className="text-sm text-astro-inkSoft leading-relaxed pl-8 md:pl-0">{feat.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
