import { NextResponse } from 'next/server';
import axios from 'axios';
import {
  TABLE_CONFIGS,
  validateAndConvertFields,
  errorResponse,
  successResponse,
} from './utils/dataProcessor';
import { getFeishuToken } from '@/lib/feishuToken';

const BASE_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';
const TABLE_ID = TABLE_CONFIGS.students.tableId;

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getFeishuToken();
    const body = await request.json();

    console.log('=== PUT /api/student-management/students/[id] ===');
    console.log('recordId:', params.id);
    console.log('body.fields:', body.fields);
    console.log('body:', body);

    const fields = validateAndConvertFields(body.fields || body, 'students');

    console.log('转换后fields:', fields);

    const response = await axios.put(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${TABLE_ID}/records/${params.id}`,
      { fields },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );

    console.log('飞书API响应:', response.data);

    if (response.data.code !== 0) {
      throw new Error(response.data.msg);
    }

    return successResponse(response.data.data, '学员信息更新成功');
  } catch (error: any) {
    console.error('Error updating student:', error);
    return errorResponse(error.message || 'Failed to update student');
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getFeishuToken();

    const response = await axios.delete(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${TABLE_ID}/records/${params.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.code !== 0) {
      throw new Error(response.data.msg);
    }

    return successResponse(null, '学员删除成功');
  } catch (error: any) {
    console.error('Error deleting student:', error);
    return errorResponse(error.message || 'Failed to delete student');
  }
}
