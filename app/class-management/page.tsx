'use client';

import { useState } from 'react';
import TopAlert from './components/TopAlert';
import SearchBar from './components/SearchBar';
import ClassList from './components/ClassList';
import StudentGrid from './components/StudentGrid';

interface SearchFilters {
  date: string;
  category: string;
  status: string;
  keyword: string;
}

export default function ClassManagementPage() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    date: new Date().toISOString().split('T')[0],
    category: '',
    status: '',
    keyword: '',
  });

  const toggleStudent = (id: string) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const handleBatchAttendance = async (action: string) => {
    if (!selectedClass || selectedStudents.length === 0) return;

    try {
      const response = await fetch('/api/class-management/attendance/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class_id: selectedClass,
          student_ids: selectedStudents,
          action,
          date: filters.date,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        setSelectedStudents([]);
        window.location.reload();
      } else {
        alert(`操作失败: ${result.error}`);
      }
    } catch (error) {
      console.error('Batch attendance error:', error);
      alert('操作失败，请重试');
    }
  };

  return (
    <div className="space-y-6">
      <TopAlert onClassClick={(id) => setSelectedClass(id)} />
      <SearchBar onSearch={handleSearch} />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <ClassList
            filters={filters}
            onClassSelect={(id) => {
              setSelectedClass(id);
              setSelectedStudents([]);
            }}
            selectedClassId={selectedClass}
          />
        </div>
        <div className="lg:col-span-3">
          <StudentGrid
            classId={selectedClass}
            selectedStudents={selectedStudents}
            onStudentToggle={toggleStudent}
            onSelectAll={(ids) => setSelectedStudents(ids)}
            onBatchAttendance={handleBatchAttendance}
          />
        </div>
      </div>
    </div>
  );
}