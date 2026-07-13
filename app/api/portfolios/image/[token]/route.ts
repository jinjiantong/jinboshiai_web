import { NextRequest, NextResponse } from 'next/server'
import settings from '../../../../../setting.json'

async function getTenantAccessToken(): Promise<string> {
  try {
    const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_id: settings.data.app_id,
        app_secret: settings.data.app_secret,
      }),
    })
    
    const data = await response.json()
    
    if (data.code === 0 && data.tenant_access_token) {
      return data.tenant_access_token as string
    }
    
    throw new Error(data.msg || 'Failed to get access token')
  } catch (error) {
    console.error('Error getting tenant_access_token:', error)
    throw error
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const accessToken = await getTenantAccessToken()
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
