import { NextResponse } from 'next/server'
import axios from 'axios'

const BASE_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc'
const STUDENT_TABLE_ID = 'tblhnKUAyBJbpoDo'
const CLASS_TABLE_ID = 'tblDDKeft6iLlGAx'
const HOMEWORK_TABLE_ID = 'tblEUJfrNGtkUJLR'

let accessToken: string | null = null
let tokenExpiry: number = 0

async function getAccessToken(): Promise<string> {
  const now = Date.now()
  if (accessToken && now < tokenExpiry) {
    return accessToken
  }

  try {
    const response = await axios.post('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      app_id: 'cli_a96bb944bef89bcb',
      app_secret: 'IkQIF3w2JIUD9WFssvzwOdSPbnkiKaHp',
    })

    if (response.data.code === 0) {
      accessToken = response.data.tenant_access_token
      tokenExpiry = now + (response.data.expire - 60) * 1000
      return accessToken
    } else {
      throw new Error(`Failed to get access token: ${response.data.msg}`)
    }
  } catch (error: any) {
    console.error('Error getting access token:', error)
    throw new Error('Failed to get access token')
  }
}

async function getRecordCount(tableId: string): Promise<number> {
  try {
    const token = await getAccessToken()
    const response = await axios.get(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${tableId}/records`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { page_size: 1, get_count: true }
      }
    )

    if (response.data.code === 0) {
      return response.data.data?.total || response.data.data?.items?.length || 0
    }
    return 0
  } catch (error: any) {
    console.error(`Error getting record count for ${tableId}:`, error)
    return 0
  }
}

export async function GET() {
  try {
    const [totalStudents, totalClasses, totalHomework] = await Promise.all([
      getRecordCount(STUDENT_TABLE_ID),
      getRecordCount(CLASS_TABLE_ID),
      getRecordCount(HOMEWORK_TABLE_ID),
    ])

    return NextResponse.json({
      success: true,
      data: {
        totalStudents,
        totalClasses,
        totalHomework,
      },
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({
      success: false,
      message: '获取统计数据失败',
    })
  }
}
