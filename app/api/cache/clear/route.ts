import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
    
    const response = await fetch(`${redisUrl}/FLUSHDB`, {
      method: 'POST',
    })

    return NextResponse.json({
      success: true,
      message: 'Redis缓存已清除',
      url: redisUrl
    })
  } catch (error) {
    console.error('Clear cache error:', error)
    return NextResponse.json({
      success: false,
      message: '清除缓存失败',
      error: String(error)
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: '缓存清除服务正常'
  })
}
