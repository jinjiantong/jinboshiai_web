import { NextResponse } from 'next/server'
import settings from '../../../setting.json'

const CLASS_TABLE_ID = 'tblDDKeft6iLlGAx'
const APP_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc'

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
      cachedToken = data.tenant_access_token
      tokenExpiryTime = now + (data.expire - 60) * 1000
      console.log('Got new tenant_access_token')
      return cachedToken
    }
    
    console.error('Failed to get tenant_access_token:', data)
    throw new Error(data.msg || 'Failed to get access token')
  } catch (error) {
    console.error('Error getting tenant_access_token:', error)
    throw error
  }
}

async function getRecords(tableId: string): Promise<any[]> {
  const accessToken = await getTenantAccessToken()
  
  try {
    const response = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${tableId}/records?page_size=500`,
      {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      }
    )
    
    const data = await response.json()
    
    if (data.code === 0 && data.data?.items) {
      return data.data.items
    }
    
    console.error('API error:', data)
    return []
  } catch (error) {
    console.error('Failed to fetch records:', error)
    return []
  }
}

export async function GET() {
  try {
    const records = await getRecords(CLASS_TABLE_ID)
    
    const classes = records.map((record: any) => ({
      id: String(record.record_id || ''),
      name: String(record.fields?.name || record.fields?.['班级名称'] || '未命名班级'),
    })).filter(cls => cls.id && cls.name)

    return NextResponse.json({ success: true, data: classes })
  } catch (error) {
    console.error('Error fetching classes:', error)
    return NextResponse.json({ success: false, message: '获取班级列表失败' })
  }
}
