'use client'

import { Edit2, Trash2, Star } from 'lucide-react'
import { Assignment } from '../hooks/useAssignment'

interface AssignmentCardProps {
  assignment: Assignment
  canOperate: boolean
  canMarkExcellent: boolean
  onEdit: (assignment: Assignment) => void
  onDelete: (assignment: Assignment) => void
  onMarkExcellent: (assignment: Assignment) => void
}

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

export function AssignmentCard({
  assignment,
  canOperate,
  canMarkExcellent,
  onEdit,
  onDelete,
  onMarkExcellent
}: AssignmentCardProps) {
  const getSubmissionStatus = () => {
    const status = assignment.fields['提交状态'] || assignment.fields['作业状态']
    if (status === '已提交' || status === '已完成') {
      return { label: '已提交', color: 'bg-green-100 text-green-800' }
    }
    return { label: '未提交', color: 'bg-yellow-100 text-yellow-800' }
  }

  const submissionStatus = getSubmissionStatus()
  const isExcellent = assignment.fields['是否优秀作品']

  const studentName = extractText(assignment.fields['关联学员'])
  const courseName = extractText(assignment.fields['关联课程'])

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow relative">
      {isExcellent && (
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
            <Star className="w-3 h-3" />
            <span>优秀作品</span>
          </div>
        </div>
      )}

      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 text-lg mb-2 pr-16">
          {assignment.fields['作业标题'] || '未命名作业'}
        </h3>
        {assignment.fields['作业描述'] && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {assignment.fields['作业描述']}
          </p>
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        {studentName && (
          <div className="flex items-center">
            <span className="w-16 text-gray-500">学员:</span>
            <span className="font-medium text-gray-700">{studentName}</span>
          </div>
        )}
        {courseName && (
          <div className="flex items-center">
            <span className="w-16 text-gray-500">课程:</span>
            <span className="font-medium text-gray-700">{courseName}</span>
          </div>
        )}
        {assignment.fields['作业分数'] !== undefined && (
          <div className="flex items-center">
            <span className="w-16 text-gray-500">分数:</span>
            <span className="font-medium text-gray-700">
              {assignment.fields['作业分数'] !== null ? `${assignment.fields['作业分数']}分` : '-'}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${submissionStatus.color}`}>
          {submissionStatus.label}
        </span>

        {canOperate && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(assignment)}
              className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1 text-sm"
            >
              <Edit2 className="w-4 h-4" />
              <span>编辑</span>
            </button>
            <button
              onClick={() => onDelete(assignment)}
              className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            {canMarkExcellent && !isExcellent && (
              <button
                onClick={() => onMarkExcellent(assignment)}
                className="px-3 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors"
                title="标记为优秀"
              >
                <Star className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AssignmentCard