import axios from 'axios';
import {
  TABLE_CONFIGS,
  validateAndConvertFields,
  errorResponse,
  successResponse,
  recordCache,
  listCache,
} from '../utils/dataProcessor';

const APP_ID = 'cli_a96bb944bef89bcb';
const APP_SECRET = 'IkQIF3w2JIUD9WFssvzwOdSPbnkiKaHp';
const BASE_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';
const TABLE_ID = TABLE_CONFIGS.courses.tableId;

const CLASSES_TABLE_ID = 'tblDDKeft6iLlGAx';

let accessToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (accessToken && now < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
      { app_id: APP_ID, app_secret: APP_SECRET }
    );

    if (response.data.code === 0) {
      accessToken = response.data.tenant_access_token;
      tokenExpiry = now + (response.data.expire - 60) * 1000;
      return accessToken!;
    }
    throw new Error(`Failed to get access token: ${response.data.msg}`);
  } catch (error: any) {
    console.error('Error getting access token:', error);
    throw new Error('Failed to get access token');
  }
}

export async function GET() {
  try {
    const cachedList = listCache.get('classes');
    if (cachedList) {
      return successResponse(cachedList, 'Class list (cached)');
    }

    const token = await getAccessToken();

    const response = await axios.get(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${CLASSES_TABLE_ID}/records`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { page_size: 100 },
      }
    );

    if (response.data.code === 0) {
      const records = response.data.data?.items || [];

      records.forEach((record: any) => {
        recordCache.set(`course:${record.record_id}`, record);
      });

      listCache.set('classes', records);

      return successResponse(records);
    }

    throw new Error(`Failed to fetch classes: ${response.data.msg}`);
  } catch (error: any) {
    console.error('Error fetching classes:', error);
    return errorResponse(error.message || 'Failed to fetch classes');
  }
}

export async function POST(request: Request) {
  try {
    const token = await getAccessToken();
    const body = await request.json();

    const fields = validateAndConvertFields(body, 'courses');

    const response = await axios.post(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${TABLE_ID}/records`,
      { fields },
      {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      }
    );

    if (response.data.code === 0) {
      listCache.invalidate('courses');
      return successResponse(response.data.data, '课程添加成功');
    }

    throw new Error(`Failed to add course: ${response.data.msg}`);
  } catch (error: any) {
    console.error('Error adding course:', error);
    return errorResponse(error.message || 'Failed to add course');
  }
}

export async function PUT(request: Request) {
  try {
    const token = await getAccessToken();
    const body = await request.json();
    const recordId = body.record_id;
    let fields = body.fields || {};

    if (!recordId) {
      return errorResponse('Missing record_id', 400);
    }

    delete fields['record_id'];

    fields = validateAndConvertFields(fields, 'courses');

    const response = await axios.put(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${TABLE_ID}/records/${recordId}`,
      { fields },
      {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      }
    );

    if (response.data.code === 0) {
      recordCache.invalidate(`course:${recordId}`);
      listCache.invalidate('courses');
      return successResponse(response.data.data, '课程信息更新成功');
    }

    throw new Error(`Failed to update course: ${response.data.msg}`);
  } catch (error: any) {
    console.error('Error updating course:', error);
    return errorResponse(error.message || 'Failed to update course');
  }
}

export async function DELETE(request: Request) {
  try {
    const token = await getAccessToken();
    const { searchParams } = new URL(request.url);
    const recordId = searchParams.get('record_id');

    if (!recordId) {
      return errorResponse('Missing record_id', 400);
    }

    const response = await axios.delete(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${TABLE_ID}/records/${recordId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.code === 0) {
      recordCache.invalidate(`course:${recordId}`);
      listCache.invalidate('courses');
      return successResponse(null, '课程删除成功');
    }

    throw new Error(`Failed to delete course: ${response.data.msg}`);
  } catch (error: any) {
    console.error('Error deleting course:', error);
    return errorResponse(error.message || 'Failed to delete course');
  }
}