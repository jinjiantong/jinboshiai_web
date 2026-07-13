import { NextResponse } from 'next/server';
import axios from 'axios';
import {
  errorResponse,
  successResponse,
  listCache
} from '@/app/api/student-management/utils/dataProcessor';
import { getFeishuToken } from '@/lib/feishuToken';

const ASSIGNMENTS_TABLE_ID = 'tblEUJfrNGtkUJLR';
const APP_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const token = await getFeishuToken();

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
    const token = await getFeishuToken();
    const body = await request.json();

    console.log('=== PUT /api/assignments/[id] ===');
    console.log('body:', JSON.stringify(body, null, 2));

    const fields: Record<string, any> = {};

    if (body['作业标题']) {
      fields['作业标题'] = body['作业标题'];
    }
    if (body['作业描述']) {
      fields['作业内容'] = body['作业描述'];
    }
    if (body['关联班级']) {
      const classData = body['关联班级'];
      if (Array.isArray(classData)) {
        fields['关联班级'] = classData;
      } else {
        fields['关联班级'] = [classData];
      }
    }
    if (body['关联学员']) {
      const studentData = body['关联学员'];
      if (Array.isArray(studentData)) {
        fields['关联学员'] = studentData;
      } else {
        fields['关联学员'] = [studentData];
      }
    }
    if (body['是否优秀作品'] !== undefined) {
      fields['是否优秀作品'] = body['是否优秀作品'];
    }
    if (body['存档路径']) {
      fields['存档路径'] = body['存档路径'];
    }
    if (body['作业附件']) {
      const attachments = body['作业附件'];
      if (Array.isArray(attachments)) {
        const attachmentData = attachments.map((att: any) => {
          if (typeof att === 'string') {
            return { file_token: att };
          }
          return { file_token: att.token || att };
        }).filter(att => att.file_token);
        
        if (attachmentData.length > 0) {
          fields['作业附件'] = attachmentData;
        }
      }
    }
    if (body['提交截止日期']) {
      const dueDate = body['提交截止日期'];
      if (typeof dueDate === 'number') {
        fields['提交截止日期'] = dueDate;
      } else {
        fields['提交截止日期'] = new Date(dueDate).getTime();
      }
    }

    console.log('转换后fields:', JSON.stringify(fields, null, 2));

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
    const token = await getFeishuToken();

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
