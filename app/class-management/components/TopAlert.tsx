'use client';

import { useEffect, useState } from 'react';

interface UpcomingClass {
  record_id: string;
  class_name: string;
  time_slot: string;
  minutes_until_start: number;
}

interface TopAlertProps {
  onClassClick: (classId: string) => void;
}

export default function TopAlert({ onClassClick }: TopAlertProps) {
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUpcomingClasses();
    const interval = setInterval(fetchUpcomingClasses, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchUpcomingClasses = async () => {
    try {
      const res = await fetch('/api/class-management/classes/upcoming?minutes=30');
      const data = await res.json();
      setUpcomingClasses(data.upcoming_classes || []);
    } catch (error) {
      console.error('获取即将上课班级失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="animate-pulse h-8 bg-red-100 rounded"></div>
      </div>
    );
  }

  if (upcomingClasses.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-red-600 text-xl">🔔</span>
        <h3 className="font-semibold text-red-800">即将上课</h3>
      </div>
      <div className="space-y-2">
        {upcomingClasses.slice(0, 3).map((cls) => (
          <div
            key={cls.record_id}
            className="flex items-center justify-between bg-white rounded p-3 cursor-pointer hover:bg-red-100 transition"
            onClick={() => onClassClick(cls.record_id)}
          >
            <div>
              <span className="font-medium">{cls.class_name}</span>
              <span className="text-gray-500 ml-2">{cls.time_slot}</span>
            </div>
            <span className="text-red-600 font-semibold">
              距离开课还有 {cls.minutes_until_start} 分钟
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}