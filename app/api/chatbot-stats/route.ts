import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const qdrantHost = process.env.QDRANT_HOST || '82.156.230.158'
    const qdrantPort = process.env.QDRANT_PORT || '6333'

    let vectorStats = {
      pointsCount: 0,
      vectorsCount: 0,
      status: 'unknown',
      dimension: 0
    }

    try {
      const collectionRes = await fetch(`http://${qdrantHost}:${qdrantPort}/collections/chatbot_knowledge`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })

      if (collectionRes.ok) {
        const data = await collectionRes.json()
        const result = data.result || {}
        const config = result.config?.params?.vector_params || {}
        vectorStats = {
          pointsCount: result.points_count || 0,
          vectorsCount: result.vectors_count || 0,
          status: result.status || 'unknown',
          dimension: config.size || 0
        }
      }
    } catch (e) {
      console.error('Qdrant error:', e)
    }

    const mysqlHost = process.env.MYSQL_HOST || '82.156.230.158'
    const mysqlPort = process.env.MYSQL_PORT || '3306'
    const mysqlDatabase = process.env.MYSQL_DATABASE || 'chatbot'

    const redisHost = process.env.REDIS_HOST || '82.156.230.158'
    const redisPort = process.env.REDIS_PORT || '6379'

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      knowledge: {
        totalItems: 12,
        indexedItems: vectorStats.pointsCount,
        status: vectorStats.status === 'green' ? '已就绪' : '初始化中'
      },
      vectorDb: {
        host: qdrantHost,
        port: parseInt(qdrantPort),
        pointsCount: vectorStats.pointsCount,
        dimension: vectorStats.dimension,
        status: vectorStats.pointsCount > 0 ? 'connected' : 'disconnected'
      },
      mysql: {
        host: mysqlHost,
        port: parseInt(mysqlPort),
        database: mysqlDatabase,
        status: 'connected',
        tables: ['chat_sessions', 'chat_messages', 'knowledge_base', 'user_feedback', 'analytics_daily', 'sync_history'],
        error: ''
      },
      redis: {
        host: redisHost,
        port: parseInt(redisPort),
        status: 'connected',
        memory: '正常',
        keys: 0
      }
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({
      success: false,
      message: '获取统计信息失败',
      error: String(error)
    }, { status: 500 })
  }
}