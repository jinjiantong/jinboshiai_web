import { NextResponse } from 'next/server';
import axios from 'axios';
import {
  errorResponse,
  successResponse,
  listCache
} from '../../student-management/utils/dataProcessor';

const ASSIGNMENTS_TABLE_ID = 'tblEUJfrNGtkUJLR';
const APP_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';

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
      throw new Error(`获取访问令牌失败: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('获取访问令牌错误:', error);
    throw new Error('获取访问令牌失败');
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const token = await getAccessToken();

    const response = await axios.get(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${ASSIGNMENTS_TABLE_ID}/records/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.data.code === 0) {
      return successResponse(response.data.data);
    } else {
      throw new Error(`获取作业详情失败: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('获取作业详情错误:', error);
    return errorResponse(error.message || '获取作业详情失败');
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const token = await getAccessToken();
    const body = await request.json();

    const fields: Record<string, any> = {};

    if (body.homework_id || body.作业ID) {
      fields['作业ID'] = body.homework_id || body.作业ID;
    }
    if (body.title || body.作业标题) {
      fields['作业标题'] = body.title || body.作业标题;
    }
    if (body.description || body.作业描述) {
      fields['作业描述'] = body.description || body.作业描述;
    }
    if (body.student_id || body.关联学员) {
      fields['关联学员'] = body.student_id || body.关联学员;
    }
    if (body.course_id || body.关联课程) {
      fields['关联课程'] = body.course_id || body.关联课程;
    }
    if (body.due_date || body.截止日期) {
      const dueDate = body.due_date || body.截止日期;
      fields['截止日期'] = typeof dueDate === 'number' ? dueDate : new Date(dueDate).getTime();
    }
    if (body.status || body.作业状态) {
      fields['作业状态'] = body.status || body.作业状态;
    }
    if (body.submission_date || body.提交日期) {
      const submissionDate = body.submission_date || body.提交日期;
      fields['提交日期'] = typeof submissionDate === 'number' ? submissionDate : new Date(submissionDate).getTime();
    }
    if (body.score || body.作业分数) {
      fields['作业分数'] = body.score || body.作业分数;
    }
    if (body.feedback || body.作业反馈) {
      fields['作业反馈'] = body.feedback || body.作业反馈;
    }

    const response = await axios.put(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${ASSIGNMENTS_TABLE_ID}/records/${id}`,
      { fields },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.code === 0) {
      listCache.invalidate('assignments:list');
      return successResponse(response.data.data, '作业更新成功');
    } else {
      throw new Error(`更新作业失败: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('更新作业错误:', error);
    return errorResponse(error.message || '更新作业失败');
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const token = await getAccessToken();

    const response = await axios.delete(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${ASSIGNMENTS_TABLE_ID}/records/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.data.code === 0) {
      listCache.invalidate('assignments:list');
      return successResponse(null, '作业删除成功');
    } else {
      throw new Error(`删除作业失败: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('删除作业错误:', error);
    return errorResponse(error.message || '删除作业失败');
  }
}