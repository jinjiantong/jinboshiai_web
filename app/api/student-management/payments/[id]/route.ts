import axios from 'axios';
import { TABLE_CONFIGS, validateAndConvertFields, errorResponse, successResponse } from '../../utils/dataProcessor';
import { getFeishuToken } from '@/lib/feishuToken';

const BASE_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';
const TABLE_ID = TABLE_CONFIGS.payments.tableId;

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
    const token = await getFeishuToken();
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