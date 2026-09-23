import { NextResponse } from 'next/server';
import axios from 'axios';
import { getFeishuToken } from '@/lib/feishuToken';

// 依赖飞书接口实时数据，禁止构建期静态预渲染
export const dynamic = 'force-dynamic';

const BASE_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';
const COURSES_TABLE_ID = 'tblThjrxFT0mZ3pL';

export async function GET() {
  try {
    const token = await getFeishuToken();
    
    const response = await axios.get(`https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${COURSES_TABLE_ID}/fields`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.data.code === 0) {
      return NextResponse.json({ 
        code: 0, 
        data: response.data.data?.items || [] 
      });
    } else {
      throw new Error(`Failed to fetch course fields: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('Error fetching course fields:', error);
    return NextResponse.json({ 
      code: -1, 
      msg: error.message || 'Failed to fetch course fields' 
    }, { status: 500 });
  }
}
