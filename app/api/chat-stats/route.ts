import { NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

export async function GET() {
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

    const [messages] = await pool.query(
      `SELECT content, created_at FROM chat_messages WHERE role = 'user' ORDER BY created_at DESC LIMIT 500`
    ) as [any[], any]

    await pool.end()

    const questionCount: Record<string, number> = {}
    let totalQuestions = messages.length

    for (const msg of messages) {
      const question = String(msg.content || '').trim()
      if (question) {
        questionCount[question] = (questionCount[question] || 0) + 1
      }
    }

    const entries = Object.entries(questionCount)
    entries.sort((a, b) => b[1] - a[1])
    const topQuestions = entries.slice(0, 10).map((item) => ({
      question: item[0],
      count: item[1],
      lastAsked: ''
    }))

    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      last7Days.push({
        date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
        totalQuestions: 0,
        uniqueUsers: 0
      })
    }

    return NextResponse.json({
      success: true,
      topQuestions,
      dailyStats: last7Days,
      overall: {
        totalQuestions,
        totalSessions: Math.floor(totalQuestions / 3),
        avgResponseTime: 1.5,
        todayQuestions: totalQuestions,
        yesterdayQuestions: 0
      }
    })
  } catch (error) {
    console.error('Chat stats error:', error)
    return NextResponse.json({
      success: false,
      topQuestions: [],
      dailyStats: [],
      overall: {
        totalQuestions: 0,
        totalSessions: 0,
        avgResponseTime: 0,
        todayQuestions: 0,
        yesterdayQuestions: 0
      }
    }, { status: 500 })
  }
}