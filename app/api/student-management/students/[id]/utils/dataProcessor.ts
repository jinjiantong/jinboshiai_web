/**
 * 飞书多维表格数据处理工具
 * 统一处理数据格式转换、类型验证、缓存管理等
 */

import { NextResponse } from 'next/server';

/**
 * 字段类型定义
 */
export interface FieldConfig {
  name: string;
  type: 'text' | 'number' | 'currency' | 'link' | 'date' | 'checkbox' | 'select' | 'multiSelect';
  required?: boolean;
  defaultValue?: any;
}

/**
 * 表格配置
 */
export interface TableConfig {
  tableId: string;
  fields: FieldConfig[];
}

/**
 * 所有表格的字段配置
 */
export const TABLE_CONFIGS: Record<string, TableConfig> = {
  teachers: {
    tableId: 'tblxN3e1fyhOMTSt',
    fields: [
      { name: '老师ID', type: 'text' },
      { name: '老师姓名', type: 'text' },
      { name: '联系电话', type: 'text' },
      { name: '授课科目', type: 'multiSelect' },
      { name: '可带班级', type: 'number' },
      { name: '授课课时统计', type: 'number' },
      { name: '老师绩效', type: 'number' },
      { name: '上课评价', type: 'text' },
      { name: '上课班级ID', type: 'link' },
    ],
  },
  students: {
    tableId: 'tblhnKUAyBJbpoDo',
    fields: [
      { name: '学员ID', type: 'text' },
      { name: '姓名', type: 'text' },
      { name: '学员联系人', type: 'link' },
      { name: '性别', type: 'text' },
      { name: '年龄', type: 'number' },
      { name: '联系电话', type: 'text' },
      { name: '微信', type: 'text' },
      { name: '来源渠道', type: 'text' },
      { name: '报名日期', type: 'date' },
      { name: '学习状态', type: 'text' },
      { name: '备注', type: 'text' },
      { name: '所学课程', type: 'checkbox' },
      { name: '报名班级', type: 'link' },
      { name: '授课老师', type: 'link' },
      { name: '旷课次数', type: 'text' },
    ],
  },
  courses: {
    tableId: 'tblThjrxFT0mZ3pL',
    fields: [
      { name: '课程名称', type: 'select' },
      { name: '课程类型', type: 'select' },
      { name: '课时', type: 'number' },
      { name: '课程时长', type: 'number' },
      { name: '班级人数', type: 'number' },
      { name: '满班人数', type: 'number' },
    ],
  },
  payments: {
    tableId: 'tblhIFrvvseuEgIh',
    fields: [
      { name: '应收学费', type: 'currency' },
      { name: '缴费金额', type: 'currency' },
      { name: '缴费类型', type: 'select' },
      { name: '收款方式', type: 'select' },
    ],
  },
  attendance: {
    tableId: 'tbl28gcD5cNjhYg8',
    fields: [
      { name: '签到状态', type: 'select' },
      { name: '签到方式', type: 'select' },
      { name: '请假原因', type: 'text' },
    ],
  },
};

/**
 * 提取富文本字段的文本内容
 * 飞书 API 返回的文本字段格式: [{ text: "内容", type: "text" }]
 */
export function extractText(value: any): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object' && 'text' in item) return item.text;
        return String(item);
      })
      .filter(Boolean)
      .join(', ');
  }
  
  if (typeof value === 'object' && 'text' in value) {
    return value.text;
  }
  
  return String(value);
}

/**
 * 将富文本字段转换为简单对象（用于 API 提交）
 * 输入: [{ text: "内容", type: "text" }]
 * 输出: "内容"
 */
export function simplifyRichText(value: any): any {
  if (!value) return value;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  
  if (Array.isArray(value)) {
    if (value.length > 0 && typeof value[0] === 'object' && 'text' in value[0]) {
      return extractText(value);
    }
    return value;
  }
  
  if (typeof value === 'object' && 'text' in value) {
    return value.text;
  }
  
  return value;
}

/**
 * 处理字段值，根据字段类型进行转换
 */
export function processFieldValue(value: any, fieldType: FieldConfig['type']): any {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  
  switch (fieldType) {
    case 'number':
    case 'currency':
      const num = parseFloat(value);
      return isNaN(num) ? 0 : num;
      
    case 'text':
      return simplifyRichText(value);
      
    case 'checkbox':
      if (Array.isArray(value)) {
        return value.flatMap(v => {
          if (typeof v === 'string') {
            return [v];
          }
          if (v && typeof v === 'object') {
            if (v.record_ids && Array.isArray(v.record_ids)) {
              return v.record_ids;
            }
            if (v.record_id) {
              return [v.record_id];
            }
            return [];
          }
          return [];
        });
      }
      if (typeof value === 'string') {
        return [value];
      }
      if (value && typeof value === 'object') {
        if (value.record_ids && Array.isArray(value.record_ids)) {
          return value.record_ids;
        }
        if (value.record_id) {
          return [value.record_id];
        }
      }
      return [];
      
    case 'date':
      if (typeof value === 'number') return value;
      if (value instanceof Date) return value.getTime();
      if (typeof value === 'string') return new Date(value).getTime();
      return undefined;
      
    case 'link':
      if (Array.isArray(value)) {
        if (value.length > 0) {
          const firstItem = value[0];
          if (typeof firstItem === 'string') return value;
          if (firstItem && typeof firstItem === 'object' && firstItem.record_ids) {
            return firstItem.record_ids;
          }
          if (firstItem && typeof firstItem === 'object' && firstItem.link_record_ids) {
            return firstItem.link_record_ids;
          }
        }
        return [];
      }
      if (typeof value === 'string') return [value];
      return value;
      
    case 'multiSelect':
      if (Array.isArray(value)) return value;
      if (typeof value === 'string') return [value];
      return [];
      
    default:
      return simplifyRichText(value);
  }
}

/**
 * 验证并转换字段值（用于 PUT/POST 请求）
 */
export function validateAndConvertFields(
  fields: Record<string, any>,
  tableName: string
): Record<string, any> {
  const config = TABLE_CONFIGS[tableName];
  if (!config) {
    console.warn(`Unknown table: ${tableName}`);
    return fields;
  }
  
  const result: Record<string, any> = {};
  
  config.fields.forEach((field) => {
    if (fields[field.name] !== undefined) {
      const processed = processFieldValue(fields[field.name], field.type);
      if (processed !== undefined) {
        result[field.name] = processed;
      }
    }
  });
  
  return result;
}

/**
 * 统一错误响应格式
 */
export function errorResponse(message: string, status: number = 500) {
  return NextResponse.json(
    {
      code: -1,
      msg: message,
      timestamp: Date.now(),
    },
    { status }
  );
}

/**
 * 统一成功响应格式
 */
export function successResponse(data: any, message?: string) {
  return NextResponse.json({
    code: 0,
    data,
    message: message || 'Success',
    timestamp: Date.now(),
  });
}

/**
 * 缓存管理类
 */
export class CacheManager<T> {
  private cache: Map<string, { data: T; timestamp: number }> = new Map();
  private ttl: number;
  
  constructor(ttl: number = 30000) {
    this.ttl = ttl;
  }
  
  get(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
  
  set(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }
  
  invalidate(key: string): void {
    this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
}

/**
 * 记录缓存
 */
export const recordCache = new CacheManager<any>(30000);

/**
 * 列表缓存
 */
export const listCache = new CacheManager<any[]>(30000);
