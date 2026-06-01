import { NextResponse } from 'next/server';
import axios from 'axios';
import {
  TABLE_CONFIGS,
  validateAndConvertFields,
  errorResponse,
  successResponse,
  CacheManager,
} from './utils/dataProcessor';

const BASE_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';
const TABLE_ID = TABLE_CONFIGS.students.tableId;

const accessTokenCache = new CacheManager<string>(1500000);

async function getAccessToken(): Promise<string> {
  const cached = accessTokenCache.get('access_token');
  if (cached) return cached;

  const APP_ID = 'cli_a96bb944bef89bcb';
  const APP_SECRET = 'IkQIF3w2JIUD9WFssvzwOdSPbnkiKaHp';

  const response = await axios.post(
    'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
    { app_id: APP_ID, app_secret: APP_SECRET }
  );

  if (response.data.code !== 0) {
    throw new Error(`Failed to get access token: ${response.data.msg}`);
  }

  const token = response.data.tenant_access_token;
  const expireMs = (response.data.expire - 60) * 1000;
  accessTokenCache.set('access_token', token);
  setTimeout(() => accessTokenCache.invalidate('access_token'), expireMs);

  return token;
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getAccessToken();
    const body = await request.json();
    const fields = validateAndConvertFields(body.fields || body, 'students');

    const response = await axios.put(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${TABLE_ID}/records/${params.id}`,
      { fields },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );

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
    const token = await getAccessToken();

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
