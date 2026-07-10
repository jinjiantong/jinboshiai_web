import { NextRequest, NextResponse } from 'next/server'
import { retrieve } from '@/lib/rag'
import { chatCompletion } from '@/lib/embedding'
import mysql from 'mysql2/promise'
import { createClient } from 'redis'

const SYSTEM_PROMPT = `你是金博士AI课程咨询助手，专门回答用户关于金博士AI实验室课程的问题。

【身份定位】
- 你是一个专业、友好的课程顾问
- 只回答与金博士AI课程相关的问题
- 非课程问题礼貌拒绝并引导咨询相关渠道

【课程体系】（必须严格遵守）
金博士AI实验室包含三大核心课程，共8节：

01 AI知识体系构建与实战
- 第一节：AI基础（龙虾、Skill、Agent、Token、MCP等）、豆包提示词、各类场景应用、自媒体智能体
- 第二节：WPS AI办公、飞书Agent办公实战、Trae企业级解决方案
- 第三节：龙虾安装配置、标准化技能创建、自动化发布

02 AI企业级解决方案  
- 第一节：飞书多维表格、知识库搭建AI数据中台、智能客服智能体
- 第二节：销量预测智能体、企业各类智能体（晚报、巡检、提醒等）
- 第三节：企业官网开发、营销小游戏开发

03 AI实验室项目
- 学员主导完成真实企业级项目

【上课安排】
- A班：每周一/二/三 晚7-9点
- B班：每周二/四/六 晚7-9点
- 班级规模：满4人开班，严格8人小班

【服务承诺】
- 首节不满意，全额退款
- 8人小班，一对一指导
- 企业级项目实战

【回答规范】
1. 回答必须基于【相关知识】中的内容，不要编造
2. 回答简洁专业，150-200字
3. 如知识库没有答案，诚实说明并引导联系顾问
4. 适当使用emoji增加可读性

【联系方式】
- 电话：13051202991
- 微信：jinboshiai
- 官网：jinboshiai.com`

let redisClient: ReturnType<typeof createClient> | null = null

async function getRedisClient() {
  if (!redisClient) {
    try {
      redisClient = createClient({
        url: `redis://${process.env.REDIS_HOST || '82.156.230.158'}:${process.env.REDIS_PORT || '6379'}`
      })
      redisClient.on('error', (err) => console.error('Redis Error:', err))
      await redisClient.connect()
      console.log('Redis connected')
    } catch (error) {
      console.error('Redis connect error:', error)
      redisClient = null
    }
  }
  return redisClient
}

async function getCachedResponse(question: string) {
  try {
    const client = await getRedisClient()
    if (!client) return null
    const cacheKey = `chat:${Buffer.from(question.trim()).toString('base64')}`
    const cached = await client.get(cacheKey)
    if (cached) {
      console.log('Redis cache hit:', cacheKey)
      return JSON.parse(cached)
    }
  } catch (error) {
    console.error('Redis get error:', error)
  }
  return null
}

async function setCachedResponse(question: string, response: any) {
  try {
    const client = await getRedisClient()
    if (!client) return
    const cacheKey = `chat:${Buffer.from(question.trim()).toString('base64')}`
    await client.setEx(cacheKey, 3600, JSON.stringify(response))
    console.log('Redis cache set:', cacheKey)
  } catch (error) {
    console.error('Redis set error:', error)
  }
}

async function saveToDatabase(sessionId: string, userMessage: string, aiMessage: string, sources: any[]) {
  try {
    const pool = mysql.createPool({
      host: process.env.MYSQL_HOST || '82.156.230.158',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER || 'chatbot_user',
      password: process.env.MYSQL_PASSWORD || 'chatbot_pass_2024',
      database: process.env.MYSQL_DATABASE || 'chatbot',
      waitForConnections: true,
      connectionLimit: 5,
      charset: 'utf8mb4'
    })

    await pool.query(`INSERT IGNORE INTO chat_sessions (session_id) VALUES (?)`, [sessionId])
    await pool.query(`INSERT INTO chat_messages (session_id, role, content, source_used) VALUES (?, 'user', ?, NULL)`, [sessionId, userMessage])
    await pool.query(`INSERT INTO chat_messages (session_id, role, content, source_used) VALUES (?, 'assistant', ?, ?)`, [sessionId, aiMessage, JSON.stringify(sources)])

    await pool.end()
  } catch (error) {
    console.error('Failed to save to database:', error)
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const { message, sessionId } = await request.json()

    if (!message) {
      return NextResponse.json(
        { success: false, message: '请输入问题' },
        { status: 400 }
      )
    }

    const currentSessionId = sessionId || `session-${Date.now()}`

    const cachedResult = await getCachedResponse(message)
    if (cachedResult) {
      return NextResponse.json({
        success: true,
        message: cachedResult.message,
        sources: cachedResult.sources,
        tokens: cachedResult.tokens || 0,
        responseTime: Date.now() - startTime,
        sessionId: currentSessionId,
        cached: true
      })
    }

    const ragResult = await retrieve(message)

    let aiMessage = ''
    let sources: any[] = []

    if (!ragResult.found || !ragResult.context) {
      const fallbackPrompt = `${SYSTEM_PROMPT}

【用户问题】
${message}

请根据上述【课程体系】信息回答用户问题。如果确实不了解，请诚实说明并引导用户联系顾问：电话13051202991，微信jinboshiai。`

      const response = await chatCompletion([
        { role: 'system', content: fallbackPrompt },
        { role: 'user', content: message }
      ])
      aiMessage = response.content
    } else {
      const contextPrompt = `${SYSTEM_PROMPT}

【用户问题】
${message}

【相关知识】（以下是知识库中的相关信息，请基于此回答）
${ragResult.context}

请根据以上【相关知识】准确回答用户问题。如果知识库信息不足以回答，请诚实说明并引导联系顾问：电话13051202991，微信jinboshiai。`

      const response = await chatCompletion([
        { role: 'system', content: contextPrompt },
        { role: 'user', content: message }
      ])

      aiMessage = response.content
      sources = ragResult.sources
    }

    await setCachedResponse(message, { message: aiMessage, sources })
    await saveToDatabase(currentSessionId, message, aiMessage, sources)

    return NextResponse.json({
      success: true,
      message: aiMessage,
      sources: sources,
      tokens: 0,
      responseTime: Date.now() - startTime,
      sessionId: currentSessionId,
      cached: false
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      {
        success: false,
        message: '服务暂时不可用，请稍后再试或联系：13051202991'
      },
      { status: 500 }
    )
  }
}
