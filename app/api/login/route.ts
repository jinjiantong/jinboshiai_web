import { NextResponse } from 'next/server'
import settings from '../../../setting.json'

const TEACHER_TABLE_ID = 'tblxN3e1fyhOMTSt'
const STUDENT_TABLE_ID = 'tblhnKUAyBJbpoDo'
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, username, classId } = body

    if (!username) {
      return NextResponse.json({ success: false, message: '请输入用户名' })
    }

    if (type === 'teacher') {
      const records = await getRecords(TEACHER_TABLE_ID)
      
      let foundTeacher = null
      
      for (const record of records) {
        const name = record.fields?.['老师姓名'] || record.fields?.name || ''
        
        if (name === username || name === `${username}老师`) {
          foundTeacher = record
          break
        }
      }
      
      if (foundTeacher) {
        return NextResponse.json({
          success: true,
          message: `登录成功，欢迎 ${username} 老师`,
          data: {
            type: 'teacher',
            name: username,
            id: foundTeacher.record_id,
          },
        })
      } else {
        return NextResponse.json({
          success: false,
          message: '老师姓名不存在，请检查输入',
        })
      }
    } else if (type === 'student') {
      if (!classId) {
        return NextResponse.json({ success: false, message: '请选择所属班级' })
      }

      const studentRecords = await getRecords(STUDENT_TABLE_ID)
      
      let foundStudent = null
      
      for (const record of studentRecords) {
        const name = record.fields?.['学员姓名'] || record.fields?.name || ''
        const classRef = record.fields?.['所属班级']
        
        let studentClassId = ''
        if (classRef) {
          if (Array.isArray(classRef) && classRef[0]) {
            studentClassId = classRef[0]
          } else if (typeof classRef === 'string') {
            studentClassId = classRef
          }
        }
        
        if (name === username && studentClassId === classId) {
          foundStudent = record
          break
        }
      }
      
      if (foundStudent) {
        return NextResponse.json({
          success: true,
          message: `登录成功，欢迎 ${username} 同学`,
          data: {
            type: 'student',
            name: username,
            id: foundStudent.record_id,
            classId,
          },
        })
      } else {
        return NextResponse.json({
          success: false,
          message: '学员姓名或班级信息不正确，请检查输入',
        })
      }
    } else {
      return NextResponse.json({ success: false, message: '请选择登录类型' })
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ success: false, message: '登录失败，请稍后重试' })
  }
}
