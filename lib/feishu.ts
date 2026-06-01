import axios from 'axios';

export const APP_ID = 'cli_a96bb944bef89bcb';
export const APP_SECRET = 'IkQIF3w2JIUD9WFssvzwOdSPbnkiKaHp';
export const BASE_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';

export const TABLE_IDS = {
  CLASSES: 'tblDDKeft6iLlGAx',
  STUDENTS: 'tblhnKUAyBJbpoDo',
  COURSE_HOURS: 'tblYolOuKVjujV9J',
  ATTENDANCE: 'tbl28gcD5cNjhYg8',
};

let accessToken: string | null = null;
let tokenExpiry: number = 0;

export async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (accessToken && now < tokenExpiry) {
    return accessToken;
  }

  try {
    const response = await axios.post('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      app_id: APP_ID,
      app_secret: APP_SECRET,
    });

    if (response.data.code === 0) {
      accessToken = response.data.tenant_access_token;
      tokenExpiry = now + (response.data.expire - 60) * 1000;
      return accessToken!;
    } else {
      throw new Error(`Failed to get access token: ${response.data.msg}`);
    }
  } catch (error: any) {
    console.error('Error getting access token:', error);
    throw new Error('Failed to get access token');
  }
}

export async function getRecords(tableId: string, params?: {
  filter?: string;
  page_size?: number;
  page_token?: string;
}) {
  const token = await getAccessToken();
  const query: Record<string, any> = {
    page_size: params?.page_size || 100,
  };

  if (params?.filter) {
    query.filter = params.filter;
  }
  if (params?.page_token) {
    query.page_token = params.page_token;
  }

  const response = await axios.get(
    `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${tableId}/records`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: query,
    }
  );

  if (response.data.code === 0) {
    return response.data.data;
  } else {
    throw new Error(`Failed to fetch records: ${response.data.msg}`);
  }
}

export async function createRecord(tableId: string, fields: Record<string, any>) {
  const token = await getAccessToken();

  const response = await axios.post(
    `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${tableId}/records`,
    { fields },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (response.data.code === 0) {
    return response.data.data;
  } else {
    throw new Error(`Failed to create record: ${response.data.msg}`);
  }
}

export async function updateRecord(tableId: string, recordId: string, fields: Record<string, any>) {
  const token = await getAccessToken();

  const response = await axios.put(
    `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${tableId}/records/${recordId}`,
    { fields },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (response.data.code === 0) {
    return response.data.data;
  } else {
    throw new Error(`Failed to update record: ${response.data.msg}`);
  }
}

export async function getRecord(tableId: string, recordId: string) {
  const token = await getAccessToken();

  const response = await axios.get(
    `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${tableId}/records/${recordId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (response.data.code === 0) {
    return response.data.data;
  } else {
    throw new Error(`Failed to fetch record: ${response.data.msg}`);
  }
}

export function extractTextValue(field: any): string {
  if (!field) return '';
  if (typeof field === 'string') return field;
  if (field.text !== undefined) return field.text;
  return String(field);
}

export function extractNumberValue(field: any): number {
  if (field === null || field === undefined) return 0;
  if (typeof field === 'number') return field;
  if (typeof field === 'string') return parseFloat(field) || 0;
  return 0;
}

export function extractDateValue(field: any): number | null {
  if (!field) return null;
  if (typeof field === 'number') return field;
  if (typeof field === 'string') {
    const date = new Date(field);
    return isNaN(date.getTime()) ? null : date.getTime();
  }
  return null;
}