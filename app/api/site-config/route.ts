import { NextResponse } from 'next/server'
import { getSiteConfig } from '@/lib/site-config'

// 强制动态执行：不预渲染，运行时每次真实读取 CloudBase 环境变量与数据
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const cfg = await getSiteConfig()
    return NextResponse.json({ ok: true, data: cfg })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String((e && e.message) || e) }, { status: 500 })
  }
}