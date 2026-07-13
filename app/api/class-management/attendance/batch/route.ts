import { NextResponse } from 'next/server';
import axios from 'axios';
import { getFeishuToken } from '@/lib/feishuToken';

const BASE_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';
const COURSE_HOURS_TABLE_ID = 'tblYolOuKVjujV9J';
const ATTENDANCE_TABLE_ID = 'tbl28gcD5cNjhYg8';

async function getRecords(tableId: string): Promise<any[]> {
  const token = await getFeishuToken();
  try {
    const response = await axios.get(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${tableId}/records?page_size=500`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    if (response.data.code === 0) {
      return response.data.data?.items || [];
    }
    return [];
  } catch (error) {
    console.error(`Error fetching records from ${tableId}:`, error);
    return [];
  }
}

async function createRecord(tableId: string, fields: any): Promise<{ success: boolean; error?: any }> {
  const token = await getFeishuToken();
  try {
    const response = await axios.post(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${tableId}/records`,
      { fields },
      {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      }
    );
    console.log('创建考勤记录API响应:', JSON.stringify(response.data));
    return { success: response.data.code === 0, error: response.data };
  } catch (error: any) {
    console.error(`Error creating record in ${tableId}:`, error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

async function updateRecord(tableId: string, recordId: string, fields: any): Promise<boolean> {
  const token = await getFeishuToken();
  const url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${tableId}/records/${recordId}`;
  console.log(`updateRecord 请求 - URL: ${url}, recordId: ${recordId}, fields:`, JSON.stringify(fields));
  try {
    const response = await axios.put(
      url,
      { fields },
      {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      }
    );
    console.log(`updateRecord 响应 - status: ${response.status}, data:`, JSON.stringify(response.data));
    const isSuccess = response.data?.code === 0;
    console.log(`updateRecord 判断结果: ${isSuccess}`);
    return isSuccess;
  } catch (error: any) {
    console.error(`Error updating record in ${tableId}:`, error.response?.data || error.message);
    console.error(`Error response status:`, error.response?.status);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    const { class_id, student_ids, action } = await request.json();

    console.log('=== 批量上课调试 ===');
    console.log('class_id:', class_id);
    console.log('student_ids:', student_ids);
    console.log('action:', action);

    if (!class_id || !student_ids || !action) {
      return NextResponse.json({ 
        success: false, 
        message: '缺少必要参数' 
      }, { status: 400 });
    }

    if (action !== 'present') {
      return NextResponse.json({ 
        success: false, 
        message: '只支持已上课操作' 
      }, { status: 400 });
    }

    const courseHoursRecords = await getRecords(COURSE_HOURS_TABLE_ID);
    console.log('课时记录数量:', courseHoursRecords.length);
    
    const studentCourseHoursMap: Record<string, { record_id: string; remaining: number; student_record_id?: string }> = {};
    
    if (courseHoursRecords.length > 0) {
      console.log('第一条课时记录的关联学员字段:', JSON.stringify(courseHoursRecords[0].fields?.['关联学员']));
      console.log('第一条课时记录的record_id:', courseHoursRecords[0].record_id);
      console.log('第一条课时记录的剩余课时:', courseHoursRecords[0].fields?.['剩余课时']);
    }
    
    courseHoursRecords.forEach((record: any) => {
      const studentField = record.fields?.['关联学员'];
      if (Array.isArray(studentField)) {
        studentField.forEach((s: any) => {
          const ids = s?.record_ids || (s?.id ? [s.id] : []);
          const textValue = s?.text;
          ids.forEach((sid: string) => {
            const remaining = parseFloat(String(record.fields?.['剩余课时'] || 0)) || 0;
            if (remaining > 0) {
              studentCourseHoursMap[sid] = { 
                record_id: record.record_id, 
                remaining,
                student_record_id: textValue || sid
              };
            }
          });
        });
      }
    });

    console.log('学员课时映射表:', studentCourseHoursMap);
    console.log('尝试匹配的student_ids:', student_ids);

    const today = new Date();
    const todayTimestamp = Math.floor(today.getTime() / 1000);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() / 1000;
    const todayEnd = todayStart + 86400;
    let successCount = 0;
    let failCount = 0;
    let alreadyAttendedCount = 0;

    const attendanceRecords = await getRecords(ATTENDANCE_TABLE_ID);
    const todayAttendedStudents = new Set<string>();
    attendanceRecords.forEach((record: any) => {
      const attendanceDate = record.fields?.['上课日期'];
      if (attendanceDate && typeof attendanceDate === 'number') {
        if (attendanceDate >= todayStart && attendanceDate < todayEnd) {
          const studentField = record.fields?.['关联学员'];
          if (Array.isArray(studentField)) {
            studentField.forEach((s: any) => {
              const ids = s?.record_ids || [];
              ids.forEach((sid: string) => {
                todayAttendedStudents.add(sid);
              });
            });
          }
        }
      }
    });
    console.log(`当天已上课的学员:`, Array.from(todayAttendedStudents));

    for (const studentId of student_ids) {
      console.log('处理学员ID:', studentId);
      
      if (todayAttendedStudents.has(studentId)) {
        console.log(`学员 ${studentId} 当天已上过课，跳过`);
        alreadyAttendedCount++;
        continue;
      }
      
      const courseHours = studentCourseHoursMap[studentId];
      console.log('找到的课时记录:', courseHours);
      
      if (!courseHours) {
        failCount++;
        continue;
      }

      const newRemaining = courseHours.remaining - 1;
      console.log(`更新课时记录 ${courseHours.record_id}: 剩余课时 ${courseHours.remaining} -> ${newRemaining}`);
      const updated = await updateRecord(COURSE_HOURS_TABLE_ID, courseHours.record_id, {
        '剩余课时': newRemaining
      });
      console.log(`更新结果:`, updated);

      if (!updated) {
        failCount++;
        continue;
      }

      console.log(`创建考勤记录: 学员ID=${studentId}`);
      const attendanceResult = await createRecord(ATTENDANCE_TABLE_ID, {
        '关联学员': [studentId],
        '关联班级': [class_id],
        '上课日期': todayTimestamp,
        '签到状态': '已上课',
        '签到方式': '系统自动登记'
      });

      if (!attendanceResult.success) {
        console.error(`创建考勤记录失败:`, attendanceResult.error);
      }

      successCount++;
    }

    let message = `成功标记 ${successCount} 位学生已上课`;
    if (alreadyAttendedCount > 0) {
      message += `，${alreadyAttendedCount} 位学生当天已上过课`;
    }
    if (failCount > 0) {
      message += `，${failCount} 位学生处理失败`;
    }
    
    return NextResponse.json({ 
      success: true, 
      message 
    });
  } catch (error: any) {
    console.error('Error batch attendance:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || '批量考勤操作失败' 
    }, { status: 500 });
  }
}
