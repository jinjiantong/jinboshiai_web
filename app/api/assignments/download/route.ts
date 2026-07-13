import { NextResponse } from 'next/server';
import axios from 'axios';
import { errorResponse, successResponse } from '@/app/api/student-management/utils/dataProcessor';
import { getFeishuToken } from '@/lib/feishuToken';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileToken = searchParams.get('file_token');

    if (!fileToken) {
      return errorResponse('缺少 file_token 参数');
    }

    const token = await getFeishuToken();

    const response = await axios.get(
      `https://open.feishu.cn/open-apis/drive/v1/medias/batch_get_tmp_download_url?file_tokens=${fileToken}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.data.code === 0) {
      const downloadUrl = response.data.data.tmp_download_urls?.[0]?.tmp_download_url;
      if (downloadUrl) {
        return successResponse({ url: downloadUrl }, '获取下载链接成功');
      }
      return errorResponse('未找到下载链接');
    } else {
      throw new Error(`获取下载链接失败: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('获取下载链接错误:', error);
    return errorResponse(error.message || '获取下载链接失败');
  }
}
