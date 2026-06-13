'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, X, Calendar } from 'lucide-react'

export interface FilterOptions {
  student_id?: string
  class_id?: string
  date_from?: string
  date_to?: string
}

interface FilterSidebarProps {
  onFilter: (filters: FilterOptions) => void
}

interface Option {
  id: string
  name: string
  classIds?: string[]
  studentId?: string // 学员ID字段
}

interface Student {
  record_id: string
  fields: {
    '姓名'?: string
    '学员ID'?: string
    '报名班级'?: Array<{ record_ids?: string[]; text?: string }>
  }
}

interface Course {
  record_id: string
  fields: {
    '班级名称'?: string
  }
}

export function FilterSidebar({ onFilter }: FilterSidebarProps) {
  const [students, setStudents] = useState<Option[]>([])
  const [courses, setCourses] = useState<Option[]>([])
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')
  const [loading, setLoading] = useState(true)
  
  const [studentsDropdownOpen, setStudentsDropdownOpen] = useState(false)
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false)

  useEffect(() => {
    fetchFilterData()
  }, [])

  const fetchFilterData = async () => {
    try {
      setLoading(true)
      
      const [studentsRes, coursesRes] = await Promise.all([
        fetch('/api/student-management/students?force_refresh=true'),
        fetch('/api/student-management/courses?force_refresh=true')
      ])

      const studentsData = await studentsRes.json()
      const coursesData = await coursesRes.json()

      if (studentsData.code === 0) {
        const studentOptions = (studentsData.data as Student[]).map((student) => {
          // 提取学员所属的班级ID列表
          let classIds: string[] = []
          const classField = student.fields['报名班级']
          if (classField && Array.isArray(classField)) {
            classField.forEach((c: any) => {
              if (c?.record_ids && Array.isArray(c.record_ids)) {
                classIds.push(...c.record_ids)
              }
            })
          }
          return {
            id: student.record_id,
            name: student.fields['姓名'] || '未知学员',
            classIds,
            studentId: student.fields['学员ID'] || student.record_id
          }
        })
        setStudents(studentOptions)
      }

      if (coursesData.code === 0) {
        const courseOptions = (coursesData.data as Course[]).map((course) => ({
          id: course.record_id,
          name: course.fields['班级名称'] || '未知班级'
        }))
        setCourses(courseOptions)
      }
    } catch (error) {
      console.error('获取筛选数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 根据选中的班级过滤学员
  const filteredStudents = selectedCourse
    ? students.filter(student => 
        student.classIds && student.classIds.includes(selectedCourse)
      )
    : students

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudent(prev => prev === studentId ? '' : studentId)
    setStudentsDropdownOpen(false)
  }

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourse(prev => prev === courseId ? '' : courseId)
    // 选择班级时，清空已选的学员（因为学员列表会变化）
    setSelectedStudent('')
    setCoursesDropdownOpen(false)
  }

  const handleApplyFilters = () => {
    const filters: FilterOptions = {}
    
    if (selectedStudent) {
      // 使用学员ID筛选
      const student = students.find(s => s.id === selectedStudent)
      if (student?.studentId) {
        filters.student_id = student.studentId
      }
    }
    
    if (selectedCourse) {
      filters.class_id = selectedCourse
    }
    
    if (dateFrom) {
      filters.date_from = dateFrom
    }
    
    if (dateTo) {
      filters.date_to = dateTo
    }

    onFilter(filters)
  }

  const handleReset = () => {
    setSelectedStudent('')
    setSelectedCourse('')
    setDateFrom('')
    setDateTo('')
    onFilter({})
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="animate-pulse flex gap-4">
          <div className="h-10 bg-gray-200 rounded w-48"></div>
          <div className="h-10 bg-gray-200 rounded w-48"></div>
          <div className="h-10 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">班级筛选：</span>
          <div className="relative">
            <button
              onClick={() => setCoursesDropdownOpen(!coursesDropdownOpen)}
              className="px-3 py-2 text-left bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm min-w-[120px]"
            >
              <span className="text-gray-700 flex-1 truncate">
                {selectedCourse 
                  ? courses.find(c => c.id === selectedCourse)?.name || '选择班级'
                  : '选择班级'}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${coursesDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {coursesDropdownOpen && (
              <div className="absolute z-20 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                <label
                  className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="course-filter"
                    checked={selectedCourse === ''}
                    onChange={() => handleCourseSelect('')}
                    className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">不限班级</span>
                </label>
                <div className="border-t border-gray-200"></div>
                {courses.map(course => (
                  <label
                    key={course.id}
                    className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="course-filter"
                      checked={selectedCourse === course.id}
                      onChange={() => handleCourseSelect(course.id)}
                      className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{course.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">学员筛选：</span>
          <div className="relative">
            <button
              onClick={() => setStudentsDropdownOpen(!studentsDropdownOpen)}
              className="px-3 py-2 text-left bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-2 text-sm min-w-[120px]"
            >
              <span className="text-gray-700 flex-1 truncate">
                {selectedStudent 
                  ? students.find(s => s.id === selectedStudent)?.name || '选择学员'
                  : selectedCourse ? '选择学员' : '选择学员'}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform flex-shrink-0 ${studentsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {studentsDropdownOpen && (
              <div className="absolute z-20 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                <label
                  className="flex items-center px-4 py-2 hover:bg-blue-50 cursor-pointer bg-blue-50"
                >
                  <input
                    type="radio"
                    name="student-filter"
                    checked={selectedStudent === ''}
                    onChange={() => handleStudentSelect('')}
                    className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">不限学员</span>
                </label>
                <div className="border-t border-gray-200"></div>
                {filteredStudents.length === 0 ? (
                  <div className="px-4 py-2 text-gray-500 text-sm">
                    {selectedCourse ? '该班级暂无学员' : '暂无学员'}
                  </div>
                ) : (
                  filteredStudents.map(student => (
                    <label
                      key={student.id}
                      className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="student-filter"
                        checked={selectedStudent === student.id}
                        onChange={() => handleStudentSelect(student.id)}
                        className="mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{student.name}</span>
                    </label>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4 inline mr-1" />
            日期筛选：
          </span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm w-36"
            placeholder="开始日期"
          />
          <span className="text-gray-400">至</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm w-36"
            placeholder="结束日期"
          />
        </div>

        <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            筛选
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
          >
            重置
          </button>
        </div>
      </div>
    </div>
  )
}

export default FilterSidebar