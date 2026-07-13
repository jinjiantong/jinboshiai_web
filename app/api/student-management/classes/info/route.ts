import { NextResponse } from 'next/server';
import axios from 'axios';
import { getFeishuToken } from '@/lib/feishuToken';

const BASE_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';
const CLASSES_TABLE_ID = 'tblDDKeft6iLlGAx';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const recordId = searchParams.get('record_id')

    if (!recordId) {
      return NextResponse.json({ 
        code: -1, 
        msg: 'Missing record_id parameter' 
      }, { status: 400 });
    }

    const token = await getFeishuToken();
    
    const response = await axios.get(`https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${CLASSES_TABLE_ID}/records/${recordId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.data.code === 0) {
      return NextResponse.json({ 
        code: 0, 
        data: response.data.data 
      });
    } else {
      throw new Error(`Failed to fetch class: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('Error fetching class:', error);
    return NextResponse.json({ 
      code: -1, 
      msg: error.message || 'Failed to fetch class' 
    }, { status: 500 });
  }
}
