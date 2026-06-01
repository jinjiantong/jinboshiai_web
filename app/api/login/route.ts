import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const TEACHER_TABLE_ID = 'tblxN3e1fyhOMTSt'
const STUDENT_TABLE_ID = 'tblhnKUAyBJbpoDo'
const CLASS_TABLE_ID = 'tblDDKeft6iLlGAx'

const execAsync = promisify(exec)

const mockTeachers = [
  ['1', '王老师', '数学老师'],
  ['2', '张老师', '英语老师'],
  ['3', '李老师', 'AI老师'],
]

const mockStudents = [
  ['1', '张七', '周二班'],
  ['2', '张三', '周二班'],
  ['3', '李四', '周三班'],
  ['4', '王五', '周四班'],
]

const mockClasses = [
  ['1', '周二班', 'AI课程'],
  ['2', '周三班', 'AI课程'],
  ['3', '周四班', 'AI课程'],
]

async function getRecords(tableId: string): Promise<any[]> {
  try {
    const { stdout } = await execAsync(
      `lark-cli base +record-list --base-token LrzibrgRsaviAQsiywBcpZQ4nwc --table-id ${tableId} --format json`
    )
    const data = JSON.parse(stdout)
    if (data.ok && data.data?.data) {
      return data.data.data
    }
    console.log('No data from Feishu, using mock data')
    if (tableId === TEACHER_TABLE_ID) return mockTeachers
    if (tableId === STUDENT_TABLE_ID) return mockStudents
    if (tableId === CLASS_TABLE_ID) return mockClasses
    return []
  } catch (error) {
    console.error('Failed to fetch records from Feishu, using mock data:', error)
    if (tableId === TEACHER_TABLE_ID) return mockTeachers
    if (tableId === STUDENT_TABLE_ID) return mockStudents
    if (tableId === CLASS_TABLE_ID) return mockClasses
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
        if (Array.isArray(record)) {
          for (let i = 0; i < record.length; i++) {
            if (typeof record[i] === 'string' && record[i].includes('老师')) {
              name = record[i]
              break
            }
          }
          if (!name) {
            name = record[2] || record[7] || ''
          }
        } else if (typeof record === 'object') {
          name = record.name || record.teacherName || record['老师姓名'] || record[2] || record[7] || ''
        }
        
        console.log('Checking teacher:', name, 'vs input:', username)
        
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
            id: foundTeacher[0],
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

      const classData = await execAsync(
        `lark-cli base +record-list --base-token LrzibrgRsaviAQsiywBcpZQ4nwc --table-id ${CLASS_TABLE_ID} --format json`
      )
      const classJson = JSON.parse(classData.stdout)
      
      let classExists = false
      let targetClassRecordId = ''
      let targetClassName = ''
      if (classJson.ok && classJson.data?.data && classJson.data.record_id_list) {
        const records = classJson.data.data
        const recordIds = classJson.data.record_id_list
        for (let i = 0; i < records.length; i++) {
          const classRecord = records[i]
          const cId = String(Array.isArray(classRecord) ? classRecord[0] || '' : '')
          if (cId === classId) {
            classExists = true
            targetClassRecordId = recordIds[i] || ''
            if (Array.isArray(classRecord)) {
              targetClassName = classRecord[5] || classRecord[2] || '未命名班级'
            } else {
              targetClassName = classRecord.name || '未命名班级'
            }
            break
          }
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
        
        if (Array.isArray(record)) {
          name = record[2] || ''
          const classLink = record[19]
          if (Array.isArray(classLink) && classLink.length > 0 && typeof classLink[0] === 'object' && classLink[0].id) {
            studentClassRecordId = classLink[0].id
          }
        } else if (typeof record === 'object') {
          name = record.name || record[2] || ''
          const classLink = record.classRecord || record[19]
          if (Array.isArray(classLink) && classLink.length > 0 && typeof classLink[0] === 'object' && classLink[0].id) {
            studentClassRecordId = classLink[0].id
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
            id: Array.isArray(foundStudent) ? foundStudent[0] : (foundStudent.id || foundStudent[0]),
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
