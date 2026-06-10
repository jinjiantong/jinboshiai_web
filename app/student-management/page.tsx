'use client'

import { useState, useEffect } from 'react'
import {
  Users,
  BookOpen,
  CalendarCheck,
  Plus,
  Search,
  X,
  Edit2,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  RefreshCw,
  ClipboardList
} from 'lucide-react'
import { ToastProvider, useToast } from '../components/ui/Toast'
import { ModalConfirm } from '../components/ui/ModalConfirm'

type ActiveModule = 'students' | 'teachers' | 'courses' | 'attendance'

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
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'addCourseHours'>('add')
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [pendingDeleteItem, setPendingDeleteItem] = useState<any>(null)
  
  const [students, setStudents] = useState<Student[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  
  const [courseRelations, setCourseRelations] = useState<Record<string, {
    teacherName: string;
    studentCount: number;
  }>>({})
  
  const [studentRelations, setStudentRelations] = useState<Record<string, {
    className: string;
    teacherName: string;
    paymentAmount: number;
    totalHours: number;
    remainingHours: number;
  }>>({})
  
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  
  const [filterTeacher, setFilterTeacher] = useState('')
  const [filterClass, setFilterClass] = useState('')
  
  useEffect(() => {
    if (activeModule === 'students') {
      if (students.length === 0) {
        loadData()
      }
      if (teachers.length === 0) {
        loadTeachersAndCourses()
      }
    } else if (activeModule === 'courses' || activeModule === 'teachers') {
      loadData()
    }
  }, [activeModule])
  
  const loadTeachersAndCourses = async () => {
    try {
      const [teachersRes, coursesRes] = await Promise.all([
        fetch('/api/student-management/teachers?force_refresh=true'),
        fetch('/api/student-management/courses?force_refresh=true')
      ])
      
      if (teachersRes.ok) {
        const teachersData = await teachersRes.json()
        setTeachers(teachersData.data || [])
      }
      
      if (coursesRes.ok) {
        const coursesData = await coursesRes.json()
        setCourses(coursesData.data || [])
      }
    } catch (err) {
      console.error('加载老师和班级数据失败:', err)
    }
  }
  
  const loadData = async () => {
    setLoading(true)
    try {
      switch (activeModule) {
        case 'students':
          try {
            const studentsRes = await fetch('/api/student-management/students?force_refresh=true', {
            })
            if (!studentsRes.ok) throw new Error('学员API响应失败')
            const studentsData = await studentsRes.json()
            setStudents(studentsData.data || [])
            
            let teachersList: any[] = []
            let coursesList: any[] = []
            
            const classMap = new Map<string, string>()
            const teacherMap = new Map<string, string>()
            const paymentMap = new Map<string, number>()
            const courseHoursMap = new Map<string, { total: number; remaining: number }>()
            
            try {
              const [coursesRes, teachersRes, paymentsRes, courseHoursRes] = await Promise.all([
                fetch('/api/student-management/courses?force_refresh=true'),
                fetch('/api/student-management/teachers?force_refresh=true'),
                fetch('/api/student-management/payments?force_refresh=true'),
                fetch('/api/student-management/student-course-hours?force_refresh=true')
              ])
              
              if (coursesRes.ok) {
                const coursesData = await coursesRes.json()
                coursesList = coursesData.data || []
                coursesData.data?.forEach((course: any) => {
                  classMap.set(course.record_id, course.fields['班级名称'] || '未知')
                })
              }
              
              if (teachersRes.ok) {
                const teachersData = await teachersRes.json()
                teachersList = teachersData.data || []
                teachersData.data?.forEach((teacher: any) => {
                  teacherMap.set(teacher.record_id, teacher.fields['老师姓名'] || teacher.fields['姓名'] || '未知')
                })
              }
              
              if (paymentsRes.ok) {
                const paymentsData = await paymentsRes.json()
                paymentsData.data?.forEach((payment: any) => {
                  const recordId = payment.fields['关联学员']?.[0]?.record_ids?.[0]
                  if (recordId) {
                    const existing = paymentMap.get(recordId) || 0
                    const amount = parseFloat(String(payment.fields['已缴金额'] || payment.fields['缴费金额'] || 0)) || 0
                    paymentMap.set(recordId, existing + amount)
                  }
                })
              }
              
              if (courseHoursRes.ok) {
                const courseHoursData = await courseHoursRes.json()
                courseHoursData.data?.forEach((record: any) => {
                  record.fields['关联学员']?.[0]?.record_ids?.forEach((studentId: string) => {
                    const totalHours = parseFloat(record.fields['总课时']) || 0
                    const remainingHours = parseFloat(record.fields['剩余课时']) || 0
                    const existing = courseHoursMap.get(studentId) || { total: 0, remaining: 0 }
                    courseHoursMap.set(studentId, {
                      total: existing.total + totalHours,
                      remaining: existing.remaining + remainingHours
                    })
                  })
                })
              }
            } catch (err) {
              console.error('加载关联数据失败:', err)
            }
            
            const relations: Record<string, { className: string; teacherName: string; paymentAmount: number; totalHours: number; remainingHours: number }> = {}
            
            ;(studentsData.data || []).forEach((student: any) => {
              const classIds = student.fields['报名班级']?.[0]?.record_ids || []
              const teacherIds = student.fields['授课老师']?.[0]?.record_ids || []
              const studentId = student.record_id
              
              const classNames = classIds.map((id: string) => classMap.get(id)).filter(Boolean)
              const teacherNames = teacherIds.map((id: string) => teacherMap.get(id)).filter(Boolean)
              const courseHours = courseHoursMap.get(studentId) || { total: 0, remaining: 0 }
              
              relations[studentId] = {
                className: classNames.length > 0 ? classNames.join(', ') : '-',
                teacherName: teacherNames.length > 0 ? teacherNames.join(', ') : '-',
                paymentAmount: paymentMap.get(studentId) || 0,
                totalHours: courseHours.total,
                remainingHours: courseHours.remaining
              }
            })
            
            setStudentRelations(relations)
            setTeachers(teachersList)
            setCourses(coursesList)
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
            const coursesRes = await fetch('/api/student-management/courses?force_refresh=true', {
            })
            if (!coursesRes.ok) throw new Error('班级API响应失败')
            const coursesData = await coursesRes.json()
            const coursesList = coursesData.data || []
            setCourses(coursesList)
            
            const teacherMap = new Map<string, string>()
            
            try {
              const teacherRes = await fetch('/api/student-management/teachers?force_refresh=true')
              if (teacherRes.ok) {
                const teacherData = await teacherRes.json()
                teacherData.data?.forEach((teacher: any) => {
                  teacherMap.set(teacher.record_id, teacher.fields['老师姓名'] || teacher.fields['姓名'] || '未知')
                })
              }
            } catch (err) {
              console.error('加载老师信息失败:', err)
            }
            
            const relations: Record<string, { teacherName: string; studentCount: number }> = {}
            
            coursesList.forEach((course: any) => {
              const teacherField = course.fields['授课老师']
              let teacherIds: string[] = []
              if (Array.isArray(teacherField)) {
                if (teacherField.length > 0 && typeof teacherField[0] === 'string') {
                  teacherIds = teacherField
                } else if (teacherField[0]?.record_ids) {
                  teacherIds = teacherField[0].record_ids
                }
              }
              const teacherNames = teacherIds.map((id: string) => teacherMap.get(id)).filter(Boolean)
              const studentField = course.fields['关联学员']?.[0]
              const studentCount = studentField?.text_arr?.length || 
                                   course.fields['关联学员列表']?.[0]?.text_arr?.length || 0
              
              relations[course.record_id] = {
                teacherName: teacherNames.length > 0 ? teacherNames.join(', ') : '-',
                studentCount
              }
            })
            
            setCourseRelations(relations)
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
    }

    if (!searchQuery && !filterTeacher && !filterClass) return data

    return data.filter(item => {
      if (activeModule === 'students') {
        const matchesSearch = !searchQuery || 
          extractText(item.fields['姓名']).includes(searchQuery) ||
          item.fields['联系电话']?.toString().includes(searchQuery)
        
        const teacherIds = item.fields['授课老师']?.[0]?.record_ids || []
        const classIds = item.fields['报名班级']?.[0]?.record_ids || []
        const matchesTeacher = !filterTeacher || teacherIds.includes(filterTeacher)
        const matchesClass = !filterClass || classIds.includes(filterClass)
        
        return matchesSearch && matchesTeacher && matchesClass
      }
      if (activeModule === 'teachers') {
        return extractText(item.fields['老师姓名']).includes(searchQuery) ||
               item.fields['联系电话']?.toString().includes(searchQuery)
      }
      if (activeModule === 'courses') {
        return extractText(item.fields['班级名称']).includes(searchQuery) ||
               item.fields['班级ID']?.toString().includes(searchQuery) ||
               extractText(item.fields['授课老师']?.[0]).includes(searchQuery)
      }
      return true
    })
  }

  const filteredData = getFilteredData()
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleAdd = (type?: 'normal' | 'courseHours') => {
    if (activeModule === 'students' && type === 'courseHours') {
      setModalMode('addCourseHours')
    } else {
      setModalMode('add')
    }
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
    }
    
    const setter = dataSetters[activeModule]
    
    setLoading(true)
    
    setter((prevData: any[]) => prevData.filter((record: any) => record.record_id !== itemRecordId))
    
    try {
      if (activeModule === 'courses') {
        const teachersRes = await fetch('/api/student-management/teachers?force_refresh=true')
        if (teachersRes.ok) {
          const teachersData = await teachersRes.json()
          for (const teacher of teachersData.data || []) {
            const classField = teacher.fields['上课班级ID']
            let classIds: string[] = []
            if (Array.isArray(classField)) {
              if (classField.length > 0 && typeof classField[0] === 'string') {
                classIds = classField
              } else if (classField[0]?.record_ids) {
                classIds = classField[0].record_ids
              }
            }
            if (classIds.includes(itemRecordId)) {
              const newClassIds = classIds.filter((id: string) => id !== itemRecordId)
              await fetch(`/api/student-management/teachers/${teacher.record_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  recordId: teacher.record_id,
                  fields: { '上课班级ID': newClassIds.length > 0 ? newClassIds : [] }
                })
              })
            }
          }
        }
      }
      
      if (activeModule === 'teachers') {
        const coursesRes = await fetch('/api/student-management/courses?force_refresh=true')
        if (coursesRes.ok) {
          const coursesData = await coursesRes.json()
          for (const course of coursesData.data || []) {
            const teacherField = course.fields['授课老师']
            let teacherIds: string[] = []
            if (Array.isArray(teacherField)) {
              if (teacherField.length > 0 && typeof teacherField[0] === 'string') {
                teacherIds = teacherField
              } else if (teacherField[0]?.record_ids) {
                teacherIds = teacherField[0].record_ids
              }
            }
            if (teacherIds.includes(itemRecordId)) {
              const newTeacherIds = teacherIds.filter((id: string) => id !== itemRecordId)
              await fetch(`/api/student-management/courses/${course.record_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  recordId: course.record_id,
                  fields: { '授课老师': newTeacherIds.length > 0 ? newTeacherIds : [] }
                })
              })
            }
          }
        }
      }
      
      await fetch(`/api/student-management/${activeModule}/${itemRecordId}`, {
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
      if (modalMode === 'addCourseHours') {
        setLoading(true)
        setIsModalOpen(false)
        
        const studentId = formData.studentId
        const totalHours = formData.totalHours || 0
        const courseHoursName = formData.courseHoursName || ''
        const paymentAmount = formData.paymentAmount || 0
        
        const [courseHoursRes, paymentRes] = await Promise.all([
          fetch('/api/student-management/student-course-hours', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fields: {
                '课时名称': courseHoursName,
                '总课时': totalHours,
                '剩余课时': totalHours,
                '关联学员': [studentId]
              }
            })
          }),
          fetch('/api/student-management/payments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fields: {
                '已缴金额': paymentAmount,
                '缴费金额': paymentAmount,
                '缴费日期': new Date().toISOString().split('T')[0],
                '关联学员': [studentId]
              }
            })
          })
        ])
        
        if (courseHoursRes.ok && paymentRes.ok) {
          success('课时缴费添加成功')
        } else {
          const errorData = await Promise.all([courseHoursRes.json(), paymentRes.json()])
          error('部分数据添加失败')
        }
        
        loadData()
        return
      }
      
      let url = `/api/student-management/${activeModule}`
      let method = 'POST'
      let body = formData
      
      if (modalMode === 'edit' && selectedItem) {
        url = `/api/student-management/${activeModule}`
        method = 'PUT'
        body = {
          recordId: selectedItem.record_id,
          fields: formData
        }
      }
      
      if (activeModule === 'courses') {
        const teacherField = formData['授课老师']
        let hasTeacher = false
        if (Array.isArray(teacherField)) {
          if (teacherField.length > 0 && (typeof teacherField[0] === 'string' || teacherField[0]?.record_ids?.length > 0)) {
            hasTeacher = true
          }
        } else if (typeof teacherField === 'string' && teacherField) {
          hasTeacher = true
        }
        
        if (!hasTeacher) {
          setLoading(false)
          setIsModalOpen(false)
          error('请选择授课老师')
          return
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
        
        if (activeModule === 'teachers') {
          const manageClassField = formData['上课班级ID']
          const teacherRecordId = modalMode === 'edit' && selectedItem ? selectedItem.record_id : result.data?.record_id
          
          if (modalMode === 'edit' && selectedItem) {
            const oldClassField = selectedItem.fields['上课班级ID']
            let oldClassIds: string[] = []
            if (Array.isArray(oldClassField)) {
              if (oldClassField.length > 0 && typeof oldClassField[0] === 'string') {
                oldClassIds = oldClassField
              } else if (oldClassField[0]?.record_ids) {
                oldClassIds = oldClassField[0].record_ids
              }
            }
            
            let newClassIds: string[] = []
            if (manageClassField && Array.isArray(manageClassField) && manageClassField.length > 0) {
              newClassIds = manageClassField.map((item: any) => typeof item === 'string' ? item : item?.record_ids?.[0]).filter(Boolean)
            }
            
            const removedClassIds = oldClassIds.filter((id: string) => !newClassIds.includes(id))
            for (const classId of removedClassIds) {
              try {
                const courseRes = await fetch(`/api/student-management/courses/${classId}`)
                if (courseRes.ok) {
                  const courseData = await courseRes.json()
                  const courseRecord = courseData.data?.record || courseData.data
                  const existingTeachers = courseRecord?.fields?.['授课老师'] || []
                  let teacherIds: string[] = []
                  if (Array.isArray(existingTeachers)) {
                    teacherIds = existingTeachers.flatMap((t: any) => t.record_ids || (typeof t === 'string' ? [t] : []))
                  }
                  const newTeacherIds = teacherIds.filter((id: string) => id !== teacherRecordId)
                  await fetch(`/api/student-management/courses/${classId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      recordId: classId,
                      fields: { '授课老师': newTeacherIds }
                    })
                  })
                }
              } catch (e) {
                console.error('清除班级授课老师失败:', e)
              }
            }
          }
          
          if (manageClassField && Array.isArray(manageClassField) && manageClassField.length > 0 && teacherRecordId) {
            for (const classItem of manageClassField) {
              const classId = typeof classItem === 'string' ? classItem : classItem?.record_ids?.[0]
              if (classId && typeof classId === 'string') {
                try {
                  const courseRes = await fetch(`/api/student-management/courses/${classId}`)
                  if (courseRes.ok) {
                    const courseData = await courseRes.json()
                    const courseRecord = courseData.data?.record || courseData.data
                    const existingTeachers = courseRecord?.fields?.['授课老师'] || []
                    let existingIds: string[] = []
                    if (Array.isArray(existingTeachers)) {
                      existingIds = existingTeachers.flatMap((t: any) => t.record_ids || (typeof t === 'string' ? [t] : []))
                    } else if (typeof existingTeachers === 'string') {
                      existingIds = [existingTeachers]
                    }
                    if (!existingIds.includes(teacherRecordId)) {
                      await fetch(`/api/student-management/courses/${classId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          recordId: classId,
                          fields: {
                            '授课老师': [...existingIds, teacherRecordId]
                          }
                        })
                      })
                    }
                  }
                } catch (syncErr) {
                  console.error('同步班级授课老师失败:', syncErr)
                }
              }
            }
          }
        }
        
        if (activeModule === 'courses') {
          const courseRecordId = modalMode === 'edit' && selectedItem ? selectedItem.record_id : result.data?.record_id
          const teacherField = formData['授课老师']
          let newTeacherIds: string[] = []
          if (Array.isArray(teacherField)) {
            if (teacherField.length > 0 && typeof teacherField[0] === 'string') {
              newTeacherIds = teacherField
            } else if (teacherField[0]?.record_ids) {
              newTeacherIds = teacherField[0].record_ids
            }
          }
          
          if (modalMode === 'edit' && selectedItem) {
            const oldTeacherField = selectedItem.fields['授课老师']
            let oldTeacherIds: string[] = []
            if (Array.isArray(oldTeacherField)) {
              if (oldTeacherField.length > 0 && typeof oldTeacherField[0] === 'string') {
                oldTeacherIds = oldTeacherField
              } else if (oldTeacherField[0]?.record_ids) {
                oldTeacherIds = oldTeacherField[0].record_ids
              }
            }
            
            const removedTeacherIds = oldTeacherIds.filter((id: string) => !newTeacherIds.includes(id))
            for (const teacherId of removedTeacherIds) {
              try {
                const teacherRes = await fetch(`/api/student-management/teachers/${teacherId}`)
                if (teacherRes.ok) {
                  const teacherData = await teacherRes.json()
                  const teacherRecord = teacherData.data?.record || teacherData.data
                  const existingClasses = teacherRecord?.fields?.['上课班级ID'] || []
                  let classIds: string[] = []
                  if (Array.isArray(existingClasses)) {
                    classIds = existingClasses.flatMap((c: any) => c.record_ids || (typeof c === 'string' ? [c] : []))
                  }
                  const newClassIds = classIds.filter((id: string) => id !== courseRecordId)
                  await fetch(`/api/student-management/teachers/${teacherId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      recordId: teacherId,
                      fields: { '上课班级ID': newClassIds }
                    })
                  })
                }
              } catch (e) {
                console.error('清除老师上课班级失败:', e)
              }
            }
          }
          
          for (const teacherId of newTeacherIds) {
            try {
              const teacherRes = await fetch(`/api/student-management/teachers/${teacherId}`)
              if (teacherRes.ok) {
                const teacherData = await teacherRes.json()
                const teacherRecord = teacherData.data?.record || teacherData.data
                const existingClasses = teacherRecord?.fields?.['上课班级ID'] || []
                let classIds: string[] = []
                if (Array.isArray(existingClasses)) {
                  classIds = existingClasses.flatMap((c: any) => c.record_ids || (typeof c === 'string' ? [c] : []))
                }
                if (!classIds.includes(courseRecordId)) {
                  await fetch(`/api/student-management/teachers/${teacherId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      recordId: teacherId,
                      fields: { '上课班级ID': [...classIds, courseRecordId] }
                    })
                  })
                }
              }
            } catch (e) {
              console.error('同步老师上课班级失败:', e)
            }
          }
        }
        
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
              
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 flex gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索姓名或电话..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                />
              </div>
              
              {activeModule === 'students' && (
                <select
                  value={filterTeacher}
                  onChange={(e) => { setFilterTeacher(e.target.value); setCurrentPage(1) }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                >
                  <option value="">按老师筛选</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.record_id} value={teacher.record_id}>
                      {teacher.fields?.['老师姓名'] || '未知'}
                    </option>
                  ))}
                </select>
              )}
              
              {activeModule === 'students' && (
                <select
                  value={filterClass}
                  onChange={(e) => { setFilterClass(e.target.value); setCurrentPage(1) }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                >
                  <option value="">按班级筛选</option>
                  {courses.map((course) => (
                    <option key={course.record_id} value={course.record_id}>
                      {course.fields?.['班级名称'] || '未知'}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                {activeModule === 'students' ? '添加学员' : '添加'}
              </button>

              {activeModule === 'students' && (
                <button
                  onClick={() => handleAdd('courseHours')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  添加课时
                </button>
              )}

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
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        {activeModule === 'students' && (
                          <>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">联系电话</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">班级名称</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">授课老师</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">总课时</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">剩余课时</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">缴费记录</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">学习状态</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                          </>
                        )}
                    {activeModule === 'teachers' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">联系电话</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">管理班级</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                      </>
                    )}
                    {activeModule === 'courses' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">班级名称</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">上课时间</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">开班日期</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">结课日期</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">学员数量</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">授课老师</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">总课时</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">剩余课时</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">是否结课</th>
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
                    
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedData.map((item: any) => (
                    <tr key={item.record_id} className="hover:bg-gray-50">
                      {activeModule === 'students' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{extractText(item.fields['姓名']) || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.fields['联系电话'] || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {studentRelations[item.record_id]?.className || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {studentRelations[item.record_id]?.teacherName || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {studentRelations[item.record_id]?.totalHours || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {studentRelations[item.record_id]?.remainingHours || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {studentRelations[item.record_id]?.paymentAmount 
                              ? `¥${studentRelations[item.record_id].paymentAmount.toLocaleString()}` 
                              : '未缴费'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.fields['学习状态'] && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.fields['学习状态'])}`}>
                                {item.fields['学习状态']}
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
                      {activeModule === 'teachers' && (
                        <>
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
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {extractText(item.fields['班级名称']) || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {extractText(item.fields['上课时间段']) || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {item.fields['开班日期'] ? new Date(item.fields['开班日期']).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {item.fields['结课日期'] ? new Date(item.fields['结课日期']).toLocaleDateString() : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {courseRelations[item.record_id]?.studentCount ?? 
                              (item.fields['关联学员']?.[0]?.text_arr?.length || 
                               item.fields['关联学员列表']?.[0]?.text_arr?.length || 0)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {courseRelations[item.record_id]?.teacherName || 
                             item.fields['授课老师']?.[0]?.text || 
                             '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {item.fields['总课时数'] || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {item.fields['剩余课时'] ?? '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.fields['是否结课'] ? (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                已结课
                              </span>
                            ) : (
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                未结课
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

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
          students={students}
          teachers={teachers}
          courses={courses}
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
  mode: 'add' | 'edit' | 'addCourseHours'
  module: ActiveModule
  data: any
  onClose: () => void
  onSubmit: (data: any) => void
  students?: any[]
  teachers?: any[]
  courses?: any[]
}

function FormModal({ mode, module, data, onClose, onSubmit, students = [], teachers = [], courses = [] }: FormModalProps) {
  const [formData, setFormData] = useState<any>({})
  const [teacherList, setTeacherList] = useState<any[]>(teachers)

  useEffect(() => {
    if (mode === 'edit' && data) {
      setFormData(data.fields || {})
    } else {
      setFormData({})
    }
  }, [mode, data])

  useEffect(() => {
    if (module === 'courses') {
      fetchTeachers()
    }
  }, [module])

  const fetchTeachers = async () => {
    try {
      const res = await fetch('/api/student-management/teachers?force_refresh=true')
      if (res.ok) {
        const result = await res.json()
        setTeacherList(result.data || [])
      }
    } catch (err) {
      console.error('加载老师列表失败:', err)
    }
  }

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
        if (mode === 'addCourseHours') {
          return (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">班级</label>
                <select
                  value={formData['filterClassId'] || ''}
                  onChange={(e) => {
                    handleChange('filterClassId', e.target.value)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">全部班级</option>
                  {courses.map((course) => (
                    <option key={course.record_id} value={course.record_id}>
                      {course.fields?.['班级名称'] || '未知'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">学生名称 *</label>
                <select
                  value={formData['studentId'] || ''}
                  onChange={(e) => {
                    const studentId = e.target.value
                    if (studentId) {
                      const student = students.find(s => s.record_id === studentId)
                      handleChange('studentId', studentId)
                      handleChange('studentName', student?.fields?.['姓名'] || '')
                    } else {
                      handleChange('studentId', '')
                      handleChange('studentName', '')
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                >
                  <option value="">请选择学生</option>
                  {(formData['filterClassId'] ? students.filter(s => {
                    const classIds = s.fields['报名班级']?.[0]?.record_ids || []
                    return classIds.includes(formData['filterClassId'])
                  }) : students).map((student) => (
                    <option key={student.record_id} value={student.record_id}>
                      {student.fields?.['姓名'] || '未知'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">课时 *</label>
                  <input
                    type="number"
                    value={formData['totalHours'] || ''}
                    onChange={(e) => handleChange('totalHours', parseInt(e.target.value) || 0)}
                    placeholder="请输入课时数"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">课时名称</label>
                  <input
                    type="text"
                    value={formData['courseHoursName'] || ''}
                    onChange={(e) => handleChange('courseHoursName', e.target.value)}
                    placeholder="如: Python基础课程"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">缴费金额 *</label>
                <input
                  type="number"
                  value={formData['paymentAmount'] || ''}
                  onChange={(e) => handleChange('paymentAmount', parseFloat(e.target.value) || 0)}
                  placeholder="请输入缴费金额"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
            </>
          )
        }
        return (
          <>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
              <input
                type="text"
                value={formData['联系电话'] || ''}
                onChange={(e) => handleChange('联系电话', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">班级名称</label>
              <select
                value={(() => {
                  const classField = formData['报名班级']
                  if (Array.isArray(classField)) {
                    if (classField.length > 0 && typeof classField[0] === 'string') {
                      return classField[0]
                    } else if (classField[0]?.record_ids?.[0]) {
                      return classField[0].record_ids[0]
                    }
                  } else if (typeof classField === 'string') {
                    return classField
                  }
                  return ''
                })()}
                onChange={(e) => {
                  const classId = e.target.value
                  if (classId) {
                    handleChange('报名班级', [{ record_ids: [classId] }])
                  } else {
                    handleChange('报名班级', [])
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">请选择班级</option>
                {courses.map((course) => (
                  <option key={course.record_id} value={course.record_id}>
                    {course.fields?.['班级名称'] || '未知'}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">授课老师</label>
              <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">
                {(() => {
                  const classField = formData['报名班级']
                  let classId = ''
                  if (Array.isArray(classField)) {
                    if (classField.length > 0 && typeof classField[0] === 'string') {
                      classId = classField[0]
                    } else if (classField[0]?.record_ids?.[0]) {
                      classId = classField[0].record_ids[0]
                    }
                  } else if (typeof classField === 'string') {
                    classId = classField
                  }
                  
                  if (!classId) {
                    return <span className="text-gray-400">请先选择班级</span>
                  }
                  
                  const selectedClass = courses.find(c => c.record_id === classId)
                  if (!selectedClass) {
                    return <span className="text-gray-400">班级不存在</span>
                  }
                  
                  const teacherField = selectedClass.fields?.['授课老师']
                  let teacherName = ''
                  if (teacherField) {
                    if (typeof teacherField === 'string') {
                      const teacher = teachers.find(t => t.record_id === teacherField)
                      teacherName = teacher?.fields?.['姓名'] || teacher?.fields?.['老师姓名'] || teacherField
                    } else if (Array.isArray(teacherField)) {
                      if (teacherField.length > 0 && typeof teacherField[0] === 'string') {
                        const teacherId = teacherField[0]
                        const teacher = teachers.find(t => t.record_id === teacherId)
                        teacherName = teacher?.fields?.['姓名'] || teacher?.fields?.['老师姓名'] || teacherId
                      } else {
                        teacherName = teacherField[0]?.text || teacherField[0]?.name || ''
                      }
                    } else if (teacherField?.text) {
                      teacherName = teacherField.text
                    }
                  }
                  
                  return teacherName || <span className="text-gray-400">该班级暂无授课老师</span>
                })()}
              </div>
              <p className="mt-1 text-xs text-gray-500">* 授课老师跟随班级自动关联</p>
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
                {courses.length === 0 ? (
                  <span className="text-gray-400 text-sm">暂无班级，请先添加班级</span>
                ) : (
                  courses.map((cls) => {
                    const classField = formData['上课班级ID']
                    let selectedIds: string[] = []
                    if (Array.isArray(classField)) {
                      if (classField.length > 0 && typeof classField[0] === 'string') {
                        selectedIds = classField
                      } else if (classField[0]?.record_ids) {
                        selectedIds = classField[0].record_ids
                      }
                    } else if (typeof classField === 'string') {
                      selectedIds = [classField]
                    }
                    const isSelected = selectedIds.includes(cls.record_id)
                    return (
                      <button
                        key={cls.record_id}
                        type="button"
                        onClick={async () => {
                          let newIds = [...selectedIds]
                          if (isSelected) {
                            newIds = newIds.filter((id: string) => id !== cls.record_id)
                          } else {
                            newIds.push(cls.record_id)
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
                        {cls.fields?.['班级名称'] || cls.fields?.['班级分类'] || '未命名班级'}
                      </button>
                    )
                  })
                )}
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
                placeholder="请输入班级名称"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">上课时间</label>
              <input
                type="text"
                value={formData['上课时间段'] || ''}
                onChange={(e) => handleChange('上课时间段', e.target.value)}
                placeholder="如: 周一至周五 19:00-21:00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">授课老师 *</label>
              <select
                value={(() => {
                  const teacherField = formData['授课老师']
                  if (Array.isArray(teacherField)) {
                    if (teacherField.length > 0 && typeof teacherField[0] === 'string') {
                      return teacherField[0]
                    } else if (teacherField[0]?.record_ids?.[0]) {
                      return teacherField[0].record_ids[0]
                    }
                  } else if (typeof teacherField === 'string') {
                    return teacherField
                  }
                  return ''
                })()}
                onChange={(e) => {
                  const teacherId = e.target.value
                  if (teacherId) {
                    const teacher = teacherList.find(t => t.record_id === teacherId)
                    const teacherName = teacher?.fields?.['老师姓名'] || ''
                    handleChange('授课老师', [{
                      record_ids: [teacherId],
                      table_id: 'tblxN3e1fyhOMTSt',
                      text: teacherName,
                      text_arr: [teacherName],
                      type: 'text'
                    }])
                  } else {
                    handleChange('授课老师', [])
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              >
                <option value="">请选择老师 *</option>
                {teacherList.map((teacher) => (
                  <option key={teacher.record_id} value={teacher.record_id}>
                    {teacher.fields?.['老师姓名'] || '未知'}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">开班日期</label>
                <input
                  type="date"
                  value={formData['开班日期'] ? new Date(formData['开班日期']).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleChange('开班日期', new Date(e.target.value).getTime())}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">结课日期</label>
                <input
                  type="date"
                  value={formData['结课日期'] ? new Date(formData['结课日期']).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleChange('结课日期', new Date(e.target.value).getTime())}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">总课时</label>
                <input
                  type="text"
                  value={formData['总课时数'] || ''}
                  onChange={(e) => handleChange('总课时数', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">剩余课时</label>
                <input
                  type="number"
                  value={formData['剩余课时'] || ''}
                  onChange={(e) => handleChange('剩余课时', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">班级状态</label>
                <select
                  value={formData['班级状态'] || ''}
                  onChange={(e) => handleChange('班级状态', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">请选择</option>
                  <option value="招生中">招生中</option>
                  <option value="上课中">上课中</option>
                  <option value="已结课">已结课</option>
                </select>
              </div>
              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData['是否结课'] || false}
                    onChange={(e) => handleChange('是否结课', e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-medium text-gray-700">是否结课</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
              <textarea
                value={formData['备注'] || ''}
                onChange={(e) => handleChange('备注', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
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
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {mode === 'addCourseHours' ? '添加课时' : (mode === 'add' ? '添加' : '编辑')}
            {module === 'students' && (mode === 'addCourseHours' ? '' : '学员')}
            {module === 'teachers' && '老师'}
            {module === 'courses' && '班级'}
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