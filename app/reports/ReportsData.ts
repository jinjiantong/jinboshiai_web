// 阿木木AI CRM 销售报告能力清单（来自真实示例文档结构）
import {
  Target, ShieldAlert, FileText, Users, MessageSquare,
  Trophy, TrendingDown, Route, BrainCircuit, CalendarDays, ClipboardList,
} from 'lucide-react'

export interface ReportType {
  id: string
  ag: string[]
  name: string
  icon: any
  color: string // tailwind 用于标题底色
  desc: string
  sections: string[]
  sample: string
}

export const reports: ReportType[] = [
  {
    id: 'leads',
    ag: ['AG-01'],
    name: '销售线索报告',
    icon: Target,
    color: 'from-astro-orange to-astro-orangeDark',
    desc: '联网调研自动找客：按 ICP 画像产出线索清单，含来源、质量分、匹配理由与切入建议。',
    sections: ['一、摘要（策略版本 / 线索总数 / 等级分布 / 质量分）', '二、线索清单（按质量分从高到低）', '三、人工操作卡（优先级分级）', '四、渠道与策略说明', '五、产品覆盖情况'],
    sample: '示例：S级 100分｜测试-广饶县人民医院｜新院区检验能力建设窗口期｜质量分（联系方式20/来源15/画像15…）',
  },
  {
    id: 'review',
    ag: ['AG-01'],
    name: '审查报告',
    icon: ShieldAlert,
    color: 'from-amber-500 to-orange-600',
    desc: '对你录入的商机/线索做合规与补齐审查，标出会被挡下的问题与建议补的字段。',
    sections: ['一、初始化检查结果', '二、执行审查', '三、数据审查（联系方式获取指引）', '四、策略更新审查', '五、综合评级'],
    sample: '示例：缺联系方式→先主动获取失败后，再以“获取尝试”兜底；写入需显式确认，禁止编造号码。',
  },
  {
    id: 'plan',
    ag: ['AG-03'],
    name: '销售计划书',
    icon: FileText,
    color: 'from-sky-500 to-blue-600',
    desc: '一个商机的完整打法：画像＋分析＋评级＋赢率＋分阶段执行方案＋SOP依据。',
    sections: ['0. 销售作战指令卡', '一、客户分析', '二、商机分析', '三、综合评级', '四、成交概率预测', '五、执行方案（按SOP阶段＋话术库）', '六、SOP 依据'],
    sample: '示例：测试-兰考县中心医院｜指令卡置顶评级/赢率/本周必确认清单/关键风险｜执行方案逐阶段配话术。',
  },
  {
    id: 'profile',
    ag: ['AG-04'],
    name: '客户 360° 画像',
    icon: Users,
    color: 'from-violet-500 to-purple-600',
    desc: '跨表聚合 10 个维度的客户全貌，先联网调研后入库，查不到如实标注。',
    sections: ['一、基础档案', '二、联系人', '三、商机', '四、跟进记录', '五、业务画像', '六、组织画像', '七、近期动态', '八、客户价值评估', '九、切入机会点', '十、主要风险'],
    sample: '示例：测试-兰考县中心医院｜业务/组织/动态/价值/机会点/风险 全维度聚合。',
  },
  {
    id: 'followup',
    ag: ['AG-05', 'AG-06'],
    name: '跟进报告（13 节）',
    icon: MessageSquare,
    color: 'from-emerald-500 to-green-600',
    desc: '每次沟通自动成稿：摘要到附件 13 节，全程留痕、可追溯。',
    sections: ['摘要 · 相关报告 · 跟进历史', '客户/商机信息', '健康度评估 · 赢率预测', '下一步行动 · 话术推荐 · 待办', '风险预警 · SOP合规 · 附件'],
    sample: '示例：B2-滨州市人民医院｜健康度红黄绿灯＋赢率＋下一步＋话术（附出处）。',
  },
  {
    id: 'win',
    ag: ['AG-08'],
    name: '赢单复盘（7 章含成功因子）',
    icon: Trophy,
    color: 'from-lime-500 to-green-600',
    desc: '逐条跟进原文回放复盘，提炼可复制的成功因子，回写策略模式库。',
    sections: ['一、商机基本信息', '二、时间线销售过程复盘', '三、关键决策点分析', '四、SOP执行评分卡', '五、赢单/丢单原因深度分析', '六、总结与改进行动计划', '七、成功因子结构化提取（极性=正向）'],
    sample: '示例：第1次电话→第2次拜访逐条分析｜提取“先样本比对再谈判”打法→入策略模式库。',
  },
  {
    id: 'loss',
    ag: ['AG-09', 'AG-10'],
    name: '丢单复盘（7 章含失败因子）',
    icon: TrendingDown,
    color: 'from-rose-500 to-red-600',
    desc: '把丢单原因归类留档，提取失败因子（负向），避免重蹈覆辙。',
    sections: ['一、商机基本信息', '二、时间线销售过程复盘', '三、关键决策点分析', '四、SOP执行评分卡', '五、原因深度分析', '六、总结与改进行动计划', '七、失败因子结构化提取（极性=负向）'],
    sample: '示例：测试-B3-XX医院｜丢单原因归类 + 负因子（如“决策人未覆盖”）→进策略模式库负向对照。',
  },
  {
    id: 'sop',
    ag: ['AG-10'],
    name: 'SOP 优化报告',
    icon: Route,
    color: 'from-teal-500 to-cyan-600',
    desc: '用真实赢/丢单数据诊断流程：哪一步最常卡、该补什么、该改什么。',
    sections: ['一、数据概览', '二、SOP阶段有效性分析', '三、SOP覆盖度分析', '四、SOP推荐有效性分析', '五、偏离热点分析', '六、SOP优化建议汇总'],
    sample: '示例：按数据指出某阶段转化最低、建议补话术/动作，绝不“因为价格贵”这类空话。',
  },
  {
    id: 'brain',
    ag: ['AG-11'],
    name: '策略大脑运营报告',
    icon: BrainCircuit,
    color: 'from-fuchsia-500 to-purple-600',
    desc: '看你买它最值钱的部分：沉淀了多少打法、哪些生效、效果如何、哪些淘汰。',
    sections: ['一、数据概览', '二、获取层策略（综合价值排序）', '三、推进层模式（按 lift 排序）', '四、成交层模式（竞品/决策）', '五、负因子对照与失败模式', '六、置信度变化与模式淘汰清单', '七、样本不足与降级说明'],
    sample: '示例：模式“医疗检验：先样本比对再谈判” 样本8单 lift×2.1 置信度高｜不足样本明确“仅供参考”。',
  },
  {
    id: 'schedule',
    ag: ['AG-13'],
    name: '今日日程',
    icon: CalendarDays,
    color: 'from-orange-400 to-amber-500',
    desc: '每天打开就知道干嘛：目标进度、待办、成交冲刺 TOP3、日程与待跟进商机。',
    sections: ['一、今日目标进度', '二、今日待办清单', '三、成交冲刺 TOP3', '四、飞书日历日程', '五、待跟进商机（做什么怎么做）', '六、日程空白时段提醒', '七、操作建议'],
    sample: '示例：阿里云🔴高/商机确认/120万/超期16天｜成交冲刺按“金额×赢率”排序。',
  },
  {
    id: 'daily',
    ag: ['AG-13'],
    name: '个人日报',
    icon: ClipboardList,
    color: 'from-blue-500 to-indigo-600',
    desc: '个人日报/周报/月报自动汇总，不夹别人排名，标题统一可直接归档。',
    sections: ['一、执行摘要（今日 vs 昨日）', '二、今日跟进明细', '三、今日新增商机', '四、今日赢单', '五、相关报告汇总'],
    sample: '示例：用户日报-2026-09-17｜我的跟进/新增/赢单，个人口径不含团队榜单。',
  },
]