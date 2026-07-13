import { NextResponse } from 'next/server'
import settings from '../../../setting.json'

const CLASS_TABLE_ID = 'tblDDKeft6iLlGAx'
const STUDENTS_TABLE_ID = 'tblhnKUAyBJbpoDo'
const TEACHERS_TABLE_ID = 'tblxN3e1fyhOMTSt'
const APP_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc'

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
    
    console.error('Failed to get tenant_access_token:', data)
    throw new Error(data.msg || 'Failed to get access token')
  } catch (error) {
    console.error('Error getting tenant_access_token:', error)
    throw error
  }
}

async function getRecords(tableId: string): Promise<any[]> {
  const accessToken = await getTenantAccessToken()
  let allRecords: any[] = []
  let pageToken = ''
  
  try {
    do {
      const url = pageToken 
        ? `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${tableId}/records?page_size=500&page_token=${pageToken}`
        : `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${tableId}/records?page_size=500`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      })
      
      const data = await response.json()
      
      if (data.code === 0 && data.data?.items) {
        allRecords.push(...data.data.items)
        pageToken = data.data.page_token || ''
      } else {
        console.error(`API error for table ${tableId}:`, data)
        break
      }
    } while (pageToken)
    
    return allRecords
  } catch (error) {
    console.error(`Failed to fetch records from table ${tableId}:`, error)
    return []
  }
}

export async function GET() {
  try {
    const [classRecords, studentRecords, teacherRecords] = await Promise.all([
      getRecords(CLASS_TABLE_ID),
      getRecords(STUDENTS_TABLE_ID),
      getRecords(TEACHERS_TABLE_ID)
    ])
    
    // 构建老师 ID 到姓名的映射
    const teacherNameMap: Record<string, string> = {}
    teacherRecords.forEach((teacher: any) => {
      const teacherId = teacher.record_id
      const nameField = teacher.fields?.['老师姓名']
      let teacherName = '未知老师'
      if (typeof nameField === 'string') {
        teacherName = nameField
      } else if (Array.isArray(nameField)) {
        teacherName = nameField[0]?.text || nameField[0]?.name || teacherName
      } else if (typeof nameField === 'object' && nameField !== null) {
        teacherName = nameField.text || nameField.name || teacherName
      }
      teacherNameMap[teacherId] = teacherName
    })
    
    // 计算每个班级的学员数量
    const studentCountMap: Record<string, number> = {}
    console.log(`班级API: 获取到 ${studentRecords.length} 条学员记录`)
    console.log(`班级API: 学员记录详情:`, JSON.stringify(studentRecords.map((s: any) => ({
      name: s.fields?.['姓名'],
      classField: s.fields?.['报名班级']
    }))))
    studentRecords.forEach((student: any) => {
      const classField = student.fields?.['报名班级']
      if (Array.isArray(classField)) {
        classField.forEach((c: any) => {
          if (c?.record_ids && Array.isArray(c.record_ids)) {
            c.record_ids.forEach((classId: string) => {
              studentCountMap[classId] = (studentCountMap[classId] || 0) + 1
            })
          }
        })
      }
    })
    console.log(`班级API: studentCountMap =`, studentCountMap)
    
    const classes = classRecords.map((record: any) => {
      // 班级名称可能是对象、字符串或数组
      let name = '未命名班级'
      const classNameField = record.fields?.name || record.fields?.['班级名称']
      
      if (typeof classNameField === 'string') {
        name = classNameField
      } else if (Array.isArray(classNameField)) {
        // 如果是数组，尝试提取第一个元素的 text
        const firstItem = classNameField[0]
        if (typeof firstItem === 'string') {
          name = firstItem
        } else if (typeof firstItem === 'object' && firstItem !== null) {
          name = firstItem.text || firstItem.name || firstItem.title || JSON.stringify(classNameField)
        }
      } else if (typeof classNameField === 'object' && classNameField !== null) {
        name = classNameField.text || classNameField.name || classNameField.title || JSON.stringify(classNameField)
      }
      
      // 解析上课时间
      let time_slot = ''
      const timeField = record.fields?.['上课时间段'] || record.fields?.['时间段']
      if (typeof timeField === 'string') {
        time_slot = timeField
      } else if (Array.isArray(timeField)) {
        time_slot = timeField[0]?.text || timeField[0]?.name || ''
      } else if (typeof timeField === 'object' && timeField !== null) {
        time_slot = timeField.text || timeField.name || ''
      }
      
      // 解析授课老师
      let teacher_name = ''
      const teacherField = record.fields?.['授课老师']
      if (Array.isArray(teacherField)) {
        teacherField.forEach((t: any) => {
          if (t?.record_ids && Array.isArray(t.record_ids)) {
            t.record_ids.forEach((tid: string) => {
              if (teacherNameMap[tid]) {
                teacher_name = teacherNameMap[tid]
              }
            })
          }
          if (!teacher_name && t?.text) {
            teacher_name = t.text
          }
        })
      } else if (typeof teacherField === 'object' && teacherField !== null && teacherField.record_ids) {
        teacherField.record_ids.forEach((tid: string) => {
          if (teacherNameMap[tid]) {
            teacher_name = teacherNameMap[tid]
          }
        })
      }
      
      const classId = String(record.record_id || '')
      
      return {
        id: classId,
        name: name,
        time_slot: time_slot,
        teacher_name: teacher_name,
        student_count: studentCountMap[classId] || 0,
        status: 'upcoming'
      }
    }).filter(cls => cls.id && cls.name !== '[object Object]')

    return NextResponse.json({ success: true, data: classes })
  } catch (error) {
    console.error('Error fetching classes:', error)
    return NextResponse.json({ success: false, message: '获取班级列表失败' })
  }
}
