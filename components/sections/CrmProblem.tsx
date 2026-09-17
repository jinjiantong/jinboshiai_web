'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import {
  Play, Target, Briefcase, ListChecks, BookOpenCheck, CalendarDays, LayoutDashboard, Sparkles,
  Mic, Lightbulb, Activity, RefreshCcw, ListTodo, TriangleAlert, TrendingUp,
  Brain, Cpu, ShieldCheck, History, Clock, Trophy, Lock, Check, X,
} from 'lucide-react'
import AmumuBot from '@/components/AmumuBot'

/* 一句话定位 */
const briefs = [
  { name: '线索管理', slogan: '自动找到对的客户', icon: Target },
  { name: '商机管理', slogan: '录入即生成全套销售方案', icon: Briefcase },
  { name: '跟进管理', slogan: '把「记录」升级成「作战」', icon: ListChecks },
  { name: '话术/SOP/复盘', slogan: '让销冠经验可复制', icon: BookOpenCheck },
  { name: '定时任务', slogan: '到点自动干活，不用盯', icon: Clock },
  { name: '日历与报告', slogan: '自动汇报，不写报告', icon: CalendarDays },
  { name: '老板驾驶舱', slogan: '一眼看懂全局，该找谁该救谁', icon: LayoutDashboard },
]

/* 核心 AI 大脑：六个真实场景（没大脑 vs 有大脑） */
const brainScenes = [
  {
    tag: '承诺追踪',
    title: '客户承诺到期没人在意',
    without: '销售上周答应检验科王主任「周三给样本比对方案」，最近忙别的就忘了；客户也没催，商机静静凉了两周。',
    with: '大脑在你承诺的到期日前 1 天主动提醒——商机「XX医院检验科」：王主任 9/18 前等你的「样本比对方案」（依据：9/10 跟进原文承诺）。建议今天上午补发，话术参见 SOP 第二章「方案沟通」，可一键转成行动。',
    solve: '把「靠销售记性」变成「系统盯着承诺」，减少因遗忘导致的进度流失。',
  },
  {
    tag: '失联预警',
    title: '高价值商机突然失联',
    without: '一个 600 万商机，技术负责人两轮没回消息，销售以为「在走流程」，实际已转向别家，直到竞标才知道损失。',
    with: '超过 SOP 失联阈值（如「N 天无跟进＝失联预警」）自动触发——「赛科动力」商机已达 4 天无跟进（SOP 阈值 3 天），且该商机高价值（600 万）。建议今天安排一次回访，重点确认竞品动向。',
    solve: '在流失成事实前提醒，不靠人盯。',
  },
  {
    tag: '阶段停滞',
    title: '商机卡在一个阶段不动',
    without: '商机停在「方案沟通」两个月没推进，销售自己都说不清卡在哪一步。',
    with: '阶段更新时间超过 SOP 标准周期即提醒——「XX商机」停在「方案沟通」已 25 天，超过 SOP 标准周期。建议推动到「商务谈判」，或确认是否竞品已报价。',
    solve: '把「隐性卡壳」变成「显性行动项」，推动漏斗往前走。',
  },
  {
    tag: '行动闭环',
    title: '行动计划到期没人收尾',
    without: '医生要的产品资料、内部要审批的折扣，行动建了但到期没人跟进完成。',
    with: '复用行动管理，到期 D-1 / D 主动提醒——行动「整理装机许可资料」今日到期（负责人：你）。建议完成并更新状态，或延期并说明原因。',
    solve: '行动从「建了就完」变成「到期必催」，闭环成功率更高。',
  },
  {
    tag: '模式命中',
    title: '赢了单的经验，及时复用给相似客户',
    without: '赢单复盘沉淀了「这类客户成功的关键是第一轮先出验证对比方案」，但销售面对下一个相似客户时想不到去用。',
    with: '新商机画像命中「策略模式库・生效中」成功模式时主动推——新商机「某三甲医院检验科」匹配成功模式「医疗检验：先样本比对 → 再方案谈判」（样本 8 单，lift ×2.1，置信度高）。建议第一轮先给比对方案。',
    solve: '把「躺着的经验库」变成「主动送到客户跟前的战术」，经验真正被复用。',
  },
  {
    tag: '负向预警',
    title: '负向信号提前预警，不再重蹈覆辙',
    without: '上一单丢在「方案太复杂、客户决策链没打通」，下一单同类客户又开始走老路。',
    with: '命中负向因子场景时提前预警——该商机与丢单模式「决策人未覆盖」高匹配（有丢单负因子依据）。建议尽早触达最终决策人，而非只对接科室。',
    solve: '不止复盘，还能在下一次同类场景提前规避。',
  },
]

/* 核心 AI 能力（七项，完整原文） */
const aiSkills = [
  {
    icon: Mic,
    title: '语音/对话录入，自动结构化',
    desc: '说一段话（或发语音），AI 自动识别出：客户是谁、商机是什么、跟进内容、待办事项、风险信号——不用再手动填字段。',
  },
  {
    icon: Lightbulb,
    title: '智能话术推荐（严格基于你的 SOP）',
    desc: '每一个场景，从你公司的 SOP 里检索出标准话术全文，标出来源。不会凭空编话术，SOP 没有的场景会如实告诉你。',
  },
  {
    icon: Activity,
    title: '商机健康度评估 + 赢率预测',
    desc: '综合「互动活跃度、决策链完整性、需求匹配度」给商机打分（红/黄/绿），并按「阶段 × 健康度」算出赢率——让你知道哪些单该重点攻、哪些单要救。',
  },
  {
    icon: RefreshCcw,
    title: '自动复盘，沉淀「成功经验」',
    desc: '赢单/丢单后，AI 自动复盘（六/七章节），并提取「成功因子」，沉淀成团队可复用的成功经验。',
  },
  {
    icon: ListTodo,
    title: '今日作战清单',
    desc: '每天打开，直接告诉你：今天最该攻的 3 个客户（成交冲刺 TOP3）、每个客户的下一步动作、开场话术、联系方式——按「金额 × 赢率」智能排序。',
  },
  {
    icon: TriangleAlert,
    title: '风险预警',
    desc: '自动扫描所有商机，把「超期未跟进」的商机按轻重缓急标出来，并定位到责任人——防止商机静悄悄流失。',
  },
  {
    icon: TrendingUp,
    title: '成交预测 + AI 大局观',
    desc: '用「加权管线 + 指数平滑」融合算法预测下期成交额（带置信区间），并用「销量四杠杆」（线索量 × 转商机率 × 赢单率 × 客单价）拆解，告诉你增长卡在哪、该先补哪块。',
  },
]

export default function CrmProblem() {
  const [videoUrl, setVideoUrl] = useState('')

  useEffect(() => {
    fetch('/api/site-config')
      .then((r) => r.json())
      .then((res) => {
        if (res && res.ok && res.data && res.data.videoUrl) setVideoUrl(res.data.videoUrl)
      })
      .catch(() => {})
  }, [])

  return (
    <section id="problem" className="py-24 lg:py-32 bg-astro-bgAlt">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* ============ 视频演示区：满屏幕视频 ============ */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-astro-orange/10 text-astro-orange text-xs font-bold tracking-[0.2em] uppercase mb-5">
              <Play className="w-3.5 h-3.5" />
              满屏幕视频
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-astro-ink tracking-tight">
              阿木木AI CRM <span className="text-astro-orange">真实场景视频演示</span>
            </h2>
          </div>

          {/* 视频容器 - 满宽 16:9 */}
          <div className="relative rounded-[2rem] overflow-hidden bg-white border border-astro-line shadow-softLg">
            {videoUrl ? (
              <div className="relative aspect-video bg-black">
                <video
                  src={videoUrl}
                  controls
                  playsInline
                  className="absolute inset-0 w-full h-full object-contain"
                  poster=""
                />
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-astro-line text-astro-ink text-xs font-medium shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-astro-orange animate-pulse" />
                  真实场景演示视频
                </div>
              </div>
            ) : (
            <div className="relative aspect-video flex items-center justify-center bg-gradient-to-br from-astro-bgAlt via-white to-astro-orange/[0.08]">
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.12]">
                <AmumuBot size={320} />
              </div>
              <button
                type="button"
                aria-label="播放视频"
                className="group relative flex items-center justify-center z-10"
              >
                <span className="absolute w-28 h-28 rounded-full bg-astro-orange/20 animate-ping" />
                <span className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-astro-orange flex items-center justify-center shadow-brand group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 lg:w-10 lg:h-10 text-white ml-1" fill="currentColor" />
                </span>
              </button>
              <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-astro-line text-astro-ink text-xs font-medium shadow-sm">
                <span className="w-2 h-2 rounded-full bg-astro-orange animate-pulse" />
                视频广告位 · 待接入（在后台「视频URL」tab 填入直链即可播放）
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-astro-ink/80 text-white text-xs font-medium backdrop-blur-sm whitespace-nowrap">
                <AmumuBot size={16} />
                阿木木 AI CRM · 真实场景演示
              </div>
            </div>
            )}
          </div>
        </motion.div>

        {/* ============ 模块标题区 ============ */}
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
            阿木木AI CRM <span className="text-astro-orange">核心模块</span>
          </h2>
          <p className="text-lg text-astro-inkSoft max-w-2xl mx-auto leading-relaxed">
            七大模块覆盖销售全流程：找客户 → 建商机 → 做跟进 → 复盘总结 → 定时自动化 → 自动汇报 → 全局看板。
          </p>
        </motion.div>

        {/* ============ 一句话定位 ============ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-20">
          {briefs.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.06 }}
                className="group bg-white border border-astro-line rounded-2xl p-5 shadow-card hover:shadow-softLg hover:-translate-y-1 transition-all"
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-10 h-10 rounded-xl bg-astro-orange/10 text-astro-orange flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" strokeWidth={1.8} />
                  </div>
                  <span className="font-bold text-astro-ink text-sm leading-tight">{item.name}</span>
                </div>
                <p className="text-xs text-astro-inkSoft leading-relaxed">
                  <span className="text-astro-orange font-semibold">›</span> {item.slogan}
                </p>
              </motion.div>
            )
          })}
        </div>

        {/* ============ 核心 AI 大脑：六个真实场景 ============ */}
        <div className="mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-astro-orange/10 text-astro-orange text-xs font-bold tracking-[0.2em] uppercase mb-5">
              AI Brain
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-astro-ink tracking-tight mb-3">
              核心 AI 大脑（<span className="text-astro-orange">主动参谋</span>）
            </h2>
            <p className="text-base lg:text-lg text-astro-inkSoft max-w-3xl mx-auto leading-relaxed">
              承诺、期限、跟进、阶段、模式——信息本来就躺在系统里。大脑补的是最后一层：
              <span className="font-semibold text-astro-ink">在正确的时机把它捞出来，主动告诉你该做什么</span>。
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-5">
            {brainScenes.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 2) * 0.08 }}
                className="bg-white border border-astro-line rounded-3xl shadow-card overflow-hidden flex flex-col"
              >
                {/* 场景头 */}
                <div className="px-6 py-4 border-b border-astro-line flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-astro-orange/10 text-astro-orange text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="font-bold text-astro-ink text-sm leading-tight">{s.title}</div>
                    <div className="text-[11px] text-astro-orange font-semibold mt-0.5">{s.tag}</div>
                  </div>
                </div>

                {/* 没大脑 */}
                <div className="px-6 py-4 bg-slate-50/80 border-b border-astro-line">
                  <div className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <div>
                      <div className="text-[11px] font-bold text-slate-500 mb-1">没大脑</div>
                      <p className="text-[13px] text-astro-inkSoft leading-relaxed">{s.without}</p>
                    </div>
                  </div>
                </div>

                {/* 有大脑 */}
                <div className="px-6 py-4 bg-astro-orange/[0.04] flex-1">
                  <div className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-astro-orange flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <div>
                      <div className="text-[11px] font-bold text-astro-orange mb-1">有大脑</div>
                      <p className="text-[13px] text-astro-ink leading-relaxed">{s.with}</p>
                    </div>
                  </div>
                </div>

                {/* 解决 */}
                <div className="px-6 py-3 bg-white border-t border-astro-line flex items-start gap-2.5">
                  <span className="flex-shrink-0 text-[10px] font-bold text-astro-green bg-astro-green/10 px-1.5 py-0.5 rounded">
                    解决
                  </span>
                  <p className="text-[12px] text-astro-inkSoft leading-relaxed">{s.solve}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 一句话总结 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 relative bg-gradient-to-r from-astro-orange/[0.08] to-white border-2 border-astro-orange/25 rounded-3xl p-7 lg:p-8"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-astro-orange text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-astro-orange/25">
                <Brain className="w-6 h-6" strokeWidth={1.8} />
              </div>
              <div>
                <div className="font-bold text-astro-ink text-base mb-2">这些场景的共同点</div>
                <p className="text-[14px] text-astro-inkSoft leading-relaxed">
                  信息其实都躺在系统里（承诺、期限、跟进、阶段、模式），缺的只是「有人／有大脑在正确时机把它捞出来、主动告诉你该做什么」。
                  <span className="font-semibold text-astro-ink">大脑补齐的就是这一层——从「数据仓库」变成「主动参谋」。</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ============ 核心 AI 能力 ============ */}
        <div className="mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-astro-orange/10 text-astro-orange text-xs font-bold tracking-[0.2em] uppercase mb-5">
              AI Powers
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-astro-ink tracking-tight mb-3">
              核心 AI 能力（<span className="text-astro-orange">这才是灵魂</span>）
            </h2>
            <p className="text-base lg:text-lg text-astro-inkSoft max-w-2xl mx-auto leading-relaxed">
              传统 CRM 只是「存数据」，阿木木知晓AI CRM 的 AI 让数据「活起来、帮销售干活」：
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {aiSkills.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.08 }}
                  className="relative bg-white border border-astro-line rounded-3xl p-6 shadow-card hover:shadow-softLg hover:-translate-y-1 transition-all overflow-hidden"
                >
                  <div className="absolute -right-3 -top-5 text-7xl font-black text-astro-orange/10 select-none">0{i + 1}</div>
                  <div className="w-12 h-12 rounded-2xl bg-astro-orange/10 text-astro-orange flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" strokeWidth={1.8} />
                  </div>
                  <h4 className="text-base font-bold text-astro-ink mb-2 leading-snug">{item.title}</h4>
                  <p className="text-[13px] text-astro-inkSoft leading-relaxed">{item.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* ============ 策略模块：两个学习引擎 ============ */}
        <div className="mt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-astro-orange/10 text-astro-orange text-xs font-bold tracking-[0.2em] uppercase mb-5">
              Strategy Engine
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-astro-ink tracking-tight mb-3">
              策略模块 · <span className="text-astro-orange">两个学习引擎</span>
            </h2>
            <p className="text-base lg:text-lg text-astro-inkSoft max-w-2xl mx-auto">
              大脑的两个半球：一个复制成功，一个自我进化
            </p>
          </motion.div>

          {/* ---- 两个引擎 ----
          */}
          <div className="grid lg:grid-cols-2 gap-6 mb-14">
            {/* 引擎一 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white border border-astro-line rounded-3xl shadow-card overflow-hidden"
            >
              <div className="bg-gradient-to-r from-astro-orange to-astro-orangeDark px-6 py-5 flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white flex-shrink-0">
                  <Brain className="w-6 h-6" strokeWidth={1.8} />
                </div>
                <div>
                  <div className="text-white font-bold text-base leading-tight">引擎一：成功模式库</div>
                  <div className="text-white/80 text-xs mt-0.5">经验复制</div>
                </div>
              </div>
              <div className="divide-y divide-astro-line">
                {[
                  ['触发', '赢单后自动复盘（七章节）'],
                  ['提取', '从复盘提取 6 类成功因子：行业 / 规模 / 阶段 / 竞品 / 话术 / 决策'],
                  ['聚合', '多单因子聚合 → 成功模式（行业≥5单、规模≥5单、阶段≥5单、竞品≥3单，出现率≥60%）'],
                  ['分级', '置信度三档：高（≥10单且≥70%）/ 中（5-9单）/ 低（<5单）'],
                  ['验证', '引用追踪 + 结果回写 → 真有效则升级，无效则淘汰'],
                ].map(([k, v], i) => (
                  <div key={i} className="grid sm:grid-cols-[110px_1fr] gap-1 sm:gap-4 px-6 py-4 hover:bg-astro-orange/[0.02] transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-astro-orange/10 text-astro-orange flex items-center justify-center text-[10px] font-bold flex-shrink-0">{i + 1}</span>
                      <span className="font-semibold text-astro-ink text-sm">{k}</span>
                    </div>
                    <p className="text-[13px] text-astro-inkSoft leading-relaxed pl-7 sm:pl-0">{v}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 引擎二 */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-astro-line rounded-3xl shadow-card overflow-hidden"
            >
              <div className="bg-gradient-to-r from-astro-orange to-astro-orangeDark px-6 py-5 flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white flex-shrink-0">
                  <Cpu className="w-6 h-6" strokeWidth={1.8} />
                </div>
                <div>
                  <div className="text-white font-bold text-base leading-tight">引擎二：策略自进化</div>
                  <div className="text-white/80 text-xs mt-0.5">获客 / 销售迭代</div>
                </div>
              </div>
              <div className="divide-y divide-astro-line">
                {[
                  ['学习信号', '线索状态 = 已转商机（唯一转化口径）'],
                  ['归因维度', '渠道、场景、画像'],
                  ['更新规则', '高转化 → 进「高转化 TOP」；无转化 → 「停止投入」；高价值画像 → 沉淀'],
                  ['安全阀', '样本量门槛 + 单次限幅（渠道≤2、场景≤1）+ 策略僵化保护 + 版本回滚'],
                ].map(([k, v], i) => (
                  <div key={i} className="grid sm:grid-cols-[110px_1fr] gap-1 sm:gap-4 px-6 py-4 hover:bg-astro-orange/[0.02] transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-astro-orange/10 text-astro-orange flex items-center justify-center text-[10px] font-bold flex-shrink-0">{i + 1}</span>
                      <span className="font-semibold text-astro-ink text-sm">{k}</span>
                    </div>
                    <p className="text-[13px] text-astro-inkSoft leading-relaxed pl-7 sm:pl-0">{v}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ---- 三个关键保障 ---- */}
          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {[
              { icon: ShieldCheck, title: '置信度门槛', desc: '样本不足不更新，防止「一单就下结论」' },
              { icon: Lock, title: '限幅 + 僵化保护', desc: '每次只微调，不剧烈推翻，防止被偶然数据带偏' },
              { icon: History, title: '版本号 + 回滚', desc: 'vX.X_YYYYMMDD_原因，每次调整可追溯、可回退' },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white border border-astro-line rounded-2xl p-6 shadow-card hover:shadow-softLg hover:-translate-y-1 transition-all"
                >
                  <div className="w-11 h-11 rounded-2xl bg-astro-yellow/15 text-astro-yellow flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" strokeWidth={1.8} />
                  </div>
                  <h4 className="font-bold text-astro-ink text-sm mb-1.5">
                    <span className="text-astro-orange font-black mr-1">0{i + 1}</span>
                    三个关键保障（防止「学坏」）
                  </h4>
                  <div className="text-sm font-semibold text-astro-ink mb-1">{item.title}</div>
                  <p className="text-xs text-astro-inkSoft leading-relaxed">{item.desc}</p>
                </motion.div>
              )
            })}
          </div>

          {/* ---- 驱动方式 ---- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border border-astro-line rounded-3xl p-7 lg:p-8 shadow-card mb-10"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-astro-green/10 text-astro-green flex items-center justify-center flex-shrink-0">
                <Clock className="w-7 h-7" strokeWidth={1.8} />
              </div>
              <div className="flex-1">
                <div className="font-bold text-astro-ink text-lg mb-1">驱动方式：每日定时（凌晨 2 点）</div>
                <p className="text-sm text-astro-inkSoft leading-relaxed">
                  每天自动跑两件事：<span className="text-astro-ink font-semibold">策略优化（引擎二）</span> + <span className="text-astro-ink font-semibold">成功因子增量打标（引擎一）</span>。
                  无需人工干预，大脑自己运转。
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-astro-green/10 text-astro-green text-xs font-semibold whitespace-nowrap self-start sm:self-center">
                <span className="w-1.5 h-1.5 rounded-full bg-astro-green animate-pulse" />
                全自动 · 零人工
              </div>
            </div>
          </motion.div>

          {/* ---- 战略意义 ---- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-astro-orange/[0.07] to-white border border-astro-orange/25 rounded-3xl p-8 lg:p-10 shadow-card mb-10"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-astro-orange text-white flex items-center justify-center">
                <Trophy className="w-6 h-6" strokeWidth={1.8} />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-astro-ink">它的战略意义（为什么这是护城河）</h3>
            </div>
            <div className="space-y-4 text-sm lg:text-base text-astro-inkSoft leading-relaxed">
              <p>
                这是你系统的<span className="text-astro-ink font-semibold">「暗能力」</span>——客户感知到的是「越用越准、越用越懂我」，但看不见背后这套自进化机制。
              </p>
              <p>
                这才是真正的<span className="text-astro-orange font-bold">护城河</span>：对手能抄「功能清单」，但抄不了「用你的真实成交数据、每天自己变聪明」这件事。因为这套大脑的价值，只在你和客户的数据积累里长出来，时间越长，越追不上。
              </p>
            </div>
          </motion.div>

          {/* ---- 一句话收束 ---- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="relative bg-astro-ink rounded-3xl p-8 lg:p-10 text-center overflow-hidden">
              <div className="absolute -top-8 -right-8 opacity-10 rotate-12">
                <AmumuBot size={200} />
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-astro-orange text-white text-xs font-bold tracking-widest uppercase mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                一句话收束
              </div>
              <p className="text-lg lg:text-2xl text-white font-semibold leading-relaxed">
                阿木木的核心，不是「帮你管客户」，而是「<span className="text-astro-orange">用你的每一次成交，把自己变成越来越懂你的 AI 老师</span>」
              </p>
              <p className="mt-4 text-sm text-white/60">
                这是它越用越值钱、越用越难被替换的根本原因。
              </p>
            </div>
          </motion.div>
        </div>

        {/* ============ 一句话总结 ============ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 max-w-3xl mx-auto"
        >
          <div className="relative bg-gradient-to-br from-astro-orange/[0.08] to-white border-2 border-astro-orange/25 rounded-3xl p-8 lg:p-10 text-center shadow-card overflow-hidden">
            <div className="absolute -top-6 -right-6 opacity-[0.15] rotate-12">
              <AmumuBot size={160} />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-astro-orange text-white text-xs font-bold tracking-widest uppercase mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              一句话总结
            </div>
            <p className="text-lg lg:text-2xl font-semibold text-astro-ink leading-relaxed">
              传统 CRM 让你「<span className="text-astro-inkSoft">花时间喂系统</span>」，
              <br className="hidden sm:block" />
              阿木木知晓AI CRM 让系统「<span className="text-astro-orange">花时间喂你</span>」
            </p>
            <p className="mt-4 text-sm text-astro-inkSoft">
              你只管跟客户聊，剩下的交给 AI。
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
