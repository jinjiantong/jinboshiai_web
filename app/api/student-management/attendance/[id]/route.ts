import { NextResponse } from 'next/server';
import axios from 'axios';
import { TABLE_CONFIGS, validateAndConvertFields, errorResponse, successResponse } from './utils/dataProcessor';

let accessToken: string | null = null;
let accessTokenExpiry: number = 0;

const ATTENDANCE_CONFIG = TABLE_CONFIGS.attendance;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (accessToken && now < accessTokenExpiry) {
    return accessToken;
  }

  try {
    const response = await axios.post('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      app_id: 'cli_a96bb944bef89bcb',
      app_secret: 'IkQIF3w2JIUD9WFssvzwOdSPbnkiKaHp',
    });

    if (response.data.code === 0) {
      accessToken = response.data.tenant_access_token;
      accessTokenExpiry = now + (response.data.expire - 60) * 1000;
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
    
    const convertedFields = validateAndConvertFields(body, 'attendance');
    
    const response = await axios.put(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/LrzibrgRsaviAQsiywBcpZQ4nwc/tables/${ATTENDANCE_CONFIG.tableId}/records/${recordId}`,
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
      return successResponse(response.data.data, '考勤记录更新成功');
    } else {
      throw new Error(`Failed to update attendance: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('Error updating attendance:', error);
    return errorResponse(error.message || 'Failed to update attendance', 500);
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getAccessToken();
    const recordId = params.id;
    
    const response = await axios.delete(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/LrzibrgRsaviAQsiywBcpZQ4nwc/tables/${ATTENDANCE_CONFIG.tableId}/records/${recordId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.data.code === 0) {
      return successResponse(null, '考勤记录删除成功');
    } else {
      throw new Error(`Failed to delete attendance: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('Error deleting attendance:', error);
    return errorResponse(error.message || 'Failed to delete attendance', 500);
  }
}