import { NextResponse } from 'next/server';
import axios from 'axios';
import { getFeishuToken } from '@/lib/feishuToken';

const BASE_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';
const CLASSES_TABLE_ID = 'tblDDKeft6iLlGAx';

export async function GET() {
  try {
    const token = await getFeishuToken();
    
    const response = await axios.get(`https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${CLASSES_TABLE_ID}/fields`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.data.code === 0) {
      return NextResponse.json({ 
        code: 0, 
        data: response.data.data?.items || [] 
      });
    } else {
      throw new Error(`Failed to fetch class fields: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('Error fetching class fields:', error);
    return NextResponse.json({ 
      code: -1, 
      msg: error.message || 'Failed to fetch class fields' 
    }, { status: 500 });
  }
}