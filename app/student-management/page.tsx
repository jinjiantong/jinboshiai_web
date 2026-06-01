'use client'

import { useState, useEffect } from 'react'
import {
  Users,
  BookOpen,
  CalendarCheck,
  CreditCard,
  Grid3X3,
  List,
  Plus,
  Search,
  X,
  Edit2,
  Trash2,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  RefreshCw
} from 'lucide-react'
import { ToastProvider, useToast } from '../components/ui/Toast'
import { ModalConfirm } from '../components/ui/ModalConfirm'

type ViewMode = 'table' | 'card'
type ActiveModule = 'students' | 'teachers' | 'courses' | 'attendance' | 'payments'

function extractText(value: any): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    return value.map(item => {
      if (typeof item === 'string') return item
      if (item && typeof item === 'object' && 'text' in item) return item.text
      return String(item)
    }).filter(Boolean).join(', ')
  }
  if (typeof value === 'object' && 'text' in value) return value.text
  return String(value)
}

interface Student {
  record_id: string
  fields: {
    '学员ID'?: number
    '姓名'?: string
    '性别'?: string
    '年龄'?: number
    '联系电话'?: string
    '微信'?: string
    '报名日期'?: string
    '来源渠道'?: string
    '学习状态'?: string
    '学员标签'?: string[]
  }
}

interface Teacher {
  record_id: string
  fields: {
    '老师ID'?: number
    '老师姓名'?: string
    '联系电话'?: string
    '代课班级'?: any[]
    '上课班级ID'?: any
    '管理班级分类'?: string[]
    '上课评价'?: string
  }
}

interface Course {
  record_id: string
  fields: {
    '班级ID'?: number
    '课程名称'?: string
    '课程类型'?: string
    '课程状态'?: string
    '上课形式'?: string
    '上课时段'?: string
    '上课地点'?: string
    '班级名称'?: string
    '开班时间'?: string
    '结课时间'?: string
    '授课老师'?: any[]
  }
}

interface Attendance {
  record_id: string
  fields: {
    '考勤ID'?: number
    '关联学员'?: any[]
    '关联班级'?: any[]
    '上课日期'?: string
    '签到状态'?: string
    '签到方式'?: string
    '请假原因'?: string
  }
}

interface Payment {
  record_id: string
  fields: {
    '缴费ID'?: number
    '关联学员'?: any[]
    '缴费类型'?: string
    '收款方式'?: string
    '缴费金额'?: number
    '应收学费'?: number
    '已缴金额'?: number
    '未缴欠费金额'?: number
    '缴费日期'?: string
  }
}

export default function StudentManagement() {
  const { success, error } = useToast()
  const [activeModule, setActiveModule] = useState<ActiveModule>('students')
  const [viewMode, setViewMode] = useState<ViewMode>('table')
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [pendingDeleteItem, setPendingDeleteItem] = useState<any>(null)
  
  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  useEffect(() => {
    if (
      (activeModule === 'students' && students.length === 0) ||
      (activeModule === 'teachers' && teachers.length === 0) ||
      (activeModule === 'courses' && courses.length === 0) ||
      (activeModule === 'attendance' && attendance.length === 0) ||
      (activeModule === 'payments' && payments.length === 0)
    ) {
      loadData()
    }
  }, [activeModule])

  const loadData = async () => {
    setLoading(true)
    console.log('开始加载数据, activeModule:', activeModule)
    try {
      switch (activeModule) {
        case 'students':
          console.log('加载学员数据')
          try {
            const studentsRes = await fetch('/api/student-management/students?force_refresh=true', {
            })
            if (!studentsRes.ok) throw new Error('学员API响应失败')
            const studentsData = await studentsRes.json()
            console.log('学员数据加载成功:', studentsData.data?.length, '条')
            setStudents(studentsData.data || [])
          } catch (error) {
            console.error('加载学员数据失败:', error)
            setStudents([])
          }
          break
        case 'teachers':
          try {
            const teachersRes = await fetch('/api/student-management/teachers/full', {
              signal: AbortSignal.timeout(15000)
            })
            if (!teachersRes.ok) throw new Error('老师API响应失败')
            const teachersData = await teachersRes.json()
            if (teachersData.code === 0) {
              setTeachers(teachersData.data || [])
            } else {
              throw new Error(teachersData.msg || '获取老师数据失败')
            }
          } catch (error) {
            console.error('加载老师数据失败:', error)
            setTeachers([])
          }
          break
        case 'courses':
          try {
            const coursesRes = await fetch('/api/student-management/courses', {
            })
            if (!coursesRes.ok) throw new Error('班级API响应失败')
            const coursesData = await coursesRes.json()
            setCourses(coursesData.data || [])
          } catch (error) {
            console.error('加载班级数据失败:', error)
            setCourses([])
          }
          break
        case 'attendance':
          try {
            const attendanceRes = await fetch('/api/student-management/attendance', {
            })
            if (!attendanceRes.ok) throw new Error('考勤API响应失败')
            const attendanceData = await attendanceRes.json()
            setAttendance(attendanceData.data || [])
          } catch (error) {
            console.error('加载考勤数据失败:', error)
            setAttendance([])
          }
          break
        case 'payments':
          try {
            const paymentsRes = await fetch('/api/student-management/payments', {
            })
            if (!paymentsRes.ok) throw new Error('缴费API响应失败')
            const paymentsData = await paymentsRes.json()
            setPayments(paymentsData.data || [])
          } catch (error) {
            console.error('加载缴费数据失败:', error)
            setPayments([])
          }
          break
      }
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredData = () => {
    let data: any[] = []
    switch (activeModule) {
      case 'students':
        data = students
        break
      case 'teachers':
        data = teachers
        break
      case 'courses':
        data = courses
        break
      case 'attendance':
        data = attendance
        break
      case 'payments':
        data = payments
        break
    }

    if (!searchQuery) return data

    return data.filter(item => {
      if (activeModule === 'students') {
        return extractText(item.fields['姓名']).includes(searchQuery) ||
               item.fields['联系电话']?.toString().includes(searchQuery)
      }
      if (activeModule === 'teachers') {
        return extractText(item.fields['老师姓名']).includes(searchQuery) ||
               item.fields['联系电话']?.toString().includes(searchQuery)
      }
      if (activeModule === 'courses') {
        return extractText(item.fields['班级分类']).includes(searchQuery) ||
               item.fields['班级ID']?.toString().includes(searchQuery) ||
               extractText(item.fields['授课老师']?.[0]).includes(searchQuery)
      }
      return true
    })
  }

  const filteredData = getFilteredData()
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleAdd = () => {
    setModalMode('add')
    setSelectedItem(null)
    setIsModalOpen(true)
  }

  const handleEdit = (item: any) => {
    setModalMode('edit')
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleDelete = async (item: any) => {
    setPendingDeleteItem(item)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!pendingDeleteItem) return
    
    const item = pendingDeleteItem
    const itemRecordId = item.record_id
    
    setDeleteConfirmOpen(false)
    setPendingDeleteItem(null)
    
    const dataSetters: Record<ActiveModule, React.Dispatch<React.SetStateAction<any[]>>> = {
      students: setStudents,
      teachers: setTeachers,
      courses: setCourses,
      attendance: setAttendance,
      payments: setPayments,
    }
    
    const setter = dataSetters[activeModule]
    
    setLoading(true)
    
    setter((prevData: any[]) => prevData.filter((record: any) => record.record_id !== itemRecordId))
    
    try {
      await fetch(`/api/student-management/${activeModule}?record_id=${itemRecordId}`, {
        method: 'DELETE'
      })
      
      setTimeout(() => {
        loadData()
      }, 300)
    } catch (error) {
      console.error('删除失败:', error)
      loadData()
    }
  }

  const cancelDelete = () => {
    setDeleteConfirmOpen(false)
    setPendingDeleteItem(null)
  }

  const handleSubmit = async (formData: any) => {
    try {
      let url = `/api/student-management/${activeModule}`
      let method = 'POST'
      let body = formData
      
      if (modalMode === 'edit' && selectedItem) {
        url = `/api/student-management/${activeModule}`
        method = 'PUT'
        body = {
          record_id: selectedItem.record_id,
          fields: formData
        }
      }
      
      setLoading(true)
      setIsModalOpen(false)
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      if (response.ok) {
        const result = await response.json()
        
        setTimeout(() => {
          loadData()
        }, 100)
      } else {
        const errorData = await response.json()
        error(errorData.msg || (modalMode === 'add' ? '添加失败' : '更新失败'))
        loadData()
      }
    } catch (err) {
      console.error('提交失败:', err)
      error('提交失败，请重试')
      loadData()
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      '正常上课': 'bg-green-100 text-green-800',
      '请假': 'bg-yellow-100 text-yellow-800',
      '休学': 'bg-gray-100 text-gray-800',
      '结业': 'bg-blue-100 text-blue-800',
      '退学': 'bg-red-100 text-red-800',
      '未开课': 'bg-purple-100 text-purple-800',
      '招生中': 'bg-green-100 text-green-800',
      '上课中': 'bg-blue-100 text-blue-800',
      '已结课': 'bg-gray-100 text-gray-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const renderStudentCard = (student: Student) => (
    <div key={student.record_id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-purple-600 font-bold text-lg">
              {student.fields['姓名']?.[0] || '?'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{extractText(student.fields['姓名']) || '未命名'}</h3>
            <p className="text-sm text-gray-500">ID: {student.fields['学员ID'] || '-'}</p>
          </div>
        </div>
        {student.fields['学习状态'] && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.fields['学习状态'])}`}>
            {student.fields['学习状态']}
          </span>
        )}
      </div>
      
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <p>性别: {student.fields['性别'] || '-'}</p>
        <p>年龄: {student.fields['年龄'] || '-'}</p>
        <p>电话: {student.fields['联系电话'] || '-'}</p>
        {student.fields['学员标签'] && student.fields['学员标签'].length > 0 && (
          <div className="flex flex-wrap gap-1">
            {student.fields['学员标签'].map((tag, index) => (
              <span key={index} className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={() => handleEdit(student)}
          className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1 text-sm"
        >
          <Edit2 className="w-4 h-4" />
          编辑
        </button>
        <button 
          onClick={() => handleDelete(student)}
          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )

  const renderTeacherCard = (teacher: Teacher) => (
    <div key={teacher.record_id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{extractText(teacher.fields['老师姓名']) || '未命名'}</h3>
            <p className="text-sm text-gray-500">ID: {teacher.fields['老师ID'] || '-'}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <p>电话: {teacher.fields['联系电话'] || '-'}</p>
        {teacher.fields['上课班级ID']?.[0]?.record_ids?.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-1">管理班级:</p>
            <div className="flex flex-wrap gap-1">
              {teacher.fields['上课班级ID'][0].record_ids.map((recordId: string, index: number) => (
                <span key={index} className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-xs">
                  {teacher.fields['管理班级分类']?.[index] || teacher.fields['上课班级ID'][0].text_arr[index] || recordId}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={() => handleEdit(teacher)}
          className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1 text-sm"
        >
          <Edit2 className="w-4 h-4" />
          编辑
        </button>
        <button 
          onClick={() => handleDelete(teacher)}
          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )

  const renderCourseCard = (course: Course) => (
    <div key={course.record_id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-800">{course.fields['班级名称'] || '未命名班级'}</h3>
          <p className="text-sm text-gray-500">ID: {course.fields['班级ID'] || '-'}</p>
        </div>
        {course.fields['课程状态'] && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.fields['课程状态'])}`}>
            {course.fields['课程状态']}
          </span>
        )}
      </div>
      
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <p>课程: {course.fields['课程名称'] || '-'}</p>
        <p>类型: {course.fields['课程类型'] || '-'}</p>
        <p>形式: {course.fields['上课形式'] || '-'}</p>
        <p>时段: {course.fields['上课时段'] || '-'}</p>
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={() => handleEdit(course)}
          className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-1 text-sm"
        >
          <Edit2 className="w-4 h-4" />
          编辑
        </button>
        <button 
          onClick={() => handleDelete(course)}
          className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">师生管理系统</h1>
            
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => { setActiveModule('students'); setCurrentPage(1) }}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeModule === 'students' 
                    ? 'bg-white shadow text-purple-600' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Users className="w-4 h-4" />
                学员档案
              </button>
              <button
                onClick={() => { setActiveModule('teachers'); setCurrentPage(1) }}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeModule === 'teachers' 
                    ? 'bg-white shadow text-purple-600' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                老师档案
              </button>
              <button
                onClick={() => { setActiveModule('courses'); setCurrentPage(1) }}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeModule === 'courses' 
                    ? 'bg-white shadow text-purple-600' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                班级档案
              </button>
              <button
                onClick={() => { setActiveModule('attendance'); setCurrentPage(1) }}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeModule === 'attendance' 
                    ? 'bg-white shadow text-purple-600' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <CalendarCheck className="w-4 h-4" />
                考勤管理
              </button>
              <button
                onClick={() => { setActiveModule('payments'); setCurrentPage(1) }}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                  activeModule === 'payments' 
                    ? 'bg-white shadow text-purple-600' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                缴费管理
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'table' ? 'bg-white shadow text-purple-600' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('card')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'card' ? 'bg-white shadow text-purple-600' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                添加
              </button>

              <button
                onClick={() => loadData()}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">刷新</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        {loading && paginatedData.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-4" />
            <span className="text-gray-600">正在加载数据...</span>
          </div>
        ) : paginatedData.length === 0 && !loading ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">暂无数据</p>
            <button
              onClick={handleAdd}
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              添加第一条数据
            </button>
          </div>
        ) : (
          <div className="relative">
            {loading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
                <div className="bg-white shadow-lg rounded-lg px-6 py-4 flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                  <span className="text-gray-700 font-medium">数据刷新中...</span>
                </div>
              </div>
            )}
            {viewMode === 'table' ? (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        {activeModule === 'students' && (
                          <>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">学员ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">性别</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">年龄</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">联系电话</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">学习状态</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                          </>
                        )}
                    {activeModule === 'teachers' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">老师ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">联系电话</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">管理班级</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                      </>
                    )}
                    {activeModule === 'courses' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">班级ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">班级名称</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">授课老师</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">班级状态</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">上课时间</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                      </>
                    )}
                    {activeModule === 'attendance' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">考勤ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">学员</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">上课日期</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">签到状态</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                      </>
                    )}
                    {activeModule === 'payments' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">缴费ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">学员</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">缴费金额</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">缴费类型</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedData.map((item: any) => (
                    <tr key={item.record_id} className="hover:bg-gray-50">
                      {activeModule === 'students' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.fields['学员ID'] || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{extractText(item.fields['姓名']) || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.fields['性别'] || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.fields['年龄'] || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.fields['联系电话'] || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.fields['学习状态'] && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.fields['学习状态'])}`}>
                                {item.fields['学习状态']}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-2">
                              <button className="text-blue-600 hover:text-blue-800">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(item)} className="text-red-600 hover:text-red-800">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                      {activeModule === 'teachers' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.fields['老师ID'] || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{extractText(item.fields['老师姓名']) || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.fields['联系电话'] || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.fields['上课班级ID']?.[0]?.record_ids?.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {item.fields['上课班级ID'][0].record_ids.map((recordId: string, index: number) => (
                                  <span key={index} className="px-2 py-0.5 bg-green-50 text-green-600 rounded text-xs">
                                    {item.fields['管理班级分类']?.[index] || item.fields['上课班级ID'][0].text_arr[index] || recordId}
                                  </span>
                                ))}
                              </div>
                            ) : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(item)} className="text-red-600 hover:text-red-800">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                      {activeModule === 'courses' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.fields['班级ID'] || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{extractText(item.fields['班级分类']) || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{extractText(item.fields['授课老师']?.[0]) || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.fields['班级状态'] && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.fields['班级状态'])}`}>
                                {item.fields['班级状态']}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{extractText(item.fields['上课时间段']) || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(item)} className="text-red-600 hover:text-red-800">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                      {activeModule === 'attendance' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.fields['考勤ID'] || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {item.fields['关联学员']?.[0]?.name || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.fields['上课日期'] || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.fields['签到状态'] && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.fields['签到状态'])}`}>
                                {item.fields['签到状态']}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(item)} className="text-red-600 hover:text-red-800">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                      {activeModule === 'payments' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.fields['缴费ID'] || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {item.fields['关联学员']?.[0]?.name || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ¥{item.fields['缴费金额']?.toLocaleString() || '0'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.fields['缴费类型'] || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(item)} className="text-red-600 hover:text-red-800">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeModule === 'students' && paginatedData.map((student) => renderStudentCard(student))}
            {activeModule === 'teachers' && paginatedData.map((teacher) => renderTeacherCard(teacher))}
            {activeModule === 'courses' && paginatedData.map((course) => renderCourseCard(course))}
            {activeModule === 'attendance' && paginatedData.map((item) => (
              <div key={item.record_id} className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-gray-800 mb-2">考勤 #{item.fields['考勤ID'] || '-'}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  学员: {item.fields['关联学员']?.[0]?.name || '-'}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                    编辑
                  </button>
                  <button onClick={() => handleDelete(item)} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {activeModule === 'payments' && paginatedData.map((item) => (
              <div key={item.record_id} className="bg-white rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-gray-800 mb-2">缴费 #{item.fields['缴费ID'] || '-'}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  学员: {item.fields['关联学员']?.[0]?.name || '-'}
                </p>
                <p className="text-lg font-bold text-purple-600 mb-2">
                  ¥{item.fields['缴费金额']?.toLocaleString() || '0'}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                    编辑
                  </button>
                  <button onClick={() => handleDelete(item)} className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white shadow hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-gray-600">
              第 {currentPage} / {totalPages} 页
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white shadow hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <FormModal
          mode={modalMode}
          module={activeModule}
          data={selectedItem}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}

      <ModalConfirm
        isOpen={deleteConfirmOpen}
        title="确认删除"
        message={`确定要删除这条记录吗？此操作无法撤销。`}
        confirmText="删除"
        cancelText="取消"
        type="danger"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  )
}

interface FormModalProps {
  mode: 'add' | 'edit'
  module: ActiveModule
  data: any
  onClose: () => void
  onSubmit: (data: any) => void
}

function FormModal({ mode, module, data, onClose, onSubmit }: FormModalProps) {
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    if (mode === 'edit' && data) {
      setFormData(data.fields || {})
    } else {
      setFormData({})
    }
  }, [mode, data])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  const renderFields = () => {
    switch (module) {
      case 'students':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
                <input
                  type="text"
                  value={formData['姓名'] || ''}
                  onChange={(e) => handleChange('姓名', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">性别</label>
                <select
                  value={formData['性别'] || ''}
                  onChange={(e) => handleChange('性别', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">请选择</option>
                  <option value="男">男</option>
                  <option value="女">女</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">年龄</label>
                <input
                  type="number"
                  value={formData['年龄'] || ''}
                  onChange={(e) => handleChange('年龄', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                <input
                  type="text"
                  value={formData['联系电话'] || ''}
                  onChange={(e) => handleChange('联系电话', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">微信</label>
              <input
                type="text"
                value={formData['微信'] || ''}
                onChange={(e) => handleChange('微信', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">学习状态</label>
              <select
                value={formData['学习状态'] || ''}
                onChange={(e) => handleChange('学习状态', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">请选择</option>
                <option value="未开课">未开课</option>
                <option value="正常上课">正常上课</option>
                <option value="请假">请假</option>
                <option value="休学">休学</option>
                <option value="结业">结业</option>
                <option value="退学">退学</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">来源渠道</label>
              <select
                value={formData['来源渠道'] || ''}
                onChange={(e) => handleChange('来源渠道', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">请选择</option>
                <option value="转介绍">转介绍</option>
                <option value="线上广告">线上广告</option>
                <option value="线下活动">线下活动</option>
                <option value="其他">其他</option>
              </select>
            </div>
          </>
        )

      case 'teachers':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">老师姓名 *</label>
              <input
                type="text"
                value={formData['老师姓名'] || ''}
                onChange={(e) => handleChange('老师姓名', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
              <input
                type="text"
                value={formData['联系电话'] || ''}
                onChange={(e) => handleChange('联系电话', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">管理班级</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  { id: 'recLjRacVHANPC', name: '周三班' },
                  { id: 'recuCHEqC91pUa', name: '周末班' },
                  { id: 'reccqx3BQXZ4hy', name: '晚班' },
                  { id: 'recd6OtFuKnY6a', name: '进阶班' },
                  { id: 'recTybKI4K7zRa', name: '周四班' }
                ].map((cls) => {
                  const selectedIds = formData['上课班级ID']?.[0]?.record_ids || []
                  const isSelected = selectedIds.includes(cls.id)
                  return (
                    <button
                      key={cls.id}
                      type="button"
                      onClick={async () => {
                        let newIds = [...selectedIds]
                        if (isSelected) {
                          newIds = newIds.filter((id: string) => id !== cls.id)
                        } else {
                          newIds.push(cls.id)
                        }
                        
                        const classData = newIds.length > 0 ? [{
                          record_ids: newIds,
                          table_id: 'tblDDKeft6iLlGAx',
                          text: newIds.join(','),
                          text_arr: newIds,
                          type: 'text'
                        }] : []
                        
                        handleChange('上课班级ID', classData)
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cls.name}
                    </button>
                  )
                })}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">上课评价</label>
              <textarea
                value={formData['上课评价'] || ''}
                onChange={(e) => handleChange('上课评价', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </>
        )

      case 'courses':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">班级名称 *</label>
              <input
                type="text"
                value={formData['班级名称'] || ''}
                onChange={(e) => handleChange('班级名称', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">课程名称</label>
                <select
                  value={formData['课程名称'] || ''}
                  onChange={(e) => handleChange('课程名称', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">请选择</option>
                  <option value="AI提示词">AI提示词</option>
                  <option value="AI绘图">AI绘图</option>
                  <option value="短视频剪辑">短视频剪辑</option>
                  <option value="办公AI">办公AI</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">课程状态</label>
                <select
                  value={formData['课程状态'] || ''}
                  onChange={(e) => handleChange('课程状态', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">请选择</option>
                  <option value="招生中">招生中</option>
                  <option value="上课中">上课中</option>
                  <option value="已结课">已结课</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">上课形式</label>
                <select
                  value={formData['上课形式'] || ''}
                  onChange={(e) => handleChange('上课形式', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">请选择</option>
                  <option value="线上">线上</option>
                  <option value="线下">线下</option>
                  <option value="直播">直播</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">上课时段</label>
                <input
                  type="text"
                  value={formData['上课时段'] || ''}
                  onChange={(e) => handleChange('上课时段', e.target.value)}
                  placeholder="如: 每周六 14:00-16:00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
          </>
        )

      case 'attendance':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">上课日期</label>
                <input
                  type="date"
                  value={formData['上课日期']?.split('T')[0] || ''}
                  onChange={(e) => handleChange('上课日期', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">签到状态</label>
                <select
                  value={formData['签到状态'] || ''}
                  onChange={(e) => handleChange('签到状态', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">请选择</option>
                  <option value="正常出勤">正常出勤</option>
                  <option value="迟到">迟到</option>
                  <option value="早退">早退</option>
                  <option value="请假">请假</option>
                  <option value="旷课">旷课</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">请假原因</label>
              <textarea
                value={formData['请假原因'] || ''}
                onChange={(e) => handleChange('请假原因', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </>
        )

      case 'payments':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">缴费金额</label>
                <input
                  type="number"
                  value={formData['缴费金额'] || ''}
                  onChange={(e) => handleChange('缴费金额', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">应收学费</label>
                <input
                  type="number"
                  value={formData['应收学费'] || ''}
                  onChange={(e) => handleChange('应收学费', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">缴费类型</label>
                <select
                  value={formData['缴费类型'] || ''}
                  onChange={(e) => handleChange('缴费类型', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">请选择</option>
                  <option value="定金">定金</option>
                  <option value="全款">全款</option>
                  <option value="分期">分期</option>
                  <option value="补考费">补考费</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">收款方式</label>
                <select
                  value={formData['收款方式'] || ''}
                  onChange={(e) => handleChange('收款方式', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">请选择</option>
                  <option value="微信">微信</option>
                  <option value="支付宝">支付宝</option>
                  <option value="现金">现金</option>
                  <option value="其他">其他</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">缴费日期</label>
              <input
                type="date"
                value={formData['缴费日期']?.split('T')[0] || ''}
                onChange={(e) => handleChange('缴费日期', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </>
        )
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {mode === 'add' ? '添加' : '编辑'}
            {module === 'students' && '学员'}
            {module === 'teachers' && '老师'}
            {module === 'courses' && '班级'}
            {module === 'attendance' && '考勤记录'}
            {module === 'payments' && '缴费记录'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {renderFields()}
          
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {mode === 'add' ? '添加' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}