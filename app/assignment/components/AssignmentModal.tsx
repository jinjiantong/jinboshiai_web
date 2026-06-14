'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, File, Star, ChevronDown } from 'lucide-react';
import { Assignment } from '../hooks/useAssignment';

interface AssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AssignmentFormData) => void;
  assignment?: Assignment;
  currentUser?: {
    user_id: string;
    name: string;
    role: string;
  };
  students: Student[];
}

export interface AssignmentFormData {
  '作业标题': string;
  '作业描述': string;
  '关联学员'?: any;
  '关联班级'?: any;
  '是否优秀': boolean;
  '作品链接'?: string;
  '作业附件'?: Array<{ token: string; name: string }>;
}

interface Student {
  record_id: string;
  fields: {
    '姓名'?: string;
  };
}

interface Course {
  record_id: string;
  fields: {
    '班级名称'?: string;
  };
}

export function AssignmentModal({
  isOpen,
  onClose,
  onSubmit,
  assignment,
  currentUser,
  students
}: AssignmentModalProps) {
  const isStudent = currentUser?.role === 'student';
  const [formData, setFormData] = useState<AssignmentFormData>({
    '作业标题': '',
    '作业描述': '',
    '关联学员': undefined,
    '关联班级': undefined,
    '是否优秀': false,
    '作品链接': '',
    '作业附件': []
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchData();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [studentsRes, coursesRes] = await Promise.all([
        fetch('/api/student-management/students?force_refresh=true'),
        fetch('/api/student-management/courses?force_refresh=true')
      ]);
      
      const studentsData = await studentsRes.json();
      const coursesData = await coursesRes.json();
      
      if (studentsData.code === 0) {
        setStudents(studentsData.data || []);
      }
      
      if (coursesData.code === 0) {
        setCourses(coursesData.data || []);
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (assignment) {
        const classField = assignment.fields['关联班级'];
        let classId = '';
        if (Array.isArray(classField)) {
          classId = classField[0]?.record_ids?.[0] || classField[0]?.text || '';
        } else if (typeof classField === 'string') {
          classId = classField;
        }
        
        const studentField = assignment.fields['关联学员'];
        let studentId = '';
        if (Array.isArray(studentField)) {
          studentId = studentField[0]?.record_ids?.[0] || studentField[0]?.text || '';
        } else if (typeof studentField === 'string') {
          studentId = studentField;
        }

        const attachmentField = assignment.fields['作业附件'];
        let attachments: Array<{ token: string; name: string }> = [];
        if (attachmentField && Array.isArray(attachmentField)) {
          attachments = attachmentField
            .filter((att: any) => att && typeof att === 'object')
            .map((att: any) => ({
              token: att.file_token || att.token || '',
              name: att.name || att.filename || '未命名文件'
            }))
            .filter((att: any) => att.token);
        }
        
        setSelectedClassId(classId);
        
        setFormData({
          '作业标题': assignment.fields['作业标题'] || '',
          '作业描述': assignment.fields['作业内容'] || assignment.fields['作业描述'] || '',
          '关联学员': studentId ? { text: studentId } : undefined,
          '关联班级': classId ? { text: classId } : undefined,
          '是否优秀': assignment.fields['是否优秀作品'] || assignment.fields['是否优秀'] || assignment.fields['优秀作业标记'] || false,
          '作品链接': assignment.fields['作品链接'] || assignment.fields['存档路径'] || '',
          '作业附件': attachments
        });
      } else {
        if (isStudent && students.length > 0) {
          const studentName = currentUser?.name || '';
          const matchedStudent = students.find(s => s.fields?.['姓名'] === studentName);
          
          let classRecordId = '';
          if (matchedStudent) {
            const classField = matchedStudent.fields?.['报名班级'];
            if (classField && Array.isArray(classField)) {
              const firstItem = classField[0];
              if (firstItem && firstItem.record_ids && firstItem.record_ids.length > 0) {
                classRecordId = firstItem.record_ids[0];
              }
            }
          }
          
          setSelectedClassId(classRecordId);
          setFormData({
            '作业标题': '',
            '作业描述': '',
            '关联学员': { text: matchedStudent ? matchedStudent.record_id : studentName },
            '关联班级': classRecordId ? { text: classRecordId } : undefined,
            '是否优秀': false,
            '作品链接': '',
            '作业附件': []
          });
        } else if (!isStudent) {
          setSelectedClassId('');
          setFormData({
            '作业标题': '',
            '作业描述': '',
            '关联学员': undefined,
            '关联班级': undefined,
            '是否优秀': false,
            '作品链接': '',
            '作业附件': []
          });
        }
      }
      setErrors({});
    }
  }, [isOpen, assignment, students, isStudent, currentUser]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData['作业标题']?.trim()) {
      newErrors['作业标题'] = '请输入作业标题';
    }
    
    if (!formData['作业描述']?.trim()) {
      newErrors['作业描述'] = '请输入作业描述';
    }
    
    if (!formData['关联学员']?.text) {
      newErrors['关联学员'] = '请选择关联学员';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof AssignmentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    setFormData(prev => ({
      ...prev,
      '关联班级': classId ? { text: classId } : undefined,
      '关联学员': undefined
    }));
  };

  const handleStudentChange = (studentId: string) => {
    setFormData(prev => ({
      ...prev,
      '关联学员': studentId ? { text: studentId } : undefined
    }));
  };

  const filteredStudents = selectedClassId 
    ? students.filter(student => {
        const classField = student.fields['报名班级'];
        if (!classField) return false;
        if (Array.isArray(classField)) {
          return classField.some(c => {
            if (typeof c === 'string') return c === selectedClassId;
            if (c?.record_ids) return c.record_ids.includes(selectedClassId);
            return false;
          });
        }
        return false;
      })
    : students;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
    
    for (const file of validFiles) {
      await uploadFile(file);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
    
    for (const file of validFiles) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/assignments/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.code === 0) {
        setFormData(prev => ({
          ...prev,
          '作业附件': [...(prev['作业附件'] || []), {
            token: result.data.token,
            name: result.data.name
          }]
        }));
      } else {
        console.error('上传失败:', result.msg);
      }
    } catch (error) {
      console.error('上传文件错误:', error);
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      '作业附件': (prev['作业附件'] || []).filter((_, i) => i !== index)
    }));
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.record_id === studentId);
    return student?.fields?.['姓名'] || studentId;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-800">
            {assignment ? '编辑作业' : '新增作业'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                作业标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData['作业标题']}
                onChange={(e) => handleInputChange('作业标题', e.target.value)}
                placeholder="请输入作业标题"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors['作业标题'] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors['作业标题'] && (
                <p className="mt-1 text-sm text-red-500">{errors['作业标题']}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                作业描述 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData['作业描述']}
                onChange={(e) => handleInputChange('作业描述', e.target.value)}
                placeholder="请输入作业描述"
                rows={4}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                  errors['作业描述'] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors['作业描述'] && (
                <p className="mt-1 text-sm text-red-500">{errors['作业描述']}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  关联班级
                </label>
                <select
                  value={selectedClassId}
                  onChange={(e) => handleClassChange(e.target.value)}
                  disabled={isStudent}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    isStudent ? 'bg-gray-100 cursor-not-allowed' : ''
                  } ${errors['关联班级'] ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">{isStudent ? '（不可更改）' : '请选择班级'}</option>
                  {courses.map(course => (
                    <option key={course.record_id} value={course.record_id}>
                      {course.fields?.['班级名称'] || '未知班级'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  关联学员 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData['关联学员']?.text || ''}
                  onChange={(e) => handleStudentChange(e.target.value)}
                  disabled={isStudent}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    isStudent ? 'bg-gray-100 cursor-not-allowed' : ''
                  } ${errors['关联学员'] ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">
                    {isStudent ? currentUser?.name || '（不可更改）' : (selectedClassId ? '请选择学员' : '请先选择班级')}
                  </option>
                  {filteredStudents.map(student => (
                    <option key={student.record_id} value={student.record_id}>
                      {student.fields?.['姓名'] || '未知学员'}
                    </option>
                  ))}
                </select>
                {errors['关联学员'] && (
                  <p className="mt-1 text-sm text-red-500">{errors['关联学员']}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                作品链接
              </label>
              <input
                type="url"
                value={formData['作品链接'] || ''}
                onChange={(e) => handleInputChange('作品链接', e.target.value)}
                placeholder="请输入作品链接（如百度网盘链接）"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData['是否优秀']}
                  onChange={(e) => handleInputChange('是否优秀', e.target.checked)}
                  className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500 focus:ring-offset-0"
                />
                <Star className={`w-4 h-4 ${formData['是否优秀'] ? 'text-yellow-500 fill-yellow-500' : 'text-gray-400'}`} />
                <span className="text-sm font-medium text-gray-700">标记为优秀作业</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                附件上传
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                }`}
              >
                <Upload className={`w-10 h-10 mx-auto mb-3 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                <p className="text-sm text-gray-600">
                  <span className="text-blue-600 font-medium">点击上传</span> 或拖拽文件到这里
                </p>
                <p className="text-xs text-gray-400 mt-1">支持文件不超过 10MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip,.rar"
                />
              </div>
              
              {formData['作业附件'] && formData['作业附件'].length > 0 && (
                <div className="mt-3 space-y-2">
                  {formData['作业附件'].map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <File className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700 truncate">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {assignment ? '保存' : '创建'}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

export default AssignmentModal;