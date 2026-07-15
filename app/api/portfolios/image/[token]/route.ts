import { NextRequest, NextResponse } from 'next/server'
import { getFeishuToken, refreshFeishuToken, invalidateFeishuToken } from '@/lib/feishuToken'

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    let accessToken = await getFeishuToken()
    const fileToken = params.token

    const response = await fetch(
      `https://open.feishu.cn/open-apis/drive/v1/medias/${fileToken}/download`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        redirect: 'manual',
      }
    )

    if (response.status === 302 || response.status === 301) {
      const redirectUrl = response.headers.get('location')
      if (redirectUrl) {
        console.log('[ImageProxy] Redirecting to CDN:', redirectUrl.substring(0, 80) + '...')
        return NextResponse.redirect(redirectUrl)
      }
    }

    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}))
      if (errorData.code === 99991663 || errorData.code === 99991671) {
        console.log('[ImageProxy] Token expired, refreshing...')
        invalidateFeishuToken()
        accessToken = await refreshFeishuToken()

        const retryResponse = await fetch(
          `https://open.feishu.cn/open-apis/drive/v1/medias/${fileToken}/download`,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
            redirect: 'manual',
          }
        )

        if (retryResponse.status === 302 || retryResponse.status === 301) {
          const redirectUrl = retryResponse.headers.get('location')
          if (redirectUrl) {
            console.log('[ImageProxy] Retry redirect to CDN:', redirectUrl.substring(0, 80) + '...')
            return NextResponse.redirect(redirectUrl)
          }
        }

        if (retryResponse.ok) {
          const buffer = await retryResponse.arrayBuffer()
          const contentType = retryResponse.headers.get('content-type') || 'application/octet-stream'
          return new NextResponse(buffer, {
            headers: {
              'Content-Type': contentType,
              'Cache-Control': 'public, max-age=3600',
            },
          })
        }
      }
      return new NextResponse('Media not found', { status: 404 })
    }

    if (!response.ok) {
      return new NextResponse('Media not found', { status: 404 })
    }

    const buffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'application/octet-stream'

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('[ImageProxy] Error:', error)
    return new NextResponse('Failed to fetch media', { status: 500 })
  }
}
