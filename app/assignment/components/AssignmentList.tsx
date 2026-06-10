'use client'

import { Assignment } from '../hooks/useAssignment'
import AssignmentCard from './AssignmentCard'
import { AlertCircle, Inbox } from 'lucide-react'

interface AssignmentListProps {
  assignments: Assignment[]
  loading: boolean
  error: string | null
  canOperate: boolean
  canMarkExcellent: boolean
  onEdit: (assignment: Assignment) => void
  onDelete: (assignment: Assignment) => void
  onMarkExcellent: (assignment: Assignment) => void
}

export function AssignmentList({
  assignments,
  loading,
  error,
  canOperate,
  canMarkExcellent,
  onEdit,
  onDelete,
  onMarkExcellent
}: AssignmentListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4 p-8 bg-red-50 rounded-xl max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <div className="text-center">
            <h3 className="font-semibold text-red-800 mb-2">加载失败</h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (assignments.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4 p-8">
          <Inbox className="w-16 h-16 text-gray-300" />
          <div className="text-center">
            <h3 className="font-semibold text-gray-600 mb-2">暂无作业</h3>
            <p className="text-gray-400 text-sm">暂时没有需要完成的作业</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assignments.map((assignment) => (
        <AssignmentCard
          key={assignment.record_id}
          assignment={assignment}
          canOperate={canOperate}
          canMarkExcellent={canMarkExcellent}
          onEdit={onEdit}
          onDelete={onDelete}
          onMarkExcellent={onMarkExcellent}
        />
      ))}
    </div>
  )
}

export default AssignmentList