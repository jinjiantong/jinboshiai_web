import { NextResponse } from 'next/server';
import axios from 'axios';

const APP_ID = 'cli_a96bb944bef89bcb';
const APP_SECRET = 'IkQIF3w2JIUD9WFssvzwOdSPbnkiKaHp';
const WIKI_URL = 'https://bcn9tapz6cxp.feishu.cn/wiki/KwzLwiAL6iOJFxkzMgScPKUdnCb?from=from_copylink';

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
    accessToken = response.data.tenant_access_token as string;
    tokenExpiry = now + (response.data.expire - 60) * 1000;
    return accessToken!;
  } else {
    throw new Error(`Failed to get access token: ${response.data.msg}`);
  }
}

export async function GET() {
  try {
    const token = await getAccessToken();
    const nodeToken = WIKI_URL.match(/wiki\/([^\?]+)/)?.[1];
    
    return NextResponse.json({ code: 0, data: { node: { obj_token: nodeToken } } });
  } catch (error: any) {
    return NextResponse.json({ code: -1, msg: error.message });
  }
}