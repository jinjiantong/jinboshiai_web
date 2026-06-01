'use client';

import { useEffect, useState } from 'react';

interface Student {
  record_id: string;
  name: string;
  phone: string;
  status: string;
  remaining_hours: number;
}

interface StudentGridProps {
  classId: string | null;
  selectedStudents: string[];
  onStudentToggle: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onBatchAttendance: (action: string) => void;
}

export default function StudentGrid({
  classId,
  selectedStudents,
  onStudentToggle,
  onSelectAll,
  onBatchAttendance
}: StudentGridProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [classInfo, setClassInfo] = useState<{ name: string; time_slot: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (classId) {
      fetchStudents(classId);
    } else {
      setStudents([]);
      setClassInfo(null);
    }
  }, [classId]);

  const fetchStudents = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/class-management/classes/${id}/students`);
      const data = await res.json();
      setStudents(data.students || []);
      setClassInfo(data.class_info);
    } catch (error) {
      console.error('获取学生列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      onSelectAll([]);
    } else {
      onSelectAll(students.map((s) => s.record_id));
    }
  };

  if (!classId) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
        请从左侧选择一个班级
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <div className="animate-pulse grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-lg">{classInfo?.name || '班级学生'}</h2>
          <p className="text-sm text-gray-500">{classInfo?.time_slot}</p>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedStudents.length === students.length && students.length > 0}
            onChange={handleSelectAll}
            className="w-5 h-5 rounded"
          />
          <span>全选</span>
        </label>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {students.map((student) => (
            <div
              key={student.record_id}
              className={`border rounded-lg p-4 cursor-pointer transition ${
                selectedStudents.includes(student.record_id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => onStudentToggle(student.record_id)}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.record_id)}
                  onChange={() => onStudentToggle(student.record_id)}
                  className="mt-1 w-4 h-4"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{student.name}</h3>
                  <p className="text-sm text-gray-500">{student.phone}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {student.status}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      剩余 {student.remaining_hours} 课时
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {students.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            该班级暂无学生
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-gray-50">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">
            已选 <strong>{selectedStudents.length}</strong> 人
          </span>
          <BatchActions
            selectedCount={selectedStudents.length}
            onBatchAttendance={onBatchAttendance}
          />
        </div>
      </div>
    </div>
  );
}

interface BatchActionsProps {
  selectedCount: number;
  onBatchAttendance: (action: string) => void;
}

function BatchActions({ selectedCount, onBatchAttendance }: BatchActionsProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [action, setAction] = useState('');
  const [actionLabel, setActionLabel] = useState('');

  const handleConfirm = () => {
    onBatchAttendance(action);
    setShowConfirm(false);
  };

  const openConfirm = (act: string, label: string) => {
    setAction(act);
    setActionLabel(label);
    setShowConfirm(true);
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => openConfirm('present', '已上课')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          批量已上课
        </button>
        <button
          onClick={() => openConfirm('late', '迟到')}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          批量迟到
        </button>
        <button
          onClick={() => openConfirm('absent', '旷课')}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          批量旷课
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-semibold mb-4">确认批量操作</h3>
            <p className="text-gray-600 mb-4">
              将标记 <strong>{selectedCount}</strong> 位学生为&quot;
              {actionLabel}&quot;
              {action !== 'late' && '，每人将扣减 1 课时'}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}