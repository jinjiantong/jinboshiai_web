import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const CLASS_TABLE_ID = 'tblDDKeft6iLlGAx'

const execAsync = promisify(exec)

async function getRecords(tableId: string): Promise<any[]> {
  try {
    const { stdout } = await execAsync(
      `lark-cli base +record-list --base-token LrzibrgRsaviAQsiywBcpZQ4nwc --table-id ${tableId} --format json`
    )
    const data = JSON.parse(stdout)
    if (data.ok && data.data?.data) {
      return data.data.data
    }
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
      
      if (Array.isArray(record)) {
        id = String(record[0] || '')
        if (record[5] && typeof record[5] === 'string') {
          name = record[5]
        } else if (record[11] && Array.isArray(record[11]) && record[11][0]) {
          name = record[11][0]
        } else if (record[2] && typeof record[2] === 'string') {
          name = record[2]
        } else if (record[4] && typeof record[4] === 'string') {
          name = record[4]
        }
      } else if (typeof record === 'object') {
        id = String(record.id || record[0] || '')
        name = record.name || '未命名班级'
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
