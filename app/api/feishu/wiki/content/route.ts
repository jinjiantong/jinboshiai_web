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
    const wikiUrl = url.searchParams.get('url');
    
    if (!wikiUrl) {
      return NextResponse.json({ code: -1, msg: 'Missing url' });
    }

    const nodeToken = wikiUrl.match(/wiki\/([^\?]+)/)?.[1];
    if (!nodeToken) {
      return NextResponse.json({ code: -1, msg: 'Invalid wiki URL' });
    }

    const token = await getAccessToken();
    const documentId = nodeToken;

    const response = await axios.get(`https://open.feishu.cn/open-apis/docx/v1/documents/${documentId}/blocks`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page_token: '', page_size: 500 },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json({ 
      code: error.response?.data?.code || -1, 
      msg: error.response?.data?.msg || error.message 
    });
  }
}