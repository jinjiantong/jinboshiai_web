import { NextResponse } from 'next/server'

interface Course {
  id: number
  title: string
  subtitle: string
  sections: {
    title: string
    content: string[]
  }[]
  schedule?: {
    A班?: string
    B班?: string
    总课时?: string
    上课模式?: string
    班级规模?: string
  }
  services?: string[]
  gradient: string
  color: string
}

const coursesData: { title: string; courses: Course[] } = {
  title: '金博士AI实验室课程',
  courses: [
    {
      id: 1,
      title: '01 AI知识体系构建与实战',
      subtitle: '打牢AI基础，掌握核心概念与工具',
      sections: [
        {
          title: '第一节',
          content: [
            '龙虾、Skill、Agent、Token、MCP，大模型等 AI 基础讲解',
            '借助豆包搭建专属提示词',
            '巧用 AI 工具撰写儿童故事，花草识别、智能客服等各类场景提示词',
            '借助大模型深度研讨创业思路与项目规划',
            '五分钟快速搭建全网比价实用技能',
            '搭建销售线索获取工作流',
            '搭建自媒体智能体，自动化创作故事、情感短视频'
          ]
        },
        {
          title: '第二节',
          content: [
            'WPS AI 全场景办公实操演练',
            '飞书 Agent 办公实战（项目管理系统全链路搭建）',
            'Trae 企业级一站式办公解决方案'
          ]
        },
        {
          title: '第三节',
          content: [
            '龙虾云端安装配置 + MiniMax TokenPlan',
            '龙虾本地安装（Trae）+ 打通飞书通道',
            '龙虾标准化创建技能（一站式销售管理技能）',
            '龙虾使用自动化发布技能'
          ]
        }
      ],
      gradient: 'from-blue-500 to-blue-700',
      color: 'blue'
    },
    {
      id: 2,
      title: '02 AI企业级解决方案',
      subtitle: '企业级AI落地，从数据中台到智能应用',
      sections: [
        {
          title: '第一节',
          content: [
            '通过飞书多维表格，知识库、扣子知识库搭建 AI 数据中台',
            '涵盖结构化数据表、标签化字段、AI字段，工作流、旧数据清洗迁移等核心功能实战',
            '融合飞书、龙虾、扣子搭建智能客服智能体',
            '客服数据采集、仪表盘展示、紧急问题监控处理工作流',
            '技术架构总结，通用方案案例说明'
          ]
        },
        {
          title: '第二节',
          content: [
            '搭建销量预测智能体',
            '每日晚报、库存巡检、现场巡检、会员生日提醒，销售统计，统一话术等企业智能体',
            '搭建自媒体线上营销智能体',
            '搭建销售过程管理智能体'
          ]
        },
        {
          title: '第三节',
          content: [
            '企业产品官网开发部署',
            '企业营销小游戏开发发布'
          ]
        }
      ],
      gradient: 'from-purple-500 to-purple-700',
      color: 'purple'
    },
    {
      id: 3,
      title: '03 AI实验室项目',
      subtitle: '学员主导完成真实企业级项目',
      sections: [
        {
          title: '第一节',
          content: [
            '项目规划：项目分析、流程分析、盘点资产、技术方案',
            '搭建数据：数据中台、数据迁移、数据治理，知识库',
            '搭建应用：龙虾、扣子、Trae应用'
          ]
        },
        {
          title: '第二节',
          content: [
            '跑通流程',
            '沉淀技能',
            '项目发布说明会'
          ]
        }
      ],
      gradient: 'from-green-500 to-green-700',
      color: 'green'
    }
  ]
}

const scheduleData = {
  A班: '每周一/二/三 晚7-9点',
  B班: '每周二/四/六 晚7-9点',
  总课时: '8节（3节知识体系 + 3节企业方案 + 2节实验室项目）',
  上课模式: '圆桌实战模式，每节课2小时，拒绝纯理论',
  班级规模: '满4人开班，严格8人小班，确保一对一指导质量'
}

const servicesData = [
  '周末加练场：课程期间每周末教室免费开放，提供设备和环境',
  '2个月技术顾问：结课后享有一对一深度技术支持，帮你真正落地',
  '永久学习社群：答疑、资源分享，行业动态，持续成长不断线'
]

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      ...coursesData,
      schedule: scheduleData,
      services: servicesData
    }
  })
}
