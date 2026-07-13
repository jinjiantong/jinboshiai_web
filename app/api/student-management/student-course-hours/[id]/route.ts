import { NextResponse } from 'next/server';
import axios from 'axios';
import { getFeishuToken } from '@/lib/feishuToken';

const BASE_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';
const TABLE_ID = 'tblYolOuKVjujV9J';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getFeishuToken();
    const recordId = params.id;

    const response = await axios.delete(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${TABLE_ID}/records/${recordId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.data.code !== 0) {
      throw new Error(`Failed to delete course hours: ${response.data.msg}`);
    }

    return NextResponse.json({
      code: 0,
      data: null,
      msg: '课时记录删除成功'
    });
  } catch (error: any) {
    console.error('Error deleting course hours:', error);
    return NextResponse.json({
      code: -1,
      msg: error.message || 'Failed to delete course hours'
    }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getAccessToken();
    const body = await request.json();
    const recordId = params.id;
    const fields = body.fields || body;

    const response = await axios.put(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${TABLE_ID}/records/${recordId}`,
      { fields },
      {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
      }
    );

    if (response.data.code !== 0) {
      throw new Error(`Failed to update course hours: ${response.data.msg}`);
    }

    return NextResponse.json({
      code: 0,
      data: response.data.data,
      msg: '课时记录更新成功'
    });
  } catch (error: any) {
    console.error('Error updating course hours:', error);
    return NextResponse.json({
      code: -1,
      msg: error.message || 'Failed to update course hours'
    }, { status: 500 });
  }
}