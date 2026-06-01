'use client';

import { useEffect, useState } from 'react';

interface ClassItem {
  record_id: string;
  class_name: string;
  time_slot: string;
  student_count: number;
  status: 'upcoming' | 'ongoing' | 'finished';
}

interface SearchFilters {
  date: string;
  category: string;
  status: string;
  keyword: string;
}

interface ClassListProps {
  onClassSelect: (classId: string) => void;
  selectedClassId?: string | null;
  filters: SearchFilters;
}

const STATUS_LABELS = {
  upcoming: { text: '即将上课', color: 'bg-orange-100 text-orange-700' },
  ongoing: { text: '进行中', color: 'bg-green-100 text-green-700' },
  finished: { text: '已结束', color: 'bg-gray-100 text-gray-600' }
};

export default function ClassList({ onClassSelect, selectedClassId, filters }: ClassListProps) {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, [filters]);

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.date) params.append('date', filters.date);
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      if (filters.keyword) params.append('keyword', filters.keyword);

      const res = await fetch(`/api/class-management/classes?${params.toString()}`);
      const data = await res.json();
      setClasses(data.classes || []);
    } catch (error) {
      console.error('获取班级列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-12 bg-gray-100 rounded"></div>
          <div className="h-12 bg-gray-100 rounded"></div>
          <div className="h-12 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">班级列表</h2>
        <p className="text-sm text-gray-500">{classes.length} 个班级</p>
      </div>
      <div className="divide-y max-h-[600px] overflow-y-auto">
        {classes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            暂无班级数据
          </div>
        ) : (
          classes.map((cls) => (
            <div
              key={cls.record_id}
              className={`p-4 cursor-pointer transition ${
                selectedClassId === cls.record_id
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onClassSelect(cls.record_id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{cls.class_name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{cls.time_slot}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  STATUS_LABELS[cls.status].color
                }`}>
                  {STATUS_LABELS[cls.status].text}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {cls.student_count} 名学员
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}