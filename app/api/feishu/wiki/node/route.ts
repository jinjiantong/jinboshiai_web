import { NextResponse } from 'next/server';
import axios from 'axios';
import { getFeishuToken } from '@/lib/feishuToken';

// 依赖飞书接口实时数据，禁止构建期静态预渲染
export const dynamic = 'force-dynamic';

const WIKI_URL = 'https://bcn9tapz6cxp.feishu.cn/wiki/KwzLwiAL6iOJFxkzMgScPKUdnCb?from=from_copylink';

export async function GET() {
  try {
    const token = await getFeishuToken();
    const nodeToken = WIKI_URL.match(/wiki\/([^\?]+)/)?.[1];
    
    return NextResponse.json({ code: 0, data: { node: { obj_token: nodeToken } } });
  } catch (error: any) {
    return NextResponse.json({ code: -1, msg: error.message });
  }
}