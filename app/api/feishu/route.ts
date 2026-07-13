import { NextResponse } from 'next/server';
import axios from 'axios';
import { getFeishuToken } from '@/lib/feishuToken';

const WIKI_URL = 'https://bcn9tapz6cxp.feishu.cn/wiki/KwzLwiAL6iOJFxkzMgScPKUdnCb?from=from_copylink';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  try {
    const token = await getAccessToken();

    if (pathname.endsWith('/wiki/node')) {
      const response = await axios.get('https://open.feishu.cn/open-apis/wiki/v2/spaces/7629331605785431218/nodes', {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 100 },
      });

      const wikiUrl = WIKI_URL;
      const nodeToken = wikiUrl.match(/wiki\/([^\?]+)/)?.[1];
      
      let targetNode = null;
      if (response.data.code === 0 && response.data.data?.items) {
        targetNode = response.data.data.items.find((item: any) => 
          item.obj_token === nodeToken || item.url === wikiUrl
        );
      }

      if (!targetNode) {
        targetNode = { node: { obj_token: nodeToken } };
      }

      return NextResponse.json({ code: 0, data: targetNode });
    }

    if (pathname.endsWith('/docx/blocks')) {
      const documentId = url.searchParams.get('document_id');
      if (!documentId) {
        return NextResponse.json({ code: -1, msg: 'Missing document_id' });
      }

      const response = await axios.get(`https://open.feishu.cn/open-apis/docx/v1/documents/${documentId}/blocks`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page_token: '', page_size: 500 },
      });

      return NextResponse.json(response.data);
    }

    if (pathname.endsWith('/wiki/content')) {
      const wikiUrl = url.searchParams.get('url');
      if (!wikiUrl) {
        return NextResponse.json({ code: -1, msg: 'Missing url' });
      }

      const nodeToken = wikiUrl.match(/wiki\/([^\?]+)/)?.[1];
      if (!nodeToken) {
        return NextResponse.json({ code: -1, msg: 'Invalid wiki URL' });
      }

      const response = await axios.get('https://open.feishu.cn/open-apis/wiki/v2/spaces/7629331605785431218/nodes', {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 100 },
      });

      let documentId = '';
      if (response.data.code === 0 && response.data.data?.items) {
        const targetNode = response.data.data.items.find((item: any) => 
          item.obj_token === nodeToken || item.url === wikiUrl
        );
        if (targetNode) {
          documentId = targetNode.obj_token;
        }
      }

      if (!documentId) {
        documentId = nodeToken;
      }

      const blocksResponse = await axios.get(`https://open.feishu.cn/open-apis/docx/v1/documents/${documentId}/blocks`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page_token: '', page_size: 500 },
      });

      return NextResponse.json(blocksResponse.data);
    }

    if (pathname.endsWith('/media/download')) {
      const mediaToken = url.searchParams.get('token');
      if (!mediaToken) {
        return NextResponse.json({ code: -1, msg: 'Missing token' });
      }

      try {
        const response = await axios.get(`https://open.feishu.cn/open-apis/drive/v1/medias/${mediaToken}/download`, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'stream',
        });

        return new NextResponse(response.data, {
          headers: {
            'Content-Type': String(response.headers['content-type'] || 'application/octet-stream'),
            'Content-Disposition': `attachment; filename="${mediaToken}"`,
          },
        });
      } catch (error: any) {
        console.error('Error downloading media:', error);
        return NextResponse.json({ code: -1, msg: 'Failed to download media' });
      }
    }

    return NextResponse.json({ code: -1, msg: 'Invalid endpoint' });
  } catch (error: any) {
    console.error('Feishu API error:', error);
    return NextResponse.json({ 
      code: error.response?.data?.code || -1, 
      msg: error.response?.data?.msg || error.message || 'Internal server error' 
    });
  }
}