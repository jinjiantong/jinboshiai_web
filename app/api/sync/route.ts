import { NextRequest, NextResponse } from 'next/server'
import { initKnowledgeBase } from '@/lib/rag'

const KNOWLEDGE_BASE = [
  {
    id: 1,
    category: 'course',
    sub_category: 'intro',
    title: '课程体系简介',
    content: `金博士AI课程体系是一套专为零基础学员设计的AI技能实战培训方案，涵盖从AI认知启蒙到企业级应用落地的完整学习路径。

课程特色：
- 零基础友好：无需编程基础，从入门到精通
- 实战导向：所有课程围绕真实项目展开，学完就能用
- 持续服务：学习社群+答疑服务，陪伴式成长
- 权威认证：结业后可获得行业认可的能力证书

适用人群：
- 想学习AI技能的职场人士
- 希望提升效率的企业员工
- 想转行AI领域的求职者
- 对AI感兴趣的创业者`,
    keywords: ['课程', '介绍', '简介', '体系', '特色']
  },
  {
    id: 2,
    category: 'course',
    sub_category: 'chapter1',
    title: '第一章：课程简介',
    content: `【第一章：课程简介】
学习内容：
• AI学习路径整体介绍
• 课程体系概览
• 学习目标与收益

学习目标：
• 了解AI技能学习整体路径
• 明确个人学习方向
• 制定学习计划`,
    keywords: ['第一章', '课程简介', '学习路径', '入门']
  },
  {
    id: 3,
    category: 'course',
    sub_category: 'chapter2',
    title: '第二章：一图吃透AI',
    content: `【第二章：一图吃透AI】
学习内容：
• 理解AI基本原理
• AI能做什么、不能做什么
• 大模型原理、RAG、Agent基础
• AI发展历程与未来趋势

核心价值：
• 建立AI认知框架
• 理解AI能力边界
• 为后续学习打基础`,
    keywords: ['一图吃透', 'AI原理', '大模型', 'RAG', 'Agent']
  },
  {
    id: 4,
    category: 'course',
    sub_category: 'chapter3',
    title: '第三章：为啥我的AI不好用',
    content: `【第三章：为啥我的AI不好用】
学习内容：
• 精准提问技巧和方法论
• Prompt工程核心原则
• 常见提问错误与纠正
• 实战案例分析

核心价值：
• 掌握精准提问方法
• 提升AI使用效率
• 10倍提升AI产出`,
    keywords: ['精准提问', 'Prompt', '提示词', '提问技巧']
  },
  {
    id: 5,
    category: 'course',
    sub_category: 'chapter4',
    title: '第四章：一切皆技能',
    content: `【第四章：一切皆技能】
学习内容：
• 技能拆解方法论
• AI工作流设计
• 判断需求可行性与技术路径
• 案例：如何用AI完成复杂任务

核心价值：
• 掌握技能拆解思维
• 设计高效AI工作流
• 复杂任务简单化`,
    keywords: ['技能拆解', '工作流', 'AI工作流']
  },
  {
    id: 6,
    category: 'course',
    sub_category: 'chapter5',
    title: '第五章：AI办公',
    content: `【第五章：AI办公】
学习内容：
• AI辅助办公高效应用
• 文档撰写与润色
• 数据分析与图表生成
• 会议纪要自动整理
• 邮件撰写与回复

核心价值：
• 提升3倍办公效率
• 减少重复性工作
• 专注高价值任务`,
    keywords: ['AI办公', '文档', '数据分析', '图表', '会议纪要']
  },
  {
    id: 7,
    category: 'course',
    sub_category: 'chapter6',
    title: '第六章：0基础玩转AI绘图',
    content: `【第六章：0基础玩转AI绘图】
学习内容：
• Midjourney从入门到精通
• Stable Diffusion专业应用
• 商业海报与产品图设计
• AI绘图变现技巧

工具覆盖：Midjourney、Stable Diffusion、DALL-E

变现方向：电商产品图、社交媒体配图、设计外包服务

核心价值：
• 零基础也能做设计
• 快速生成高质量图片
• 开启副业变现之路`,
    keywords: ['AI绘图', 'Midjourney', 'Stable Diffusion', 'AI绘画', '变现']
  },
  {
    id: 8,
    category: 'course',
    sub_category: 'chapter7',
    title: '第七章：创作爆款短视频',
    content: `【第七章：创作爆款短视频】
学习内容：
• AI视频生成工具使用
• 脚本策划与创意
• 视频剪辑与特效
• 平台运营与推广

工具覆盖：Sora、Runway、Pika、剪映AI版

变现方向：短视频创作、内容创业、广告植入、知识付费

核心价值：
• 降低视频制作门槛
• 快速产出内容
• 抓住短视频红利`,
    keywords: ['短视频', 'AI视频', 'Sora', '剪辑', '创作']
  },
  {
    id: 9,
    category: 'course',
    sub_category: 'chapter8',
    title: '第八章：AI+行业实战应用',
    content: `【第八章：AI+行业实战应用】
学习内容：
• 企业级AI解决方案
• AI副业与变现路径
• 独立产品设计与开发
• 流程自动化实践

行业应用：教育培训、电商零售、医疗健康、金融服务

变现路径：企业培训服务、AI解决方案咨询、自动化工具开发

核心价值：
• 深度行业应用
• 商业变现闭环
• 成为AI专家`,
    keywords: ['行业应用', '企业', '变现', '副业', 'AI专家']
  },
  {
    id: 10,
    category: 'business',
    sub_category: 'registration',
    title: '报名咨询',
    content: `【报名咨询】

报名流程：
1. 选择感兴趣的课程
2. 联系客服咨询详情
3. 确认课程时间和方式
4. 完成缴费报名
5. 开通学习账号

上课方式：
• 在线直播（实时互动）
• 录播回放（随时学习）
• 社群答疑（专属服务）
• 实战项目（动手练习）

学习支持：专业讲师授课、社群答疑服务、作业点评反馈、毕业证书

立即咨询：电话：15811055744，邮箱：26256649@qq.com，微信：jinboshi-ai`,
    keywords: ['报名', '咨询', '报名流程', '如何报名', '学习方式']
  },
  {
    id: 11,
    category: 'business',
    sub_category: 'pricing',
    title: '价格咨询',
    content: `【价格咨询】

课程费用参考：
• 单门课程：¥680-1,980
• 系统课程：享8折优惠
• 企业团购：定制方案

优惠政策：
• 早鸟价：限时优惠500元
• 团购价：3人以上享9折
• 推荐奖励：推荐学员享佣金

支付方式：微信支付、支付宝、银行转账、对公转账

如需了解详细价格，欢迎联系：电话：15811055744`,
    keywords: ['价格', '收费', '多少钱', '优惠', '折扣', '费用']
  },
  {
    id: 12,
    category: 'faq',
    sub_category: 'beginner',
    title: '零基础咨询',
    content: `【零基础学员咨询】

完全没问题！零基础也能学习AI！

我们的课程专为零基础学员设计：
✅ 无需编程基础
✅ 从入门到精通循序渐进
✅ 实战项目驱动学习
✅ 社群答疑全程支持

学习路径建议：
第一步：先学《课程简介》了解整体框架
第二步：再学《一图吃透AI》理解基本原理
第三步：接着《精准提问》掌握使用技巧
第四步：根据兴趣选择专业方向深入学习

开始学习，改变从今天开始！咨询：15811055744`,
    keywords: ['零基础', '基础', '入门', '小白', '不会', '新手']
  }
]

export async function POST(request: NextRequest) {
  try {
    const { type } = await request.json()

    if (type === 'sync' || type === 'init') {
      const count = await initKnowledgeBase(KNOWLEDGE_BASE)

      return NextResponse.json({
        success: true,
        message: `知识库同步完成，共 ${count} 条记录`,
        count
      })
    }

    return NextResponse.json({
      success: false,
      message: '未知的同步类型'
    }, { status: 400 })

  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json({
      success: false,
      message: '同步失败'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: '知识库同步服务正常',
    knowledgeCount: KNOWLEDGE_BASE.length
  })
}