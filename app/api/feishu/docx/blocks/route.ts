import { NextResponse } from 'next/server';
import axios from 'axios';
import { getFeishuToken } from '@/lib/feishuToken';

// 依赖请求参数与飞书接口，禁止构建期静态预渲染
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const documentId = url.searchParams.get('document_id');
    
    if (!documentId) {
      return NextResponse.json({ code: -1, msg: 'Missing document_id' });
    }

    const token = await getFeishuToken();
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