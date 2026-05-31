import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const STUDENT_TABLE_ID = 'tblhnKUAyBJbpoDo'
const CLASS_TABLE_ID = 'tblDDKeft6iLlGAx'
const HOMEWORK_TABLE_ID = 'tblEUJfrNGtkUJLR'

const execAsync = promisify(exec)

async function getRecordCount(tableId: string): Promise<number> {
  try {
    const { stdout } = await execAsync(
      `lark-cli base +record-list --base-token LrzibrgRsaviAQsiywBcpZQ4nwc --table-id ${tableId} --format json`
    )
    const data = JSON.parse(stdout)
    if (data.ok && data.data?.data) {
      return data.data.data.length
    }
    return 0
  } catch (error) {
    console.error(`Failed to fetch records from table ${tableId}:`, error)
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