import { NextResponse } from 'next/server';
import { createRecord, updateRecord, getRecord, TABLE_IDS, extractNumberValue } from '@/lib/feishu';

export interface AttendanceResult {
  success: boolean;
  processed_count: number;
  message: string;
  errors?: string[];
}

export async function processBatchAttendance(params: {
  class_id: string;
  student_ids: string[];
  action: 'present' | 'late' | 'absent' | 'leave';
  date?: string;
}): Promise<AttendanceResult> {
  const { class_id, student_ids, action, date } = params;

  const errors: string[] = [];
  let processedCount = 0;

  const actionStatusMap: Record<string, string> = {
    'present': '正常出勤',
    'late': '迟到',
    'absent': '旷课',
    'leave': '请假',
  };

  const attendanceDate = date
    ? new Date(date).getTime()
    : new Date().setHours(0, 0, 0, 0);

  for (const student_id of student_ids) {
    try {
      await createRecord(TABLE_IDS.ATTENDANCE, {
        '上课日期': attendanceDate,
        '签到状态': actionStatusMap[action] || '正常出勤',
        '关联班级': [class_id],
        '关联学员': [student_id],
      });

      if (action === 'present' || action === 'absent') {
        const studentRecord = await getRecord(TABLE_IDS.STUDENTS, student_id);
        if (studentRecord?.record) {
          const studentFields = studentRecord.record.fields;
          const hoursLink = studentFields['课时记录表'];

          if (hoursLink && typeof hoursLink === 'object' && hoursLink.record_ids?.[0]) {
            const hoursRecordId = hoursLink.record_ids[0];
            const hoursRecord = await getRecord(TABLE_IDS.COURSE_HOURS, hoursRecordId);

            if (hoursRecord?.record) {
              const hoursFields = hoursRecord.record.fields;
              const usedHours = extractNumberValue(hoursFields['已上课时']);

              await updateRecord(TABLE_IDS.COURSE_HOURS, hoursRecordId, {
                '已上课时': usedHours + 1,
              });
            }
          }
        }
      }

      processedCount++;
    } catch (error: any) {
      console.error(`Error processing attendance for student ${student_id}:`, error);
      errors.push(`学生 ${student_id}: ${error.message}`);
    }
  }

  return {
    success: errors.length === 0,
    processed_count: processedCount,
    message: `成功标记 ${processedCount} 位学生考勤状态`,
    errors: errors.length > 0 ? errors : undefined,
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { class_id, student_ids, action, date } = body;

    if (!class_id || !student_ids || !action) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    if (!Array.isArray(student_ids) || student_ids.length === 0) {
      return NextResponse.json(
        { error: 'student_ids 必须是非空数组' },
        { status: 400 }
      );
    }

    const validActions = ['present', 'late', 'absent', 'leave'];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: '无效的考勤操作类型' },
        { status: 400 }
      );
    }

    const result = await processBatchAttendance({
      class_id,
      student_ids,
      action,
      date,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error processing batch attendance:', error);
    return NextResponse.json(
      { error: '考勤操作失败', message: error.message },
      { status: 500 }
    );
  }
}