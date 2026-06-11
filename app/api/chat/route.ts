import { NextRequest, NextResponse } from 'next/server'
import { retrieve } from '@/lib/rag'
import { chatCompletion } from '@/lib/embedding'

const SYSTEM_PROMPT = `你是一个专业的金博士AI课程咨询助手。

【角色定义】
你是金博士AI的智能课程顾问，专门帮助用户解答关于AI课程的各种问题。

【课程体系】
金博士AI课程体系包含8大核心章节：
1. 课程简介 - AI学习路径整体介绍
2. 一图吃透AI - 理解AI基本原理和应用场景
3. 为啥我的AI不好用 - 精准提问技巧和方法论
4. 一切皆技能 - 技能拆解与AI工作流设计
5. AI办公 - AI辅助办公的高效应用
6. 0基础玩转AI绘图 - Midjourney、Stable Diffusion实战
7. 创作爆款短视频 - AI视频生成与剪辑技巧
8. AI+行业实战应用 - 企业级AI解决方案

【课程特色】
- 零基础友好：无需编程基础，从入门到精通
- 实战导向：所有课程围绕真实项目展开，学完就能用
- 持续服务：学习社群+答疑服务，陪伴式成长
- 权威认证：结业后可获得行业认可的能力证书

【回答原则】
1. 专业友好：用专业但易懂的语言回答
2. 针对性强：根据用户问题推荐相关课程
3. 行动引导：鼓励用户咨询报名
4. 基于知识库：优先使用提供的参考资料回答

【联系方式】
- 电话：15811055744
- 邮箱：26256649@qq.com
- 微信：jinboshi-ai

请用中文回答，保持友好专业的语气。回答简洁有力，不超过200字。`

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const { message, sessionId, history } = await request.json()

    if (!message) {
      return NextResponse.json(
        { success: false, message: '请输入问题' },
        { status: 400 }
      )
    }

    const ragResult = await retrieve(message)

    let contextPrompt = ''
    if (ragResult.found && ragResult.context) {
      contextPrompt = `\n\n【参考资料】\n${ragResult.context}\n\n请基于以上参考资料回答用户问题。如果参考资料中有相关信息，请优先使用参考资料中的内容。`
    }

    const fullPrompt = SYSTEM_PROMPT + contextPrompt

    const messages = [
      { role: 'system', content: fullPrompt },
      ...(history || []).slice(-6).map((m: any) => ({
        role: m.role,
        content: m.content
      })),
      { role: 'user', content: message }
    ]

    const response = await chatCompletion(messages)

    return NextResponse.json({
      success: true,
      message: response.content,
      sources: ragResult.sources,
      tokens: response.tokens,
      responseTime: Date.now() - startTime,
      sessionId: sessionId || `session-${Date.now()}`
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      {
        success: false,
        message: '抱歉，服务暂时不可用，请稍后再试或联系客服：15811055744'
      },
      { status: 500 }
    )
  }
}