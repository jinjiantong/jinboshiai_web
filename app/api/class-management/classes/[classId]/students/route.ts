import { NextResponse } from 'next/server';
import { getRecords, getRecord, TABLE_IDS, extractTextValue, extractNumberValue } from '@/lib/feishu';

export interface StudentItem {
  record_id: string;
  name: string;
  phone: string;
  status: string;
  remaining_hours: number;
  hours_record_id?: string;
}

export async function getClassStudents(classId: string): Promise<{
  class_info: { name: string; time_slot: string; course: string };
  students: StudentItem[];
}> {
  const classRecord = await getRecord(TABLE_IDS.CLASSES, classId);

  if (!classRecord?.record) {
    throw new Error('班级不存在');
  }

  const fields = classRecord.record.fields;
  const className = extractTextValue(fields['班级ID']) || extractTextValue(fields['班级名称']) || '';
  const timeSlot = extractTextValue(fields['上课时间段']) || '';

  const courseLink = fields['关联课程'];
  let courseName = '';
  if (courseLink && typeof courseLink === 'object' && courseLink.record_ids?.[0]) {
    try {
      const courseRecord = await getRecord(TABLE_IDS.CLASSES, courseLink.record_ids[0]);
      courseName = extractTextValue(courseRecord?.record?.fields?.['课程名称']) || '';
    } catch (e) {
      courseName = '';
    }
  }

  const studentsField = fields['关联学员列表'];
  const studentRecordIds: string[] = [];

  if (studentsField && Array.isArray(studentsField)) {
    studentRecordIds.push(...studentsField.map((s: any) =>
      typeof s === 'string' ? s : s.record_id
    ));
  } else if (studentsField && typeof studentsField === 'object' && studentsField.record_ids) {
    studentRecordIds.push(...studentsField.record_ids);
  }

  const students: StudentItem[] = [];

  for (const studentId of studentRecordIds) {
    try {
      const studentRecord = await getRecord(TABLE_IDS.STUDENTS, studentId);
      if (!studentRecord?.record) continue;

      const studentFields = studentRecord.record.fields;
      const name = extractTextValue(studentFields['姓名']) || '';
      const phoneField = studentFields['联系电话'];
      const phone = typeof phoneField === 'string' ? phoneField :
        (phoneField?.phone ? phoneField.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '');
      const status = extractTextValue(studentFields['学习状态']) || '正常上课';

      let remainingHours = 0;
      let hoursRecordId = '';

      const hoursLink = studentFields['课时记录表'];
      if (hoursLink && typeof hoursLink === 'object' && hoursLink.record_ids?.[0]) {
        hoursRecordId = hoursLink.record_ids[0];
        const hoursRecord = await getRecord(TABLE_IDS.COURSE_HOURS, hoursRecordId);
        if (hoursRecord?.record) {
          const hoursFields = hoursRecord.record.fields;
          const totalHours = extractNumberValue(hoursFields['总课时']);
          const usedHours = extractNumberValue(hoursFields['已上课时']);
          remainingHours = totalHours - usedHours;
        }
      }

      students.push({
        record_id: studentId,
        name,
        phone,
        status,
        remaining_hours: remainingHours,
        hours_record_id: hoursRecordId,
      });
    } catch (error) {
      console.error(`Error fetching student ${studentId}:`, error);
    }
  }

  return {
    class_info: {
      name: className,
      time_slot: timeSlot,
      course: courseName,
    },
    students,
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ classId: string }> }
) {
  try {
    const { classId } = await params;

    if (!classId) {
      return NextResponse.json(
        { error: '缺少班级ID' },
        { status: 400 }
      );
    }

    const result = await getClassStudents(classId);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching class students:', error);
    return NextResponse.json(
      { error: '获取学生列表失败', message: error.message },
      { status: 500 }
    );
  }
}