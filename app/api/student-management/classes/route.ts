import { NextResponse } from 'next/server';
import axios from 'axios';

const APP_ID = 'cli_a96bb944bef89bcb';
const APP_SECRET = 'IkQIF3w2JIUD9WFssvzwOdSPbnkiKaHp';
const BASE_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';
const CLASSES_TABLE_ID = 'tblDDKeft6iLlGAx';

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
      accessToken = response.data.tenant_access_token as string;
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

export async function GET() {
  try {
    const token = await getAccessToken();
    
    const response = await axios.get(`https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${CLASSES_TABLE_ID}/records`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page_size: 100 }
    });

    if (response.data.code === 0) {
      return NextResponse.json({ 
        code: 0, 
        data: response.data.data?.items || [] 
      });
    } else {
      throw new Error(`Failed to fetch classes: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('Error fetching classes:', error);
    return NextResponse.json({ 
      code: -1, 
      msg: error.message || 'Failed to fetch classes' 
    }, { status: 500 });
  }
}