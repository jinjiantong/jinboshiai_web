'use client'

import { useState, useEffect } from 'react'
import {
  FileText,
  Grid3X3,
  List,
  Plus,
  RefreshCw,
  User,
  GraduationCap,
  Loader2
} from 'lucide-react'
import { ToastProvider, useToast } from '../components/ui/Toast'
import { ModalConfirm } from '../components/ui/ModalConfirm'
import FilterSidebar from './components/FilterSidebar'
import AssignmentList from './components/AssignmentList'
import AssignmentModal, { AssignmentFormData } from './components/AssignmentModal'
import ConfirmModal from './components/ConfirmModal'
import { useAssignment, Assignment } from './hooks/useAssignment'

type ViewMode = 'grid' | 'list'

function AssignmentPageContent() {
  const { success, error } = useToast()
  const {
    assignments,
    loading,
    user,
    fetchAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    canOperate,
    canMarkExcellent
  } = useAssignment()

  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    fetchAssignments()
  }, [refreshKey])

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
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
      success('作业删除成功')
    } else {
      error(result.message || '删除作业失败')
    }
    setIsDeleteModalOpen(false)
    setSelectedAssignment(null)
  }

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false)
    setSelectedAssignment(null)
  }

  const handleMarkExcellent = async (assignment: Assignment) => {
    const newValue = !assignment.fields['是否优秀']
    const result = await updateAssignment(assignment.record_id, {
      '是否优秀': newValue
    })

    if (result.success) {
      success(newValue ? '已标记为优秀作业' : '已取消优秀作业标记')
    } else {
      error(result.message || '操作失败')
    }
  }

  const handleModalSubmit = async (formData: AssignmentFormData) => {
    setIsModalOpen(false)

    if (selectedAssignment) {
      const result = await updateAssignment(selectedAssignment.record_id, {
        '作业标题': formData['作业标题'],
        '作业描述': formData['作业描述'],
        '关联学员': formData['关联学员'],
        '关联课程': formData['关联课程'],
        '作业分数': formData['作业分数'],
        '作业状态': formData['作业状态'],
        '是否优秀': formData['是否优秀']
      })

      if (result.success) {
        success('作业更新成功')
      } else {
        error(result.message || '更新作业失败')
      }
    } else {
      const result = await createAssignment({
        '作业标题': formData['作业标题'],
        '作业描述': formData['作业描述'],
        '关联学员': formData['关联学员'],
        '关联课程': formData['关联课程'],
        '作业分数': formData['作业分数'],
        '作业状态': formData['作业状态'],
        '是否优秀': formData['是否优秀']
      })

      if (result.success) {
        success('作业创建成功')
      } else {
        error(result.message || '创建作业失败')
      }
    }
  }

  const handleFilter = (filters: any) => {
    fetchAssignments(filters)
  }

  const getUserRoleBadge = () => {
    if (!user) return null

    const roleConfig = {
      admin: { icon: User, text: '管理员', bgColor: 'bg-purple-100', textColor: 'text-purple-600' },
      teacher: { icon: GraduationCap, text: '老师', bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
      student: { icon: User, text: '学生', bgColor: 'bg-green-100', textColor: 'text-green-600' }
    }

    const config = roleConfig[user.role]
    if (!config) return null

    const Icon = config.icon

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </span>
    )
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
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                新增作业
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
        <div className="flex gap-6">
          <aside className="w-72 flex-shrink-0">
            <FilterSidebar onFilter={handleFilter} />
          </aside>

          <main className="flex-1">
            {loading && assignments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <span className="text-gray-600">正在加载作业...</span>
              </div>
            ) : (
              <AssignmentList
                assignments={assignments}
                loading={false}
                error={null}
                canOperate={canOperate()}
                canMarkExcellent={canMarkExcellent()}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMarkExcellent={handleMarkExcellent}
              />
            )}
          </main>
        </div>
      </div>

      <AssignmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        assignment={selectedAssignment || undefined}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="确认删除"
        message={`确定要删除作业"${selectedAssignment?.fields['作业标题']}"吗？此操作无法撤销。`}
      />
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