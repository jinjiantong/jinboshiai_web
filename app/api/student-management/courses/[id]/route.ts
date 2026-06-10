import { NextResponse } from 'next/server';
import axios from 'axios';
import {
  TABLE_CONFIGS,
  validateAndConvertFields,
  errorResponse,
  successResponse,
  recordCache,
} from './utils/dataProcessor';

const APP_ID = 'cli_a96bb944bef89bcb';
const APP_SECRET = 'IkQIF3w2JIUD9WFssvzwOdSPbnkiKaHp';
const BASE_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';
const TABLE_ID = TABLE_CONFIGS.courses.tableId;

let accessToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (accessToken && now < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await axios.post('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      app_id: APP_ID,
      app_secret: APP_SECRET,
    });

    if (response.data.code === 0) {
      accessToken = response.data.tenant_access_token;
      tokenExpiry = now + (response.data.expire - 60) * 1000;
      return accessToken!;
    } else {
      throw new Error(`Failed to get access token: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('Error getting access token:', error);
    throw new Error('Failed to get access token');
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getAccessToken();
    const recordId = params.id;
    
    const response = await axios.get(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${TABLE_ID}/records/${recordId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.data.code === 0) {
      const record = response.data.data;
      record.fields = validateAndConvertFields(record.fields || {}, 'courses');
      return successResponse(record, '课程信息获取成功');
    } else {
      throw new Error(`Failed to get course: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('Error getting course:', error);
    return errorResponse(error.message || 'Failed to get course');
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getAccessToken();
    const body = await request.json();
    const recordId = params.id;
    const fields = validateAndConvertFields(body.fields || body, 'courses');
    
    recordCache.invalidate(`course:${recordId}`);

    const response = await axios.put(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${TABLE_ID}/records/${recordId}`,
      { fields },
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.code === 0) {
      return successResponse(response.data.data, '课程信息更新成功');
    } else {
      throw new Error(`Failed to update course: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('Error updating course:', error);
    return errorResponse(error.message || 'Failed to update course');
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getAccessToken();
    const recordId = params.id;
    
    const response = await axios.delete(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${TABLE_ID}/records/${recordId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.data.code === 0) {
      recordCache.invalidate(`course:${recordId}`);
      return successResponse(null, '课程删除成功');
    } else {
      throw new Error(`Failed to delete course: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('Error deleting course:', error);
    return errorResponse(error.message || 'Failed to delete course');
  }
}