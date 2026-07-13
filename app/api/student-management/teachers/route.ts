import { NextResponse } from 'next/server';
import axios from 'axios';
import { 
  validateAndConvertFields, 
  errorResponse, 
  successResponse,
  recordCache,
  listCache
} from '../utils/dataProcessor';
import { getFeishuToken } from '@/lib/feishuToken';

const BASE_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';
const TEACHERS_TABLE_ID = 'tblxN3e1fyhOMTSt';

export async function GET() {
  try {
    const cachedList = listCache.get('teachers');
    if (cachedList) {
      return successResponse(cachedList, 'Teacher list (cached)');
    }

    const token = await getAccessToken();
    
    const response = await axios.get(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${TEACHERS_TABLE_ID}/records`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { page_size: 100 }
      }
    );

    if (response.data.code === 0) {
      const records = response.data.data?.items || [];
      
      records.forEach((record: any) => {
        recordCache.set(record.record_id, record);
      });
      
      listCache.set('teachers', records);
      
      return successResponse(records);
    }
    
    throw new Error(`Failed to fetch teachers: ${response.data.msg}`);
  } catch (error: any) {
    console.error('Error fetching teachers:', error);
    return errorResponse(error.message || 'Failed to fetch teachers');
  }
}

export async function POST(request: Request) {
  try {
    const token = await getAccessToken();
    const body = await request.json();
    
    const fields = validateAndConvertFields(body.fields || body, 'teachers');
    
    const response = await axios.post(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${TEACHERS_TABLE_ID}/records`,
      { fields },
      {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      }
    );

    if (response.data.code === 0) {
      listCache.invalidate('teachers');
      return successResponse(response.data.data, '老师添加成功');
    }
    
    throw new Error(`Failed to add teacher: ${response.data.msg}`);
  } catch (error: any) {
    console.error('Error adding teacher:', error);
    return errorResponse(error.message || 'Failed to add teacher');
  }
}

export async function PUT(request: Request) {
  try {
    const token = await getFeishuToken();
    const body = await request.json();
    const recordId = body.recordId || body.record_id;
    let fields = body.fields || {};
    
    if (!recordId) {
      return errorResponse('缺少记录ID', 400);
    }
    
    delete fields['管理班级分类'];
    delete fields['record_id'];
    
    fields = validateAndConvertFields(fields, 'teachers');
    
    const response = await axios.put(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${TEACHERS_TABLE_ID}/records/${recordId}`,
      { fields },
      {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      }
    );

    if (response.data.code === 0) {
      recordCache.invalidate(recordId);
      listCache.invalidate('teachers');
      return successResponse(response.data.data, '老师更新成功');
    }
    
    throw new Error(`Failed to update teacher: ${response.data.msg}`);
  } catch (error: any) {
    console.error('Error updating teacher:', error);
    return errorResponse(error.message || 'Failed to update teacher');
  }
}

export async function DELETE(request: Request) {
  try {
    const token = await getFeishuToken();
    const { searchParams } = new URL(request.url);
    const recordId = searchParams.get('record_id');
    
    if (!recordId) {
      return errorResponse('Missing record_id', 400);
    }
    
    const response = await axios.delete(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${TEACHERS_TABLE_ID}/records/${recordId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.code === 0) {
      recordCache.invalidate(recordId);
      listCache.invalidate('teachers');
      return successResponse(null, '老师删除成功');
    }
    
    throw new Error(`Failed to delete teacher: ${response.data.msg}`);
  } catch (error: any) {
    console.error('Error deleting teacher:', error);
    return errorResponse(error.message || 'Failed to delete teacher');
  }
}
