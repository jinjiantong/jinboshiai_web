'use client'

import { useState, useEffect } from 'react'
import {
  FileText,
  Plus,
  RefreshCw,
  User,
  GraduationCap,
  Loader2
} from 'lucide-react'
import { ToastProvider } from '../components/ui/Toast'
import FilterSidebar from './components/FilterSidebar'
import AssignmentList from './components/AssignmentList'
import AssignmentModal, { AssignmentFormData } from './components/AssignmentModal'
import ConfirmModal from './components/ConfirmModal'
import { useAssignment, Assignment } from './hooks/useAssignment'

function AssignmentPageContent() {
  useEffect(() => {
    const savedLogin = localStorage.getItem('dashboard_login');
    if (!savedLogin) {
      window.location.href = '/dashboard';
      return;
    }
    try {
      const loginData = JSON.parse(savedLogin);
      if (!loginData.expiryTime || Date.now() >= loginData.expiryTime) {
        localStorage.removeItem('dashboard_login');
        window.location.href = '/dashboard';
      }
    } catch (e) {
      localStorage.removeItem('dashboard_login');
      window.location.href = '/dashboard';
    }
  }, []);

  const {
    assignments,
    loading,
    error,
    user,
    students,
    courses,
    totalCount,
    currentPage,
    pageSize,
    fetchAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    canOperate,
    setCurrentPage,
    setPageSize
  } = useAssignment()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  useEffect(() => {
    fetchAssignments()
  }, [fetchAssignments])

  const showSuccessToast = (message: string) => {
    setToastMessage(message)
    setToastType('success')
    setTimeout(() => setToastMessage(''), 3000)
  }

  const showErrorToast = (message: string) => {
    setToastMessage(message)
    setToastType('error')
    setTimeout(() => setToastMessage(''), 3000)
  }

  const handleRefresh = () => {
    fetchAssignments()
  }

  const handleAdd = () => {
    setSelectedAssignment(null)
    setIsModalOpen(true)
  }

  const handleEdit = (assignment: Assignment) => {
    setSelectedAssignment(assignment)
    setIsModalOpen(true)
  }

  const handleDelete = (assignment: Assignment) => {
    setSelectedAssignment(assignment)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedAssignment) return
    
    const result = await deleteAssignment(selectedAssignment.record_id)
    
    if (result.success) {
      showSuccessToast('作业删除成功')
    } else {
      showErrorToast('删除作业失败')
    }
    
    setIsDeleteModalOpen(false)
    setSelectedAssignment(null)
  }

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false)
    setSelectedAssignment(null)
  }

  const handleModalSubmit = async (formData: AssignmentFormData) => {
    setIsModalOpen(false)

    const buildFields = (data: AssignmentFormData) => {
      const fields: any = {
        '作业标题': data['作业标题'],
        '作业描述': data['作业描述'],
        '是否优秀作品': data['是否优秀'] ? true : false,
        '存档路径': data['作品链接'] || ''
      }
      
      console.log('buildFields input:', JSON.stringify(data, null, 2));
      
      if (data['关联班级']) {
        fields['关联班级'] = [data['关联班级'].text]
      }
      
      if (data['关联学员']) {
        fields['关联学员'] = [data['关联学员'].text]
      }
      
      if (data['作业附件'] && data['作业附件'].length > 0) {
        fields['作业附件'] = data['作业附件']
      }
      
      console.log('buildFields output:', JSON.stringify(fields, null, 2));
      
      return fields
    }

    let result: { success: boolean; message?: string }

    if (selectedAssignment) {
      result = await updateAssignment(selectedAssignment.record_id, buildFields(formData))
    } else {
      result = await createAssignment(buildFields(formData))
    }

    if (result.success) {
      showSuccessToast(result.message || '操作成功')
    } else {
      showErrorToast(result.message || '操作失败')
    }
  }

  const handleFilter = (filters: any) => {
    fetchAssignments(filters)
  }

  const getUserRoleBadge = () => {
    if (!user) return null

    const roleConfig: Record<string, { icon: any; text: string; bgColor: string; textColor: string }> = {
      admin: { icon: User, text: '管理员', bgColor: 'bg-purple-100', textColor: 'text-purple-600' },
      teacher: { icon: GraduationCap, text: '老师', bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
      student: { icon: User, text: '学生', bgColor: 'bg-green-100', textColor: 'text-green-600' }
    }

    const role = user.role || user.type
    const config = roleConfig[role]
    if (!config) return null

    const Icon = config.icon

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </span>
    )
  }

  const getAssignmentTitle = (assignment: Assignment | null) => {
    if (!assignment) return ''
    return assignment.fields['作业标题'] || assignment.fields['title'] || '未命名作业'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">作业管理系统</h1>
                {user && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">{user.name}</span>
                    {getUserRoleBadge()}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                {user?.role === 'student' ? '提交作业' : '新增作业'}
              </button>

              <button
                onClick={handleRefresh}
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

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <FilterSidebar onFilter={handleFilter} />
        </div>

        <main>
          {loading && assignments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
              <span className="text-gray-600">正在加载作业...</span>
            </div>
          ) : error ? (
            <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center justify-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                重试
              </button>
            </div>
          ) : (
            <AssignmentList
              assignments={assignments}
              students={students}
              courses={courses}
              loading={loading}
              error={error}
              canOperate={canOperate}
              onEdit={handleEdit}
              onDelete={handleDelete}
              totalCount={totalCount}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
            />
          )}
        </main>
      </div>

      <AssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        assignment={selectedAssignment || undefined}
        currentUser={user}
        students={students}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="确认删除"
        message={`确定要删除作业"${getAssignmentTitle(selectedAssignment)}"吗？此操作无法撤销。`}
      />

      {toastMessage && (
        <div className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white ${
          toastType === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {toastMessage}
        </div>
      )}
    </div>
  )
}

export default function AssignmentPage() {
  return (
    <ToastProvider>
      <AssignmentPageContent />
    </ToastProvider>
  )
}
