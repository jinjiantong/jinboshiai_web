import { NextResponse } from 'next/server';
import axios from 'axios';

const APP_ID = 'cli_a96bb944bef89bcb';
const APP_SECRET = 'IkQIF3w2JIUD9WFssvzwOdSPbnkiKaHp';
const BASE_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';
const COURSE_HOURS_TABLE_ID = 'tblYolOuKVjujV9J';

let accessToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (accessToken && now < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
      { app_id: APP_ID, app_secret: APP_SECRET }
    );

    if (response.data.code === 0) {
      accessToken = response.data.tenant_access_token;
      tokenExpiry = now + (response.data.expire - 60) * 1000;
      return accessToken!;
    }
    throw new Error(`Failed to get access token`);
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

function processFieldValue(value: any, type: string): any {
  if (value === undefined || value === null) return undefined;
  
  switch (type) {
    case 'link':
      if (Array.isArray(value)) {
        if (value.length > 0) {
          const firstItem = value[0];
          if (typeof firstItem === 'string') return value;
          if (firstItem && typeof firstItem === 'object' && firstItem.record_ids) {
            return firstItem.record_ids;
          }
          if (firstItem && typeof firstItem === 'object' && firstItem.link_record_ids) {
            return firstItem.link_record_ids;
          }
        }
        return [];
      }
      if (typeof value === 'string') return [value];
      return value;
    case 'date':
      if (value) {
        const date = new Date(value)
        if (!isNaN(date.getTime())) {
          return Math.floor(date.getTime() / 1000 * 1000)
        }
      }
      return undefined
    case 'checkbox':
      return value === true || value === 'true' || value === '是'
    case 'number':
    case 'currency':
      return Number(value) || 0
    default:
      return value
  }
}

export async function GET() {
  try {
    const token = await getAccessToken();
    
    const response = await axios.get(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${COURSE_HOURS_TABLE_ID}/records`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { page_size: 100 }
      }
    );

    if (response.data.code !== 0) {
      throw new Error(`Failed to fetch course hours: ${response.data.msg}`);
    }

    return NextResponse.json({ 
      code: 0, 
      data: response.data.data?.items || [],
      cached: false
    });
  } catch (error: any) {
    console.error('Error fetching course hours:', error);
    return NextResponse.json({ 
      code: -1, 
      msg: error.message || 'Failed to fetch course hours' 
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const token = await getAccessToken();
    const body = await request.json();
    
    const fields: Record<string, any> = {}
    
    if (body.fields) {
      Object.entries(body.fields).forEach(([key, value]) => {
        if (key === '总课时' || key === '已上课时') {
          fields[key] = processFieldValue(value, 'number')
        } else {
          fields[key] = value
        }
      })
    }
    
    const response = await axios.post(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${COURSE_HOURS_TABLE_ID}/records`,
      { fields },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.data.code !== 0) {
      throw new Error(`Failed to create course hours: ${response.data.msg}`);
    }

    return NextResponse.json({ 
      code: 0, 
      data: response.data.data,
      msg: '课时记录添加成功'
    });
  } catch (error: any) {
    console.error('Error creating course hours:', error);
    return NextResponse.json({ 
      code: -1, 
      msg: error.message || 'Failed to create course hours' 
    }, { status: 500 });
  }
}