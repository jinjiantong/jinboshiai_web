import { NextResponse } from 'next/server';
import axios from 'axios';
import { getFeishuToken } from '@/lib/feishuToken';

const BASE_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';
const COURSES_TABLE_ID = 'tblThjrxFT0mZ3pL';

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
    
    const response = await axios.get(`https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${COURSES_TABLE_ID}/records/${recordId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.data.code === 0) {
      return NextResponse.json({ 
        code: 0, 
        data: response.data.data 
      });
    } else {
      throw new Error(`Failed to fetch course: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('Error fetching course:', error);
    return NextResponse.json({ 
      code: -1, 
      msg: error.message || 'Failed to fetch course' 
    }, { status: 500 });
  }
}