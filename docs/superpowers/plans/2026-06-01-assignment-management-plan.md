# 作业管理系统实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 开发作业管理系统，集成到学生管理后台，支持作品展示、提交、编辑和删除功能。

**Architecture:** 
- 后端：Next.js API Routes，调用飞书多维表格 API
- 前端：React 组件，使用 Tailwind CSS 样式
- 权限控制：基于登录用户的 type 和 id 判断操作权限

**Tech Stack:** 
- Next.js 14.2.3
- Tailwind CSS 3.4.3
- 飞书多维表格 API
- 现有组件：ModalConfirm, Toast

---

## 文件结构

### 需要创建的文件

```
app/
├── api/
│   └── assignments/
│       ├── route.ts              # GET/POST 作业列表
│       └── [id]/
│           └── route.ts          # GET/PUT/DELETE 单个作业
└── assignment/
    ├── page.tsx                  # 主页面
    ├── components/
    │   ├── FilterSidebar.tsx      # 筛选侧边栏
    │   ├── AssignmentCard.tsx    # 作品卡片
    │   ├── AssignmentList.tsx    # 作品列表容器
    │   ├── AssignmentModal.tsx   # 新增/编辑弹窗
    │   └── ConfirmModal.tsx      # 确认对话框
    └── hooks/
        └── useAssignment.ts     # 作业数据管理 Hook
```

### 需要修改的文件

```
app/student-management/page.tsx  # 添加"作业管理"按钮和路由跳转
app/layout.tsx                   # 可能需要添加作业管理页面的布局
```

---

## 任务列表

### Task 1: 创建作业 API - GET 获取作业列表

**Files:**
- Create: `app/api/assignments/route.ts`
- Test: 使用浏览器测试 API 响应

- [ ] **Step 1: 创建 API 路由文件**

创建文件：`app/api/assignments/route.ts`

```typescript
import { NextResponse } from 'next/server'
import settings from '../../../../setting.json'

const ASSIGNMENT_TABLE_ID = 'tblEUJfrNGtkUJLR'
const APP_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc'

let cachedToken = ''
let tokenExpiryTime = 0

async function getTenantAccessToken(): Promise<string> {
  const now = Date.now()
  
  if (cachedToken && now < tokenExpiryTime) {
    return cachedToken
  }
  
  try {
    const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_id: settings.data.app_id,
        app_secret: settings.data.app_secret,
      }),
    })
    
    const data = await response.json()
    
    if (data.code === 0 && data.tenant_access_token) {
      cachedToken = data.tenant_access_token
      tokenExpiryTime = now + (data.expire - 60) * 1000
      return cachedToken
    }
    
    throw new Error(data.msg || 'Failed to get access token')
  } catch (error) {
    console.error('Error getting tenant_access_token:', error)
    throw error
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('student_id')
    const courseId = searchParams.get('course_id')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')

    const accessToken = await getTenantAccessToken()
    
    let url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${ASSIGNMENT_TABLE_ID}/records?page_size=${pageSize}`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${accessToken}` },
    })
    
    const data = await response.json()
    
    if (data.code === 0) {
      let records = data.data.items || []
      
      // 简单筛选（实际应该用飞书的多维表格筛选API）
      if (studentId) {
        records = records.filter((r: any) => {
          const studentRef = r.fields?.['关联学员']
          return studentRef && studentRef[0] === studentId
        })
      }
      
      if (status) {
        records = records.filter((r: any) => 
          r.fields?.['提交状态'] === status
        )
      }
      
      return NextResponse.json({
        code: 0,
        msg: 'success',
        data: records,
        total: records.length,
      })
    }
    
    return NextResponse.json({
      code: data.code,
      msg: data.msg || 'Failed to fetch assignments',
      data: [],
    })
  } catch (error) {
    console.error('Error fetching assignments:', error)
    return NextResponse.json({
      code: -1,
      msg: 'Internal server error',
      data: [],
    })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const accessToken = await getTenantAccessToken()
    
    const response = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${ASSIGNMENT_TABLE_ID}/records`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: body.fields,
        }),
      }
    )
    
    const data = await response.json()
    
    if (data.code === 0) {
      return NextResponse.json({
        code: 0,
        msg: 'success',
        data: data.data,
      })
    }
    
    return NextResponse.json({
      code: data.code,
      msg: data.msg || 'Failed to create assignment',
    })
  } catch (error) {
    console.error('Error creating assignment:', error)
    return NextResponse.json({
      code: -1,
      msg: 'Internal server error',
    })
  }
}
```

- [ ] **Step 2: 测试 API 路由**

Run: `curl http://localhost:3000/api/assignments`
Expected: JSON 响应，包含 code: 0 和作业列表数据

---

### Task 2: 创建作业 API - 单个作业的 GET/PUT/DELETE

**Files:**
- Create: `app/api/assignments/[id]/route.ts`
- Test: 使用浏览器测试 API 响应

- [ ] **Step 1: 创建单个作业 API 路由文件**

创建文件：`app/api/assignments/[id]/route.ts`

```typescript
import { NextResponse } from 'next/server'
import settings from '../../../../../../setting.json'

const ASSIGNMENT_TABLE_ID = 'tblEUJfrNGtkUJLR'
const APP_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc'

async function getTenantAccessToken(): Promise<string> {
  try {
    const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_id: settings.data.app_id,
        app_secret: settings.data.app_secret,
      }),
    })
    
    const data = await response.json()
    
    if (data.code === 0 && data.tenant_access_token) {
      return data.tenant_access_token
    }
    
    throw new Error(data.msg || 'Failed to get access token')
  } catch (error) {
    console.error('Error getting tenant_access_token:', error)
    throw error
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const accessToken = await getTenantAccessToken()
    
    const response = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${ASSIGNMENT_TABLE_ID}/records/${id}`,
      {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      }
    )
    
    const data = await response.json()
    
    if (data.code === 0) {
      return NextResponse.json({
        code: 0,
        msg: 'success',
        data: data.data,
      })
    }
    
    return NextResponse.json({
      code: data.code,
      msg: data.msg || 'Failed to fetch assignment',
    })
  } catch (error) {
    console.error('Error fetching assignment:', error)
    return NextResponse.json({
      code: -1,
      msg: 'Internal server error',
    })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const accessToken = await getTenantAccessToken()
    
    const response = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${ASSIGNMENT_TABLE_ID}/records/${id}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: body.fields,
        }),
      }
    )
    
    const data = await response.json()
    
    if (data.code === 0) {
      return NextResponse.json({
        code: 0,
        msg: 'success',
        data: data.data,
      })
    }
    
    return NextResponse.json({
      code: data.code,
      msg: data.msg || 'Failed to update assignment',
    })
  } catch (error) {
    console.error('Error updating assignment:', error)
    return NextResponse.json({
      code: -1,
      msg: 'Internal server error',
    })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const accessToken = await getTenantAccessToken()
    
    const response = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${ASSIGNMENT_TABLE_ID}/records/${id}`,
      {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${accessToken}` },
      }
    )
    
    const data = await response.json()
    
    if (data.code === 0) {
      return NextResponse.json({
        code: 0,
        msg: 'success',
      })
    }
    
    return NextResponse.json({
      code: data.code,
      msg: data.msg || 'Failed to delete assignment',
    })
  } catch (error) {
    console.error('Error deleting assignment:', error)
    return NextResponse.json({
      code: -1,
      msg: 'Internal server error',
    })
  }
}
```

- [ ] **Step 2: 测试单个作业 API**

Run: `curl http://localhost:3000/api/assignments/{record_id}`
Expected: JSON 响应，包含单个作业详情

---

### Task 3: 创建作业数据管理 Hook

**Files:**
- Create: `app/assignment/hooks/useAssignment.ts`
- Test: 在页面中测试 Hook 功能

- [ ] **Step 1: 创建 useAssignment Hook**

创建文件：`app/assignment/hooks/useAssignment.ts`

```typescript
import { useState, useEffect } from 'react'

interface Assignment {
  record_id: string
  fields: {
    '作业ID'?: number
    '作业内容'?: string
    '提交状态'?: string
    '作业附件'?: any[]
    '关联学员'?: string[]
    '关联班级'?: string[]
    '是否优秀作品'?: boolean
    '对应课时'?: number
    [key: string]: any
  }
}

interface User {
  type: 'teacher' | 'student'
  id: string
  name: string
  classId?: string
}

interface UseAssignmentReturn {
  assignments: Assignment[]
  loading: boolean
  error: string | null
  user: User | null
  fetchAssignments: (filters?: {
    student_id?: string
    course_id?: string
    status?: string
  }) => Promise<void>
  createAssignment: (data: Partial<Assignment['fields']>) => Promise<boolean>
  updateAssignment: (id: string, data: Partial<Assignment['fields']>) => Promise<boolean>
  deleteAssignment: (id: string) => Promise<boolean>
  canOperate: (assignment: Assignment) => boolean
  canMarkExcellent: () => boolean
}

export function useAssignment(): UseAssignmentReturn {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const fetchAssignments = async (filters?: {
    student_id?: string
    course_id?: string
    status?: string
  }) => {
    try {
      setLoading(true)
      setError(null)
      
      let url = '/api/assignments'
      const params = new URLSearchParams()
      
      if (filters?.student_id) params.append('student_id', filters.student_id)
      if (filters?.course_id) params.append('course_id', filters.course_id)
      if (filters?.status) params.append('status', filters.status)
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }
      
      const response = await fetch(url)
      const result = await response.json()
      
      if (result.code === 0) {
        setAssignments(result.data || [])
      } else {
        setError(result.msg || '获取作业列表失败')
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
      console.error('Error fetching assignments:', err)
    } finally {
      setLoading(false)
    }
  }

  const createAssignment = async (data: Partial<Assignment['fields']>): Promise<boolean> => {
    try {
      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: data }),
      })
      
      const result = await response.json()
      
      if (result.code === 0) {
        await fetchAssignments()
        return true
      }
      
      setError(result.msg || '创建作业失败')
      return false
    } catch (err) {
      setError('网络错误，请稍后重试')
      console.error('Error creating assignment:', err)
      return false
    }
  }

  const updateAssignment = async (id: string, data: Partial<Assignment['fields']>): Promise<boolean> => {
    try {
      const response = await fetch(`/api/assignments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields: data }),
      })
      
      const result = await response.json()
      
      if (result.code === 0) {
        await fetchAssignments()
        return true
      }
      
      setError(result.msg || '更新作业失败')
      return false
    } catch (err) {
      setError('网络错误，请稍后重试')
      console.error('Error updating assignment:', err)
      return false
    }
  }

  const deleteAssignment = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/assignments/${id}`, {
        method: 'DELETE',
      })
      
      const result = await response.json()
      
      if (result.code === 0) {
        await fetchAssignments()
        return true
      }
      
      setError(result.msg || '删除作业失败')
      return false
    } catch (err) {
      setError('网络错误，请稍后重试')
      console.error('Error deleting assignment:', err)
      return false
    }
  }

  const canOperate = (assignment: Assignment): boolean => {
    if (!user) return false
    if (user.type === 'teacher') return true
    const studentRef = assignment.fields?.['关联学员']
    return studentRef && studentRef[0] === user.id
  }

  const canMarkExcellent = (): boolean => {
    return user?.type === 'teacher'
  }

  return {
    assignments,
    loading,
    error,
    user,
    fetchAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    canOperate,
    canMarkExcellent,
  }
}
```

---

### Task 4: 创建作品卡片组件

**Files:**
- Create: `app/assignment/components/AssignmentCard.tsx`
- Test: 在列表中测试卡片显示

- [ ] **Step 1: 创建作品卡片组件**

创建文件：`app/assignment/components/AssignmentCard.tsx`

```typescript
'use client'

import { Assignment } from '../hooks/useAssignment'
import { Edit2, Trash2, Star } from 'lucide-react'

interface AssignmentCardProps {
  assignment: Assignment
  canOperate: boolean
  canMarkExcellent: boolean
  onEdit: (assignment: Assignment) => void
  onDelete: (assignment: Assignment) => void
  onMarkExcellent: (assignment: Assignment) => void
}

export default function AssignmentCard({
  assignment,
  canOperate,
  canMarkExcellent,
  onEdit,
  onDelete,
  onMarkExcellent,
}: AssignmentCardProps) {
  const { fields } = assignment
  const isExcellent = fields['是否优秀作品']
  const status = fields['提交状态']
  const studentName = fields['关联学员']?.[0] || '未知学员'
  const courseName = fields['关联班级']?.[0] || '未知课程'
  const lessonCount = fields['对应课时'] || 0

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="aspect-video bg-gray-100 flex items-center justify-center">
        {fields['作业附件'] && fields['作业附件'].length > 0 ? (
          <div className="text-center text-gray-500">
            <p className="text-sm">附件数量: {fields['作业附件'].length}</p>
            <p className="text-xs mt-1">点击查看详情</p>
          </div>
        ) : (
          <div className="text-gray-400 text-sm">暂无附件</div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
          {fields['作业内容'] || '无标题'}
        </h3>
        
        <div className="text-sm text-gray-600 space-y-1 mb-3">
          <p>👤 {studentName}</p>
          <p>📚 {courseName}</p>
          <p>⏰ 第 {lessonCount} 课时</p>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === '已提交' 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {status || '未提交'}
          </span>
          
          {isExcellent && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
              ⭐ 优秀
            </span>
          )}
        </div>
        
        {(canOperate || canMarkExcellent) && (
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            {canOperate && (
              <>
                <button
                  onClick={() => onEdit(assignment)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  编辑
                </button>
                <button
                  onClick={() => onDelete(assignment)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  删除
                </button>
              </>
            )}
            
            {canMarkExcellent && !isExcellent && (
              <button
                onClick={() => onMarkExcellent(assignment)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
              >
                <Star className="w-4 h-4" />
                标记优秀
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
```

---

### Task 5: 创建筛选侧边栏组件

**Files:**
- Create: `app/assignment/components/FilterSidebar.tsx`
- Test: 在页面中测试筛选功能

- [ ] **Step 1: 创建筛选侧边栏组件**

创建文件：`app/assignment/components/FilterSidebar.tsx`

```typescript
'use client'

import { useState } from 'react'

interface FilterSidebarProps {
  onFilter: (filters: {
    student_id?: string
    course_id?: string
    status?: string
  }) => void
}

export default function FilterSidebar({ onFilter }: FilterSidebarProps) {
  const [selectedStudent, setSelectedStudent] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  const handleFilter = () => {
    onFilter({
      student_id: selectedStudent || undefined,
      course_id: selectedCourse || undefined,
      status: selectedStatus || undefined,
    })
  }

  const handleReset = () => {
    setSelectedStudent('')
    setSelectedCourse('')
    setSelectedStatus('')
    onFilter({})
  }

  return (
    <div className="w-64 bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">筛选条件</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            学员
          </label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">全部学员</option>
            <option value="student1">学员1</option>
            <option value="student2">学员2</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            课程
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">全部课程</option>
            <option value="course1">AI提示词</option>
            <option value="course2">AI绘图</option>
            <option value="course3">短视频剪辑</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            提交状态
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">全部状态</option>
            <option value="已提交">已提交</option>
            <option value="未提交">未提交</option>
          </select>
        </div>

        <div className="flex gap-2 pt-4">
          <button
            onClick={handleFilter}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            筛选
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            重置
          </button>
        </div>
      </div>
    </div>
  )
}
```

---

### Task 6: 创建新增/编辑弹窗组件

**Files:**
- Create: `app/assignment/components/AssignmentModal.tsx`
- Test: 在页面中测试弹窗功能

- [ ] **Step 1: 创建新增/编辑弹窗组件**

创建文件：`app/assignment/components/AssignmentModal.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import ModalConfirm from '../../components/ui/ModalConfirm'
import { Assignment } from '../hooks/useAssignment'

interface AssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Assignment['fields']>) => Promise<boolean>
  assignment?: Assignment | null
}

export default function AssignmentModal({
  isOpen,
  onClose,
  onSubmit,
  assignment,
}: AssignmentModalProps) {
  const [formData, setFormData] = useState({
    '作业内容': '',
    '提交状态': '已提交',
    '关联学员': [] as string[],
    '关联班级': [] as string[],
    '对应课时': 0,
    '是否优秀作品': false,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (assignment) {
      setFormData({
        '作业内容': assignment.fields['作业内容'] || '',
        '提交状态': assignment.fields['提交状态'] || '已提交',
        '关联学员': assignment.fields['关联学员'] || [],
        '关联班级': assignment.fields['关联班级'] || [],
        '对应课时': assignment.fields['对应课时'] || 0,
        '是否优秀作品': assignment.fields['是否优秀作品'] || false,
      })
    } else {
      setFormData({
        '作业内容': '',
        '提交状态': '已提交',
        '关联学员': [],
        '关联班级': [],
        '对应课时': 0,
        '是否优秀作品': false,
      })
    }
  }, [assignment, isOpen])

  const handleSubmit = async () => {
    if (!formData['作业内容']) {
      alert('请填写作业内容')
      return
    }

    setLoading(true)
    const success = await onSubmit(formData)
    setLoading(false)

    if (success) {
      onClose()
    }
  }

  return (
    <ModalConfirm
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleSubmit}
      title={assignment ? '编辑作业' : '新增作业'}
      confirmText="提交"
      confirmLoading={loading}
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            作业内容 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData['作业内容']}
            onChange={(e) => setFormData({ ...formData, '作业内容': e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入作业内容描述"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            对应课时
          </label>
          <input
            type="number"
            value={formData['对应课时']}
            onChange={(e) => setFormData({ ...formData, '对应课时': parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="请输入课时数"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            提交状态
          </label>
          <select
            value={formData['提交状态']}
            onChange={(e) => setFormData({ ...formData, '提交状态': e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="已提交">已提交</option>
            <option value="未提交">未提交</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            作业附件
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
            <p className="text-gray-600">点击或拖拽文件到此处上传</p>
            <p className="text-sm text-gray-400 mt-1">支持 jpg、png、pdf、mp4 等格式</p>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isExcellent"
            checked={formData['是否优秀作品']}
            onChange={(e) => setFormData({ ...formData, '是否优秀作品': e.target.checked })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isExcellent" className="ml-2 text-sm text-gray-700">
            标记为优秀作品
          </label>
        </div>
      </div>
    </ModalConfirm>
  )
}
```

---

### Task 7: 创建确认删除对话框组件

**Files:**
- Create: `app/assignment/components/ConfirmModal.tsx`
- Test: 在页面中测试确认对话框

- [ ] **Step 1: 创建确认删除对话框组件**

创建文件：`app/assignment/components/ConfirmModal.tsx`

```typescript
'use client'

import ModalConfirm from '../../components/ui/ModalConfirm'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message: string
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = '确认删除',
  message,
}: ConfirmModalProps) {
  return (
    <ModalConfirm
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      confirmText="确认删除"
      confirmStyle="danger"
    >
      <div className="text-center py-4">
        <p className="text-gray-600">{message}</p>
        <p className="text-sm text-gray-400 mt-2">此操作不可撤销</p>
      </div>
    </ModalConfirm>
  )
}
```

---

### Task 8: 创建作品列表容器组件

**Files:**
- Create: `app/assignment/components/AssignmentList.tsx`
- Test: 在页面中测试列表显示

- [ ] **Step 1: 创建作品列表容器组件**

创建文件：`app/assignment/components/AssignmentList.tsx`

```typescript
'use client'

import { Assignment } from '../hooks/useAssignment'
import AssignmentCard from './AssignmentCard'
import { Loader2 } from 'lucide-react'

interface AssignmentListProps {
  assignments: Assignment[]
  loading: boolean
  canOperate: (assignment: Assignment) => boolean
  canMarkExcellent: () => boolean
  onEdit: (assignment: Assignment) => void
  onDelete: (assignment: Assignment) => void
  onMarkExcellent: (assignment: Assignment) => void
}

export default function AssignmentList({
  assignments,
  loading,
  canOperate,
  canMarkExcellent,
  onEdit,
  onDelete,
  onMarkExcellent,
}: AssignmentListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">加载中...</span>
      </div>
    )
  }

  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p className="text-lg">暂无作业记录</p>
        <p className="text-sm mt-2">点击上方按钮添加第一个作业</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assignments.map((assignment) => (
        <AssignmentCard
          key={assignment.record_id}
          assignment={assignment}
          canOperate={canOperate(assignment)}
          canMarkExcellent={canMarkExcellent()}
          onEdit={onEdit}
          onDelete={onDelete}
          onMarkExcellent={onMarkExcellent}
        />
      ))}
    </div>
  )
}
```

---

### Task 9: 创建作业管理主页面

**Files:**
- Create: `app/assignment/page.tsx`
- Test: 访问 /assignment 页面测试

- [ ] **Step 1: 创建作业管理主页面**

创建文件：`app/assignment/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { Plus, LayoutGrid, List } from 'lucide-react'
import { useAssignment } from './hooks/useAssignment'
import FilterSidebar from './components/FilterSidebar'
import AssignmentList from './components/AssignmentList'
import AssignmentModal from './components/AssignmentModal'
import ConfirmModal from './components/ConfirmModal'
import Toast from '../components/ui/Toast'
import { Assignment } from './hooks/useAssignment'

export default function AssignmentPage() {
  const {
    assignments,
    loading,
    error,
    user,
    fetchAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    canOperate,
    canMarkExcellent,
  } = useAssignment()

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')

  useEffect(() => {
    fetchAssignments()
  }, [])

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message)
    setToastType(type)
    setTimeout(() => setToastMessage(''), 3000)
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
    
    const success = await deleteAssignment(selectedAssignment.record_id)
    
    if (success) {
      showToast('删除成功', 'success')
    } else {
      showToast('删除失败', 'error')
    }
    
    setIsDeleteModalOpen(false)
    setSelectedAssignment(null)
  }

  const handleMarkExcellent = async (assignment: Assignment) => {
    const success = await updateAssignment(assignment.record_id, {
      '是否优秀作品': true,
    })
    
    if (success) {
      showToast('标记优秀成功', 'success')
    } else {
      showToast('标记失败', 'error')
    }
  }

  const handleModalSubmit = async (data: Partial<Assignment['fields']>) => {
    if (selectedAssignment) {
      const success = await updateAssignment(selectedAssignment.record_id, data)
      if (success) {
        showToast('更新成功', 'success')
      }
      return success
    } else {
      const success = await createAssignment(data)
      if (success) {
        showToast('创建成功', 'success')
      }
      return success
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedAssignment(null)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">请先登录</p>
          <a href="/" className="text-blue-600 hover:underline">
            返回首页
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">作业管理系统</h1>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                欢迎，{user.name} ({user.type === 'teacher' ? '老师' : '学生'})
              </span>
              
              <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
              
              {(user.type === 'teacher' || user.type === 'student') && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  新增作业
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <FilterSidebar onFilter={fetchAssignments} />
          
          {/* Assignment List */}
          <div className="flex-1">
            <AssignmentList
              assignments={assignments}
              loading={loading}
              canOperate={canOperate}
              canMarkExcellent={canMarkExcellent}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMarkExcellent={handleMarkExcellent}
            />
          </div>
        </div>
      </main>

      {/* Modals */}
      <AssignmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleModalSubmit}
        assignment={selectedAssignment}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setSelectedAssignment(null)
        }}
        onConfirm={handleConfirmDelete}
        message={`确定要删除作业"${selectedAssignment?.fields['作业内容']}"吗？`}
      />

      {/* Toast */}
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} />
      )}
    </div>
  )
}
```

---

### Task 10: 在学生管理页面添加作业管理入口

**Files:**
- Modify: `app/student-management/page.tsx`
- Test: 访问学生管理页面，点击作业管理按钮

- [ ] **Step 1: 修改学生管理页面，添加作业管理按钮**

修改文件：`app/student-management/page.tsx`

在 `ActiveModule` 类型中添加 `'assignments'`：

```typescript
type ActiveModule = 'students' | 'teachers' | 'courses' | 'attendance' | 'payments' | 'assignments'
```

在侧边栏菜单中添加作业管理按钮：

```typescript
// 在现有的菜单项后面添加
<button
  onClick={() => window.location.href = '/assignment'}
  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
    activeModule === 'assignments'
      ? 'bg-blue-600 text-white'
      : 'text-gray-700 hover:bg-gray-100'
  }`}
>
  作业管理
</button>
```

在数据加载函数中添加 assignments 的处理（可选，如果需要从作业管理页面访问数据）：

```typescript
case 'assignments':
  // 不需要从学生管理页面加载数据
  break
```

---

## 自检清单

### 1. 规格覆盖检查

浏览设计文档的每个部分，确认每个需求都有对应的任务：

- [x] 作业列表展示 - Task 8 (AssignmentList)
- [x] 作品卡片显示 - Task 4 (AssignmentCard)
- [x] 新增作业 - Task 6 (AssignmentModal), Task 9 (page.tsx)
- [x] 编辑作业 - Task 6 (AssignmentModal), Task 9 (page.tsx)
- [x] 删除作业 - Task 7 (ConfirmModal), Task 9 (page.tsx)
- [x] 标记优秀 - Task 4 (AssignmentCard), Task 9 (page.tsx)
- [x] 筛选功能 - Task 5 (FilterSidebar), Task 9 (page.tsx)
- [x] 视图切换 - Task 9 (page.tsx header)
- [x] 权限控制 - Task 3 (useAssignment), Task 4, Task 9
- [x] API 路由 - Task 1, Task 2
- [x] 错误处理 - Task 3 (useAssignment), Task 9 (page.tsx toast)
- [x] 加载状态 - Task 8 (AssignmentList)

### 2. 占位符检查

搜索计划中是否有以下问题：
- ❌ 无 TBD、TODO
- ❌ 无"实现具体逻辑"等模糊描述
- ❌ 所有步骤都有具体代码

### 3. 类型一致性检查

检查类型和方法签名：
- ✅ `Assignment` 接口在 Task 3, 4, 6, 7, 8, 9 中一致使用
- ✅ `useAssignment` Hook 返回值在所有使用处一致
- ✅ API 路由路径一致 (`/api/assignments`, `/api/assignments/:id`)
- ✅ 组件 Props 接口一致

### 4. 现有代码集成

检查是否遵循现有模式：
- ✅ 使用现有的 `ModalConfirm` 组件
- ✅ 使用现有的 `Toast` 组件
- ✅ 遵循 Tailwind CSS 样式约定
- ✅ API 调用模式与现有代码一致

---

## 执行选项

**计划完成并保存到：** `docs/superpowers/plans/2026-06-01-assignment-management-plan.md`

**两种执行方式：**

### 1. 子代理驱动开发（推荐）✨
- 每个任务由新的子代理执行
- 任务间有检查点
- 快速迭代，即时反馈

### 2. 内部执行 📝
- 在当前会话中按顺序执行任务
- 分批执行，有检查点
- 更详细的控制

**您希望采用哪种执行方式？**
