import { NextResponse } from 'next/server';
import axios from 'axios';
import { getFeishuToken } from '@/lib/feishuToken';

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

    const token = await getFeishuToken();
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
