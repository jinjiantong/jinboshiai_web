'use client';

import { useEffect, useState } from 'react';

interface ClassItem {
  record_id: string;
  class_name: string;
  time_slot: string;
  teacher_name: string;
  student_count: number;
  status: 'ongoing' | 'finished' | 'upcoming';
}

interface ClassListProps {
  onClassSelect: (classId: string) => void;
  selectedClassId?: string | null;
}

const STATUS_LABELS = {
  ongoing: { text: '进行中', color: 'bg-green-100 text-green-700' },
  finished: { text: '已结束', color: 'bg-gray-100 text-gray-600' }
};

export default function ClassList({ onClassSelect, selectedClassId }: ClassListProps) {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/classes');
      const data = await res.json();
      // API 返回格式是 { success: true, data: [...] }，转换为 ClassList 需要的格式
      const classesData = data.data || [];
      setClasses(classesData.map((item: any) => ({
        record_id: item.id,
        class_name: item.name,
        time_slot: item.time_slot || '',
        teacher_name: item.teacher_name || '',
        student_count: item.student_count || 0,
        status: item.status || 'upcoming'
      })));
    } catch (error) {
      console.error('获取班级列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow h-full p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-10 bg-gray-100 rounded"></div>
          <div className="h-10 bg-gray-100 rounded"></div>
          <div className="h-10 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow h-full flex flex-col">
      <div className="p-3 border-b">
        <h2 className="font-semibold">班级列表</h2>
        <p className="text-xs text-gray-500">{classes.length} 个班级</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {classes.length === 0 ? (
          <div className="p-4 text-center text-gray-500 text-sm">
            暂无班级数据
          </div>
        ) : (
          classes.map((cls) => (
            <div
              key={cls.record_id}
              className={`p-3 cursor-pointer transition border-b border-gray-100 ${
                selectedClassId === cls.record_id
                  ? 'bg-blue-50 border-l-4 border-l-blue-500'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onClassSelect(cls.record_id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-sm">{cls.class_name}</h3>
                  {cls.teacher_name && (
                    <p className="text-xs text-gray-500">老师: {cls.teacher_name}</p>
                  )}
                  {cls.time_slot && (
                    <p className="text-xs text-gray-400">时间: {cls.time_slot}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{cls.student_count} 名学员</p>
                  {cls.status !== 'upcoming' && (
                    <span className={`text-xs px-1.5 py-0.5 rounded mt-1 inline-block ${
                      STATUS_LABELS[cls.status as keyof typeof STATUS_LABELS]?.color || ''
                    }`}>
                      {STATUS_LABELS[cls.status as keyof typeof STATUS_LABELS]?.text || ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}