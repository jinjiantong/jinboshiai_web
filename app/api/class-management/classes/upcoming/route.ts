import { NextResponse } from 'next/server';
import { getRecords, TABLE_IDS, extractTextValue, extractNumberValue } from '@/lib/feishu';

export interface UpcomingClass {
  record_id: string;
  class_name: string;
  time_slot: string;
  minutes_until_start: number;
}

function parseTimeSlot(timeSlot: string): { startHour: number; startMinute: number } | null {
  if (!timeSlot) return null;

  const match = timeSlot.match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;

  return {
    startHour: parseInt(match[1], 10),
    startMinute: parseInt(match[2], 10),
  };
}

function calculateMinutesUntilClass(timeSlot: string, classDate: number): number {
  const timeInfo = parseTimeSlot(timeSlot);
  if (!timeInfo) return -1;

  const now = new Date();
  const classStart = new Date(classDate);
  classStart.setHours(timeInfo.startHour, timeInfo.startMinute, 0, 0);

  const diffMs = classStart.getTime() - now.getTime();
  return Math.floor(diffMs / (1000 * 60));
}

export async function getUpcomingClasses(minutes: number = 30): Promise<UpcomingClass[]> {
  const data = await getRecords(TABLE_IDS.CLASSES, { page_size: 100 });

  if (!data.items || data.items.length === 0) {
    return [];
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const todayEnd = todayStart + 24 * 60 * 60 * 1000 - 1;

  const upcomingClasses: UpcomingClass[] = [];

  for (const record of data.items) {
    const fields = record.fields;
    const className = extractTextValue(fields['班级ID']) || extractTextValue(fields['班级名称']) || '';
    const timeSlot = extractTextValue(fields['上课时间段']);
    const classStatus = extractTextValue(fields['班级状态']);

    if (classStatus !== '上课中') continue;

    const startDate = extractNumberValue(fields['开班日期']);
    const endDate = extractNumberValue(fields['结课日期']);

    if (!startDate || startDate > todayEnd) continue;
    if (!endDate || endDate < todayStart) continue;

    const minutesUntil = calculateMinutesUntilClass(timeSlot, startDate);

    if (minutesUntil >= 0 && minutesUntil <= minutes) {
      upcomingClasses.push({
        record_id: record.record_id,
        class_name: className,
        time_slot: timeSlot,
        minutes_until_start: minutesUntil,
      });
    }
  }

  upcomingClasses.sort((a, b) => a.minutes_until_start - b.minutes_until_start);

  return upcomingClasses;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const minutes = parseInt(searchParams.get('minutes') || '30', 10);

    const upcomingClasses = await getUpcomingClasses(minutes);

    return NextResponse.json({ upcoming_classes: upcomingClasses });
  } catch (error: any) {
    console.error('Error fetching upcoming classes:', error);
    return NextResponse.json(
      { error: '获取即将上课班级失败', message: error.message },
      { status: 500 }
    );
  }
}