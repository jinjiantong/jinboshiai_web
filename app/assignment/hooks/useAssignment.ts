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
  course_id?: string;
  status?: string;
}

export interface UserInfo {
  user_id: string;
  name: string;
  role: 'admin' | 'teacher' | 'student';
}

export interface UseAssignmentReturn {
  assignments: Assignment[];
  loading: boolean;
  error: string | null;
  filters: AssignmentFilters;
  user: UserInfo | null;
  fetchAssignments: (filters?: AssignmentFilters) => Promise<void>;
  createAssignment: (data: Partial<Assignment['fields']>) => Promise<{ success: boolean; message?: string }>;
  updateAssignment: (id: string, data: Partial<Assignment['fields']>) => Promise<{ success: boolean; message?: string }>;
  deleteAssignment: (id: string) => Promise<{ success: boolean; message?: string }>;
  setFilters: (filters: AssignmentFilters) => void;
  canOperate: (assignment?: Assignment) => boolean;
  canMarkExcellent: (assignment?: Assignment) => boolean;
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AssignmentFilters>({});
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const userInfo = getUserFromStorage();
    setUser(userInfo);
  }, []);

  const fetchAssignments = useCallback(async (newFilters?: AssignmentFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (newFilters?.student_id) params.append('student_id', newFilters.student_id);
      if (newFilters?.course_id) params.append('course_id', newFilters.course_id);
      if (newFilters?.status) params.append('status', newFilters.status);
      params.append('force_refresh', 'true');
      
      const url = `/api/assignments${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('获取作业列表失败');
      }
      
      const result = await response.json();
      
      if (result.code === 0) {
        setAssignments(result.data || []);
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
  }, []);

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
      const linkedStudent = extractText(assignment.fields['关联学员']);
      return linkedStudent.includes(user.user_id) || linkedStudent.includes(user.name);
    }
    
    return false;
  }, [user]);

  const canMarkExcellent = useCallback((assignment?: Assignment): boolean => {
    if (!user) return false;
    
    if (user.role === 'admin') return true;
    
    if (user.role === 'teacher') return true;
    
    return false;
  }, [user]);

  return {
    assignments,
    loading,
    error,
    filters,
    user,
    fetchAssignments,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    setFilters,
    canOperate,
    canMarkExcellent,
  };
}

export default useAssignment;