import { NextResponse } from 'next/server';
import axios from 'axios';
import { getFeishuToken } from '@/lib/feishuToken';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const mediaToken = url.searchParams.get('token');
    
    if (!mediaToken) {
      return NextResponse.json({ code: -1, msg: 'Missing token' });
    }

    const token = await getFeishuToken();
    
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
