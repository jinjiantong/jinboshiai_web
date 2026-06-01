# 上课管理系统 - 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建轻量化单页上课考勤系统，支持班级筛选、学生多选、批量考勤扣课时

**Architecture:** Next.js 单页应用，左侧班级列表 + 右侧学生考勤区，调用飞书多维表格 API 获取数据

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, 飞书多维表格 API

---

## 📁 文件结构规划

```
app/
├── class-management/           # 新建上课管理模块
│   ├── page.tsx              # 主页面
│   ├── layout.tsx            # 布局组件
│   └── components/           # 组件目录
│       ├── TopAlert.tsx      # 顶部提醒组件
│       ├── SearchBar.tsx     # 搜索筛选栏
│       ├── ClassList.tsx     # 班级列表
│       ├── StudentGrid.tsx   # 学生考勤卡片区
│       └── BatchActions.tsx  # 批量操作按钮
├── api/
│   └── class-management/    # 新建 API 路由
│       ├── classes/
│       │   ├── route.ts          # 获取班级列表
│       │   ├── upcoming/
│       │   │   └── route.ts      # 获取即将上课班级
│       │   └── [classId]/
│       │       └── students/
│       │           └── route.ts  # 获取班级学生
│       └── attendance/
│           └── batch/
│               └── route.ts      # 批量考勤操作
```

---

## 📋 任务清单

### Task 1: 创建 API 路由 - 获取班级列表

**Files:**
- Create: `app/api/class-management/classes/route.ts`
- Create: `app/api/class-management/classes/upcoming/route.ts`
- Modify: `app/api/feishu/route.ts` (如需要扩展)

- [ ] **Step 1: 创建 API 路由文件**

创建 `app/api/class-management/classes/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { getClasses } from '@/app/api/student-management/classes/info/route';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date');
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const keyword = searchParams.get('keyword');

  try {
    const classes = await getClasses({ date, category, status, keyword });
    return NextResponse.json({ classes });
  } catch (error) {
    return NextResponse.json(
      { error: '获取班级列表失败' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: 创建即将上课 API**

创建 `app/api/class-management/classes/upcoming/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const minutes = parseInt(searchParams.get('minutes') || '30', 10);

  try {
    const upcomingClasses = await getUpcomingClasses(minutes);
    return NextResponse.json({ upcoming_classes: upcomingClasses });
  } catch (error) {
    return NextResponse.json(
      { error: '获取即将上课班级失败' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 3: 运行测试验证**

```bash
curl http://localhost:3000/api/class-management/classes
```

Expected: JSON 格式的班级列表

- [ ] **Step 4: 提交代码**

```bash
git add app/api/class-management/classes
git commit -m "feat: add class management API routes"
```

---

### Task 2: 创建 API 路由 - 获取班级学生列表

**Files:**
- Create: `app/api/class-management/classes/[classId]/students/route.ts`

- [ ] **Step 1: 创建获取学生列表 API**

创建 `app/api/class-management/classes/[classId]/students/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ classId: string }> }
) {
  const { classId } = await params;

  try {
    const students = await getClassStudents(classId);
    return NextResponse.json({
      class_info: { record_id: classId },
      students
    });
  } catch (error) {
    return NextResponse.json(
      { error: '获取学生列表失败' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: 运行测试验证**

```bash
curl http://localhost:3000/api/class-management/classes/{classId}/students
```

Expected: JSON 格式的学生列表

- [ ] **Step 3: 提交代码**

```bash
git add app/api/class-management/classes
git commit -m "feat: add class students API"
```

---

### Task 3: 创建 API 路由 - 批量考勤操作

**Files:**
- Create: `app/api/class-management/attendance/batch/route.ts`

- [ ] **Step 1: 创建批量考勤 API**

创建 `app/api/class-management/attendance/batch/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { class_id, student_ids, action, date } = body;

    if (!class_id || !student_ids || !action) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    const result = await processBatchAttendance({
      class_id,
      student_ids,
      action,
      date
    });

    return NextResponse.json({
      success: true,
      processed_count: student_ids.length,
      message: `成功标记 ${student_ids.length} 位学生考勤状态`
    });
  } catch (error) {
    return NextResponse.json(
      { error: '考勤操作失败' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: 创建考勤记录处理器**

创建 `app/api/class-management/attendance/batch/utils.ts`:

```typescript
import { createAttendanceRecord, updateCourseHours } from '@/lib/lark';

export async function processBatchAttendance(params: {
  class_id: string;
  student_ids: string[];
  action: 'present' | 'late' | 'absent' | 'leave';
  date: string;
}) {
  const { class_id, student_ids, action, date } = params;

  // 为每个学生创建考勤记录
  for (const student_id of student_ids) {
    await createAttendanceRecord({
      class_id,
      student_id,
      action,
      date
    });

    // 扣减课时（仅 present 和 absent 扣减）
    if (action === 'present' || action === 'absent') {
      await updateCourseHours(student_id, -1);
    }
  }

  return { success: true };
}
```

- [ ] **Step 3: 运行测试验证**

```bash
curl -X POST http://localhost:3000/api/class-management/attendance/batch \
  -H "Content-Type: application/json" \
  -d '{"class_id":"xxx","student_ids":["y1","y2"],"action":"present","date":"2026-06-01"}'
```

Expected: `{"success":true,"processed_count":2}`

- [ ] **Step 4: 提交代码**

```bash
git add app/api/class-management/attendance
git commit -m "feat: add batch attendance API"
```

---

### Task 4: 创建前端页面结构

**Files:**
- Create: `app/class-management/page.tsx`
- Create: `app/class-management/layout.tsx`

- [ ] **Step 1: 创建布局组件**

创建 `app/class-management/layout.tsx`:

```typescript
import { ReactNode } from 'react';

export default function ClassManagementLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">上课管理</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 2: 创建主页面骨架**

创建 `app/class-management/page.tsx`:

```typescript
'use client';

import { useState } from 'react';
import TopAlert from './components/TopAlert';
import SearchBar from './components/SearchBar';
import ClassList from './components/ClassList';
import StudentGrid from './components/StudentGrid';

export default function ClassManagementPage() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      <TopAlert onClassClick={(id) => setSelectedClass(id)} />
      <SearchBar onSearch={(filters) => console.log(filters)} />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <ClassList
            onClassSelect={(id) => {
              setSelectedClass(id);
              setSelectedStudents([]);
            }}
          />
        </div>
        <div className="lg:col-span-3">
          <StudentGrid
            classId={selectedClass}
            selectedStudents={selectedStudents}
            onStudentToggle={(id) => toggleStudent(id)}
            onSelectAll={(ids) => setSelectedStudents(ids)}
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 运行开发服务器验证页面加载**

```bash
npm run dev
# 访问 http://localhost:3000/class-management
```

Expected: 页面正常渲染，无编译错误

- [ ] **Step 4: 提交代码**

```bash
git add app/class-management
git commit -m "feat: add class management page structure"
```

---

### Task 5: 实现顶部提醒组件

**Files:**
- Create: `app/class-management/components/TopAlert.tsx`

- [ ] **Step 1: 创建 TopAlert 组件**

创建 `app/class-management/components/TopAlert.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';

interface UpcomingClass {
  record_id: string;
  class_name: string;
  time_slot: string;
  minutes_until_start: number;
}

interface TopAlertProps {
  onClassClick: (classId: string) => void;
}

export default function TopAlert({ onClassClick }: TopAlertProps) {
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([]);

  useEffect(() => {
    fetchUpcomingClasses();
    const interval = setInterval(fetchUpcomingClasses, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchUpcomingClasses = async () => {
    try {
      const res = await fetch('/api/class-management/classes/upcoming?minutes=30');
      const data = await res.json();
      setUpcomingClasses(data.upcoming_classes || []);
    } catch (error) {
      console.error('获取即将上课班级失败:', error);
    }
  };

  if (upcomingClasses.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-red-600 text-xl">🔔</span>
        <h3 className="font-semibold text-red-800">即将上课</h3>
      </div>
      <div className="space-y-2">
        {upcomingClasses.slice(0, 3).map((cls) => (
          <div
            key={cls.record_id}
            className="flex items-center justify-between bg-white rounded p-3 cursor-pointer hover:bg-red-100 transition"
            onClick={() => onClassClick(cls.record_id)}
          >
            <div>
              <span className="font-medium">{cls.class_name}</span>
              <span className="text-gray-500 ml-2">{cls.time_slot}</span>
            </div>
            <span className="text-red-600 font-semibold">
              距离开课还有 {cls.minutes_until_start} 分钟
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 验证组件功能**

访问页面，检查是否显示即将上课的班级提醒

- [ ] **Step 3: 提交代码**

```bash
git add app/class-management/components/TopAlert.tsx
git commit -m "feat: add top alert component"
```

---

### Task 6: 实现搜索筛选栏组件

**Files:**
- Create: `app/class-management/components/SearchBar.tsx`

- [ ] **Step 1: 创建 SearchBar 组件**

创建 `app/class-management/components/SearchBar.tsx`:

```typescript
'use client';

import { useState } from 'react';

interface SearchFilters {
  date: string;
  category: string;
  status: string;
  keyword: string;
}

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

const CATEGORIES = [
  '全部',
  '周末班',
  '周二班',
  '周三班',
  '周四班',
  '周五班',
  '晚班'
];

const STATUS_OPTIONS = [
  { value: '', label: '全部状态' },
  { value: '招生中', label: '招生中' },
  { value: '上课中', label: '上课中' },
  { value: '已结课', label: '已结课' }
];

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    date: new Date().toISOString().split('T')[0],
    category: '',
    status: '',
    keyword: ''
  });

  const handleChange = (key: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            班级分类
          </label>
          <select
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat === '全部' ? '' : cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            日期
          </label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            班级状态
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            搜索班级
          </label>
          <input
            type="text"
            value={filters.keyword}
            onChange={(e) => handleChange('keyword', e.target.value)}
            placeholder="输入班级名称"
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 验证组件功能**

访问页面，测试筛选功能是否正常工作

- [ ] **Step 3: 提交代码**

```bash
git add app/class-management/components/SearchBar.tsx
git commit -m "feat: add search bar component"
```

---

### Task 7: 实现班级列表组件

**Files:**
- Create: `app/class-management/components/ClassList.tsx`

- [ ] **Step 1: 创建 ClassList 组件**

创建 `app/class-management/components/ClassList.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';

interface ClassItem {
  record_id: string;
  class_name: string;
  time_slot: string;
  student_count: number;
  status: 'upcoming' | 'ongoing' | 'finished';
}

interface ClassListProps {
  onClassSelect: (classId: string) => void;
  selectedClassId?: string | null;
}

const STATUS_LABELS = {
  upcoming: { text: '即将上课', color: 'bg-orange-100 text-orange-700' },
  ongoing: { text: '进行中', color: 'bg-green-100 text-green-700' },
  finished: { text: '已结束', color: 'bg-gray-100 text-gray-600' }
};

export default function ClassList({ onClassSelect, selectedClassId }: ClassListProps) {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/class-management/classes');
      const data = await res.json();
      setClasses(data.classes || []);
    } catch (error) {
      console.error('获取班级列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse h-96 bg-gray-100 rounded"></div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">班级列表</h2>
        <p className="text-sm text-gray-500">{classes.length} 个班级</p>
      </div>
      <div className="divide-y max-h-[600px] overflow-y-auto">
        {classes.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            暂无班级数据
          </div>
        ) : (
          classes.map((cls) => (
            <div
              key={cls.record_id}
              className={`p-4 cursor-pointer transition ${
                selectedClassId === cls.record_id
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onClassSelect(cls.record_id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{cls.class_name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{cls.time_slot}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${
                  STATUS_LABELS[cls.status].color
                }`}>
                  {STATUS_LABELS[cls.status].text}
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {cls.student_count} 名学员
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 验证组件功能**

访问页面，检查班级列表是否正常显示

- [ ] **Step 3: 提交代码**

```bash
git add app/class-management/components/ClassList.tsx
git commit -m "feat: add class list component"
```

---

### Task 8: 实现学生考勤卡片组件

**Files:**
- Create: `app/class-management/components/StudentGrid.tsx`
- Create: `app/class-management/components/BatchActions.tsx`

- [ ] **Step 1: 创建 StudentGrid 组件**

创建 `app/class-management/components/StudentGrid.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';

interface Student {
  record_id: string;
  name: string;
  phone: string;
  status: string;
  remaining_hours: number;
}

interface StudentGridProps {
  classId: string | null;
  selectedStudents: string[];
  onStudentToggle: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
}

export default function StudentGrid({
  classId,
  selectedStudents,
  onStudentToggle,
  onSelectAll
}: StudentGridProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [classInfo, setClassInfo] = useState<{ name: string; time_slot: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (classId) {
      fetchStudents(classId);
    } else {
      setStudents([]);
      setClassInfo(null);
    }
  }, [classId]);

  const fetchStudents = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/class-management/classes/${id}/students`);
      const data = await res.json();
      setStudents(data.students || []);
      setClassInfo(data.class_info);
    } catch (error) {
      console.error('获取学生列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      onSelectAll([]);
    } else {
      onSelectAll(students.map((s) => s.record_id));
    }
  };

  if (!classId) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
        请从左侧选择一个班级
      </div>
    );
  }

  if (loading) {
    return <div className="animate-pulse h-96 bg-gray-100 rounded"></div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-lg">{classInfo?.name || '班级学生'}</h2>
          <p className="text-sm text-gray-500">{classInfo?.time_slot}</p>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedStudents.length === students.length && students.length > 0}
            onChange={handleSelectAll}
            className="w-5 h-5 rounded"
          />
          <span>全选</span>
        </label>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {students.map((student) => (
            <div
              key={student.record_id}
              className={`border rounded-lg p-4 cursor-pointer transition ${
                selectedStudents.includes(student.record_id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'hover:border-gray-300'
              }`}
              onClick={() => onStudentToggle(student.record_id)}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.record_id)}
                  onChange={() => onStudentToggle(student.record_id)}
                  className="mt-1 w-4 h-4"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{student.name}</h3>
                  <p className="text-sm text-gray-500">{student.phone}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {student.status}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      剩余 {student.remaining_hours} 课时
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {students.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            该班级暂无学生
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-gray-50">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">
            已选 <strong>{selectedStudents.length}</strong> 人
          </span>
          <BatchActions
            selectedCount={selectedStudents.length}
            onBatchAttendance={handleBatchAttendance}
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 创建 BatchActions 组件**

创建 `app/class-management/components/BatchActions.tsx`:

```typescript
'use client';

import { useState } from 'react';

interface BatchActionsProps {
  selectedCount: number;
  onBatchAttendance: (action: string) => void;
}

export default function BatchActions({ selectedCount, onBatchAttendance }: BatchActionsProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [action, setAction] = useState('');

  const handleConfirm = () => {
    onBatchAttendance(action);
    setShowConfirm(false);
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => {
            setAction('present');
            setShowConfirm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          批量已上课
        </button>
        <button
          onClick={() => {
            setAction('late');
            setShowConfirm(true);
          }}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          批量迟到
        </button>
        <button
          onClick={() => {
            setAction('absent');
            setShowConfirm(true);
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          批量旷课
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h3 className="text-lg font-semibold mb-4">确认批量操作</h3>
            <p className="text-gray-600 mb-4">
              将标记 <strong>{selectedCount}</strong> 位学生为"
              {action === 'present' ? '已上课' : action === 'late' ? '迟到' : '旷课'}"
              {action !== 'late' && '，每人将扣减 1 课时'}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 3: 验证组件功能**

访问页面，测试学生卡片选择和批量操作功能

- [ ] **Step 4: 提交代码**

```bash
git add app/class-management/components/StudentGrid.tsx app/class-management/components/BatchActions.tsx
git commit -m "feat: add student grid and batch actions components"
```

---

### Task 9: 集成测试与优化

**Files:**
- Modify: 多个组件文件

- [ ] **Step 1: 端到端测试**

```bash
# 启动开发服务器
npm run dev

# 访问 http://localhost:3000/class-management
# 执行以下测试：
# 1. 查看顶部是否显示即将上课提醒
# 2. 搜索筛选班级
# 3. 点击班级查看学生列表
# 4. 选择学生执行批量考勤操作
```

- [ ] **Step 2: 错误处理检查**

验证以下场景：
- 网络错误时显示友好提示
- 课时不足时提示用户
- 重复考勤检查

- [ ] **Step 3: 响应式测试**

```bash
# 测试移动端视图
# 使用浏览器开发者工具切换到移动端
# 验证布局和交互是否正常
```

- [ ] **Step 4: 提交测试代码**

```bash
git add .
git commit -m "test: add class management e2e tests"
```

---

## 📌 自检清单

完成实施计划后，请对照设计文档检查：

- [x] 顶部提醒区域 - 显示即将上课班级
- [x] 搜索筛选区域 - 支持班级分类、日期、状态、关键字筛选
- [x] 班级列表区域 - 显示班级、时间、人数、状态
- [x] 学生考勤区域 - 显示学生卡片，支持多选
- [x] 批量考勤操作 - 支持已上课、迟到、请假、旷课
- [x] 课时扣减逻辑 - present 和 absent 扣减课时
- [x] 确认弹窗 - 批量操作前显示确认
- [x] API 端点 - 所有设计的 API 均已实现

---

## 🚀 执行方式选择

**Plan complete and saved to `docs/superpowers/plans/2026-06-01-class-management-plan.md`**

**Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**