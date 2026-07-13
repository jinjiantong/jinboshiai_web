import { NextResponse } from 'next/server';
import axios from 'axios';
import {
  errorResponse,
  successResponse,
  listCache
} from '../student-management/utils/dataProcessor';
import { getFeishuToken } from '@/lib/feishuToken';

const ASSIGNMENTS_TABLE_ID = 'tblEUJfrNGtkUJLR';
const APP_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('student_id');
    const classId = searchParams.get('class_id');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const forceRefresh = searchParams.get('force_refresh') === 'true';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('page_size') || '10', 10);
    
    const cacheKey = 'assignments:list';
    const cachedData = listCache.get(cacheKey);
    if (cachedData && !forceRefresh) {
      let filteredData = cachedData;
      
      if (studentId && studentId !== 'all') {
        const studentIds = studentId.split(',');
        filteredData = filteredData.filter((item: any) => {
          const fields = item.fields || item;
          const linkedStudent = fields.关联学员;
          if (Array.isArray(linkedStudent)) {
            return linkedStudent.some((s: any) => {
              if (typeof s === 'string') {
                return studentIds.includes(s);
              }
              if (typeof s === 'object') {
                if (s.record_ids && Array.isArray(s.record_ids)) {
                  if (s.record_ids.some((id: string) => studentIds.includes(id))) {
                    return true;
                  }
                }
                if (s.text && studentIds.includes(s.text)) {
                  return true;
                }
              }
              return false;
            });
          }
          return false;
        });
      }
      
      if (classId) {
        const classIds = classId.split(',');
        filteredData = filteredData.filter((item: any) => {
          const fields = item.fields || item;
          const linkedCourse = fields.关联班级;
          if (Array.isArray(linkedCourse)) {
            return linkedCourse.some((c: any) => {
              if (typeof c === 'string') {
                return classIds.includes(c);
              }
              if (typeof c === 'object' && c.record_ids) {
                return c.record_ids.some((id: string) => classIds.includes(id));
              }
              if (typeof c === 'object' && c.text) {
                return classIds.includes(c.text);
              }
              return false;
            });
          }
          return false;
        });
      }
      
      if (dateFrom) {
        const fromTime = new Date(dateFrom).getTime();
        filteredData = filteredData.filter((item: any) => {
          const fields = item.fields || item;
          const submissionDate = fields.提交日期 || fields.截止日期;
          return submissionDate && submissionDate >= fromTime;
        });
      }
      
      if (dateTo) {
        const toTime = new Date(dateTo).getTime() + 86400000;
        filteredData = filteredData.filter((item: any) => {
          const fields = item.fields || item;
          const submissionDate = fields.提交日期 || fields.截止日期;
          return submissionDate && submissionDate <= toTime;
        });
      }
      
      const totalCount = filteredData.length;
      const startIndex = (page - 1) * pageSize;
      const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);
      
      return NextResponse.json({
        code: 0,
        msg: 'success',
        data: paginatedData,
        total: totalCount,
        page,
        page_size: pageSize
      });
    }
    
    const token = await getFeishuToken();
    
    const response = await axios.get(`https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${ASSIGNMENTS_TABLE_ID}/records`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page_size: 100 }
    });

    if (response.data.code === 0) {
      const items = response.data.data?.items || [];
      
      console.log('=== 作业数据调试 ===');
      console.log('作业数量:', items.length);
      if (items.length > 0) {
        console.log('第一条作业的所有字段:', Object.keys(items[0].fields));
        console.log('作业附件字段值:', items[0].fields['作业附件']);
        console.log('存档路径字段值:', items[0].fields['存档路径']);
      }
      
      listCache.set(cacheKey, items);
      
      let filteredData = items;
      
      if (studentId && studentId !== 'all') {
        const studentIds = studentId.split(',');
        filteredData = filteredData.filter((item: any) => {
          const fields = item.fields || item;
          const linkedStudent = fields.关联学员;
          if (Array.isArray(linkedStudent)) {
            return linkedStudent.some((s: any) => {
              if (typeof s === 'string') {
                return studentIds.includes(s);
              }
              if (typeof s === 'object') {
                if (s.record_ids && Array.isArray(s.record_ids)) {
                  if (s.record_ids.some((id: string) => studentIds.includes(id))) {
                    return true;
                  }
                }
                if (s.text && studentIds.includes(s.text)) {
                  return true;
                }
              }
              return false;
            });
          }
          return false;
        });
      }
      
      if (classId) {
        const classIds = classId.split(',');
        filteredData = filteredData.filter((item: any) => {
          const fields = item.fields || item;
          const linkedCourse = fields.关联班级;
          if (Array.isArray(linkedCourse)) {
            return linkedCourse.some((c: any) => {
              if (typeof c === 'string') {
                return classIds.includes(c);
              }
              if (typeof c === 'object' && c.record_ids) {
                return c.record_ids.some((id: string) => classIds.includes(id));
              }
              if (typeof c === 'object' && c.text) {
                return classIds.includes(c.text);
              }
              return false;
            });
          }
          return false;
        });
      }
      
      if (dateFrom) {
        const fromTime = new Date(dateFrom).getTime();
        filteredData = filteredData.filter((item: any) => {
          const fields = item.fields || item;
          const submissionDate = fields.提交日期 || fields.截止日期;
          return submissionDate && submissionDate >= fromTime;
        });
      }
      
      if (dateTo) {
        const toTime = new Date(dateTo).getTime() + 86400000;
        filteredData = filteredData.filter((item: any) => {
          const fields = item.fields || item;
          const submissionDate = fields.提交日期 || fields.截止日期;
          return submissionDate && submissionDate <= toTime;
        });
      }
      
      const totalCount = filteredData.length;
      const startIndex = (page - 1) * pageSize;
      const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);
      
      return NextResponse.json({
        code: 0,
        msg: 'success',
        data: paginatedData,
        total: totalCount,
        page,
        page_size: pageSize
      });
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
    const token = await getFeishuToken();
    const body = await request.json();
    
    console.log('=== POST /api/assignments ===');
    console.log('接收到的body:', JSON.stringify(body, null, 2));
    
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
    
    console.log('飞书API响应:', JSON.stringify(response.data, null, 2));

    if (response.data.code === 0) {
      listCache.invalidate('assignments:list');
      return successResponse(response.data.data, '作业添加成功');
    } else {
      throw new Error(`添加作业失败: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('添加作业错误:', error);
    console.error('错误详情:', error.response?.data || error.message);
    return errorResponse(error.response?.data?.msg || error.message || '添加作业失败');
  }
}
