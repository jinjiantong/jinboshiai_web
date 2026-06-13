'use client';

import { useState } from 'react';
import ClassList from './components/ClassList';
import StudentGrid from './components/StudentGrid';

export default function ClassManagementPage() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const toggleStudent = (id: string) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleBatchAttendance = async (action: string) => {
    if (!selectedClass || selectedStudents.length === 0) return;

    setLoading(true);
    try {
      const response = await fetch('/api/class-management/attendance/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class_id: selectedClass,
          student_ids: selectedStudents,
          action,
        }),
      });

      const result = await response.json();

      setSelectedStudents([]);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Batch attendance error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-10rem)] gap-4">
      <div className="w-72 flex-shrink-0">
        <ClassList
          key={refreshKey}
          onClassSelect={(id) => {
            setSelectedClass(id);
            setSelectedStudents([]);
          }}
          selectedClassId={selectedClass}
        />
      </div>
      <div className="flex-1 min-w-0 relative">
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-600">处理中...</span>
            </div>
          </div>
        )}
        <StudentGrid
          key={`students-${selectedClass}-${refreshKey}`}
          classId={selectedClass}
          selectedStudents={selectedStudents}
          onStudentToggle={toggleStudent}
          onSelectAll={(ids) => setSelectedStudents(ids)}
          onBatchAttendance={handleBatchAttendance}
        />
      </div>
    </div>
  );
}