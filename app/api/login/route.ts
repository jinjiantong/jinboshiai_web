import { NextResponse } from 'next/server'
import settings from '../../../setting.json'

const TEACHER_TABLE_ID = 'tblxN3e1fyhOMTSt'
const STUDENT_TABLE_ID = 'tblhnKUAyBJbpoDo'
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

let cachedAppToken: string = ''

async function getBitableAppToken(): Promise<string> {
  if (cachedAppToken) {
    return cachedAppToken
  }
  
  const accessToken = await getTenantAccessToken()
  
  try {
    const response = await fetch('https://open.feishu.cn/open-apis/bitable/v1/apps', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    
    const data = await response.json()
    
    if (data.code === 0 && data.data?.items && data.data.items.length > 0) {
      cachedAppToken = data.data.items[0].app_token
      console.log('Found bitable app_token:', cachedAppToken)
      return cachedAppToken
    }
    
    console.error('Failed to get bitable app_token:', data)
    throw new Error('Failed to get bitable app_token')
  } catch (error) {
    console.error('Error getting bitable app_token:', error)
    throw error
  }
}

async function getRecords(tableId: string): Promise<any[]> {
  const accessToken = await getTenantAccessToken()
  const appToken = await getBitableAppToken()
  
  try {
    const response = await fetch(`https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records`, {
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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, username, classId } = body

    if (!username) {
      return NextResponse.json({
        success: false,
        message: '请输入用户名',
      })
    }

    if (type === 'teacher') {
      const records = await getRecords(TEACHER_TABLE_ID)
      
      let foundTeacher = null
      
      for (const record of records) {
        let name = ''
        if (typeof record === 'object') {
          name = record.fields?.name || record.name || record[2] || record[7] || ''
        }
        
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
            id: foundTeacher.record_id || foundTeacher[0],
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
        return NextResponse.json({
          success: false,
          message: '请选择所属班级',
        })
      }

      const classRecords = await getRecords(CLASS_TABLE_ID)
      
      let classExists = false
      let targetClassRecordId = ''
      for (const classRecord of classRecords) {
        const cId = String(classRecord.record_id || classRecord[0] || '')
        if (cId === classId) {
          classExists = true
          targetClassRecordId = cId
          break
        }
      }
      
      if (!classExists) {
        return NextResponse.json({
          success: false,
          message: '班级不存在',
        })
      }

      const studentRecords = await getRecords(STUDENT_TABLE_ID)
      
      let foundStudent = null
      
      for (const record of studentRecords) {
        let name = ''
        let studentClassRecordId = ''
        
        if (typeof record === 'object') {
          name = record.fields?.name || record.name || record[2] || ''
          const classField = record.fields?.classRecord || record.fields?.class || record[19]
          if (classField) {
            if (typeof classField === 'string') {
              studentClassRecordId = classField
            } else if (Array.isArray(classField) && classField.length > 0) {
              studentClassRecordId = classField[0].record_id || classField[0].id || String(classField[0])
            } else if (typeof classField === 'object' && classField.record_id) {
              studentClassRecordId = classField.record_id
            }
          }
        }
        
        if (name === username && studentClassRecordId === targetClassRecordId) {
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
            id: foundStudent.record_id || foundStudent[0],
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
      return NextResponse.json({
        success: false,
        message: '请选择登录类型',
      })
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      success: false,
      message: '登录失败，请稍后重试',
    })
  }
}
