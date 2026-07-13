import { NextResponse } from 'next/server';
import axios from 'axios';
import {
  TABLE_CONFIGS,
  validateAndConvertFields,
  errorResponse,
  successResponse,
  recordCache,
  listCache
} from '../utils/dataProcessor';
import { getFeishuToken } from '@/lib/feishuToken';

const STUDENTS_TABLE_ID = TABLE_CONFIGS.students.tableId;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get('force_refresh') === 'true';
    
    const cacheKey = 'students:list';
    const cachedData = listCache.get(cacheKey);
    if (cachedData && !forceRefresh) {
      return successResponse(cachedData);
    }
    
    const token = await getFeishuToken();
    
    const response = await axios.get(`https://open.feishu.cn/open-apis/bitable/v1/apps/LrzibrgRsaviAQsiywBcpZQ4nwc/tables/${STUDENTS_TABLE_ID}/records`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page_size: 100 }
    });

    if (response.data.code === 0) {
      const items = response.data.data?.items || [];
      listCache.set(cacheKey, items);
      return successResponse(items);
    } else {
      throw new Error(`获取学员列表失败: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('获取学员列表错误:', error);
    return errorResponse(error.message || '获取学员列表失败');
  }
}

export async function POST(request: Request) {
  try {
    const token = await getFeishuToken();
    const body = await request.json();
    
    const inputFields = body.fields || body;
    const convertedFields = validateAndConvertFields(inputFields, 'students');
    
    const response = await axios.post(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/LrzibrgRsaviAQsiywBcpZQ4nwc/tables/${STUDENTS_TABLE_ID}/records`,
      { fields: convertedFields },
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.code === 0) {
      listCache.invalidate('students:list');
      return successResponse(response.data.data, '学员添加成功');
    } else {
      throw new Error(`添加学员失败: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('添加学员错误:', error);
    return errorResponse(error.message || '添加学员失败');
  }
}

export async function PUT(request: Request) {
  try {
    const token = await getAccessToken();
    const body = await request.json();
    const { recordId, fields } = body;
    
    console.log('=== PUT /api/student-management/students ===');
    console.log('recordId:', recordId);
    console.log('原始fields:', JSON.stringify(fields, null, 2));
    
    if (!recordId) {
      return errorResponse('缺少记录ID', 400);
    }
    
    const convertedFields = validateAndConvertFields(fields, 'students');
    console.log('转换后fields:', JSON.stringify(convertedFields, null, 2));
    
    const response = await axios.put(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/LrzibrgRsaviAQsiywBcpZQ4nwc/tables/${STUDENTS_TABLE_ID}/records/${recordId}`,
      { fields: convertedFields },
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('飞书API响应:', response.data);
    
    if (response.data.code === 0) {
      listCache.invalidate('students:list');
      recordCache.invalidate(`students:${recordId}`);
      return successResponse(response.data.data, '学员更新成功');
    } else {
      throw new Error(`更新学员失败: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('更新学员错误:', error);
    console.error('错误堆栈:', error.stack);
    return errorResponse(error.message || '更新学员失败');
  }
}