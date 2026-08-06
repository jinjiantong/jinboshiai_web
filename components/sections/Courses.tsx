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
    <section id="courses" className="pt-24 pb-20 lg:pt-32 lg:pb-32 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-[1080px] mx-auto px-5 sm:px-6">
        <div className="text-center mb-12">
          <div className="section-badge justify-center">
            <span>Courses</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3 text-slate-900">
            金博士AI实验室所有课程
          </h2>
          <p className="text-lg text-blue-600 font-semibold mb-2">
            从AI启蒙到企业落地，学完就能用
          </p>
          <p className="text-sm text-slate-500 max-w-lg mx-auto leading-relaxed">
            四套课程体系，覆盖不同阶段的学习需求
          </p>
        </div>

        {/* 课程切换 Tab */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-slate-100 rounded-full p-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 sm:px-6 py-2.5 text-sm font-semibold rounded-full cursor-pointer transition-all ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-[1080px] mx-auto bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">

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
    <div className="bg-slate-50">
      <div className="p-10">
        <div className="bg-white p-5 mb-6 border-l-4 border-blue-600 rounded-r-lg shadow-sm">
          <div className="text-xs text-blue-500 font-mono tracking-widest uppercase mb-4">课程成果</div>
          <div className="flex items-start gap-5">
            <div className="text-xl font-bold text-slate-700 min-w-[100px]">3天，带走</div>
            <div className="text-lg text-slate-600">
              属于自己的 <span className="font-bold text-blue-600">网站 · 小程序游戏 · 手机App</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 mb-6 border-l-4 border-blue-600 rounded-r-lg shadow-sm">
          <div className="text-xs text-blue-500 font-mono tracking-widest uppercase mb-4">时代对比</div>
          <div className="flex items-start gap-5 mb-4">
            <div className="text-xl font-bold text-slate-700 min-w-[100px]">互联网时代</div>
            <div className="text-base text-slate-600">老板 + 产品 + 开发 + 设计 + 后台 + 运营 + 数据，<span className="font-bold text-blue-600">一个月上线</span></div>
          </div>
          <div className="flex items-start gap-5 mb-4">
            <div className="text-xl font-bold text-slate-700 min-w-[100px]">AI时代</div>
            <div className="text-base text-slate-600"><span className="font-bold text-blue-600">1个人 + AI工具，3天上线</span></div>
          </div>
          <div className="flex items-start gap-5">
            <div className="text-xl font-bold text-slate-700 min-w-[100px]">核心理念</div>
            <div className="text-base text-slate-600">AI无限放大你的能力。过去我们学知识，现在我们学如何用别人的知识。</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { day: 'Day 1', content: '企业级产品开发流程介绍\nAI编程工具介绍\n创意讨论\n产品文档撰写\n产品设计稿制作\n技术设计方案撰写' },
            { day: 'Day 2', content: '产品开发（含服务端开发）\n调试\n测试' },
            { day: 'Day 3', content: '产品部署\n数据分析\n增长运营' },
          ].map((item, i) => (
            <div key={i} className="bg-white border border-slate-200 p-4 rounded-lg relative">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-blue-600 rounded-t-lg" />
              <div className="text-xs text-blue-500 font-mono font-semibold mb-2">{item.day}</div>
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{item.content}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { title: '真·小班', desc: '不超过8人，确保老师看见每个创意' },
            { title: '真产品', desc: '可带走的网站、游戏、App，不是Demo，是能上线能用的真东西' },
            { title: '真交付', desc: 'Vibe Coding降低创造门槛，我们补上部署、服务端、运营的硬核闭环' },
            { title: '硬核老师', desc: '老师深耕AI多领域，课堂中穿插前沿视野拓展。不止教做产品，更帮孩子看见AI的全貌。' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 border-l-[3px] border-blue-600 rounded-r-lg shadow-sm">
              <div className="text-base font-bold text-slate-700 mb-1">{item.title}</div>
              <div className="text-sm text-slate-500 leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>

        <div className="bg-blue-600 p-3 mb-6 rounded-lg flex items-center gap-4">
          <span className="text-xs text-white/70 font-mono tracking-widest uppercase">上课时间</span>
          <span className="text-base text-white font-semibold">每周一，三、五 下午 1:30～4:00</span>
        </div>
      </div>

      <div className="p-5 bg-slate-50 border-t-2 border-blue-600">
        <div className="text-xs text-blue-500 font-mono tracking-widest uppercase mb-4">联系我们</div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '📞', text: '13051202991' },
            { icon: '📞', text: '15811055744' },
            { icon: '🌐', text: 'jinboshiai.com' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 flex items-center justify-center text-white text-sm rounded-lg">{item.icon}</div>
              <span className="text-sm text-slate-600">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 flex justify-between items-center border-t border-slate-200 bg-slate-50">
        <div className="flex flex-col items-end gap-2">
          <div className="text-base font-semibold text-slate-700 tracking-wider">金博士 AI 实验室</div>
          <div className="text-xs text-slate-500">青少年 Vibe Coding 3日创造营</div>
        </div>
        <div className="w-[110px] h-[110px] overflow-hidden rounded-lg">
          <img src="/images/erweima.png" alt="二维码" className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  )
}

function AgentTab() {
  return (
    <div>
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-14 text-white relative overflow-hidden">
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
        <div className="py-12 border-b border-slate-200 relative before:absolute before:left-[-40px] before:top-12 before:w-1.5 before:h-12 before:bg-gradient-to-b from-blue-600 to-blue-50 before:rounded">
          <div className="pl-6">
            <div className="p-9 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl text-lg text-white text-center leading-relaxed shadow-md">
              3天时间 · 从0到1搭建 · 带走<strong className="text-[#FFE566]">专属你的AI数字员工</strong><br/>
              <span className="text-base opacity-90">以后别卷自己了，咱们学会「压榨」AI员工！</span>
            </div>
          </div>
        </div>

        <div className="py-12 border-b border-[#E2E8F0] relative before:absolute before:left-[-40px] before:top-12 before:w-1.5 before:h-12 before:bg-gradient-to-b from-[#3B82F6] to-[#EFF6FF] before:rounded">
          <h2 className="text-2xl font-bold text-[#475569] mb-7 pl-6">3天课程安排</h2>
          <div className="space-y-6 pl-6">
            {[
              { day: 'Day 1', title: '认识你的AI新同事', topics: ['主流智能体工具全景介绍', '创建第一个专属技能', '玩转第三方技能库'] },
              { day: 'Day 2', title: '搭建AI数字员工架构', topics: ['拆解业务流程与任务', '设计智能体架构', '实现你的AI数字员工'] },
              { day: 'Day 3', title: '让AI员工正式上岗', topics: ['全面实现数字员工功能', '测试与调试智能体', '让AI员工开始为你工作'] },
            ].map((item, i) => (
              <div key={i} className="p-8 bg-white rounded-xl border-2 border-blue-50 relative shadow-sm">
                <div className="absolute top-0 left-9 right-9 h-1 bg-gradient-to-r from-blue-600 to-blue-50 rounded" />
                <div className="flex items-center gap-5 mb-5">
                  <div className="w-14 h-14 bg-blue-600 text-white font-bold text-base flex items-center justify-center rounded-lg shadow-sm">{item.day}</div>
                  <div className="text-xl font-bold text-slate-700">{item.title}</div>
                </div>
                <div className="pl-19 space-y-4">
                  {item.topics.map((topic, j) => (
                    <div key={j} className="text-base text-slate-600 leading-relaxed relative pl-7">
                      <span className="absolute left-0 top-2.5 w-2.5 h-2.5 bg-blue-600 rounded-full" />
                      {topic}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-16 py-10 bg-slate-900 flex justify-between items-center gap-16">
        <div className="flex-1">
          <div className="text-xl font-bold text-blue-400 mb-2 tracking-wider">金博士 AI 实验室</div>
          <div className="text-sm text-slate-400 leading-loose">
            手机/微信：13051202991 ｜ 15811055744<br/>
            地址：北京市顺义区临空经济核心区安庆大街7号良基科技广场A座316室<br/>
            jinboshiai.com
          </div>
        </div>
        <div className="w-[110px] h-[110px] bg-white p-2 rounded-xl shadow-md">
          <img src="/images/erweima.png" alt="二维码" className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  )
}

function CompanyTab() {
  return (
    <div>
      <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] p-14 text-white relative overflow-hidden">
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
        <div className="py-12 border-b border-[#E2E8F0] relative before:absolute before:left-[-40px] before:top-12 before:w-1.5 before:h-12 before:bg-gradient-to-b from-[#3B82F6] to-[#EFF6FF] before:rounded">
          <div className="pl-6">
            <div className="p-9 bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] rounded-xl text-lg text-white text-center leading-relaxed shadow-[0_8px_32px_rgba(59,130,246,0.25)]">
              3天实战 · 从0到1 · 带走<strong className="text-[#FFE566]">小公司AI落地最佳方案</strong><br/>
              <span className="text-base opacity-90">让AI真正落地到你的公司，少走弯路！</span>
            </div>
          </div>
        </div>

        <div className="py-12 border-b border-[#E2E8F0] relative before:absolute before:left-[-40px] before:top-12 before:w-1.5 before:h-12 before:bg-gradient-to-b from-[#3B82F6] to-[#EFF6FF] before:rounded">
          <h2 className="text-2xl font-bold text-[#475569] mb-7 pl-6">3天课程安排</h2>
          <div className="space-y-6 pl-6">
            {[
              { day: 'Day 1', title: 'AI落地技术方案', topics: ['公司AI落地技术方案', '相关工具全面介绍', '相关解决案例讲解'] },
              { day: 'Day 2', title: '搭建落地架构', topics: ['拆解公司业务流程', '搭建AI落地架构'] },
              { day: 'Day 3', title: '全面实现落地', topics: ['全面跑通业务流程', '实现AI真正落地', '搭建可监控可衡量的闭环系统'] },
            ].map((item, i) => (
              <div key={i} className="p-8 bg-white rounded-xl border-2 border-[#EFF6FF] relative shadow-[0_4px_20px_rgba(59,130,246,0.06)]">
                <div className="absolute top-0 left-9 right-9 h-1 bg-gradient-to-r from-[#3B82F6] to-[#EFF6FF] rounded" />
                <div className="flex items-center gap-5 mb-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white font-bold text-base flex items-center justify-center rounded-lg shadow-[0_4px_16px_rgba(59,130,246,0.3)]">{item.day}</div>
                  <div className="text-xl font-bold text-[#475569]">{item.title}</div>
                </div>
                <div className="pl-19 space-y-4">
                  {item.topics.map((topic, j) => (
                    <div key={j} className="text-base text-[#475569] leading-relaxed relative pl-7">
                      <span className="absolute left-0 top-2.5 w-2.5 h-2.5 bg-[#3B82F6] rounded-full shadow-[0_2px_8px_rgba(59,130,246,0.3)]" />
                      {topic}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-16 py-10 bg-gradient-to-br from-[#1E293B] to-[#2a2a2a] flex justify-between items-center gap-16">
        <div className="flex-1">
          <div className="text-xl font-bold text-[#3B82F6] mb-2 tracking-wider">金博士 AI 实验室</div>
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
      <div className="bg-gradient-to-br from-[#3B82F6] to-[#2563EB] p-14 text-white relative overflow-hidden">
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
        <div className="py-12 border-b border-[#E2E8F0] relative before:absolute before:left-[-40px] before:top-12 before:w-1.5 before:h-12 before:bg-gradient-to-b from-[#3B82F6] to-[#EFF6FF] before:rounded">
          <div className="pl-6">
            <div className="p-9 bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] rounded-xl text-lg text-white text-center leading-relaxed shadow-[0_8px_32px_rgba(59,130,246,0.25)]">
              3天实战 · 系统学习 · <strong className="text-[#FFE566]">掌握AI核心能力</strong><br/>
              <span className="text-base opacity-90">从提示词到工作流，从智能体到编程，一次打通！</span>
            </div>
          </div>
        </div>

        <div className="py-12 border-b border-[#E2E8F0] relative before:absolute before:left-[-40px] before:top-12 before:w-1.5 before:h-12 before:bg-gradient-to-b from-[#3B82F6] to-[#EFF6FF] before:rounded">
          <h2 className="text-2xl font-bold text-[#475569] mb-7 pl-6">3天课程安排</h2>
          <div className="space-y-6 pl-6">
            {[
              { day: 'Day 1', title: 'AI基础与提示词', topics: ['AI知识体系全面讲解', '提示词工程实战', '技能实战训练'] },
              { day: 'Day 2', title: 'AI进阶技能', topics: ['工作流实战', '智能体实战'] },
              { day: 'Day 3', title: 'AI综合实战', topics: ['AI办公实战', 'AI编程实战'] },
            ].map((item, i) => (
              <div key={i} className="p-8 bg-white rounded-xl border-2 border-[#EFF6FF] relative shadow-[0_4px_20px_rgba(59,130,246,0.06)]">
                <div className="absolute top-0 left-9 right-9 h-1 bg-gradient-to-r from-[#3B82F6] to-[#EFF6FF] rounded" />
                <div className="flex items-center gap-5 mb-5">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] text-white font-bold text-base flex items-center justify-center rounded-lg shadow-[0_4px_16px_rgba(59,130,246,0.3)]">{item.day}</div>
                  <div className="text-xl font-bold text-[#475569]">{item.title}</div>
                </div>
                <div className="pl-19 space-y-4">
                  {item.topics.map((topic, j) => (
                    <div key={j} className="text-base text-[#475569] leading-relaxed relative pl-7">
                      <span className="absolute left-0 top-2.5 w-2.5 h-2.5 bg-[#3B82F6] rounded-full shadow-[0_2px_8px_rgba(59,130,246,0.3)]" />
                      {topic}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-16 py-10 bg-gradient-to-br from-[#1E293B] to-[#2a2a2a] flex justify-between items-center gap-16">
        <div className="flex-1">
          <div className="text-xl font-bold text-[#3B82F6] mb-2 tracking-wider">金博士 AI 实验室</div>
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
