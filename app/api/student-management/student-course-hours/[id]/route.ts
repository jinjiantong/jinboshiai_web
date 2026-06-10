import { NextResponse } from 'next/server';
import axios from 'axios';

const APP_ID = 'cli_a96bb944bef89bcb';
const APP_SECRET = 'IkQIF3w2JIUD9WFssvzwOdSPbnkiKaHp';
const BASE_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';
const TABLE_ID = 'tblYolOuKVjujV9J';

let accessToken: string | null = null;
let tokenExpiry: number = 0;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (accessToken && now < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await axios.post(
      'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
      { app_id: APP_ID, app_secret: APP_SECRET }
    );

    if (response.data.code === 0) {
      accessToken = response.data.tenant_access_token;
      tokenExpiry = now + (response.data.expire - 60) * 1000;
      return accessToken!;
    }
    throw new Error(`Failed to get access token`);
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = await getAccessToken();
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