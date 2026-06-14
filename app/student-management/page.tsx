'use client'

import { useState, useEffect } from 'react'
import {
  Users,
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
  Eye,
  EyeOff,
  Check,
  Filter,
  Upload,
  Image as ImageIcon,
  FileText,
  Star
} from 'lucide-react'
import { ToastProvider, useToast } from '../components/ui/Toast'
import { ModalConfirm } from '../components/ui/ModalConfirm'

type UserType = 'student' | 'teacher' | 'admin' | ''

interface UserInfo {
  name: string
  type: UserType
  recordId?: string
}

interface Work {
  record_id: string
  fields: {
    '作品ID'?: number
    '作品名称'?: string
    '学员'?: any[]
    '学员姓名'?: string
    '班级'?: any[]
    '班级名称'?: string
    '作品描述'?: string
    '作品图片'?: any[]
    '作品链接'?: string
    '点赞数'?: number
    '评论数'?: number
    '是否展示'?: string
    '提交时间'?: string
    '审核状态'?: string
  }
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

function AuthGuard({ children, allowedTypes }: { children: React.ReactNode, allowedTypes: UserType[] }) {
  const { error } = useToast()
  
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
        return;
      }
      if (!allowedTypes.includes(loginData.type as UserType)) {
        error('您没有权限访问此页面')
        window.location.href = '/dashboard';
      }
    } catch (e) {
      localStorage.removeItem('dashboard_login');
      window.location.href = '/dashboard';
    }
  }, []);

  return <>{children}</>;
}

export default function StudentManagement() {
  const { success, error: showError } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [selectedItem, setSelectedItem] = useState<Work | null>(null)
  const [loading, setLoading] = useState(false)

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [pendingDeleteItem, setPendingDeleteItem] = useState<Work | null>(null)

  const [works, setWorks] = useState<Work[]>([])
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', type: '' })

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  
  const [filterClass, setFilterClass] = useState('')
  const [classes, setClasses] = useState<any[]>([])

  useEffect(() => {
    const savedLogin = localStorage.getItem('dashboard_login');
    if (savedLogin) {
      try {
        const loginData = JSON.parse(savedLogin);
        setUserInfo({
          name: loginData.name,
          type: loginData.type,
          recordId: loginData.recordId
        });
      } catch (e) {
        console.error('解析登录信息失败', e)
      }
    }
    loadWorks()
    loadClasses()
  }, [])
  
  const loadClasses = async () => {
    try {
      const res = await fetch('/api/student-management/courses?force_refresh=true')
      if (res.ok) {
        const data = await res.json()
        setClasses(data.data || [])
      }
    } catch (err) {
      console.error('加载班级数据失败', err)
    }
  }

  const loadWorks = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/works?force_refresh=true')
      if (res.ok) {
        const data = await res.json()
        setWorks(data.data || [])
      } else {
        setWorks([])
      }
    } catch (err) {
      console.error('加载作品数据失败', err)
      setWorks([])
    } finally {
      setLoading(false)
    }
  }

  const isTeacher = userInfo.type === 'teacher'
  const isStudent = userInfo.type === 'student'

  const getFilteredData = () => {
    let filtered = works

    if (searchQuery) {
      filtered = filtered.filter(item => 
        extractText(item.fields['作品名称']).includes(searchQuery) ||
        extractText(item.fields['学员姓名']).includes(searchQuery) ||
        extractText(item.fields['作品描述']).includes(searchQuery)
      )
    }

    if (filterClass) {
      filtered = filtered.filter(item => {
        const classField = item.fields['班级']
        if (!classField) return false
        if (Array.isArray(classField)) {
          if (classField[0]?.record_ids?.includes(filterClass)) return true
          if (classField[0]?.text?.includes(filterClass)) return true
        }
        return false
      })
    }

    return filtered
  }

  const filteredData = getFilteredData()
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleAdd = () => {
    setModalMode('add')
    setSelectedItem(null)
    setIsModalOpen(true)
  }

  const handleEdit = (item: Work) => {
    if (isStudent) {
      const creatorNames = extractText(item.fields['学员姓名'] || item.fields['学员'])
      if (creatorNames !== userInfo.name) {
        showError('您只能编辑自己的作品')
        return
      }
    }
    setModalMode('edit')
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleDelete = (item: Work) => {
    if (isStudent) {
      const creatorNames = extractText(item.fields['学员姓名'] || item.fields['学员'])
      if (creatorNames !== userInfo.name) {
        showError('您只能删除自己的作品')
        return
      }
    }
    setPendingDeleteItem(item)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = async () => {
    if (!pendingDeleteItem) return
    
    setDeleteConfirmOpen(false)
    setPendingDeleteItem(null)
    
    setLoading(true)
    
    setWorks(prev => prev.filter(w => w.record_id !== pendingDeleteItem.record_id))
    
    try {
      const res = await fetch(`/api/works/${pendingDeleteItem.record_id}`, {
        method: 'DELETE'
      })
      
      const result = await res.json()
      
      if (result.code === 0 || result.success) {
        success('删除成功')
      } else {
        showError(result.msg || '删除失败')
      }
      
      setTimeout(() => loadWorks(), 300)
    } catch (err) {
      console.error('删除失败:', err)
      showError('删除失败，请重试')
      loadWorks()
    }
  }

  const cancelDelete = () => {
    setDeleteConfirmOpen(false)
    setPendingDeleteItem(null)
  }

  const handleSubmit = async (formData: any) => {
    try {
      setLoading(true)
      setIsModalOpen(false)
      
      let url = '/api/works'
      let method = 'POST'
      let body = formData
      
      if (modalMode === 'edit' && selectedItem) {
        url = `/api/works/${selectedItem.record_id}`
        method = 'PUT'
        body = {
          recordId: selectedItem.record_id,
          fields: formData
        }
      }
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.code === 0 || result.success) {
          success(modalMode === 'add' ? '添加成功' : '更新成功')
        } else {
          showError(result.msg || (modalMode === 'add' ? '添加失败' : '更新失败'))
        }
      } else {
        showError(modalMode === 'add' ? '添加失败' : '更新失败')
      }
      
      loadWorks()
    } catch (err) {
      console.error('提交失败:', err)
      showError('提交失败，请重试')
      loadWorks()
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      '已展示': 'bg-green-100 text-green-800',
      '待审核': 'bg-yellow-100 text-yellow-800',
      '未展示': 'bg-gray-100 text-gray-800',
      '已推荐': 'bg-purple-100 text-purple-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <AuthGuard allowedTypes={['student', 'teacher', 'admin']}>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">作业管理系统</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {isTeacher ? '教师管理模式 - 可管理所有作品' : '学生模式 - 可查看所有作品，增删改自己的作品'}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg">
                  <GraduationCap className="w-5 h-5" />
                  <span className="font-medium">{userInfo.name || '未登录'}</span>
                  <span className="text-xs px-2 py-0.5 bg-purple-100 rounded-full">
                    {isTeacher ? '老师' : '学生'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 flex gap-3 flex-wrap">
                <div className="relative flex-1 max-w-md min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="搜索作品名称或学员..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  />
                </div>
                
                <select
                  value={filterClass}
                  onChange={(e) => { setFilterClass(e.target.value); setCurrentPage(1) }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                >
                  <option value="">全部班级</option>
                  {classes.map((cls) => (
                    <option key={cls.record_id} value={cls.record_id}>
                      {cls.fields?.['班级名称'] || '未知'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                {isTeacher && (
                  <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    添加作品
                  </button>
                )}

                <button
                  onClick={() => loadWorks()}
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
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">暂无作品</p>
              {isTeacher && (
                <button
                  onClick={handleAdd}
                  className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  添加第一个作品
                </button>
              )}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedData.map((item) => (
                  <div key={item.record_id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                      {item.fields['作品图片']?.[0]?.url || item.fields['作品图片']?.[0] ? (
                        <img 
                          src={item.fields['作品图片']?.[0]?.url || item.fields['作品图片']?.[0]} 
                          alt={item.fields['作品名称']}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-purple-300" />
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-800 truncate flex-1">
                          {extractText(item.fields['作品名称']) || '未命名作品'}
                        </h3>
                        {item.fields['审核状态'] && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ml-2 ${getStatusColor(item.fields['审核状态'])}`}>
                            {item.fields['审核状态']}
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <p className="truncate">
                          <span className="text-gray-400">学员:</span> {extractText(item.fields['学员姓名']) || '-'}
                        </p>
                        <p className="truncate">
                          <span className="text-gray-400">班级:</span> {extractText(item.fields['班级名称']) || '-'}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          {item.fields['点赞数'] > 0 && (
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4" />
                              {item.fields['点赞数']}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleEdit(item)} 
                            className={`p-1.5 rounded-lg transition-colors ${
                              isStudent 
                                ? extractText(item.fields['学员姓名']) === userInfo.name
                                  ? 'text-blue-600 hover:bg-blue-50'
                                  : 'text-gray-300 cursor-not-allowed'
                                : 'text-blue-600 hover:bg-blue-50'
                            }`}
                            title={isStudent && extractText(item.fields['学员姓名']) !== userInfo.name ? '只能编辑自己的作品' : '编辑'}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(item)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isStudent 
                                ? extractText(item.fields['学员姓名']) === userInfo.name
                                  ? 'text-red-600 hover:bg-red-50'
                                  : 'text-gray-300 cursor-not-allowed'
                                : 'text-red-600 hover:bg-red-50'
                            }`}
                            title={isStudent && extractText(item.fields['学员姓名']) !== userInfo.name ? '只能删除自己的作品' : '删除'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
          <WorkFormModal
            mode={modalMode}
            data={selectedItem}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmit}
            loading={loading}
            userInfo={userInfo}
            classes={classes}
          />
        )}

        <ModalConfirm
          isOpen={deleteConfirmOpen}
          title="确认删除"
          message="确定要删除这条作品记录吗？此操作无法撤销。"
          confirmText="删除"
          cancelText="取消"
          type="danger"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      </div>
    </AuthGuard>
  )
}

interface WorkFormModalProps {
  mode: 'add' | 'edit'
  data: Work | null
  onClose: () => void
  onSubmit: (data: any) => void
  loading?: boolean
  userInfo: UserInfo
  classes: any[]
}

function WorkFormModal({ mode, data, onClose, onSubmit, loading = false, userInfo, classes }: WorkFormModalProps) {
  const [formData, setFormData] = useState<any>({})

  useEffect(() => {
    if (mode === 'edit' && data) {
      setFormData(data.fields || {})
    } else {
      setFormData({
        '学员姓名': userInfo.name,
        '审核状态': '待审核',
        '是否展示': '否',
      })
    }
  }, [mode, data, userInfo])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {mode === 'add' ? '添加' : '编辑'}作品
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">作品名称 *</label>
            <input
              type="text"
              value={formData['作品名称'] || ''}
              onChange={(e) => handleChange('作品名称', e.target.value)}
              placeholder="请输入作品名称"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">学员姓名 *</label>
            <input
              type="text"
              value={formData['学员姓名'] || ''}
              onChange={(e) => handleChange('学员姓名', e.target.value)}
              placeholder="请输入学员姓名"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">班级</label>
            <select
              value={formData['班级ID'] || ''}
              onChange={(e) => handleChange('班级ID', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">请选择班级</option>
              {classes.map((cls) => (
                <option key={cls.record_id} value={cls.record_id}>
                  {cls.fields?.['班级名称'] || '未知'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">作品描述</label>
            <textarea
              value={formData['作品描述'] || ''}
              onChange={(e) => handleChange('作品描述', e.target.value)}
              placeholder="请输入作品描述"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">作品链接</label>
            <input
              type="url"
              value={formData['作品链接'] || ''}
              onChange={(e) => handleChange('作品链接', e.target.value)}
              placeholder="请输入作品链接（如：https://...）"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">审核状态</label>
            <select
              value={formData['审核状态'] || '待审核'}
              onChange={(e) => handleChange('审核状态', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="待审核">待审核</option>
              <option value="已展示">已展示</option>
              <option value="未展示">未展示</option>
              <option value="已推荐">已推荐</option>
            </select>
          </div>

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
              disabled={loading}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-300 disabled:cursor-not-allowed"
            >
              {loading ? '处理中...' : (mode === 'add' ? '添加' : '保存')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}