'use client';

import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

interface Student {
  record_id: string;
  feishu_id: string;
  name: string;
  phone: string;
  status: string;
  total_hours: number;
  remaining_hours: number;
  attendance_count: number;
  attendance_dates: string[];
  today_attended: boolean;
  payment_amount: number;
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
  const [attendanceModal, setAttendanceModal] = useState<{ open: boolean; student: Student | null }>({ open: false, student: null });

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
    // 只选择可选择的学员（总课时>0 且 剩余课时>0 且 缴费金额>0）
    const selectableStudents = students.filter(s => isStudentSelectable(s));
    if (selectedStudents.length === selectableStudents.length) {
      onSelectAll([]);
    } else {
      onSelectAll(selectableStudents.map((s) => s.feishu_id));
    }
  };

  const handleAttendanceClick = (e: React.MouseEvent, student: Student) => {
    e.stopPropagation();
    setAttendanceModal({ open: true, student });
  };

  // 判断学员是否可选择（总课时>0 且 剩余课时>0 且 缴费金额>0）
  const isStudentSelectable = (student: Student) => {
    return student.total_hours > 0 && student.remaining_hours > 0 && student.payment_amount > 0;
  };

  // 判断学员是否禁用（灰色显示）
  const isStudentDisabled = (student: Student) => {
    return student.total_hours <= 0 || student.remaining_hours <= 0 || student.payment_amount <= 0 || student.today_attended;
  };

  if (!classId) {
    return (
      <div className="bg-white rounded-lg shadow h-full p-12 text-center text-gray-500 flex items-center justify-center">
        请从左侧选择一个班级
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow h-full p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-100 rounded"></div>
          <div className="h-10 bg-gray-100 rounded"></div>
          <div className="h-10 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-lg">{classInfo?.name || '班级学生'}</h2>
          <button
            onClick={() => classId && fetchStudents(classId)}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            title="刷新"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500">{classInfo?.time_slot}</p>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={(() => {
                const selectableStudents = students.filter(s => isStudentSelectable(s));
                return selectableStudents.length > 0 && selectedStudents.length === selectableStudents.length;
              })()}
              onChange={handleSelectAll}
              className="w-5 h-5 rounded"
            />
            <span>全选</span>
          </label>
          <span className="text-gray-600">
            共 <strong>{students.length}</strong> 人
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {students.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            该班级暂无学生
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">选择</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">姓名</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">联系电话</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">总课时</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">剩余课时</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">上课记录</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">缴费金额</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((student) => {
                const disabled = isStudentDisabled(student);
                const todayAttended = student.today_attended;
                return (
                <tr 
                  key={student.record_id}
                  className={`hover:bg-gray-50 cursor-pointer ${disabled ? 'bg-gray-100 text-gray-400' : selectedStudents.includes(student.feishu_id) ? 'bg-blue-50' : ''} ${todayAttended && !disabled ? 'border-l-4 border-l-green-500' : ''}`}
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <label className={`flex items-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.feishu_id)}
                        onChange={() => !disabled && onStudentToggle(student.feishu_id)}
                        disabled={disabled}
                        className="w-5 h-5 rounded cursor-pointer"
                      />
                    </label>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      {student.name}
                      {todayAttended && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">今日已上课</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{student.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{student.total_hours}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={disabled ? 'text-red-400' : student.remaining_hours < 5 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                      {student.remaining_hours}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => handleAttendanceClick(e, student)}
                      className={`text-sm ${student.today_attended ? 'text-green-600 hover:text-green-800 hover:underline' : 'text-blue-600 hover:text-blue-800 hover:underline'}`}
                    >
                      {student.attendance_count || 0} 次
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {student.payment_amount > 0 ? `¥${student.payment_amount.toLocaleString()}` : '-'}
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="p-4 border-t bg-gray-50 flex-shrink-0">
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

      {/* 上课记录弹框 */}
      {attendanceModal.open && attendanceModal.student && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setAttendanceModal({ open: false, student: null })}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{attendanceModal.student.name} - 上课记录</h3>
              <button
                onClick={() => setAttendanceModal({ open: false, student: null })}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                共 <strong>{attendanceModal.student.attendance_count || 0}</strong> 次上课记录
              </p>
              {attendanceModal.student.attendance_dates?.length > 0 ? (
                <div className="max-h-60 overflow-y-auto border rounded-lg p-3">
                  {attendanceModal.student.attendance_dates.map((date, index) => (
                    <div key={index} className="py-2 border-b last:border-b-0 text-sm">
                      {date}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">暂无上课记录</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface BatchActionsProps {
  selectedCount: number;
  onBatchAttendance: (action: string) => void;
}

function BatchActions({ selectedCount, onBatchAttendance }: BatchActionsProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleConfirm = () => {
    onBatchAttendance('present');
    setShowConfirm(false);
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setShowConfirm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          批量已上课
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-semibold mb-4">确认批量操作</h3>
            <p className="text-gray-600 mb-4">
              将标记 <strong>{selectedCount}</strong> 位学生为&quot;已上课&quot;，每人将扣减 1 课时
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
