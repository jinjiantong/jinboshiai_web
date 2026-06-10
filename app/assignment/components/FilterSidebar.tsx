'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

export interface FilterOptions {
  student_id?: string;
  course_id?: string;
  status?: string;
}

interface FilterSidebarProps {
  onFilter: (filters: FilterOptions) => void;
}

interface Option {
  id: string;
  name: string;
}

interface Student {
  record_id: string;
  fields: {
    '学员姓名'?: string;
    '学号'?: string;
  };
}

interface Course {
  record_id: string;
  fields: {
    '课程名称'?: string;
  };
}

export function FilterSidebar({ onFilter }: FilterSidebarProps) {
  const [students, setStudents] = useState<Option[]>([]);
  const [courses, setCourses] = useState<Option[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  const [studentsDropdownOpen, setStudentsDropdownOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);

  useEffect(() => {
    fetchFilterData();
  }, []);

  const fetchFilterData = async () => {
    try {
      setLoading(true);
      
      const [studentsRes, coursesRes] = await Promise.all([
        fetch('/api/student-management/students?force_refresh=true'),
        fetch('/api/student-management/courses?force_refresh=true')
      ]);

      const studentsData = await studentsRes.json();
      const coursesData = await coursesRes.json();

      if (studentsData.code === 0) {
        const studentOptions = (studentsData.data as Student[]).map((student) => ({
          id: student.record_id,
          name: student.fields['学员姓名'] || '未知学员'
        }));
        setStudents(studentOptions);
      }

      if (coursesData.code === 0) {
        const courseOptions = (coursesData.data as Course[]).map((course) => ({
          id: course.record_id,
          name: course.fields['课程名称'] || '未知课程'
        }));
        setCourses(courseOptions);
      }
    } catch (error) {
      console.error('获取筛选数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentToggle = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleCourseToggle = (courseId: string) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleApplyFilters = () => {
    const filters: FilterOptions = {};
    
    if (selectedStudents.length > 0) {
      filters.student_id = selectedStudents.join(',');
    }
    
    if (selectedCourses.length > 0) {
      filters.course_id = selectedCourses.join(',');
    }
    
    if (status) {
      filters.status = status;
    }

    onFilter(filters);
  };

  const handleReset = () => {
    setSelectedStudents([]);
    setSelectedCourses([]);
    setStatus('');
    onFilter({});
  };

  const removeStudent = (studentId: string) => {
    setSelectedStudents(prev => prev.filter(id => id !== studentId));
  };

  const removeCourse = (courseId: string) => {
    setSelectedCourses(prev => prev.filter(id => id !== courseId));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">筛选条件</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">学员筛选</label>
          <div className="relative">
            <button
              onClick={() => setStudentsDropdownOpen(!studentsDropdownOpen)}
              className="w-full px-4 py-2 text-left bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between"
            >
              <span className="text-gray-700">
                {selectedStudents.length === 0 
                  ? '选择学员' 
                  : `已选择 ${selectedStudents.length} 个学员`}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${studentsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {studentsDropdownOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {students.map(student => (
                  <label
                    key={student.id}
                    className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleStudentToggle(student.id)}
                      className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{student.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          
          {selectedStudents.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedStudents.map(studentId => {
                const student = students.find(s => s.id === studentId);
                return student ? (
                  <span
                    key={studentId}
                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {student.name}
                    <button
                      onClick={() => removeStudent(studentId)}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">课程筛选</label>
          <div className="relative">
            <button
              onClick={() => setCoursesDropdownOpen(!coursesDropdownOpen)}
              className="w-full px-4 py-2 text-left bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between"
            >
              <span className="text-gray-700">
                {selectedCourses.length === 0 
                  ? '选择课程' 
                  : `已选择 ${selectedCourses.length} 个课程`}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${coursesDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {coursesDropdownOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {courses.map(course => (
                  <label
                    key={course.id}
                    className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course.id)}
                      onChange={() => handleCourseToggle(course.id)}
                      className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{course.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          
          {selectedCourses.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedCourses.map(courseId => {
                const course = courses.find(c => c.id === courseId);
                return course ? (
                  <span
                    key={courseId}
                    className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {course.name}
                    <button
                      onClick={() => removeCourse(courseId)}
                      className="ml-1 hover:bg-green-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">作业状态</label>
          <div className="space-y-2">
            {[
              { value: '', label: '全部' },
              { value: '已提交', label: '已提交' },
              { value: '未提交', label: '未提交' }
            ].map(option => (
              <label
                key={option.value}
                className="flex items-center px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="status"
                  value={option.value}
                  checked={status === option.value}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mr-3 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-3">
          <button
            onClick={handleApplyFilters}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            筛选
          </button>
          <button
            onClick={handleReset}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            重置
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterSidebar;