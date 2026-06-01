import axios from 'axios';
import { TABLE_CONFIGS, validateAndConvertFields, errorResponse, successResponse } from '../../utils/dataProcessor';

const APP_ID = 'cli_a96bb944bef89bcb';
const APP_SECRET = 'IkQIF3w2JIUD9WFssvzwOdSPbnkiKaHp';
const BASE_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';
const TABLE_ID = TABLE_CONFIGS.payments.tableId;

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
    
    const convertedFields = validateAndConvertFields(fields, 'payments');
    
    const response = await axios.put(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${TABLE_ID}/records/${recordId}`,
      { fields: convertedFields },
      {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.code === 0) {
      return successResponse(response.data.data, '缴费记录更新成功');
    } else {
      throw new Error(`Failed to update payment: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('Error updating payment:', error);
    return errorResponse(error.message || 'Failed to update payment');
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getAccessToken();
    const recordId = params.id;
    
    const response = await axios.delete(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${TABLE_ID}/records/${recordId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.data.code === 0) {
      return successResponse(null, '缴费记录删除成功');
    } else {
      throw new Error(`Failed to delete payment: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('Error deleting payment:', error);
    return errorResponse(error.message || 'Failed to delete payment');
  }
}