import { NextRequest, NextResponse } from 'next/server'
import { retrieve } from '@/lib/rag'
import { chatCompletion } from '@/lib/embedding'
import mysql from 'mysql2/promise'
import { createClient } from 'redis'

const SYSTEM_PROMPT = `你是金博士AI课程咨询助手。

【重要原则】
1. 只回答与课程相关的问题
2. 如果知识库没有相关信息，诚实地告诉用户："这个问题我暂时无法回答，建议您联系课程顾问获得更详细的解答"
3. 不要编造任何价格、优惠、课程时长等信息
4. 回答简洁专业，不超过200字

【课程信息】
- 金博士AI课程体系包含8大核心章节
- 零基础友好，无需编程基础
- 实战导向，学完就能用
- 持续服务，学习社群+答疑

【联系方式】
如有疑问，请联系：电话15811055744，邮箱26256649@qq.com`

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
      aiMessage = '抱歉，关于这个问题我暂时无法回答。建议您联系课程顾问获得更详细的解答。\n\n📞 电话：13051202991\n📧 邮箱：26256649@qq.com\n💬 微信：jinboshiai'
    } else {
      const contextPrompt = `${SYSTEM_PROMPT}

【用户问题】
${message}

【相关知识】
${ragResult.context}

请根据以上知识回答用户问题。如果知识库没有相关信息，请诚实地告诉用户联系顾问。`

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
        message: '服务暂时不可用，请稍后再试或联系：15811055744'
      },
      { status: 500 }
    )
  }
}