import { NextRequest, NextResponse } from 'next/server'
import { getFeishuToken } from '@/lib/feishuToken'

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const accessToken = await getFeishuToken()
    const fileToken = params.token

    const response = await fetch(
      `https://open.feishu.cn/open-apis/drive/v1/medias/${fileToken}/download`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        redirect: 'follow',
      }
    )

    if (!response.ok) {
      return new NextResponse('Image not found', { status: 404 })
    }

    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/jpeg'

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Image proxy error:', error)
    return new NextResponse('Failed to fetch image', { status: 500 })
  }
}
