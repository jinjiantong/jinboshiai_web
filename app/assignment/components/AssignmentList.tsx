'use client'

import { useState, useEffect } from 'react'
import { Assignment } from '../hooks/useAssignment'
import { AlertCircle, Inbox, File, Image, Video, ExternalLink, Edit2, Trash2, X, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react'

interface AssignmentListProps {
  assignments: Assignment[]
  students: Student[]
  courses: any[]
  loading: boolean
  error: string | null
  canOperate: (assignment: Assignment) => boolean
  onEdit: (assignment: Assignment) => void
  onDelete: (assignment: Assignment) => void
  totalCount?: number
  currentPage?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

interface Student {
  record_id: string
  fields: {
    '姓名'?: string
  }
}

interface Course {
  record_id: string
  fields: {
    '班级名称'?: string
  }
}

function getFieldValue(fields: any, ...fieldNames: string[]): any {
  for (const name of fieldNames) {
    if (name in fields) {
      return fields[name]
    }
  }
  return undefined
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

function formatDate(timestamp: number | string | null): string {
  if (!timestamp) return '-'
  const date = new Date(timestamp)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function getStudentNameFromField(fieldValue: any, students: Student[]): string {
  if (!fieldValue) return ''
  
  let names: string[] = []
  
  if (Array.isArray(fieldValue)) {
    fieldValue.forEach((item: any) => {
      if (item && typeof item === 'object') {
        // 检查是否是空对象（没有 record_ids, text, text_arr）
        const isEmptyObject = (!item.record_ids || item.record_ids.length === 0) &&
                             (!item.text_arr || item.text_arr.length === 0) &&
                             (!item.text);
        
        if (isEmptyObject) {
          // 空对象，返回空字符串（后续会显示为"-"）
          return;
        }
        
        // 优先使用 record_ids 查找
        if (item.record_ids && Array.isArray(item.record_ids)) {
          item.record_ids.forEach((rid: string) => {
            const matched = students.find(s => s.record_id === rid)
            if (matched && matched.fields['姓名']) {
              names.push(matched.fields['姓名'])
            }
          })
        }
        // 如果没有找到，使用 text 尝试
        if (item.text && typeof item.text === 'string' && item.text && names.length === 0) {
          const matched = students.find(s => s.record_id === item.text)
          if (matched && matched.fields['姓名']) {
            names.push(matched.fields['姓名'])
          } else if (!item.record_ids || item.record_ids.length === 0) {
            names.push(item.text)
          }
        }
        // 处理 text_arr
        if (item.text_arr && Array.isArray(item.text_arr) && names.length === 0) {
          item.text_arr.forEach((txt: string) => {
            if (txt) {
              const matched = students.find(s => s.record_id === txt)
              if (matched && matched.fields['姓名']) {
                names.push(matched.fields['姓名'])
              } else if (!item.record_ids || item.record_ids.length === 0) {
                names.push(txt)
              }
            }
          })
        }
      } else if (typeof item === 'string' && item && names.length === 0) {
        const matched = students.find(s => s.record_id === item)
        if (matched && matched.fields['姓名']) {
          names.push(matched.fields['姓名'])
        } else {
          names.push(item)
        }
      }
    })
  } else if (typeof fieldValue === 'string' && fieldValue) {
    const matched = students.find(s => s.record_id === fieldValue)
    if (matched && matched.fields['姓名']) {
      names.push(matched.fields['姓名'])
    } else {
      names.push(fieldValue)
    }
  }
  
  if (names.length === 0) return ''
  
  const result = [...new Set(names)].join(', ')
  return result || '-'
}

function getClassNameFromField(fieldValue: any, courses: Course[]): string {
  if (!fieldValue) return ''
  
  let recordIds: string[] = []
  
  if (Array.isArray(fieldValue)) {
    fieldValue.forEach((item: any) => {
      if (item && typeof item === 'object') {
        if (item.record_ids && Array.isArray(item.record_ids)) {
          recordIds.push(...item.record_ids)
        }
        if (item.text && typeof item.text === 'string' && item.text) {
          recordIds.push(item.text)
        }
        if (item.text_arr && Array.isArray(item.text_arr)) {
          recordIds.push(...item.text_arr.filter(Boolean))
        }
      } else if (typeof item === 'string' && item) {
        recordIds.push(item)
      }
    })
  } else if (typeof fieldValue === 'string') {
    recordIds.push(fieldValue)
  }
  
  if (recordIds.length === 0) return ''
  
  const names = recordIds.map(id => {
    const course = courses.find(c => c.record_id === id)
    if (course && course.fields['班级名称']) {
      return course.fields['班级名称']
    }
    return id
  })
  
  const result = [...new Set(names)].join(', ')
  return result || '-'
}

interface Attachment {
  token?: string
  name?: string
  size?: number
  type?: string
  url?: string
}

function parseAttachments(fieldValue: any): Attachment[] {
  if (!fieldValue) return []
  if (!Array.isArray(fieldValue)) return []
  
  return fieldValue
    .filter((item: any) => item && typeof item === 'object')
    .map((item: any): Attachment => {
      return {
        token: item.file_token || item.token || item.id,
        name: item.name || item.filename || '未命名文件',
        size: item.size,
        type: item.type || item.file_type,
        url: item.url || (item.file_token ? `https://open.feishu.cn/open-apis/drive/v1/medias/${item.file_token}/download` : undefined)
      }
    })
    .filter(att => att.name || att.token)
}

function getAttachmentType(name: string): 'image' | 'video' | 'other' {
  const ext = name.toLowerCase().split('.').pop() || ''
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext)) return 'image'
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'].includes(ext)) return 'video'
  return 'other'
}

export function AssignmentList({
  assignments,
  students,
  courses,
  loading,
  error,
  canOperate,
  onEdit,
  onDelete,
  totalCount = 0,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange
}: AssignmentListProps) {
  const [previewAttachment, setPreviewAttachment] = useState<{url: string, type: string} | null>(null)
  const [imageZoom, setImageZoom] = useState(100)

  const getAttachmentType = (name: string): 'image' | 'video' | 'other' => {
    const ext = name.toLowerCase().split('.').pop() || ''
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext)) return 'image'
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'].includes(ext)) return 'video'
    return 'other'
  }

  const handleAttachmentClick = async (attachment: Attachment) => {
    if (!attachment) return
    
    const token = attachment.token || attachment.file_token
    if (!token) return
    
    try {
      let url = attachment.url
      
      if (!url || url.includes('open.feishu.cn/open-apis/drive')) {
        const response = await fetch(`/api/assignments/download?file_token=${token}`)
        const result = await response.json()
        
        if (result.code === 0 && result.data?.url) {
          url = result.data.url
        }
      }
      
      if (url) {
        const type = getAttachmentType(attachment.name || '')
        setImageZoom(100)
        setPreviewAttachment({ url, type })
      }
    } catch (error) {
      console.error('获取附件下载链接失败:', error)
    }
  }

  const zoomIn = () => {
    setImageZoom(prev => Math.min(prev + 25, 200))
  }

  const zoomOut = () => {
    setImageZoom(prev => Math.max(prev - 25, 50))
  }

  const resetZoom = () => {
    setImageZoom(100)
  }

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
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-36">作业标题</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">作业描述</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-24">班级</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-24">关联学员</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-28">作业链接</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-32">附件</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-24">添加日期</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-24">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {assignments.map((assignment) => {
              const className = getClassNameFromField(getFieldValue(assignment.fields, '关联班级'), courses)
              const studentName = getStudentNameFromField(getFieldValue(assignment.fields, '关联学员'), students)
              const linkUrl = getFieldValue(assignment.fields, '存档路径', '作品链接')
              const attachments = parseAttachments(getFieldValue(assignment.fields, '作业附件'))
              const archivePath = getFieldValue(assignment.fields, '存档路径')
              const attachmentType = getFieldValue(assignment.fields, '附件类型')
              
              return (
                <tr key={assignment.record_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-800 break-words">
                      {getFieldValue(assignment.fields, '作业标题') || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600 line-clamp-3 block" title={getFieldValue(assignment.fields, '作业内容', '作业描述')}>
                      {getFieldValue(assignment.fields, '作业内容', '作业描述') || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700 break-words">
                      {className || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700 break-words">
                      {studentName || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {linkUrl ? (
                      <a 
                        href={linkUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 hover:underline whitespace-nowrap"
                      >
                        <ExternalLink className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate max-w-[80px]">打开链接</span>
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {attachments.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {attachments.slice(0, 3).map((att, idx) => {
                          const type = getAttachmentType(att.name || '')
                          return (
                            <button
                              key={idx}
                              onClick={() => handleAttachmentClick(att)}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-700 hover:bg-gray-200 transition-colors max-w-[80px]"
                              title={`${att.name}${att.token ? '\nToken: ' + att.token : ''}`}
                            >
                              {type === 'image' ? <Image className="w-3 h-3 flex-shrink-0" /> : type === 'video' ? <Video className="w-3 h-3 flex-shrink-0" /> : <File className="w-3 h-3 flex-shrink-0" />}
                              <span className="truncate">{att.name}</span>
                            </button>
                          )
                        })}
                        {attachments.length > 3 && (
                          <span className="text-xs text-gray-500 ml-1">+{attachments.length - 3}</span>
                        )}
                      </div>
                    ) : archivePath && archivePath.length > 0 ? (
                      <a
                        href={archivePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 rounded text-xs text-blue-700 hover:bg-blue-100 transition-colors"
                        title={archivePath}
                      >
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate max-w-[60px]">
                          {attachmentType?.[0]?.text || attachmentType || '链接'}
                        </span>
                      </a>
                    ) : (
                      <span className="text-sm text-gray-400">无附件</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600 whitespace-nowrap">
                      {formatDate(getFieldValue(assignment.fields, '添加日期', 'created_time'))}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      {canOperate(assignment) && (
                        <>
                          <button
                            onClick={() => onEdit(assignment)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="编辑"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(assignment)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="删除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {totalCount > pageSize && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">每页显示：</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5条</option>
              <option value={10}>10条</option>
              <option value={20}>20条</option>
              <option value={50}>50条</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              共 {totalCount} 条，第 {currentPage}/{Math.ceil(totalCount / pageSize)} 页
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="上一页"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage >= Math.ceil(totalCount / pageSize)}
                className="p-2 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="下一页"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {previewAttachment && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={() => setPreviewAttachment(null)}
        >
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            {previewAttachment.type === 'image' && (
              <div className="flex items-center gap-1 bg-white/10 rounded-full p-1">
                <button
                  onClick={(e) => { e.stopPropagation(); zoomOut(); }}
                  className="p-2 hover:bg-white/20 rounded-full text-white transition-colors"
                  title="缩小"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <span className="text-white text-sm font-medium px-2 min-w-[60px] text-center">
                  {imageZoom}%
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); zoomIn(); }}
                  className="p-2 hover:bg-white/20 rounded-full text-white transition-colors"
                  title="放大"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); resetZoom(); }}
                  className="p-2 hover:bg-white/20 rounded-full text-white transition-colors"
                  title="重置"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
              </div>
            )}
            <button
              onClick={() => setPreviewAttachment(null)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {previewAttachment.type === 'image' ? (
            <div className="relative w-full h-full flex items-center justify-center p-8 overflow-auto">
              <img 
                src={previewAttachment.url} 
                alt="附件预览" 
                className="rounded-lg shadow-2xl transition-all duration-300"
                style={{ 
                  maxWidth: `${imageZoom}%`, 
                  maxHeight: `${imageZoom}%`,
                  transform: `scale(${imageZoom / 100})`
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          ) : previewAttachment.type === 'video' ? (
            <div className="w-full max-w-5xl mx-auto px-4">
              <video 
                src={previewAttachment.url} 
                controls 
                autoPlay
                className="w-full max-h-[85vh] rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="text-center text-white/60 text-sm mt-4">
                点击外部或右上角关闭
              </div>
            </div>
          ) : (
            <a 
              href={previewAttachment.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              下载附件
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default AssignmentList