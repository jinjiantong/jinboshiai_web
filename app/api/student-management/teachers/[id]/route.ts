import { NextResponse } from 'next/server';
import axios from 'axios';
import { validateAndConvertFields } from '../../utils/dataProcessor';

const APP_ID = 'cli_a96bb944bef89bcb';
const APP_SECRET = 'IkQIF3w2JIUD9WFssvzwOdSPbnkiKaHp';
const BASE_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';
const TEACHERS_TABLE_ID = 'tblxN3e1fyhOMTSt';

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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getAccessToken();
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
    const token = await getAccessToken();
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