'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Assignment {
  record_id: string;
  fields: {
    '作业ID'?: number;
    '作业标题'?: string;
    '作业描述'?: string;
    '关联学员'?: any;
    '关联课程'?: any;
    '截止日期'?: number;
    '作业状态'?: string;
    '提交日期'?: number;
    '作业分数'?: number;
    '作业反馈'?: string;
    '是否优秀'?: boolean;
  };
}

export interface AssignmentFilters {
  student_id?: string;
  class_id?: string;
  date_from?: string;
  date_to?: string;
}

export interface UserInfo {
  user_id: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
}

export interface Student {
  record_id: string;
  fields: {
    '姓名'?: string;
    [key: string]: any;
  };
}

export interface UseAssignmentReturn {
  assignments: Assignment[];
  students: Student[];
  courses: any[];
  loading: boolean;
  error: string | null;
  filters: AssignmentFilters;
  user: UserInfo | null;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  fetchAssignments: (filters?: AssignmentFilters) => Promise<void>;
  createAssignment: (data: Partial<Assignment['fields']>) => Promise<{ success: boolean; message?: string }>;
  updateAssignment: (id: string, data: Partial<Assignment['fields']>) => Promise<{ success: boolean; message?: string }>;
  deleteAssignment: (id: string) => Promise<{ success: boolean; message?: string }>;
  setFilters: (filters: AssignmentFilters) => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  canOperate: (assignment?: Assignment) => boolean;
}

function extractText(value: any): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) {
    return value.map(item => {
      if (typeof item === 'string') return item;
      if (item && typeof item === 'object' && 'text' in item) return item.text;
      return String(item);
    }).filter(Boolean).join(', ');
  }
  if (typeof value === 'object' && 'text' in value) return value.text;
  return String(value);
}

function getUserFromStorage(): UserInfo | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const dashboardLogin = localStorage.getItem('dashboard_login');
    if (dashboardLogin) {
      const loginData = JSON.parse(dashboardLogin);
      return {
        user_id: loginData.id || loginData.recordId || '',
        name: loginData.name || '',
        role: loginData.type === 'teacher' ? 'teacher' : 'student'
      };
    }
    
    const userStr = localStorage.getItem('userInfo');
    if (userStr) {
      const user = JSON.parse(userStr);
      return {
        user_id: user.user_id || user.open_id || '',
        name: user.name || user.user_name || '',
        role: user.role || 'student'
      };
    }
    
    const feishuUserStr = localStorage.getItem('feishu_user');
    if (feishuUserStr) {
      const user = JSON.parse(feishuUserStr);
      return {
        user_id: user.open_id || '',
        name: user.name || '',
        role: user.role || 'student'
      };
    }
  } catch (error) {
    console.error('解析用户信息失败:', error);
  }
  
  return null;
}

export function useAssignment(): UseAssignmentReturn {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AssignmentFilters>({});
  const [user, setUser] = useState<UserInfo | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const userInfo = getUserFromStorage();
    setUser(userInfo);
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/student-management/students?force_refresh=true');
        if (response.ok) {
          const result = await response.json();
          if (result.code === 0) {
            setStudents(result.data || []);
          }
        }
      } catch (error) {
        console.error('获取学员列表失败:', error);
      }
    };
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/student-management/courses?force_refresh=true');
        if (response.ok) {
          const result = await response.json();
          if (result.code === 0) {
            setCourses(result.data || []);
          }
        }
      } catch (error) {
        console.error('获取班级列表失败:', error);
      }
    };
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchAssignments = useCallback(async (newFilters?: AssignmentFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (newFilters?.student_id) params.append('student_id', newFilters.student_id);
      if (newFilters?.class_id) params.append('class_id', newFilters.class_id);
      if (newFilters?.date_from) params.append('date_from', newFilters.date_from);
      if (newFilters?.date_to) params.append('date_to', newFilters.date_to);
      params.append('force_refresh', 'true');
      params.append('page', currentPage.toString());
      params.append('page_size', pageSize.toString());
      
      const url = `/api/assignments${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('获取作业列表失败');
      }
      
      const result = await response.json();
      
      if (result.code === 0) {
        setAssignments(result.data || []);
        setTotalCount(result.total || result.data?.length || 0);
      } else {
        throw new Error(result.msg || '获取作业列表失败');
      }
    } catch (err: any) {
      console.error('获取作业列表错误:', err);
      setError(err.message || '获取作业列表失败');
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize]);

  const createAssignment = useCallback(async (data: Partial<Assignment['fields']>): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('创建作业失败');
      }
      
      const result = await response.json();
      
      if (result.code === 0) {
        await fetchAssignments(filters);
        return { success: true, message: result.msg || '作业创建成功' };
      } else {
        throw new Error(result.msg || '创建作业失败');
      }
    } catch (err: any) {
      console.error('创建作业错误:', err);
      const errorMsg = err.message || '创建作业失败';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [fetchAssignments, filters]);

  const updateAssignment = useCallback(async (id: string, data: Partial<Assignment['fields']>): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/assignments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('更新作业失败');
      }
      
      const result = await response.json();
      
      if (result.code === 0) {
        await fetchAssignments(filters);
        return { success: true, message: result.msg || '作业更新成功' };
      } else {
        throw new Error(result.msg || '更新作业失败');
      }
    } catch (err: any) {
      console.error('更新作业错误:', err);
      const errorMsg = err.message || '更新作业失败';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [fetchAssignments, filters]);

  const deleteAssignment = useCallback(async (id: string): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/assignments/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('删除作业失败');
      }
      
      const result = await response.json();
      
      if (result.code === 0) {
        setAssignments(prev => prev.filter(item => item.record_id !== id));
        return { success: true, message: result.msg || '作业删除成功' };
      } else {
        throw new Error(result.msg || '删除作业失败');
      }
    } catch (err: any) {
      console.error('删除作业错误:', err);
      const errorMsg = err.message || '删除作业失败';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  const canOperate = useCallback((assignment?: Assignment): boolean => {
    if (!user) return false;
    
    if (user.role === 'admin') return true;
    
    if (user.role === 'teacher') return true;
    
    if (user.role === 'student' && assignment) {
      const fieldValue = assignment.fields['关联学员'];
      const studentName = user.name?.trim() || '';
      
      // 首先检查是否是空对象（不属于任何人）
      if (Array.isArray(fieldValue) && fieldValue.length > 0) {
        const item = fieldValue[0];
        if (item && typeof item === 'object') {
          const isEmptyObject = (!item.record_ids || item.record_ids.length === 0) &&
                               (!item.text_arr || item.text_arr.length === 0) &&
                               (!item.text);
          if (isEmptyObject) {
            return false;
          }
          
          // 使用 record_ids 查找关联学员的真实姓名
          if (item.record_ids && Array.isArray(item.record_ids) && students.length > 0) {
            for (const rid of item.record_ids) {
              const matchedStudent = students.find(s => s.record_id === rid);
              if (matchedStudent && matchedStudent.fields['姓名'] === studentName) {
                return true;
              }
            }
          }
          
          // 检查 text 字段是否匹配
          if (item.text && item.text === studentName) {
            return true;
          }
        }
      }
      
      // 检查 text_arr
      if (Array.isArray(fieldValue) && fieldValue.length > 0) {
        const item = fieldValue[0];
        if (item && item.text_arr && Array.isArray(item.text_arr)) {
          if (item.text_arr.includes(studentName)) {
            return true;
          }
        }
      }
      
      return false;
    }
    
    return false;
  }, [user, students]);

  const handleSetCurrentPage = useCallback((page: number) => {
    setCurrentPage(page);
    fetchAssignments(filters);
  }, [fetchAssignments, filters]);

  const handleSetPageSize = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    fetchAssignments(filters);
  }, [fetchAssignments, filters]);

  return {
    assignments,
    students,
    courses,
    loading,
    error,
    filters,
    user,
    totalCount,
    currentPage,
    pageSize,
    fetchAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    setFilters,
    setCurrentPage: handleSetCurrentPage,
    setPageSize: handleSetPageSize,
    canOperate,
  };
}

export default useAssignment;