import { NextResponse } from 'next/server';
import axios from 'axios';
import { errorResponse, successResponse } from '../../student-management/utils/dataProcessor';

const APP_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';
const ASSIGNMENTS_TABLE_ID = 'tblEUJfrNGtkUJLR';

let accessToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (accessToken && now < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await axios.post('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      app_id: 'cli_a96bb944bef89bcb',
      app_secret: 'IkQIF3w2JIUD9WFssvzwOdSPbnkiKaHp',
    });

    if (response.data.code === 0) {
      accessToken = response.data.tenant_access_token as string;
      tokenExpiry = now + (response.data.expire - 60) * 1000;
      return accessToken!;
    }
    throw new Error('获取访问令牌失败');
  } catch (error) {
    throw new Error('获取访问令牌失败');
  }
}

export async function POST(request: Request) {
  try {
    const token = await getAccessToken();
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return errorResponse('没有上传文件');
    }

    console.log('=== 上传作业附件 ===');
    console.log('文件名:', file.name);
    console.log('文件大小:', file.size);
    console.log('文件类型:', file.type);

    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    const uploadResponse = await axios.post(
      'https://open.feishu.cn/open-apis/drive/v1/files/upload_all',
      {
        file_name: file.name,
        parent_type: 'bitable_file',
        parent_node: APP_TOKEN,
        size: buffer.length,
        file: buffer
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      }
    );

    console.log('飞书上传响应:', JSON.stringify(uploadResponse.data, null, 2));

    if (uploadResponse.data.code === 0) {
      const fileToken = uploadResponse.data.data.file_token;
      return successResponse({ token: fileToken, name: file.name }, '文件上传成功');
    } else {
      throw new Error(`上传失败: ${uploadResponse.data.msg}`);
    }
  } catch (error: any) {
    console.error('上传文件错误:', error);
    return errorResponse(error.message || '上传文件失败');
  }
}