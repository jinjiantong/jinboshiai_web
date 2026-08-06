'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Building2, ArrowRight, CheckCircle2, Target, Users, AlertCircle, MapPin, Medal, Flame, FileText, X, Phone, Globe, Award, ThumbsUp, XCircle, ListChecks, ClipboardCheck } from 'lucide-react'

const conditions = [
  { title: '有拥抱AI的决心', desc: '老板亲自推，不是试试看' },
  { title: '有明确业务痛点', desc: '能说清具体卡在哪，有数据' },
  { title: '有AI赋能的业务场景', desc: '痛点AI能解决，不是要自研大模型' },
  { title: '能配合工程师落地', desc: '安排专人对接，不甩手' },
]

const process = [
  { phase: '需求诊断', content: '1对1调研，出诊断报告', time: '第1天' },
  { phase: '方案设计', content: '定制AI落地方案', time: '第2天' },
  { phase: '落地实施', content: '部署工具，搭建场景', time: '第3-7天' },
  { phase: '团队培训', content: '教你的团队用起来', time: '第5-6天' },
  { phase: '效果验收', content: '量化评估，出报告', time: '第8天' },
  { phase: '案例共创', content: '共同打造标杆案例', time: '第9-10天' },
]

export default function EnterpriseAI() {
  const [showRules, setShowRules] = useState(false)
  const [showCaseDetail, setShowCaseDetail] = useState(false)

  return (
    <section id="enterprise-ai" className="pt-28 pb-16 lg:pt-36 lg:pb-24 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="section-badge justify-center">
            <span>Enterprise AI</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-5 tracking-tight text-slate-900">
            企业AI落地
          </h2>
          <p className="text-lg sm:text-xl text-blue-600 font-semibold mb-3">
            先进公司，先用AI
          </p>
          <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            从培训到落地，助力企业完成AI转型，让AI真正产生价值
          </p>
        </motion.div>

        {/* 活动区域 */}
        <div className="mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-1 h-7 rounded-full bg-blue-600"></div>
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-700 tracking-tight">活动区域</h3>
            <span className="ml-2 px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              招募中 · 10月1日截止
            </span>
          </motion.div>

          {/* 活动主卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm"
          >
            {/* Hero 区 */}
            <div className="relative p-8 lg:p-12 text-white overflow-hidden bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700">
              <div className="absolute right-[-80px] top-[-80px] w-[360px] h-[360px] rounded-full border-[60px] border-white/[0.06]" />
              <div className="absolute left-[-60px] bottom-[-100px] w-[300px] h-[300px] rounded-full border-[50px] border-white/[0.04]" />
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)' }} />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full bg-white/15 border border-white/20">
                  <Flame className="w-4 h-4 text-amber-300" />
                  <span className="text-xs tracking-[0.2em] font-semibold uppercase">限时招募</span>
                </div>
                <h4 className="text-2xl lg:text-3xl font-bold mb-3 tracking-tight leading-tight">先进公司，先用AI</h4>
                <p className="text-base lg:text-lg mb-1 font-medium text-white/90">金博士AI实验室 · 免费为5家企业落地AI</p>
                <p className="text-sm text-white/70">北京限5家 · 报名截止 2026年10月1日</p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/20">
                    全程免费
                  </span>
                  <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/20">
                    诊断→部署→培训全包
                  </span>
                  <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/20">
                    北京仅5家
                  </span>
                  <button
                    onClick={() => setShowRules(true)}
                    className="ml-auto inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-blue-600 bg-white hover:bg-slate-50 transition-colors cursor-pointer shadow-sm"
                  >
                    <FileText className="w-4 h-4" />
                    活动详情
                  </button>
                </div>
              </div>
            </div>

            {/* 内容区 */}
            <div className="p-8 lg:p-12">
              {/* 是什么 / 为什么免费 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {[
                  { icon: Target, title: '这是什么？', desc: <>金博士AI实验室选5家企业，<strong className="text-blue-600">免费上门落地AI</strong>——从诊断到部署到培训，全包，不收一分钱。</> },
                  { icon: AlertCircle, title: '为什么免费？', desc: <>我们要做真实案例。你得到免费服务，我们得到落地案例，<strong className="text-blue-600">各取所需</strong>。</> },
                  { icon: Users, title: '谁能报名？', desc: <>少于20人的小微企业，老板本人有决心推AI，能安排专人配合工程师落地。</> },
                  { icon: MapPin, title: '如何落地？', desc: <>到公司现场跟业务员<strong className="text-blue-600">1对1了解业务</strong>，现场出方案。</> },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-5 rounded-xl bg-white border border-slate-200 card-hover">
                    <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h5 className="text-base font-bold mb-1.5 text-slate-700">{item.title}</h5>
                      <p className="text-sm leading-relaxed text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 四个硬条件 */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-6 rounded-full bg-blue-600"></div>
                <h5 className="text-base font-bold text-slate-700">四个硬条件</h5>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-50 text-blue-600">缺一不可</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
                {conditions.map((item, i) => (
                  <div key={i} className="p-5 rounded-xl bg-white border border-slate-200 card-hover">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full text-xs font-bold text-white flex items-center justify-center bg-blue-600">{i + 1}</span>
                      <span className="text-sm font-bold text-slate-700">{item.title}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* 你能得到什么 */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-6 rounded-full bg-blue-600"></div>
                <h5 className="text-base font-bold text-slate-700">你能得到什么？</h5>
                <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-50 text-blue-600">全程免费</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
                {process.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-200 card-hover">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-slate-700">{item.phase}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">{item.time}</span>
                      </div>
                      <p className="text-xs leading-relaxed text-slate-600">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 唯一的代价 + 名额 */}
              <div className="flex flex-col lg:flex-row gap-4 mb-10">
                <div className="flex-1 p-5 rounded-xl bg-white border border-slate-200 flex items-center gap-4 card-hover">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <Medal className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h5 className="text-base font-bold mb-1 text-slate-700">唯一的「代价」？</h5>
                    <p className="text-sm leading-relaxed text-slate-600">
                      允许我们公开落地过程和效果。<strong className="text-blue-700">真实案例比广告有用100倍。</strong>
                    </p>
                  </div>
                </div>
                <div className="flex-1 p-5 rounded-xl bg-white border border-slate-200 flex items-center gap-4 card-hover">
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h5 className="text-base font-bold mb-1 text-slate-700">名额多少？</h5>
                    <p className="text-sm leading-relaxed text-slate-600">
                      <strong className="text-blue-600">北京限5家</strong>，先到先审，满额即止。
                    </p>
                  </div>
                </div>
              </div>

              {/* 报名 */}
              <div className="rounded-xl p-7 text-white text-center bg-gradient-to-br from-blue-600 to-blue-700">
                <div className="text-lg font-bold mb-2">马上报名</div>
                <div className="text-sm mb-4 inline-block px-4 py-1.5 rounded-full bg-white/15">
                  报名截止：<strong>2026年10月1日</strong>
                </div>
                <div className="flex flex-wrap justify-center gap-4 text-sm">
                  <span className="px-4 py-2 rounded-lg bg-white/15">电话 / 微信：13051202991</span>
                  <span className="px-4 py-2 rounded-lg bg-white/15">官网：jinboshiai.com</span>
                </div>
                <div className="mt-3 text-xs text-white/70">抖音 / 小红书 / 大众点评：金博士AI实验室</div>
                <div className="mt-5 text-sm font-semibold">先进公司，先用AI。5个名额，10月1日截止，等你来抢。</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 案例展示 */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="w-1 h-7 rounded-full bg-blue-600"></div>
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-700 tracking-tight">案例展示</h3>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200 mb-6 border-t-2 border-t-blue-600"
          >
            <div className="flex flex-col lg:flex-row">
              {/* 左侧信息 */}
              <div className="flex-1 p-7 lg:p-9">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-600">
                    汽车供应链
                  </span>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-600">
                    已完成落地
                  </span>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-600">
                    提效利器
                  </span>
                </div>
                <h4 className="text-xl lg:text-2xl font-bold mb-3 tracking-tight text-slate-800">
                  给一家汽车供应链公司员工的AI落地实录
                </h4>
                <p className="text-sm leading-relaxed mb-4 text-slate-600">
                  客户是汽车供应链公司的普通员工，公司工作量是同行业2倍。他50%的时间都在写报告——每天写的报告又多又乱、经常出错。我们用AI智能体帮他重写报告工作流，解决39页PPT模板、计算逻辑、排期等痛点。
                </p>
                <div className="flex flex-wrap gap-4 mb-5">
                  <div>
                    <div className="text-xl font-bold text-blue-600">6小时</div>
                    <div className="text-xs mt-0.5 text-slate-400">完成AI落地</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-blue-600">50%</div>
                    <div className="text-xs mt-0.5 text-slate-400">报告时间可释放</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-blue-600">5步</div>
                    <div className="text-xs mt-0.5 text-slate-400">落地方法论</div>
                  </div>
                </div>
                <button
                  onClick={() => setShowCaseDetail(true)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  查看完整实录
                </button>
              </div>
              {/* 右侧步骤摘要 */}
              <div className="lg:w-2/5 p-7 lg:p-9 bg-blue-50/50 border-l border-blue-100">
                <div className="text-xs font-semibold mb-4 tracking-widest uppercase text-blue-500">落地五步法</div>
                <div className="space-y-3">
                  {['定义工作流程', '解决具体问题', '磨合期', '跑通案例', '自行测试'].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full text-xs font-bold text-white flex items-center justify-center flex-shrink-0 bg-blue-600">{i + 1}</span>
                      <span className="text-sm font-medium text-slate-700">{step}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-xl bg-blue-50">
                  <p className="text-xs leading-relaxed text-blue-700">
                    <strong>结果</strong>：AI掌握39页PPT模板与计算逻辑，稳定产出报告。同样的原理可复制到其他报告场景。
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 活动规则弹窗 */}
      {showRules && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60" onClick={() => setShowRules(false)}>
          <div
            className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 弹窗头部 */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b" style={{ borderColor: '#E2E8F0' }}>
              <div>
                <h4 className="text-lg font-bold" style={{ color: '#475569' }}>「先进公司 先用AI」活动规则</h4>
                <p className="text-xs mt-0.5" style={{ color: '#3B82F6' }}>金博士AI实验室 · 免费为5家企业落地AI</p>
              </div>
              <button onClick={() => setShowRules(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                <X className="w-5 h-5" style={{ color: '#64748B' }} />
              </button>
            </div>

            <div className="px-6 py-6 space-y-8">
              {/* 一、活动简介 */}
              <div>
                <h5 className="flex items-center gap-2 text-base font-bold mb-3" style={{ color: '#3B82F6' }}>
                  <Award className="w-4 h-4" /> 一、活动简介
                </h5>
                <div className="space-y-1.5 text-sm leading-relaxed" style={{ color: '#475569' }}>
                  <p><strong style={{ color: '#475569' }}>活动名称</strong>：先进公司 先用AI</p>
                  <p><strong style={{ color: '#475569' }}>主办方</strong>：金博士AI实验室</p>
                  <p><strong style={{ color: '#475569' }}>活动内容</strong>：免费为5家企业提供AI落地服务，包含需求诊断、方案设计、工具部署、团队培训、效果验收，帮助企业真正把AI用起来。</p>
                  <p><strong style={{ color: '#475569' }}>活动名额</strong>：北京限5家企业，按行业覆盖筛选，先到先审。</p>
                </div>
              </div>

              {/* 二、报名条件 */}
              <div>
                <h5 className="flex items-center gap-2 text-base font-bold mb-3" style={{ color: '#3B82F6' }}>
                  <ListChecks className="w-4 h-4" /> 二、报名条件
                </h5>
                <p className="text-sm font-semibold mb-3" style={{ color: '#475569' }}>
                  🔥 硬性条件（四条缺一不可，缺任何一条不予受理）
                </p>
                <div className="space-y-3 mb-4">
                  {conditions.map((item, i) => (
                    <div key={i} className="p-4 rounded-xl border" style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}>
                      <p className="text-sm font-bold mb-1" style={{ color: '#475569' }}>
                        {i + 1}. {item.title}
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>
                        {i === 0 && '企业决策者（老板/创始人）对AI落地有真正的信念和推动力，愿意为此投入时间、人员和学习成本。不是「试一下不行就算了」的心态，而是「我一定要把AI用起来」的决心。'}
                        {i === 1 && '能清楚说出当前业务中的具体问题——效率低在哪、成本高在哪、人手不够卡在哪。有量化数据或真实案例支撑，而非「我们想提升效率」这种空泛诉求。'}
                        {i === 2 && '痛点在现有AI工具能力范围内可解决。包括但不限于：智能客服、内容文案生成、数据分析、流程自动化、视觉质检、路径优化等。'}
                        {i === 3 && '安排1名专人全程对接，愿意按工程师要求准备数据、测试反馈、调整流程。不做甩手掌柜，不把「免费」当「不用管」。'}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-xl border mb-4" style={{ borderColor: '#E2E8F0', background: '#fff' }}>
                  <p className="text-sm font-bold mb-2" style={{ color: '#475569' }}>加分条件（同等条件下优先入选）</p>
                  <ul className="text-xs leading-relaxed space-y-1" style={{ color: '#64748B' }}>
                    <li>· 企业规模少于20人</li>
                    <li>· 所属行业为电商/零售、制造、教育培训、服务/餐饮、物流/供应链</li>
                    <li>· 决策者本人填写申请</li>
                    <li>· 愿意作为公开案例传播</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl border" style={{ borderColor: '#fdd', background: '#fff5f5' }}>
                  <p className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: '#d33' }}>
                    <XCircle className="w-4 h-4" /> 不接受报名的情况
                  </p>
                  <ul className="text-xs leading-relaxed space-y-1" style={{ color: '#a33' }}>
                    <li>· 痛点模糊，说不清要解决什么问题</li>
                    <li>· 对AI没有决心，抱着试试看心态</li>
                    <li>· 不愿安排人配合工程师，想做甩手掌柜</li>
                    <li>· 企业内部没有任何数字化基础（连钉钉/飞书/企微都没用）</li>
                    <li>· 不愿意公开落地过程和效果</li>
                    <li>· 需求超出团队能力范围（如自研大模型）</li>
                  </ul>
                </div>
              </div>

              {/* 三、筛选规则 */}
              <div>
                <h5 className="flex items-center gap-2 text-base font-bold mb-3" style={{ color: '#3B82F6' }}>
                  <ClipboardCheck className="w-4 h-4" /> 三、筛选规则
                </h5>
                <p className="text-sm font-semibold mb-2" style={{ color: '#475569' }}>筛选流程</p>
                <div className="flex flex-wrap items-center gap-2 mb-4 text-xs" style={{ color: '#475569' }}>
                  {['报名提交', '资格初审（1个工作日）', '深度沟通（1对1电话/视频）', '综合评分', '公布名单'].map((step, i, arr) => (
                    <span key={i} className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-full border" style={{ borderColor: '#3B82F6', color: '#3B82F6', background: 'rgba(59,130,246,0.06)' }}>{step}</span>
                      {i < arr.length - 1 && <ArrowRight className="w-3.5 h-3.5" style={{ color: '#c0c0c0' }} />}
                    </span>
                  ))}
                </div>
                <p className="text-sm font-semibold mb-2" style={{ color: '#475569' }}>评分模型（满分100分）</p>
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr style={{ background: 'rgba(59,130,246,0.08)' }}>
                        <th className="text-left px-3 py-2 border font-semibold" style={{ borderColor: '#E2E8F0', color: '#3B82F6' }}>评分维度</th>
                        <th className="text-left px-3 py-2 border font-semibold" style={{ borderColor: '#E2E8F0', color: '#3B82F6' }}>分值</th>
                        <th className="text-left px-3 py-2 border font-semibold" style={{ borderColor: '#E2E8F0', color: '#3B82F6' }}>评分标准</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['痛点清晰度', '25分', '有明确的业务痛点，能具体描述问题、有量化数据或真实案例支撑'],
                        ['AI赋能场景', '25分', '痛点匹配AI工具能力范围，落地方案可行、周期可控'],
                        ['行业代表性', '15分', '能补充5个行业案例矩阵的缺口'],
                        ['配合度', '20分', '决策者亲自参与，愿安排专人配合工程师落地，不甩手'],
                        ['传播价值', '15分', '愿意公开案例，行业有话题性和示范效应'],
                      ].map((row, i) => (
                        <tr key={i} className={i % 2 ? '' : ''} style={{ background: i % 2 ? '#fff' : '#F8FAFC' }}>
                          <td className="px-3 py-2 border" style={{ borderColor: '#E2E8F0', color: '#475569' }}>{row[0]}</td>
                          <td className="px-3 py-2 border font-semibold" style={{ borderColor: '#E2E8F0', color: '#3B82F6' }}>{row[1]}</td>
                          <td className="px-3 py-2 border" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <ul className="text-xs leading-relaxed space-y-1.5" style={{ color: '#64748B' }}>
                  <li>· 评审由金博士AI实验室团队执行，结果在活动官方渠道公布</li>
                  <li>· 每家报名企业都会收到回复（入选或未入选通知）</li>
                  <li>· 未入选企业将获赠「企业AI落地自检清单」，并可享受后续付费服务专属优惠</li>
                  <li>· 筛选过程不接受请托、说情，公平公正</li>
                </ul>
              </div>

              {/* 四、入选企业义务 */}
              <div>
                <h5 className="flex items-center gap-2 text-base font-bold mb-3" style={{ color: '#3B82F6' }}>
                  <ThumbsUp className="w-4 h-4" /> 四、入选企业义务
                </h5>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl border" style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}>
                    <p className="text-sm font-bold mb-1" style={{ color: '#475569' }}>1. 案例授权</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>允许金博士AI实验室使用企业名称及所属行业、AI落地方案与实施过程、落地效果数据（经企业确认后发布）作为公开案例。</p>
                  </div>
                  <div className="p-4 rounded-xl border" style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}>
                    <p className="text-sm font-bold mb-1" style={{ color: '#475569' }}>2. 工程配合</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>指定1名内部对接人全程配合；按要求准备业务数据、系统账号；参与需求沟通、测试反馈、流程调整；配合落地过程中的拍摄记录。</p>
                  </div>
                  <div className="p-4 rounded-xl border" style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}>
                    <p className="text-sm font-bold mb-1" style={{ color: '#475569' }}>3. 真实反馈</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>落地完成后提供真实的使用反馈和效果数据，配合输出落地效果报告。</p>
                  </div>
                  <div className="p-4 rounded-xl border" style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}>
                    <p className="text-sm font-bold mb-1" style={{ color: '#475569' }}>4. 口碑传播</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>在企业自身渠道（朋友圈、社群、行业交流群等）分享合作体验，帮助更多企业了解AI落地。</p>
                  </div>
                </div>
              </div>

              {/* 五、免费服务内容 */}
              <div>
                <h5 className="flex items-center gap-2 text-base font-bold mb-3" style={{ color: '#3B82F6' }}>
                  <CheckCircle2 className="w-4 h-4" /> 五、免费服务内容
                </h5>
                <div className="overflow-x-auto mb-3">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr style={{ background: 'rgba(59,130,246,0.08)' }}>
                        <th className="text-left px-3 py-2 border font-semibold" style={{ borderColor: '#E2E8F0', color: '#3B82F6' }}>阶段</th>
                        <th className="text-left px-3 py-2 border font-semibold" style={{ borderColor: '#E2E8F0', color: '#3B82F6' }}>服务内容</th>
                        <th className="text-left px-3 py-2 border font-semibold" style={{ borderColor: '#E2E8F0', color: '#3B82F6' }}>周期</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['需求诊断', '金博士团队1对1深入调研，输出AI落地需求诊断报告', '第1天'],
                        ['方案设计', '针对企业痛点定制AI落地方案（含工具选型、流程设计）', '第2天'],
                        ['落地实施', '协助部署配置AI工具，完成核心场景搭建', '第3-7天'],
                        ['团队培训', '为企业团队进行AI工具使用培训', '第5-6天'],
                        ['效果验收', '量化效果评估，输出落地效果报告', '第8天'],
                        ['案例共创', '共同打造行业标杆案例内容', '第9-10天'],
                      ].map((row, i) => (
                        <tr key={i} style={{ background: i % 2 ? '#fff' : '#F8FAFC' }}>
                          <td className="px-3 py-2 border font-semibold" style={{ borderColor: '#E2E8F0', color: '#475569' }}>{row[0]}</td>
                          <td className="px-3 py-2 border" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>{row[1]}</td>
                          <td className="px-3 py-2 border" style={{ borderColor: '#E2E8F0', color: '#3B82F6' }}>{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>
                  <strong style={{ color: '#3B82F6' }}>服务承诺</strong>：全程不收取任何费用。不借机推销付费课程或服务。如企业后续主动咨询付费服务，按正常商业流程另行沟通，不在免费服务范围内施压推销。
                </p>
              </div>

              {/* 六、时间安排 */}
              <div>
                <h5 className="flex items-center gap-2 text-base font-bold mb-3" style={{ color: '#3B82F6' }}>
                  <Calendar className="w-4 h-4" /> 六、时间安排
                </h5>
                <div className="overflow-x-auto mb-2">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr style={{ background: 'rgba(59,130,246,0.08)' }}>
                        <th className="text-left px-3 py-2 border font-semibold" style={{ borderColor: '#E2E8F0', color: '#3B82F6' }}>阶段</th>
                        <th className="text-left px-3 py-2 border font-semibold" style={{ borderColor: '#E2E8F0', color: '#3B82F6' }}>时间</th>
                        <th className="text-left px-3 py-2 border font-semibold" style={{ borderColor: '#E2E8F0', color: '#3B82F6' }}>内容</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['报名筛选', '第1-2天', '开放申请 + 快速筛选 + 公布名单'],
                        ['落地实施', '第3-10天', '5家企业实施AI落地'],
                        ['案例输出', '第11-14天', '发布案例，举办案例分享会'],
                      ].map((row, i) => (
                        <tr key={i} style={{ background: i % 2 ? '#fff' : '#F8FAFC' }}>
                          <td className="px-3 py-2 border font-semibold" style={{ borderColor: '#E2E8F0', color: '#475569' }}>{row[0]}</td>
                          <td className="px-3 py-2 border" style={{ borderColor: '#E2E8F0', color: '#3B82F6' }}>{row[1]}</td>
                          <td className="px-3 py-2 border" style={{ borderColor: '#E2E8F0', color: '#64748B' }}>{row[2]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: '#64748B' }}>
                  全周期不超过2周，具体日期以官方通知为准。如遇特殊情况需调整，将提前告知入选企业。
                </p>
              </div>

              {/* 七、注意事项 */}
              <div>
                <h5 className="flex items-center gap-2 text-base font-bold mb-3" style={{ color: '#3B82F6' }}>
                  <AlertCircle className="w-4 h-4" /> 七、注意事项
                </h5>
                <ol className="text-xs leading-relaxed space-y-2 list-decimal pl-4" style={{ color: '#64748B' }}>
                  <li><strong style={{ color: '#475569' }}>真实性承诺</strong>：报名企业需如实填写信息，如发现弄虚作假，取消参选资格</li>
                  <li><strong style={{ color: '#475569' }}>免费声明</strong>：本次活动全程免费，金博士AI实验室不以任何名目向入选企业收取费用</li>
                  <li><strong style={{ color: '#475569' }}>自愿原则</strong>：报名即视为自愿接受本活动规则，入选后需签署合作备忘录明确双方权责</li>
                  <li><strong style={{ color: '#475569' }}>退出机制</strong>：入选企业在落地过程中如因自身原因无法继续配合，金博士AI实验室有权终止服务并递补其他企业</li>
                  <li><strong style={{ color: '#475569' }}>解释权</strong>：本活动最终解释权归金博士AI实验室所有</li>
                </ol>
              </div>

              {/* 八、联系我们 */}
              <div>
                <h5 className="flex items-center gap-2 text-base font-bold mb-3" style={{ color: '#3B82F6' }}>
                  <Phone className="w-4 h-4" /> 八、联系我们
                </h5>
                <div className="flex flex-wrap gap-3 text-xs">
                  <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ borderColor: '#E2E8F0', color: '#475569' }}>
                    <Phone className="w-3.5 h-3.5" style={{ color: '#3B82F6' }} /> 13051202991 / 微信：jinboshiai
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ borderColor: '#E2E8F0', color: '#475569' }}>
                    <Globe className="w-3.5 h-3.5" style={{ color: '#3B82F6' }} /> jinboshiai.com
                  </span>
                </div>
                <p className="text-xs mt-2" style={{ color: '#64748B' }}>官方渠道：抖音「金博士AI实验室」/ 小红书「金博士AI实验室」/ 大众点评「金博士AI实验室」</p>
              </div>

              {/* 结语 */}
              <div className="rounded-xl p-5 text-white text-center" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' }}>
                <p className="text-base font-bold mb-1">先进公司，先用AI。</p>
                <p className="text-xs opacity-90 mb-3">不是因为AI万能，而是因为你的竞争对手已经开始用了。</p>
                <p className="text-sm font-semibold">5个名额，等你来抢。</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 案例实录弹窗 */}
      {showCaseDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60" onClick={() => setShowCaseDetail(false)}>
          <div
            className="relative bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 弹窗头部 */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b" style={{ borderColor: '#E2E8F0' }}>
              <div>
                <h4 className="text-lg font-bold" style={{ color: '#475569' }}>给一家汽车供应链公司员工的AI落地实录</h4>
                <p className="text-xs mt-0.5" style={{ color: '#2563EB' }}>客户案例 · 已完成落地</p>
              </div>
              <button onClick={() => setShowCaseDetail(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                <X className="w-5 h-5" style={{ color: '#64748B' }} />
              </button>
            </div>

            <div className="px-6 py-6 space-y-6 text-sm leading-relaxed" style={{ color: '#475569' }}>
              {/* 背景 */}
              <div className="p-5 rounded-xl" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)' }}>
                <p className="mb-3">客户是一个普通员工，他们公司工作量据说是同行业的<strong style={{ color: '#2563EB' }}>2倍</strong>，最近还裁员了。</p>
                <p className="mb-3">他的工作50%写报告，其他时间沟通、拜访、改报告。他对接几个汽车品牌，管理多个部件，所以每天写的报告不仅多还乱。他看到我桌面文件夹点进去密密麻麻全是文件，没忍住问：你这么管不会出错吗？他说<strong style={{ color: '#2563EB' }}>经常出错</strong>，出错了还得继续改。</p>
                <p className="mb-0">他的诉求很简单，想通过AI提效，<strong style={{ color: '#2563EB' }}>少花点时间写报告</strong>。看来平时没少被折磨。</p>
              </div>

              {/* 工作拆解 */}
              <div>
                <h5 className="text-base font-bold mb-3" style={{ color: '#2563EB' }}>工作拆解</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    ['50%', '写报告、写邮件'],
                    ['40%', '沟通（甲方+内部协作）'],
                    ['10%', '拜访甲方'],
                  ].map((row, i) => (
                    <div key={i} className="p-4 rounded-xl border text-center" style={{ borderColor: '#E2E8F0' }}>
                      <div className="text-xl font-bold" style={{ color: '#3B82F6' }}>{row[0]}</div>
                      <div className="text-xs mt-1" style={{ color: '#64748B' }}>{row[1]}</div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs" style={{ color: '#94A3B8' }}>
                  每天紧张的工作环境，一直让他陷在很忙的状态里，但实际产出没那么高。老板根本不给你解决系统性问题，只跟你要结果。员工没时间停下来复盘梳理工作、改进工作流，也没权限推不动。
                </p>
              </div>

              {/* 解决方案 */}
              <div>
                <h5 className="text-base font-bold mb-3" style={{ color: '#2563EB' }}>AI落地方案：先解决最小痛点——写质量报告</h5>
                <p className="mb-3">通过不断沟通了解到，他们有一套采购系统，每次进系统复制质量方案项目信息，然后基于之前的PPT报告改一下生成新的PPT。</p>
                <div className="space-y-2 mb-4">
                  {[
                    '39页PPT模板，有20个需要修改的地方',
                    '生产件数有计算逻辑，需要大量计算后写入',
                    '每个产品有自己的开发流程',
                    '项目排期靠人工经验填入',
                    '还有日期等小改动',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full text-xs font-bold text-white flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: '#3B82F6' }}>{i + 1}</span>
                      <span style={{ color: '#475569' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 五步法 */}
              <div>
                <h5 className="text-base font-bold mb-3" style={{ color: '#2563EB' }}>落地五步法</h5>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-full text-xs font-bold text-white flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }}>1</span>
                      <span className="font-bold" style={{ color: '#475569' }}>定义工作流程</span>
                    </div>
                    <p className="text-xs mt-1 pl-8" style={{ color: '#64748B' }}>进入采购系统采集数据 → 数据填入模板PPT生成最新的 → 写审核检验报告 → 提供下载链接</p>
                  </div>
                  <div className="p-4 rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-full text-xs font-bold text-white flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }}>2</span>
                      <span className="font-bold" style={{ color: '#475569' }}>解决具体问题</span>
                    </div>
                    <ul className="text-xs mt-1 pl-8 space-y-1" style={{ color: '#64748B' }}>
                      <li>· 修改地方多：让AI了解PPT每个页面、表格、位置的真实意义，通过标记和命名让AI完全掌握这个PPT，训练后知道输入该填入哪个位置</li>
                      <li>· 数据有计算逻辑：注入数学公式，填充时必须计算后填入</li>
                      <li>· 产品流程不同：给AI全产品流程图资料，根据产品和工艺自行匹配</li>
                      <li>· 排期靠经验：定义好每个阶段的排期逻辑，让AI按逻辑排期</li>
                    </ul>
                  </div>
                  {[
                    ['3', '磨合期', '不断纠正输入输出逻辑，不断输入正确的思路。'],
                    ['4', '跑通案例', '让AI跑之前人为写好的报告和数据，强化学习。'],
                    ['5', '自行测试', '直到稳定产出为止，让AI自行测试、发现问题、解决问题。'],
                  ].map((step, i) => (
                    <div key={i} className="p-4 rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-6 h-6 rounded-full text-xs font-bold text-white flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }}>{step[0]}</span>
                        <span className="font-bold" style={{ color: '#475569' }}>{step[1]}</span>
                      </div>
                      <p className="text-xs mt-1 pl-8" style={{ color: '#64748B' }}>{step[2]}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 智能体控制 */}
              <div className="p-5 rounded-xl" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.12)' }}>
                <h5 className="text-base font-bold mb-3 flex items-center gap-2" style={{ color: '#2563EB' }}>
                  <Target className="w-4 h-4" /> 智能体控制机制
                </h5>
                <div className="flex flex-wrap gap-2">
                  {['规则写入', '配置优化', '自我进化机制', '稳定输出控制', '标准技能封装'].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 text-xs rounded-full" style={{ background: 'rgba(59,130,246,0.1)', color: '#2563EB' }}>{tag}</span>
                  ))}
                </div>
              </div>

              {/* 结果 */}
              <div className="rounded-xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }}>
                <h5 className="text-base font-bold mb-3">结果</h5>
                <div className="p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.15)' }}>
                  <div className="text-xs font-semibold mb-2" style={{ letterSpacing: '0.05em' }}>最终形态</div>
                  <div className="text-sm leading-relaxed">
                    在输入框输入产品链接 → 智能体自动生成 → 返回最新报告链接
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
