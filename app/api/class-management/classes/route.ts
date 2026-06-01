import { NextResponse } from 'next/server';
import { getRecords, TABLE_IDS, extractTextValue, extractNumberValue } from '@/lib/feishu';

export interface ClassItem {
  record_id: string;
  class_name: string;
  time_slot: string;
  student_count: number;
  status: 'upcoming' | 'ongoing' | 'finished';
  start_date?: number;
  end_date?: number;
}

export async function getClasses(filters?: {
  date?: string;
  category?: string;
  status?: string;
  keyword?: string;
}): Promise<ClassItem[]> {
  const data = await getRecords(TABLE_IDS.CLASSES, { page_size: 100 });

  if (!data.items || data.items.length === 0) {
    return [];
  }

  const classes: ClassItem[] = data.items.map((record: any) => {
    const fields = record.fields;
    const className = extractTextValue(fields['班级ID']) || extractTextValue(fields['班级名称']) || '';
    const timeSlot = extractTextValue(fields['上课时间段']) || '';
    const classStatus = extractTextValue(fields['班级状态']) || '招生中';

    const studentsField = fields['关联学员列表'];
    let studentCount = 0;
    if (studentsField && Array.isArray(studentsField)) {
      studentCount = studentsField.length;
    } else if (studentsField && typeof studentsField === 'object' && studentsField.record_ids) {
      studentCount = studentsField.record_ids.length;
    }

    const now = Date.now();
    const startDate = extractNumberValue(fields['开班日期']) || 0;
    const endDate = extractNumberValue(fields['结课日期']) || 0;

    let status: 'upcoming' | 'ongoing' | 'finished' = 'ongoing';
    if (now < startDate) {
      status = 'upcoming';
    } else if (now > endDate) {
      status = 'finished';
    }

    return {
      record_id: record.record_id,
      class_name: className,
      time_slot: timeSlot,
      student_count: studentCount,
      status,
      start_date: startDate,
      end_date: endDate,
    };
  });

  let filtered = classes;

  if (filters?.category) {
    filtered = filtered.filter(c => {
      const classCategory = extractTextValue(
        (data.items.find((r: any) => r.record_id === filtered[0]?.record_id)?.fields as any)?.['班级分类']
      );
      return classCategory === filters.category;
    });
  }

  if (filters?.status) {
    const statusMap: Record<string, 'upcoming' | 'ongoing' | 'finished'> = {
      '招生中': 'upcoming',
      '上课中': 'ongoing',
      '已结课': 'finished',
    };
    filtered = filtered.filter(c => statusMap[filters.status!] === c.status);
  }

  if (filters?.keyword) {
    const keyword = filters.keyword.toLowerCase();
    filtered = filtered.filter(c => c.class_name.toLowerCase().includes(keyword));
  }

  return filtered;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const keyword = searchParams.get('keyword');

    const classes = await getClasses({ date, category, status, keyword });

    return NextResponse.json({ classes });
  } catch (error: any) {
    console.error('Error fetching classes:', error);
    return NextResponse.json(
      { error: '获取班级列表失败', message: error.message },
      { status: 500 }
    );
  }
}