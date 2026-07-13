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

const ATTENDANCE_TABLE_ID = TABLE_CONFIGS.attendance.tableId;

export async function GET() {
  try {
    const cacheKey = 'attendance:list';
    const cachedData = listCache.get(cacheKey);
    if (cachedData) {
      return successResponse(cachedData);
    }

    const token = await getFeishuToken();
    
    const response = await axios.get(`https://open.feishu.cn/open-apis/bitable/v1/apps/LrzibrgRsaviAQsiywBcpZQ4nwc/tables/${ATTENDANCE_TABLE_ID}/records`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page_size: 100 }
    });

    if (response.data.code === 0) {
      const items = response.data.data?.items || [];
      listCache.set(cacheKey, items);
      return successResponse(items);
    } else {
      throw new Error(`获取考勤列表失败: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('获取考勤列表错误:', error);
    return errorResponse(error.message || '获取考勤列表失败');
  }
}

export async function POST(request: Request) {
  try {
    const token = await getFeishuToken();
    const body = await request.json();
    
    const convertedFields = validateAndConvertFields(body.fields || body, 'attendance');
    
    const response = await axios.post(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/LrzibrgRsaviAQsiywBcpZQ4nwc/tables/${ATTENDANCE_TABLE_ID}/records`,
      { fields: convertedFields },
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.code === 0) {
      listCache.invalidate('attendance:list');
      return successResponse(response.data.data, '考勤记录添加成功');
    } else {
      throw new Error(`添加考勤记录失败: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('添加考勤记录错误:', error);
    return errorResponse(error.message || '添加考勤记录失败');
  }
}

export async function PUT(request: Request) {
  try {
    const token = await getFeishuToken();
    const body = await request.json();
    const { recordId, fields } = body;
    
    if (!recordId) {
      return errorResponse('缺少记录ID', 400);
    }
    
    const convertedFields = validateAndConvertFields(fields, 'attendance');
    
    const response = await axios.put(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/LrzibrgRsaviAQsiywBcpZQ4nwc/tables/${ATTENDANCE_TABLE_ID}/records/${recordId}`,
      { fields: convertedFields },
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.code === 0) {
      listCache.invalidate('attendance:list');
      recordCache.invalidate(`attendance:${recordId}`);
      return successResponse(response.data.data, '考勤记录更新成功');
    } else {
      throw new Error(`更新考勤记录失败: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('更新考勤记录错误:', error);
    return errorResponse(error.message || '更新考勤记录失败');
  }
}

export async function DELETE(request: Request) {
  try {
    const token = await getFeishuToken();
    const { searchParams } = new URL(request.url);
    const recordId = searchParams.get('recordId');
    
    if (!recordId) {
      return errorResponse('缺少记录ID', 400);
    }
    
    const response = await axios.delete(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/LrzibrgRsaviAQsiywBcpZQ4nwc/tables/${ATTENDANCE_TABLE_ID}/records/${recordId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.data.code === 0) {
      listCache.invalidate('attendance:list');
      recordCache.invalidate(`attendance:${recordId}`);
      return successResponse(null, '考勤记录删除成功');
    } else {
      throw new Error(`删除考勤记录失败: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('删除考勤记录错误:', error);
    return errorResponse(error.message || '删除考勤记录失败');
  }
}
