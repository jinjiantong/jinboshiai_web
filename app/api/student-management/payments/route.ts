import { NextResponse } from 'next/server';
import axios from 'axios';
import {
  errorResponse,
  successResponse,
  listCache,
  recordCache,
  TABLE_CONFIGS,
  validateAndConvertFields,
} from '../utils/dataProcessor';

const BASE_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';
const PAYMENTS_TABLE_ID = TABLE_CONFIGS.payments.tableId;

let accessToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (accessToken && now < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await axios.post('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      app_id: 'cli_a96bb944bef89bcb',
      app_secret: 'IkQIF3w2JIUD9WFssvzwOdSPbnkiKaHp',
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

async function fetchFromLarkApi<T>(url: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any): Promise<T> {
  const token = await getAccessToken();
  const response = await axios({
    url,
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data,
  });

  if (response.data.code === 0) {
    return response.data.data;
  } else {
    throw new Error(response.data.msg);
  }
}

export async function GET() {
  try {
    const cacheKey = `payments_list`;
    const cachedData = listCache.get(cacheKey);
    if (cachedData) {
      return successResponse(cachedData, 'Success (cached)');
    }

    const data = await fetchFromLarkApi<any>(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${PAYMENTS_TABLE_ID}/records`,
      'GET',
      { params: { page_size: 100 } }
    );

    const items = data?.items || [];
    listCache.set(cacheKey, items);

    return successResponse(items);
  } catch (error: any) {
    console.error('Error fetching payments:', error);
    return errorResponse(error.message || 'Failed to fetch payments');
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const convertedFields = validateAndConvertFields(body, 'payments');

    const data = await fetchFromLarkApi<any>(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${PAYMENTS_TABLE_ID}/records`,
      'POST',
      { fields: convertedFields }
    );

    listCache.invalidate(`payments_list`);

    return successResponse(data, '缴费记录添加成功');
  } catch (error: any) {
    console.error('Error adding payment:', error);
    return errorResponse(error.message || 'Failed to add payment');
  }
}

export async function PUT(request: Request) {
  try {
    const { record_id, ...fields } = await request.json();

    if (!record_id) {
      return errorResponse('record_id is required', 400);
    }

    const convertedFields = validateAndConvertFields(fields, 'payments');

    const data = await fetchFromLarkApi<any>(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${PAYMENTS_TABLE_ID}/records/${record_id}`,
      'PUT',
      { fields: convertedFields }
    );

    listCache.invalidate(`payments_list`);
    recordCache.invalidate(`payments_${record_id}`);

    return successResponse(data, '缴费记录更新成功');
  } catch (error: any) {
    console.error('Error updating payment:', error);
    return errorResponse(error.message || 'Failed to update payment');
  }
}

export async function DELETE(request: Request) {
  try {
    const { record_id } = await request.json();

    if (!record_id) {
      return errorResponse('record_id is required', 400);
    }

    await fetchFromLarkApi<any>(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${PAYMENTS_TABLE_ID}/records/${record_id}`,
      'DELETE'
    );

    listCache.invalidate(`payments_list`);
    recordCache.invalidate(`payments_${record_id}`);

    return successResponse(null, '缴费记录删除成功');
  } catch (error: any) {
    console.error('Error deleting payment:', error);
    return errorResponse(error.message || 'Failed to delete payment');
  }
}