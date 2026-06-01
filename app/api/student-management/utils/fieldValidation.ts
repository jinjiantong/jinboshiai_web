/**
 * 飞书多维表格数据验证和转换工具
 * 解决 NumberFieldConvFail、LinkFieldConvFail 等常见错误
 */

export interface FieldValidationRule {
  fieldName: string;
  type: 'number' | 'currency' | 'link' | 'date' | 'checkbox';
  required?: boolean;
}

/**
 * 数字字段类型转换
 * 飞书 API 要求数字字段必须传递整数或浮点数，不能是字符串
 * 
 * @param value - 原始值（可能是字符串、数字等）
 * @param defaultValue - 默认值
 * @returns 转换后的数字
 */
export function convertToNumber(value: any, defaultValue: number = 0): number {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }
  
  const numValue = parseFloat(value);
  return isNaN(numValue) ? defaultValue : numValue;
}

/**
 * 关联字段类型转换
 * 飞书 API 要求关联字段必须传递 record_id 的字符串数组
 * 
 * @param value - 原始值（可能是对象或数组）
 * @returns 转换后的 record_id 数组
 */
export function convertToLinkIds(value: any): string[] {
  if (!value) {
    return [];
  }
  
  if (Array.isArray(value)) {
    if (value.length > 0) {
      const firstItem = value[0];
      if (typeof firstItem === 'string') {
        return value;
      }
      if (firstItem && typeof firstItem === 'object' && firstItem.record_ids) {
        return firstItem.record_ids;
      }
    }
    return [];
  }
  
  if (typeof value === 'string') {
    return [value];
  }
  
  if (typeof value === 'object' && value.record_ids) {
    return value.record_ids;
  }
  
  return [];
}

/**
 * 日期字段类型转换
 * 飞书 API 要求日期字段必须传递时间戳（毫秒）
 * 
 * @param value - 原始值（可能是 Date 对象、字符串或时间戳）
 * @returns 转换后的时间戳
 */
export function convertToTimestamp(value: any): number | null {
  if (!value) {
    return null;
  }
  
  if (typeof value === 'number') {
    return value;
  }
  
  if (value instanceof Date) {
    return value.getTime();
  }
  
  if (typeof value === 'string') {
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      return date.getTime();
    }
  }
  
  return null;
}

/**
 * 复选框字段类型转换
 * 飞书 API 要求复选框必须传递布尔值
 * 
 * @param value - 原始值
 * @returns 转换后的布尔值
 */
export function convertToBoolean(value: any): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' || value === '1';
  }
  return Boolean(value);
}

/**
 * 批量验证和转换字段
 * 根据预定义的规则批量处理数据
 * 
 * @param fields - 原始字段对象
 * @param rules - 验证规则数组
 * @returns 转换后的字段对象
 */
export function validateAndConvertFields(
  fields: Record<string, any>,
  rules: FieldValidationRule[]
): Record<string, any> {
  const result: Record<string, any> = { ...fields };
  
  rules.forEach(rule => {
    const value = result[rule.fieldName];
    
    switch (rule.type) {
      case 'number':
      case 'currency':
        result[rule.fieldName] = convertToNumber(value);
        break;
        
      case 'link':
        result[rule.fieldName] = convertToLinkIds(value);
        break;
        
      case 'date':
        const timestamp = convertToTimestamp(value);
        if (timestamp !== null) {
          result[rule.fieldName] = timestamp;
        }
        break;
        
      case 'checkbox':
        result[rule.fieldName] = convertToBoolean(value);
        break;
    }
  });
  
  return result;
}

/**
 * 预设的表格字段验证规则
 */
export const TABLE_VALIDATION_RULES: Record<string, FieldValidationRule[]> = {
  // 师资管理表
  teachers: [
    { fieldName: '可带班级', type: 'number' },
    { fieldName: '授课课时统计', type: 'number' },
    { fieldName: '老师绩效', type: 'number' },
  ],
  
  // 学员档案表
  students: [
    { fieldName: '年龄', type: 'number' },
  ],
  
  // 课程记录表
  courses: [
    { fieldName: '课时', type: 'number' },
    { fieldName: '课程时长', type: 'number' },
    { fieldName: '班级人数', type: 'number' },
    { fieldName: '满班人数', type: 'number' },
  ],
  
  // 学费缴费表
  payments: [
    { fieldName: '应收学费', type: 'currency' },
    { fieldName: '缴费金额', type: 'currency' },
  ],
  
  // 考勤记录表 - 无需数字转换
  attendance: [],
  
  // 作业学情表
  assignments: [
    { fieldName: '对应课时', type: 'number' },
    { fieldName: '学习评分', type: 'number' },
  ],
  
  // 课时记录表
  classHours: [
    { fieldName: '总课时', type: 'number' },
    { fieldName: '已上课时', type: 'number' },
  ],
};

/**
 * 根据模块名称获取验证规则并转换字段
 * 
 * @param fields - 原始字段对象
 * @param moduleName - 模块名称
 * @returns 转换后的字段对象
 */
export function applyValidationRules(
  fields: Record<string, any>,
  moduleName: string
): Record<string, any> {
  const rules = TABLE_VALIDATION_RULES[moduleName] || [];
  return validateAndConvertFields(fields, rules);
}
