import { NextResponse } from 'next/server';
import axios from 'axios';

const APP_ID = 'cli_a96bb944bef89bcb';
const APP_SECRET = 'IkQIF3w2JIUD9WFssvzwOdSPbnkiKaHp';

let accessToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (accessToken && now < tokenExpiry) {
    return accessToken;
  }

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
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const mediaToken = url.searchParams.get('token');
    
    if (!mediaToken) {
      return NextResponse.json({ code: -1, msg: 'Missing token' });
    }

    const token = await getAccessToken();
    
    const response = await axios.get(`https://open.feishu.cn/open-apis/drive/v1/medias/${mediaToken}/download`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'arraybuffer',
    });

    const contentType = String(response.headers['content-type'] || 'application/octet-stream');
    
    return new NextResponse(response.data, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': String(response.headers['content-length'] || response.data.length),
      },
    });
  } catch (error: any) {
    console.error('Error downloading media:', error);
    return NextResponse.json({ 
      code: error.response?.data?.code || -1, 
      msg: error.response?.data?.msg || error.message || 'Failed to download media' 
    });
  }
}