import { NextResponse } from 'next/server'
import axios from 'axios'
import { getFeishuToken } from '@/lib/feishuToken'

const BASE_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc'
const STUDENT_TABLE_ID = 'tblhnKUAyBJbpoDo'
const CLASS_TABLE_ID = 'tblDDKeft6iLlGAx'
const HOMEWORK_TABLE_ID = 'tblEUJfrNGtkUJLR'

async function getRecordCount(tableId: string): Promise<number> {
  try {
    const token = await getFeishuToken()
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
