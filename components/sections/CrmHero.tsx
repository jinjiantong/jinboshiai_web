'use client'

import { motion } from 'framer-motion'
import { Mic, GraduationCap, Sparkles, BarChart3, Bell, User, FileText, MessageCircle, Check, X, ChevronDown, Bot, Database, ShieldCheck } from 'lucide-react'
import AmumuBot from '@/components/AmumuBot'
import SalesExpertCards from '@/components/SalesExpertCards'

const vsRows = [
  { neu: '一句话搞定所有需求', old: '反复手动填表单' },
  { neu: '开发渠道，自动获客', old: '被动录入已有客户' },
  { neu: '懂产品、懂标准销售流程、懂沟通话术、懂市场行情', old: '只存储客户基础资料' },
  { neu: '赢单与丢单经验经审核后，可在下一次销售中复用', old: '仅做数据归档，不会产生业务价值' },
]

export default function CrmHero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-white min-h-screen flex flex-col">
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-astro-orange/[0.08] blur-[120px]" />
        <div className="absolute -bottom-32 -left-32 w-[480px] h-[480px] rounded-full bg-astro-yellow/[0.06] blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.18]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #0F172A 1px, transparent 0)', backgroundSize: '32px 32px', maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)', WebkitMaskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)' }} />
      </div>

      {/* ============ 顶部标题区（紧凑） ============ */}
      <div className="relative pt-20 lg:pt-24 pb-3 text-center px-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-astro-orange/[0.08] border border-astro-orange/20 text-astro-orange text-sm font-semibold mb-3">
          <AmumuBot size={20} />
          CRM 不该只做数据采集，它更该是你的 AI 销冠助理
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-[2.5rem] font-bold text-astro-ink leading-[1.12] tracking-tight">
          给CRM加个<span className="text-astro-orange">AI外挂</span>，
          <span className="relative inline-block">聊天框里搞定所有销售
            <svg className="absolute -bottom-1.5 left-0 w-full h-3.5 text-astro-orange" viewBox="0 0 300 20" preserveAspectRatio="none">
              <path d="M 0 12 Q 20 4 40 12 T 80 12 T 120 12 T 160 12 T 200 12 T 240 12 T 280 12" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" />
            </svg>
          </span>
          <span className="mt-3 block text-sm sm:text-base lg:text-lg font-semibold text-astro-inkSoft tracking-normal leading-snug">
            我不是传统 CRM 系统，我是<span className="text-astro-orange">可安装在支持 SKILL 的智能体中的「AI 销售大脑」</span>
          </span>
        </h1>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 px-1">
          {/* 支持平台 — 强调 */}
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-astro-orange to-astro-orangeDark text-white text-xs sm:text-sm font-bold shadow-lg shadow-astro-orange/30">
            <Bot className="w-3.5 h-3.5" />
            首发支持 飞书 / 妙搭智能体
          </span>
          {/* 数据归属 — 强调 */}
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white border-2 border-astro-green text-astro-green text-xs sm:text-sm font-bold shadow-md shadow-astro-green/20">
            <Database className="w-3.5 h-3.5" />
            数据存你自己的飞书多维表格
          </span>
        </div>
      </div>

      {/* ============ 主对比区：左右两大阵营 ============ */}
      <div className="relative flex-1 flex items-center justify-center px-4 sm:px-6 py-3 lg:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-5 lg:gap-8 items-stretch w-full max-w-6xl">
          {/* ---------- 左：阿木木阵营（橙色） ---------- */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full"
          >
            <div className="h-full flex flex-col gap-3 rounded-3xl border-2 border-astro-orange/40 bg-gradient-to-b from-astro-orange/[0.06] to-white p-4 lg:p-5">
              {/* 阵营标签 */}
              <div className="flex items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-astro-orange text-white text-sm font-bold shadow-lg shadow-astro-orange/30">
                  <AmumuBot size={18} />
                  阿木木 AI CRM
                </span>
              </div>
              {/* WorkBuddy 实拍（上）+ 销售专家团（下）—— 上下组合，撑满剩余高度 */}
              <div className="w-full flex-1 rounded-2xl bg-white/70 border border-astro-orange/20 p-2.5 flex flex-col gap-2">
                {/* 首发验收宿主：飞书 / 妙搭 */}
                <div className="w-full flex-shrink-0 rounded-lg border border-astro-orange/25 shadow-sm bg-white py-2.5 px-3">
                  <div className="flex items-center justify-around gap-2">
                    {[
                      { logo: '/images/feishu-logo.png', name: '飞书' },
                      { logo: '/images/feishu-logo.png', name: '妙搭' },
                    ].map((p) => (
                      <div key={p.name} className="flex flex-col items-center gap-1 min-w-0 flex-1">
                        <img src={p.logo} alt={p.name} className="w-7 h-7 object-contain flex-shrink-0" />
                        <span className="text-[9px] leading-none font-semibold text-astro-ink truncate max-w-full">{p.name}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-1 text-[9px] leading-none font-bold text-astro-green">
                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                    首发宿主
                  </div>
                </div>
                {/* 专家团：撑满剩余高度 */}
                <div className="flex-1 min-h-0">
                  <SalesExpertCards />
                </div>
              </div>
              {/* AI 能力点 */}
              <div className="w-full grid gap-1.5 mt-auto">
                {vsRows.map((row, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-xl bg-astro-orange/[0.06] border border-astro-orange/15 px-3 py-1.5">
                    <Check className="w-3.5 h-3.5 text-astro-orange flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="text-[11px] leading-snug text-astro-ink font-medium">{row.neu}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ---------- 中：VS ---------- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-astro-orange/20 animate-ping" />
              <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-br from-astro-orange to-astro-orangeDark flex items-center justify-center shadow-xl shadow-astro-orange/40 border-4 border-white">
                <span className="text-white font-black text-2xl lg:text-3xl tracking-tight">VS</span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-astro-orange animate-pulse" />
              <span className="text-astro-muted text-xs font-semibold tracking-widest">新旧对决</span>
              <div className="w-1.5 h-1.5 rounded-full bg-astro-orange animate-pulse" />
            </div>
            <div className="mt-2 bg-white rounded-full shadow-lg border border-astro-orange/30 p-1">
              <AmumuBot size={40} />
            </div>
          </motion.div>

          {/* ---------- 右：传统阵营（灰色） ---------- */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full"
          >
            <div className="h-full flex flex-col gap-3 rounded-3xl border-2 border-slate-300 bg-gradient-to-b from-slate-100 to-white p-4 lg:p-5">
              {/* 阵营标签 */}
              <div className="flex items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-700 text-white text-sm font-bold">
                  <div className="w-4 h-4 rounded bg-slate-500 flex items-center justify-center text-[10px] font-black">!</div>
                  传统 CRM
                </span>
              </div>
              {/* 传统 CRM 手机界面 */}
              <div className="flex justify-center">
                <CompactTraditionalPhone />
              </div>
              {/* 传统痛点 */}
              <div className="w-full grid gap-1.5 mt-auto">
                {vsRows.map((row, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-xl bg-slate-100/80 border border-slate-200 px-3 py-1.5">
                    <X className="w-3.5 h-3.5 text-astro-muted flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="text-[11px] leading-snug text-astro-inkSoft">{row.old}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 底部信任标签（细窄条） */}
      <div className="relative pb-3">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-xs text-astro-inkSoft px-5">
          <span className="inline-flex items-center gap-1.5">
            <Mic className="w-3.5 h-3.5 text-astro-orange" />
            开口即用，不用填表
          </span>
          <span className="inline-flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-astro-yellow" />
            每一步有人教你
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-astro-green" />
            按人订阅，最低 ¥69 / 人 / 月
          </span>
          <span className="inline-flex items-center gap-1.5 text-astro-green font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            业务数据由你掌控
          </span>
        </div>
      </div>

      {/* 向下滚动提示（闪烁箭头） */}
      <div className="relative flex justify-center pb-6">
        <motion.a
          href="#problem"
          aria-label="向下滑动查看更多"
          className="flex flex-col items-center gap-1 text-astro-muted hover:text-astro-orange transition-colors"
          animate={{ y: [0, 8, 0], opacity: [1, 0.35, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-[10px] tracking-[0.3em]">向下滑动</span>
          <ChevronDown className="w-6 h-6 text-astro-orange" strokeWidth={2.5} />
        </motion.a>
      </div>
    </section>
  )
}

/* =========================================================
 * 传统 CRM 手机界面模拟（小号，适配满屏）
 * ========================================================= */
function CompactTraditionalPhone() {
  return (
    <div className="w-full max-w-[240px]">
      <div className="rounded-[2rem] bg-slate-800 p-2 shadow-xl shadow-slate-900/20">
        <div
          className="rounded-[1.5rem] bg-slate-50 overflow-hidden relative"
          style={{ height: 'clamp(280px, 36vh, 380px)' }}
        >
          {/* 状态栏 */}
          <div className="bg-slate-700 px-3 py-1.5 flex items-center justify-between text-white text-[10px] font-medium">
            <span>19:55</span>
            <div className="flex gap-1">
              <div className="w-3 h-2 border border-white rounded-sm" />
              <div className="w-3 h-2 bg-white/60 rounded-sm" />
            </div>
          </div>

          {/* 头部 用户信息 */}
          <div className="bg-slate-600 px-3 py-2 text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center text-xs font-bold">李</div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-[11px] truncate">李强 · 销售经理</div>
                <div className="text-white/60 text-[9px] truncate">4项待办 · 3场拜访</div>
              </div>
              <Bell className="w-3.5 h-3.5 text-white/70" />
            </div>
          </div>

          {/* AI晨报 */}
          <div className="px-3 mt-1.5">
            <div className="bg-white rounded-lg shadow-sm p-2 border border-slate-200">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-5 h-5 rounded bg-slate-200 flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-slate-500" />
                </div>
                <span className="font-semibold text-[10px] text-slate-700">AI 晨报</span>
                <span className="text-[8px] text-slate-400 ml-auto">· 昨日数据</span>
              </div>
              <p className="text-[9px] text-slate-500 leading-snug">
                今日3位重点客户跟进，2个商机进入谈判…
              </p>
            </div>
          </div>

          {/* 快捷入口 */}
          <div className="px-3 mt-2">
            <div className="grid grid-cols-4 gap-1">
              {[
                { icon: User, label: '新建客户' },
                { icon: FileText, label: '新建商机' },
                { icon: BarChart3, label: '拜访签到' },
                { icon: Bell, label: '写跟进' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <item.icon className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <span className="text-[7px] text-slate-500">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 销售漏斗 */}
          <div className="px-3 mt-2">
            <div className="bg-white rounded-lg shadow-sm p-2 border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-[10px] text-slate-700 flex items-center gap-1">
                  <BarChart3 className="w-2.5 h-2.5 text-blue-500" />
                  销售漏斗
                </span>
                <span className="text-[9px] text-slate-400">本周·287万</span>
              </div>
              <div className="space-y-1">
                {[
                  { label: '初步接触', pct: 90, color: 'bg-blue-400' },
                  { label: '需求确认', pct: 75, color: 'bg-blue-500' },
                  { label: '方案报价', pct: 60, color: 'bg-blue-600' },
                  { label: '赢单', pct: 30, color: 'bg-green-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="text-[7px] text-slate-500 w-10">{item.label}</span>
                    <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 底部导航 */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-center justify-around py-1.5">
            {[
              { icon: BarChart3, label: '工作台', active: true },
              { icon: User, label: '客户' },
              { icon: Bell, label: '商机' },
              { icon: MessageCircle, label: '消息' },
            ].map((item, i) => (
              <div key={i} className={`flex flex-col items-center gap-0.5 ${item.active ? 'text-blue-500' : 'text-slate-400'}`}>
                <item.icon className="w-3 h-3" />
                <span className="text-[7px]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
