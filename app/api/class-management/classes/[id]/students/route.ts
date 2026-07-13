import { NextResponse } from 'next/server';
import axios from 'axios';
import { getFeishuToken } from '@/lib/feishuToken';

const BASE_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';
const STUDENTS_TABLE_ID = 'tblhnKUAyBJbpoDo';
const PAYMENTS_TABLE_ID = 'tblhIFrvvseuEgIh';
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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const classId = params.id;

    if (!classId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing class ID' 
      }, { status: 400 });
    }

    // 并行获取所有需要的数据
    const [studentRecords, paymentRecords, courseHoursRecords, attendanceRecords] = await Promise.all([
      getRecords(STUDENTS_TABLE_ID),
      getRecords(PAYMENTS_TABLE_ID),
      getRecords(COURSE_HOURS_TABLE_ID),
      getRecords(ATTENDANCE_TABLE_ID)
    ]);

    // 通用函数：解析关联字段中的ID，支持 id 和 record_ids 格式
    const extractLinkedIds = (field: any): string[] => {
      if (!field) return []
      if (Array.isArray(field)) {
        const ids: string[] = []
        field.forEach((item: any) => {
          if (item?.record_ids && Array.isArray(item.record_ids)) {
            ids.push(...item.record_ids)
          } else if (item?.id) {
            ids.push(item.id)
          }
        })
        return ids
      }
      return []
    }
    
    // 过滤出属于该班级的学员
    const classStudents = studentRecords.filter((record: any) => {
      const classField = record.fields?.['报名班级'];
      const classIds = extractLinkedIds(classField);
      return classIds.includes(classId);
    });

    // 构建学员ID到缴费金额的映射
    const studentPaymentMap: Record<string, number> = {};
    paymentRecords.forEach((record: any) => {
      const studentField = record.fields?.['关联学员'];
      const studentIds = extractLinkedIds(studentField);
      const amount = parseFloat(String(record.fields?.['已缴金额'] || record.fields?.['缴费金额'] || 0)) || 0;
      studentIds.forEach((sid: string) => {
        studentPaymentMap[sid] = (studentPaymentMap[sid] || 0) + amount;
      });
    });

    // 构建学员ID到课时的映射
    const studentHoursMap: Record<string, { total: number; remaining: number }> = {};
    courseHoursRecords.forEach((record: any) => {
      const studentField = record.fields?.['关联学员'];
      console.log('课时记录关联学员字段:', JSON.stringify(studentField));
      const studentIds = extractLinkedIds(studentField);
      console.log('提取的学员IDs:', studentIds);
      const total = parseFloat(String(record.fields?.['总课时'] || 0)) || 0;
      const remaining = parseFloat(String(record.fields?.['剩余课时'] || 0)) || 0;
      studentIds.forEach((sid: string) => {
        if (!studentHoursMap[sid]) {
          studentHoursMap[sid] = { total: 0, remaining: 0 };
        }
        studentHoursMap[sid].total += total;
        studentHoursMap[sid].remaining += remaining;
      });
    });

    // 构建学员ID到上课次数和上课日期的映射（从考勤记录表获取）
    const studentAttendanceCountMap: Record<string, number> = {};
    const studentAttendanceDatesMap: Record<string, string[]> = {};
    const todayAttendedStudents = new Set<string>();
    
    // 计算当天的时间范围
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000;
    const todayEnd = todayStart + 86400;
    
    attendanceRecords.forEach((record: any) => {
      const studentField = record.fields?.['关联学员'];
      const studentIds = extractLinkedIds(studentField);
      const attendanceDate = record.fields?.['上课日期'];
      
      studentIds.forEach((sid: string) => {
        studentAttendanceCountMap[sid] = (studentAttendanceCountMap[sid] || 0) + 1;
        // 保存上课日期（使用北京时间）
        if (attendanceDate && typeof attendanceDate === 'number') {
          const date = new Date(attendanceDate * 1000);
          const dateStr = date.toLocaleDateString('zh-CN', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
          if (dateStr) {
            if (!studentAttendanceDatesMap[sid]) {
              studentAttendanceDatesMap[sid] = [];
            }
            studentAttendanceDatesMap[sid].push(dateStr);
          }
          // 检查是否当天已上课
          if (attendanceDate >= todayStart && attendanceDate < todayEnd) {
            todayAttendedStudents.add(sid);
          }
        }
      });
    });

    // 转换为 StudentGrid 需要的格式
    const students = classStudents.map((record: any) => {
      const studentId = record.record_id;
      
      // 提取姓名
      let name = '未知学员';
      const nameField = record.fields?.['姓名'];
      if (typeof nameField === 'string') {
        name = nameField;
      } else if (Array.isArray(nameField)) {
        name = nameField[0]?.text || nameField[0]?.name || nameField[0] || '未知学员';
      } else if (typeof nameField === 'object' && nameField !== null) {
        name = nameField.text || nameField.name || '未知学员';
      }

      // 提取电话
      let phone = '-';
      const phoneField = record.fields?.['联系电话'];
      if (typeof phoneField === 'string') {
        phone = phoneField;
      } else if (Array.isArray(phoneField)) {
        phone = phoneField[0]?.text || phoneField[0] || '-';
      } else if (typeof phoneField === 'object' && phoneField !== null) {
        phone = phoneField.text || phoneField.name || phoneField || '-';
      }

      // 提取学习状态
      let status = '正常上课';
      const statusField = record.fields?.['学习状态'];
      if (typeof statusField === 'string') {
        status = statusField;
      } else if (Array.isArray(statusField)) {
        status = statusField[0]?.text || statusField[0] || '正常上课';
      } else if (typeof statusField === 'object' && statusField !== null) {
        status = statusField.text || statusField.name || statusField || '正常上课';
      }

      // 从映射获取课时和缴费信息
      const hoursInfo = studentHoursMap[studentId] || { total: 0, remaining: 0 };
      const paymentAmount = studentPaymentMap[studentId] || 0;
      const attendanceCount = studentAttendanceCountMap[studentId] || 0;
      const attendanceDates = studentAttendanceDatesMap[studentId] || [];

      return {
        record_id: studentId,
        feishu_id: studentId, // 飞书记录ID，用于匹配课时记录
        name,
        phone,
        status,
        total_hours: hoursInfo.total,
        remaining_hours: hoursInfo.remaining,
        attendance_count: attendanceCount, // 上课次数
        attendance_dates: attendanceDates.sort().reverse(), // 上课日期列表（按日期倒序）
        today_attended: todayAttendedStudents.has(studentId), // 当天是否已上课
        payment_amount: paymentAmount
      };
    });

    console.log('返回的学员列表:', JSON.stringify(students.map(s => ({record_id: s.record_id, feishu_id: s.feishu_id, name: s.name}))));

    return NextResponse.json({ 
      success: true, 
      students,
      class_info: {
        name: '班级学生',
        time_slot: ''
      }
    });
  } catch (error: any) {
    console.error('Error fetching class students:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message || '获取班级学生列表失败' 
    }, { status: 500 });
  }
}
