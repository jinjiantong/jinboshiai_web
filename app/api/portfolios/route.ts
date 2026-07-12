import { NextResponse } from 'next/server'
import settings from '../../../setting.json'

const BASE_TOKEN = 'D2S1bhTGTaorSCsJLiOc0QZvnPc'
const TABLE_ID = 'tblfYNMFjqvkNzod'

let cachedToken = ''
let tokenExpiryTime = 0

async function getTenantAccessToken(): Promise<string> {
  const now = Date.now()
  
  if (cachedToken && now < tokenExpiryTime) {
    return cachedToken
  }
  
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
      cachedToken = data.tenant_access_token as string
      tokenExpiryTime = now + (data.expire - 60) * 1000
      return cachedToken
    }
    
    throw new Error(data.msg || 'Failed to get access token')
  } catch (error) {
    console.error('Error getting tenant_access_token:', error)
    throw error
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'showcase'
    
    const accessToken = await getTenantAccessToken()
    
    const response = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${TABLE_ID}/records?page_size=100`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Feishu API error:', errorData)
      throw new Error(`Feishu API error! status: ${response.status}`)
    }

    const result = await response.json()

    if (!result.data?.items) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No records found'
      })
    }

    const records = result.data.items
      .filter((record: any) => {
        const 是否展示 = record.fields.是否展示
        const 作品展示平台 = record.fields.作品展示平台 || ''
        const platforms = Array.isArray(作品展示平台) ? 作品展示平台 : [作品展示平台]
        
        let hasMatch = false
        if (type === 'home') {
          hasMatch = platforms.some((p: string) => p && p.includes('官网'))
        } else {
          hasMatch = platforms.some((p: string) => p && p.includes('展示台'))
        }
        
        return (是否展示 === true || 是否展示 === 'true') && hasMatch
      })
      .map((record: any) => {
        const attachments = record.fields.作品附件?.map((f: any) => ({
          name: f.name,
          size: f.size,
          file_token: f.file_token,
          type: f.type,
          download_url: `/api/portfolios/image/${f.file_token}`
        })) || []

        const videos = record.fields.演示视频?.map((f: any) => ({
          name: f.name,
          size: f.size,
          file_token: f.file_token,
          type: f.type,
          download_url: `/api/portfolios/image/${f.file_token}`
        })) || []

        const architecture = record.fields.架构图?.map((f: any) => ({
          name: f.name,
          size: f.size,
          file_token: f.file_token,
          type: f.type,
          download_url: `/api/portfolios/image/${f.file_token}`
        })) || []

        const coverImage = videos.length > 0 ? videos[0].download_url : (attachments.length > 0 ? attachments[0].download_url : null)

        const 作品分类 = Array.isArray(record.fields.作品分类) 
          ? record.fields.作品分类[0] 
          : record.fields.作品分类 || 'AI应用'

        const 作品附件类型 = Array.isArray(record.fields.作品附件类型) 
          ? record.fields.作品附件类型[0] 
          : record.fields.作品附件类型 || '图片'

        return {
          record_id: record.record_id,
          fields: {
            作品名称: record.fields.作品名称 || '',
            作品简介: record.fields.作品简介 || '',
            应用场景: record.fields.应用场景 || '',
            功能特性: record.fields.功能特性 || '',
            技术方案: record.fields.技术方案 || '',
            AI工具: record.fields.AI工具 || '',
            开发者: record.fields.开发者 || '',
            作品跳转链接: record.fields.作品跳转链接 || '',
            作品分类: 作品分类,
            作品附件类型: 作品附件类型,
            是否展示: record.fields.是否展示 || false,
            作品展示平台: record.fields.作品展示平台 || '',
            作品附件: attachments,
            演示视频: videos,
            架构图: architecture,
            创建日期: record.fields.创建日期 || null,
            cover_image: coverImage,
            access_token: accessToken
          }
        }
      })

    return NextResponse.json(
      {
        success: true,
        data: records,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )
  } catch (error) {
    console.error('Portfolios API error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch portfolios',
        error: error instanceof Error ? error.message : 'Unknown error',
        data: []
      },
      { status: 500 }
    )
  }
}
