import { NextResponse } from 'next/server';
import axios from 'axios';
import { validateAndConvertFields } from '../../utils/dataProcessor';
import { getFeishuToken } from '@/lib/feishuToken';

const BASE_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';
const TEACHERS_TABLE_ID = 'tblxN3e1fyhOMTSt';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getFeishuToken();
    const recordId = params.id;
    
    const response = await axios.get(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${TEACHERS_TABLE_ID}/records/${recordId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.data.code === 0) {
      const record = response.data.data;
      record.fields = validateAndConvertFields(record.fields || {}, 'teachers');
      return NextResponse.json({ 
        code: 0, 
        data: record,
        message: '老师信息获取成功' 
      });
    } else {
      throw new Error(`Failed to get teacher: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('Error getting teacher:', error);
    return NextResponse.json({ 
      code: -1, 
      msg: error.message || 'Failed to get teacher' 
    }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getFeishuToken();
    const body = await request.json();
    const recordId = params.id;
    const fields = body.fields || body;
    const convertedFields = validateAndConvertFields(fields, 'teachers');
    
    const response = await axios.put(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${TEACHERS_TABLE_ID}/records/${recordId}`,
      {
        fields: convertedFields
      },
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.code === 0) {
      return NextResponse.json({ 
        code: 0, 
        data: response.data.data,
        message: '老师信息更新成功' 
      });
    } else {
      throw new Error(`Failed to update teacher: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('Error updating teacher:', error);
    return NextResponse.json({ 
      code: -1, 
      msg: error.message || 'Failed to update teacher' 
    }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getFeishuToken();
    const recordId = params.id;
    
    const response = await axios.delete(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${TEACHERS_TABLE_ID}/records/${recordId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.data.code === 0) {
      return NextResponse.json({ 
        code: 0, 
        message: '老师删除成功' 
      });
    } else {
      throw new Error(`Failed to delete teacher: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('Error deleting teacher:', error);
    return NextResponse.json({ 
      code: -1, 
      msg: error.message || 'Failed to delete teacher' 
    }, { status: 500 });
  }
}
