import { NextResponse } from 'next/server';
import axios from 'axios';
import {
  errorResponse,
  successResponse,
  listCache
} from '../student-management/utils/dataProcessor';

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('student_id');
    const courseId = searchParams.get('course_id');
    const status = searchParams.get('status');
    const forceRefresh = searchParams.get('force_refresh') === 'true';
    
    const cacheKey = 'assignments:list';
    const cachedData = listCache.get(cacheKey);
    if (cachedData && !forceRefresh) {
      let filteredData = cachedData;
      if (studentId) {
        filteredData = filteredData.filter((item: any) => {
          const recordId = item.record_id || item.fields?.作业ID;
          return recordId && recordId.toString().includes(studentId);
        });
      }
      if (courseId) {
        filteredData = filteredData.filter((item: any) => {
          const fields = item.fields || item;
          const linkedCourse = fields.关联课程;
          if (Array.isArray(linkedCourse)) {
            return linkedCourse.some((c: any) => 
              (typeof c === 'string' && c.includes(courseId)) ||
              (typeof c === 'object' && c.text && c.text.includes(courseId))
            );
          }
          return false;
        });
      }
      if (status) {
        filteredData = filteredData.filter((item: any) => {
          const fields = item.fields || item;
          return fields.作业状态 === status;
        });
      }
      return successResponse(filteredData);
    }
    
    const token = await getAccessToken();
    
    const response = await axios.get(`https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${ASSIGNMENTS_TABLE_ID}/records`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page_size: 100 }
    });

    if (response.data.code === 0) {
      const items = response.data.data?.items || [];
      listCache.set(cacheKey, items);
      
      let filteredData = items;
      if (studentId) {
        filteredData = filteredData.filter((item: any) => {
          const recordId = item.record_id || item.fields?.作业ID;
          return recordId && recordId.toString().includes(studentId);
        });
      }
      if (courseId) {
        filteredData = filteredData.filter((item: any) => {
          const fields = item.fields || item;
          const linkedCourse = fields.关联课程;
          if (Array.isArray(linkedCourse)) {
            return linkedCourse.some((c: any) => 
              (typeof c === 'string' && c.includes(courseId)) ||
              (typeof c === 'object' && c.text && c.text.includes(courseId))
            );
          }
          return false;
        });
      }
      if (status) {
        filteredData = filteredData.filter((item: any) => {
          const fields = item.fields || item;
          return fields.作业状态 === status;
        });
      }
      return successResponse(filteredData);
    } else {
      throw new Error(`获取作业列表失败: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('获取作业列表错误:', error);
    return errorResponse(error.message || '获取作业列表失败');
  }
}

export async function POST(request: Request) {
  try {
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
    
    const response = await axios.post(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${ASSIGNMENTS_TABLE_ID}/records`,
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
      return successResponse(response.data.data, '作业添加成功');
    } else {
      throw new Error(`添加作业失败: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('添加作业错误:', error);
    return errorResponse(error.message || '添加作业失败');
  }
}