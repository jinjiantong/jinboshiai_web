import { NextResponse } from 'next/server'
import settings from '../../../setting.json'

const CLASS_TABLE_ID = 'tblDDKeft6iLlGAx'

let cachedToken: string = ''
let tokenExpiryTime: number = 0

async function getTenantAccessToken(): Promise<string> {
  const now = Date.now()
  
  if (cachedToken && now < tokenExpiryTime) {
    return cachedToken
  }
  
  try {
    const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_id: settings.data.app_id,
        app_secret: settings.data.app_secret,
      }),
    })
    
    const data = await response.json()
    
    if (data.code === 0 && data.tenant_access_token) {
      cachedToken = data.tenant_access_token
      tokenExpiryTime = now + (data.expire - 60) * 1000
      return cachedToken
    } else {
      console.error('Failed to get tenant_access_token:', data)
      throw new Error(data.msg || 'Failed to get access token')
    }
  } catch (error) {
    console.error('Error getting tenant_access_token:', error)
    throw error
  }
}

async function getRecords(tableId: string): Promise<any[]> {
  const accessToken = await getTenantAccessToken()
  
  try {
    const response = await fetch(`https://open.feishu.cn/open-apis/bitable/v1/apps/bascnKtF2Kq88mBkHf7jv67q7Fg/tables/${tableId}/records`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    
    const data = await response.json()
    
    if (data.code === 0 && data.data?.items) {
      return data.data.items
    }
    
    console.log('API response:', data)
    return []
  } catch (error) {
    console.error('Failed to fetch records:', error)
    return []
  }
}

export async function GET() {
  try {
    const records = await getRecords(CLASS_TABLE_ID)
    
    const classes = records.map((record: any) => {
      let name = '未命名班级'
      let id = ''
      
      if (typeof record === 'object') {
        id = String(record.record_id || record[0] || '')
        name = record.fields?.name || record.name || record[2] || record[5] || '未命名班级'
      }
      
      return {
        id: String(id),
        name: String(name),
      }
    }).filter(cls => cls.id && cls.name)

    return NextResponse.json({ success: true, data: classes })
  } catch (error) {
    console.error('Error fetching classes:', error)
    return NextResponse.json({
      success: false,
      message: '获取班级列表失败',
    })
  }
}
