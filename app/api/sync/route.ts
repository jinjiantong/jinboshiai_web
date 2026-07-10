import { NextRequest, NextResponse } from 'next/server'
import { initKnowledgeBase } from '@/lib/rag'

const KNOWLEDGE_BASE = [
  {
    id: 1,
    category: 'course',
    sub_category: 'intro',
    title: '金博士AI实验室 - 课程简介',
    content: `金博士AI实验室是一套专为零基础学员设计的AI技能实战培训方案。

课程理念：
- 0基础进场，带着企业级项目出场
- 拒绝纸上谈兵，8人小班，手把手带你做真实企业项目
- 圆桌实战模式，每节课2小时，拒绝纯理论

课程特色：
- 零基础友好：无需编程基础，从入门到精通
- 实战导向：所有课程围绕真实项目展开，学完就能用
- 持续服务：学习社群+答疑服务，陪伴式成长

上课安排：
- A班：每周一/二/三 晚7-9点
- B班：每周二/四/六 晚7-9点
- 总课时：8节
- 班级规模：满4人开班，严格8人小班，确保一对一指导质量

咨询方式：电话13051202991，微信jinboshiai，官网jinboshiai.com`,
    keywords: ['课程', '介绍', '简介', '特色', '学习', '培训']
  },
  {
    id: 2,
    category: 'course',
    sub_category: 'chapter1',
    title: '第一章：AI知识体系构建与实战',
    content: `【第一章：AI知识体系构建与实战】

第一节内容：
- 龙虾、Skill、Agent、Token、MCP，大模型等 AI 基础讲解
- 借助豆包搭建专属提示词
- 巧用 AI 工具撰写儿童故事，花草识别、智能客服等各类场景提示词
- 借助大模型深度研讨创业思路与项目规划
- 五分钟快速搭建全网比价实用技能
- 搭建销售线索获取工作流
- 搭建自媒体智能体，自动化创作故事、情感短视频

第二节内容：
- WPS AI 全场景办公实操演练
- 飞书 Agent 办公实战（项目管理系统全链路搭建）
- Trae 企业级一站式办公解决方案

第三节内容：
- 龙虾云端安装配置 + MiniMax TokenPlan
- 龙虾本地安装（Trae）+ 打通飞书通道
- 龙虾标准化创建技能（一站式销售管理技能）
- 龙虾使用自动化发布技能

咨询：13051202991`,
    keywords: ['第一章', '知识体系', 'AI基础', '豆包', '提示词', '龙虾', 'Trae', 'WPS']
  },
  {
    id: 3,
    category: 'course',
    sub_category: 'chapter2',
    title: '第二章：AI企业级解决方案',
    content: `【第二章：AI企业级解决方案】

第一节内容：
- 通过飞书多维表格，知识库、扣子知识库搭建 AI 数据中台
- 涵盖结构化数据表、标签化字段、AI字段，工作流、旧数据清洗迁移等核心功能实战
- 融合飞书、龙虾、扣子搭建智能客服智能体
- 客服数据采集、仪表盘展示、紧急问题监控处理工作流
- 技术架构总结，通用方案案例说明

第二节内容：
- 搭建销量预测智能体
- 每日晚报、库存巡检、现场巡检、会员生日提醒，销售统计，统一话术等企业智能体
- 搭建自媒体线上营销智能体
- 搭建销售过程管理智能体

第三节内容：
- 企业产品官网开发部署
- 企业营销小游戏开发发布

咨询：13051202991`,
    keywords: ['第二章', '企业方案', '飞书', '扣子', '智能体', '数据中台', '智能客服']
  },
  {
    id: 4,
    category: 'course',
    sub_category: 'chapter3',
    title: '第三章：AI实验室项目',
    content: `【第三章：AI实验室项目 - 学员主导完成项目】

第一节内容：
- 项目规划：项目分析、流程分析、盘点资产、技术方案
- 搭建数据：数据中台、数据迁移、数据治理，知识库
- 搭建应用：龙虾、扣子、Trae应用

第二节内容：
- 跑通流程
- 沉淀技能
- 项目发布说明会

特点：
- 学员主导完成项目
- 实战检验学习成果
- 企业级项目经验积累

咨询：13051202991`,
    keywords: ['第三章', '实验室', '项目', '学员', '实战']
  },
  {
    id: 5,
    category: 'service',
    sub_category: 'support',
    title: '专属护航服务',
    content: `【专属护航服务】

1. 周末加练场
   - 课程期间每周末教室免费开放
   - 提供设备和环境
   - 让学员有更多练习机会

2. 2个月技术顾问
   - 结课后享有一对一深度技术支持
   - 帮你真正落地
   - 解决实际应用中的问题

3. 永久学习社群
   - 答疑、资源分享
   - 行业动态
   - 持续成长不断线

咨询：13051202991`,
    keywords: ['服务', '加练场', '技术顾问', '社群', '答疑', '支持']
  },
  {
    id: 6,
    category: 'contact',
    sub_category: 'registration',
    title: '报名咨询 - 联系方式',
    content: `【报名咨询】

上课安排：
- A班：每周一/二/三 晚7-9点
- B班：每周二/四/六 晚7-9点
- 总课时：8节（3节知识体系 + 3节企业方案 + 2节实验室项目）
- 上课模式：圆桌实战模式，每节课2小时，拒绝纯理论
- 班级规模：满4人开班，严格8人小班，确保一对一指导质量

课程承诺：
- 首节不满意，全额退款保障
- 8人小班，一对一指导
- 企业级项目实战

联系方式：
- 电话：13051202991
- 微信：jinboshiai
- 官网：jinboshiai.com
- 地址：北京市顺义区临空经济核心区安庆大街7号良基科技广场A座316室`,
    keywords: ['报名', '咨询', '报名流程', '联系方式', '电话', '微信', '上课', '时间', '地址']
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
