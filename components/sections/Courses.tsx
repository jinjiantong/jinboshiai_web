'use client'

import { useState } from 'react'

type TabType = 'vibe' | 'agent' | 'company' | 'system'

export default function Courses() {
  const [activeTab, setActiveTab] = useState<TabType>('vibe')

  const tabs = [
    { key: 'vibe' as const, label: 'Vibe Coding 实战课' },
    { key: 'agent' as const, label: '智能体实战课' },
    { key: 'company' as const, label: '中小公司AI落地课' },
    { key: 'system' as const, label: 'AI启蒙体系课' },
  ]

  return (
    <section id="courses" className="pt-24 pb-20 lg:pt-32 lg:pb-32 bg-[#FAFAFA] relative">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-[#1a1a1a]">金博士AI实验室所有课程</h2>
      </div>
      <div className="max-w-[1080px] mx-auto bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)] rounded-lg overflow-hidden">
        <div className="flex bg-[#FF6B35]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-5 py-4 text-sm font-semibold cursor-pointer transition-all ${
                activeTab === tab.key
                  ? 'bg-white/15 text-white font-bold'
                  : 'bg-transparent text-white/70 hover:bg-white/10 hover:text-white'
              }`}
              style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'vibe' && <VibeTab />}
        {activeTab === 'agent' && <AgentTab />}
        {activeTab === 'company' && <CompanyTab />}
        {activeTab === 'system' && <SystemTab />}
      </div>
    </section>
  )
}

function VibeTab() {
  return (
    <div className="bg-[#fffbf5]">
      <div className="p-10">
        <div className="bg-[#f5f5f5] p-5 mb-6 border-l-4 border-[#FF6B35]">
          <div className="text-xs text-[#FF6B35] font-mono tracking-widest uppercase mb-4">课程成果</div>
          <div className="flex items-start gap-5">
            <div className="text-xl font-bold text-[#1a1a1a] min-w-[100px]">3天，带走</div>
            <div className="text-lg text-[#737373]">
              属于自己的 <span className="font-bold text-[#FF6B35]">网站 · 小程序游戏 · 手机App</span>
            </div>
          </div>
        </div>

        <div className="bg-[#f5f5f5] p-5 mb-6 border-l-4 border-[#FF6B35]">
          <div className="text-xs text-[#FF6B35] font-mono tracking-widest uppercase mb-4">时代对比</div>
          <div className="flex items-start gap-5 mb-4">
            <div className="text-xl font-bold text-[#1a1a1a] min-w-[100px]">互联网时代</div>
            <div className="text-base text-[#737373]">老板 + 产品 + 开发 + 设计 + 后台 + 运营 + 数据，<span className="font-bold text-[#FF6B35]">一个月上线</span></div>
          </div>
          <div className="flex items-start gap-5 mb-4">
            <div className="text-xl font-bold text-[#1a1a1a] min-w-[100px]">AI时代</div>
            <div className="text-base text-[#737373]"><span className="font-bold text-[#FF6B35]">1个人 + AI工具，3天上线</span></div>
          </div>
          <div className="flex items-start gap-5">
            <div className="text-xl font-bold text-[#1a1a1a] min-w-[100px]">核心理念</div>
            <div className="text-base text-[#737373]">AI无限放大你的能力。过去我们学知识，现在我们学如何用别人的知识。</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { day: 'Day 1', content: '企业级产品开发流程介绍\nAI编程工具介绍\n创意讨论\n产品文档撰写\n产品设计稿制作\n技术设计方案撰写' },
            { day: 'Day 2', content: '产品开发（含服务端开发）\n调试\n测试' },
            { day: 'Day 3', content: '产品部署\n数据分析\n增长运营' },
          ].map((item, i) => (
            <div key={i} className="bg-[#fffbf5] border border-[#e0e0e0] p-4 relative">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#FF6B35]" />
              <div className="text-xs text-[#FF6B35] font-mono font-semibold mb-2">{item.day}</div>
              <div className="text-sm text-[#1a1a1a] leading-relaxed whitespace-pre-line">{item.content}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {[
            { title: '真·小班', desc: '不超过8人，确保老师看见每个创意' },
            { title: '真产品', desc: '可带走的网站、游戏、App，不是Demo，是能上线能用的真东西' },
            { title: '真交付', desc: 'Vibe Coding降低创造门槛，我们补上部署、服务端、运营的硬核闭环' },
            { title: '硬核老师', desc: '老师深耕AI多领域，课堂中穿插前沿视野拓展。不止教做产品，更帮孩子看见AI的全貌。' },
          ].map((item, i) => (
            <div key={i} className="bg-[#f5f5f5] p-4 border-l-3 border-[#FF6B35]" style={{ borderLeftWidth: '3px' }}>
              <div className="text-base font-bold text-[#1a1a1a] mb-1">{item.title}</div>
              <div className="text-sm text-[#737373] leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>

        <div className="bg-[#FF6B35] p-4 mb-6 flex gap-10">
          <div className="flex-1">
            <div className="text-sm text-white/80 mb-1">常规价</div>
            <div className="text-3xl font-bold text-white">3980元</div>
          </div>
          <div className="flex-1">
            <div className="text-sm text-white/80 mb-1">早鸟价</div>
            <div className="text-3xl font-bold text-white">2980元</div>
            <div className="text-sm text-white/70 mt-1">限前8席</div>
          </div>
        </div>

        <div className="bg-[#FF6B35] p-3 mb-3 flex items-center gap-4">
          <span className="text-xs text-white/80 font-mono tracking-widest uppercase">上课时间</span>
          <span className="text-base text-white font-semibold">每周一，三、五 下午 1:30～4:00</span>
        </div>
      </div>

      <div className="p-5 bg-[#fffbf5] border-t-2 border-[#FF6B35]">
        <div className="text-xs text-[#FF6B35] font-mono tracking-widest uppercase mb-4">联系我们</div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '📞', text: '13051202991' },
            { icon: '📞', text: '15811055744' },
            { icon: '🌐', text: 'jinboshiai.com' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#FF6B35] flex items-center justify-center text-white text-sm">{item.icon}</div>
              <span className="text-sm text-[#1a1a1a]">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 flex justify-between items-center border-t border-[#e0e0e0] bg-[#fffbf5]">
        <div className="flex flex-col items-end gap-2">
          <div className="text-base font-semibold text-[#1a1a1a] tracking-wider">金博士 AI 实验室</div>
          <div className="text-xs text-[#737373]">青少年 Vibe Coding 3日创造营</div>
        </div>
        <div className="w-[120px] h-[120px] overflow-hidden rounded-lg">
          <img src="/images/erweima.png" alt="二维码" className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  )
}

function AgentTab() {
  return (
    <div>
      <div className="bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] p-14 text-white relative overflow-hidden">
        <div className="absolute right-[-80px] top-[-80px] w-[400px] h-[400px] border-[60px] border-white/6 rounded-full" />
        <div className="absolute right-[100px] bottom-[-100px] w-[280px] h-[280px] border-[40px] border-white/5 rounded-full" />
        <div className="relative z-10">
          <div className="text-sm font-medium tracking-widest text-white/80 mb-4">金博士 AI 实验室</div>
          <div className="text-3xl lg:text-4xl font-black mb-4 leading-tight">
            2026 · <span className="text-[#FFE566]">不在卷自己</span><br/>学会压榨AI
          </div>
          <div className="text-lg text-white/95 mt-4">
            <span className="bg-white/20 px-3 py-1 rounded mr-2">智能体实战课</span>3天实战训练营 · 带走你的AI数字员工
          </div>
        </div>
      </div>

      <div className="px-16">
        <div className="py-12 border-b border-[#f0f0f0] relative before:absolute before:left-[-40px] before:top-12 before:w-1.5 before:h-12 before:bg-gradient-to-b from-[#FF6B35] to-[#FFF4F0] before:rounded">
          <div className="pl-6">
            <div className="p-9 bg-gradient-to-br from-[#FF6B35] to-[#FF8F66] rounded-xl text-lg text-white text-center leading-relaxed shadow-[0_8px_32px_rgba(255,107,53,0.25)]">
              3天时间 · 从0到1搭建 · 带走<strong className="text-[#FFE566]">专属你的AI数字员工</strong><br/>
              <span className="text-base opacity-90">以后别卷自己了，咱们学会「压榨」AI员工！</span>
            </div>
          </div>
        </div>

        <div className="py-12 border-b border-[#f0f0f0] relative before:absolute before:left-[-40px] before:top-12 before:w-1.5 before:h-12 before:bg-gradient-to-b from-[#FF6B35] to-[#FFF4F0] before:rounded">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-7 pl-6">3天课程安排</h2>
          <div className="space-y-6 pl-6">
            {[
              { day: 'Day 1', title: '认识你的AI新同事', topics: ['主流智能体工具全景介绍', '创建第一个专属技能', '玩转第三方技能库'] },
              { day: 'Day 2', title: '搭建AI数字员工架构', topics: ['拆解业务流程与任务', '设计智能体架构', '实现你的AI数字员工'] },
              { day: 'Day 3', title: '让AI员工正式上岗', topics: ['全面实现数字员工功能', '测试与调试智能体', '让AI员工开始为你工作'] },
            ].map((item, i) => (
              <div key={i} className="p-8 bg-white rounded-xl border-2 border-[#FFF4F0] relative shadow-[0_4px_20px_rgba(255,107,53,0.06)]">
                <div className="absolute top-0 left-9 right-9 h-1 bg-gradient-to-r from-[#FF6B35] to-[#FFF4F0] rounded" />
                <div className="flex items-center gap-5 mb-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] text-white font-bold text-base flex items-center justify-center rounded-lg shadow-[0_4px_16px_rgba(255,107,53,0.3)]">{item.day}</div>
                  <div className="text-xl font-bold text-[#1a1a1a]">{item.title}</div>
                </div>
                <div className="pl-19 space-y-4">
                  {item.topics.map((topic, j) => (
                    <div key={j} className="text-base text-[#1a1a1a] leading-relaxed relative pl-7">
                      <span className="absolute left-0 top-2.5 w-2.5 h-2.5 bg-[#FF6B35] rounded-full shadow-[0_2px_8px_rgba(255,107,53,0.3)]" />
                      {topic}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="py-12 relative before:absolute before:left-[-40px] before:top-12 before:w-1.5 before:h-12 before:bg-gradient-to-b from-[#FF6B35] to-[#FFF4F0] before:rounded">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-7 pl-6">限时报名</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="p-9 bg-white rounded-3xl text-center border-2 border-[#f0f0f0]">
              <div className="text-lg text-[#666] mb-4">常规价</div>
              <div className="text-5xl font-black text-[#1a1a1a]">2980<span className="text-xl font-normal">元</span></div>
            </div>
            <div className="p-9 bg-white rounded-3xl text-center border-2 border-[#FF6B35] relative shadow-[0_12px_40px_rgba(255,107,53,0.25)] scale-[1.02]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wider shadow-[0_4px_16px_rgba(255,107,53,0.3)]">早鸟价</div>
              <div className="text-lg text-[#666] mb-4">早鸟价</div>
              <div className="text-5xl font-black text-[#FF6B35]">1680<span className="text-xl font-normal">元</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-16 py-10 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex justify-between items-center gap-16">
        <div className="flex-1">
          <div className="text-xl font-bold text-[#FF6B35] mb-2 tracking-wider">金博士 AI 实验室</div>
          <div className="text-sm text-white/70 leading-loose">
            手机/微信：13051202991 ｜ 15811055744<br/>
            地址：北京市顺义区临空经济核心区安庆大街7号良基科技广场A座316室<br/>
            jinboshiai.com
          </div>
        </div>
        <div className="w-[110px] h-[110px] bg-white p-2 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
          <img src="/images/erweima.png" alt="二维码" className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  )
}

function CompanyTab() {
  return (
    <div>
      <div className="bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] p-14 text-white relative overflow-hidden">
        <div className="absolute right-[-80px] top-[-80px] w-[400px] h-[400px] border-[60px] border-white/6 rounded-full" />
        <div className="absolute right-[100px] bottom-[-100px] w-[280px] h-[280px] border-[40px] border-white/5 rounded-full" />
        <div className="relative z-10">
          <div className="text-sm font-medium tracking-widest text-white/80 mb-4">金博士 AI 实验室</div>
          <div className="text-3xl lg:text-4xl font-black mb-4 leading-tight">
            2026 · 小公司也需要<br/><span className="text-[#FFE566]">科学精细化运营</span>
          </div>
          <div className="text-lg text-white/95 mt-4">
            <span className="bg-white/20 px-3 py-1 rounded mr-2">中小公司AI落地课</span>3天学会搭建小公司最佳AI落地方案
          </div>
        </div>
      </div>

      <div className="px-16">
        <div className="py-12 border-b border-[#f0f0f0] relative before:absolute before:left-[-40px] before:top-12 before:w-1.5 before:h-12 before:bg-gradient-to-b from-[#FF6B35] to-[#FFF4F0] before:rounded">
          <div className="pl-6">
            <div className="p-9 bg-gradient-to-br from-[#FF6B35] to-[#FF8F66] rounded-xl text-lg text-white text-center leading-relaxed shadow-[0_8px_32px_rgba(255,107,53,0.25)]">
              3天实战 · 从0到1 · 带走<strong className="text-[#FFE566]">小公司AI落地最佳方案</strong><br/>
              <span className="text-base opacity-90">让AI真正落地到你的公司，少走弯路！</span>
            </div>
          </div>
        </div>

        <div className="py-12 border-b border-[#f0f0f0] relative before:absolute before:left-[-40px] before:top-12 before:w-1.5 before:h-12 before:bg-gradient-to-b from-[#FF6B35] to-[#FFF4F0] before:rounded">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-7 pl-6">3天课程安排</h2>
          <div className="space-y-6 pl-6">
            {[
              { day: 'Day 1', title: 'AI落地技术方案', topics: ['公司AI落地技术方案', '相关工具全面介绍', '相关解决案例讲解'] },
              { day: 'Day 2', title: '搭建落地架构', topics: ['拆解公司业务流程', '搭建AI落地架构'] },
              { day: 'Day 3', title: '全面实现落地', topics: ['全面跑通业务流程', '实现AI真正落地', '搭建可监控可衡量的闭环系统'] },
            ].map((item, i) => (
              <div key={i} className="p-8 bg-white rounded-xl border-2 border-[#FFF4F0] relative shadow-[0_4px_20px_rgba(255,107,53,0.06)]">
                <div className="absolute top-0 left-9 right-9 h-1 bg-gradient-to-r from-[#FF6B35] to-[#FFF4F0] rounded" />
                <div className="flex items-center gap-5 mb-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] text-white font-bold text-base flex items-center justify-center rounded-lg shadow-[0_4px_16px_rgba(255,107,53,0.3)]">{item.day}</div>
                  <div className="text-xl font-bold text-[#1a1a1a]">{item.title}</div>
                </div>
                <div className="pl-19 space-y-4">
                  {item.topics.map((topic, j) => (
                    <div key={j} className="text-base text-[#1a1a1a] leading-relaxed relative pl-7">
                      <span className="absolute left-0 top-2.5 w-2.5 h-2.5 bg-[#FF6B35] rounded-full shadow-[0_2px_8px_rgba(255,107,53,0.3)]" />
                      {topic}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="py-12 relative before:absolute before:left-[-40px] before:top-12 before:w-1.5 before:h-12 before:bg-gradient-to-b from-[#FF6B35] to-[#FFF4F0] before:rounded">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-7 pl-6">限时报名</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="p-9 bg-white rounded-3xl text-center border-2 border-[#f0f0f0]">
              <div className="text-lg text-[#666] mb-4">常规价</div>
              <div className="text-5xl font-black text-[#1a1a1a]">3680<span className="text-xl font-normal">元</span></div>
            </div>
            <div className="p-9 bg-white rounded-3xl text-center border-2 border-[#FF6B35] relative shadow-[0_12px_40px_rgba(255,107,53,0.25)] scale-[1.02]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wider shadow-[0_4px_16px_rgba(255,107,53,0.3)]">早鸟价</div>
              <div className="text-lg text-[#666] mb-4">早鸟价</div>
              <div className="text-5xl font-black text-[#FF6B35]">1980<span className="text-xl font-normal">元</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-16 py-10 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex justify-between items-center gap-16">
        <div className="flex-1">
          <div className="text-xl font-bold text-[#FF6B35] mb-2 tracking-wider">金博士 AI 实验室</div>
          <div className="text-sm text-white/70 leading-loose">
            手机/微信：13051202991 ｜ 15811055744<br/>
            地址：北京市顺义区临空经济核心区安庆大街7号良基科技广场A座316室<br/>
            jinboshiai.com
          </div>
        </div>
        <div className="w-[110px] h-[110px] bg-white p-2 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
          <img src="/images/erweima.png" alt="二维码" className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  )
}

function SystemTab() {
  return (
    <div>
      <div className="bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] p-14 text-white relative overflow-hidden">
        <div className="absolute right-[-80px] top-[-80px] w-[400px] h-[400px] border-[60px] border-white/6 rounded-full" />
        <div className="absolute right-[100px] bottom-[-100px] w-[280px] h-[280px] border-[40px] border-white/5 rounded-full" />
        <div className="relative z-10">
          <div className="text-sm font-medium tracking-widest text-white/80 mb-4">金博士 AI 实验室</div>
          <div className="text-3xl lg:text-4xl font-black mb-4 leading-tight">
            2026 · 学AI要学<br/><span className="text-[#FFE566]">系统的学</span>
          </div>
          <div className="text-lg text-white/95 mt-4">
            <span className="bg-white/20 px-3 py-1 rounded mr-2">AI启蒙体系课</span>3天搞定所有AI知识体系 · 全部都是实战
          </div>
        </div>
      </div>

      <div className="px-16">
        <div className="py-12 border-b border-[#f0f0f0] relative before:absolute before:left-[-40px] before:top-12 before:w-1.5 before:h-12 before:bg-gradient-to-b from-[#FF6B35] to-[#FFF4F0] before:rounded">
          <div className="pl-6">
            <div className="p-9 bg-gradient-to-br from-[#FF6B35] to-[#FF8F66] rounded-xl text-lg text-white text-center leading-relaxed shadow-[0_8px_32px_rgba(255,107,53,0.25)]">
              3天实战 · 系统学习 · <strong className="text-[#FFE566]">掌握AI核心能力</strong><br/>
              <span className="text-base opacity-90">从提示词到工作流，从智能体到编程，一次打通！</span>
            </div>
          </div>
        </div>

        <div className="py-12 border-b border-[#f0f0f0] relative before:absolute before:left-[-40px] before:top-12 before:w-1.5 before:h-12 before:bg-gradient-to-b from-[#FF6B35] to-[#FFF4F0] before:rounded">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-7 pl-6">3天课程安排</h2>
          <div className="space-y-6 pl-6">
            {[
              { day: 'Day 1', title: 'AI基础与提示词', topics: ['AI知识体系全面讲解', '提示词工程实战', '技能实战训练'] },
              { day: 'Day 2', title: 'AI进阶技能', topics: ['工作流实战', '智能体实战'] },
              { day: 'Day 3', title: 'AI综合实战', topics: ['AI办公实战', 'AI编程实战'] },
            ].map((item, i) => (
              <div key={i} className="p-8 bg-white rounded-xl border-2 border-[#FFF4F0] relative shadow-[0_4px_20px_rgba(255,107,53,0.06)]">
                <div className="absolute top-0 left-9 right-9 h-1 bg-gradient-to-r from-[#FF6B35] to-[#FFF4F0] rounded" />
                <div className="flex items-center gap-5 mb-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] text-white font-bold text-base flex items-center justify-center rounded-lg shadow-[0_4px_16px_rgba(255,107,53,0.3)]">{item.day}</div>
                  <div className="text-xl font-bold text-[#1a1a1a]">{item.title}</div>
                </div>
                <div className="pl-19 space-y-4">
                  {item.topics.map((topic, j) => (
                    <div key={j} className="text-base text-[#1a1a1a] leading-relaxed relative pl-7">
                      <span className="absolute left-0 top-2.5 w-2.5 h-2.5 bg-[#FF6B35] rounded-full shadow-[0_2px_8px_rgba(255,107,53,0.3)]" />
                      {topic}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="py-12 relative before:absolute before:left-[-40px] before:top-12 before:w-1.5 before:h-12 before:bg-gradient-to-b from-[#FF6B35] to-[#FFF4F0] before:rounded">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mb-7 pl-6">限时报名</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="p-9 bg-white rounded-3xl text-center border-2 border-[#f0f0f0]">
              <div className="text-lg text-[#666] mb-4">常规价</div>
              <div className="text-5xl font-black text-[#1a1a1a]">3480<span className="text-xl font-normal">元</span></div>
            </div>
            <div className="p-9 bg-white rounded-3xl text-center border-2 border-[#FF6B35] relative shadow-[0_12px_40px_rgba(255,107,53,0.25)] scale-[1.02]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-br from-[#FF6B35] to-[#E55A2B] text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wider shadow-[0_4px_16px_rgba(255,107,53,0.3)]">早鸟价</div>
              <div className="text-lg text-[#666] mb-4">早鸟价</div>
              <div className="text-5xl font-black text-[#FF6B35]">1680<span className="text-xl font-normal">元</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-16 py-10 bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] flex justify-between items-center gap-16">
        <div className="flex-1">
          <div className="text-xl font-bold text-[#FF6B35] mb-2 tracking-wider">金博士 AI 实验室</div>
          <div className="text-sm text-white/70 leading-loose">
            手机/微信：13051202991 ｜ 15811055744<br/>
            地址：北京市顺义区临空经济核心区安庆大街7号良基科技广场A座316室<br/>
            jinboshiai.com
          </div>
        </div>
        <div className="w-[110px] h-[110px] bg-white p-2 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
          <img src="/images/erweima.png" alt="二维码" className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  )
}
