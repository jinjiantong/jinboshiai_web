import axios from 'axios';
import {
  TABLE_CONFIGS,
  validateAndConvertFields,
  errorResponse,
  successResponse,
  recordCache,
  listCache,
} from '../utils/dataProcessor';
import { getFeishuToken } from '@/lib/feishuToken';

const BASE_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';
const CLASSES_TABLE_ID = TABLE_CONFIGS.courses.tableId;

export async function GET() {
  try {
    const cachedList = listCache.get('classes');
    if (cachedList) {
      return successResponse(cachedList, 'Class list (cached)');
    }

    const token = await getFeishuToken();

    const response = await axios.get(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${CLASSES_TABLE_ID}/records`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { page_size: 100 },
      }
    );

    if (response.data.code === 0) {
      const records = (response.data.data?.items || []).map((record: any) => ({
        ...record,
        fields: validateAndConvertFields(record.fields || {}, 'courses')
      }));

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
    const token = await getFeishuToken();
    const body = await request.json();

    const fields = validateAndConvertFields(body.fields || body, 'courses');

    const response = await axios.post(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${CLASSES_TABLE_ID}/records`,
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
    const recordId = body.recordId || body.record_id;
    let fields = body.fields || {};
    
    if (!recordId) {
      return errorResponse('缺少记录ID', 400);
    }

    delete fields['record_id'];

    fields = validateAndConvertFields(fields, 'courses');

    const response = await axios.put(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${CLASSES_TABLE_ID}/records/${recordId}`,
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
    const token = await getFeishuToken();
    const { searchParams } = new URL(request.url);
    const recordId = searchParams.get('record_id');

    if (!recordId) {
      return errorResponse('Missing record_id', 400);
    }

    const response = await axios.delete(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${CLASSES_TABLE_ID}/records/${recordId}`,
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