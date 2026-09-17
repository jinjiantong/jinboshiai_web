import { NextResponse } from 'next/server'
import { getSiteConfig } from '@/lib/site-config'

export async function GET() {
  try {
    const cfg = await getSiteConfig()
    return NextResponse.json({ ok: true, data: cfg })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String((e && e.message) || e) }, { status: 500 })
  }
}