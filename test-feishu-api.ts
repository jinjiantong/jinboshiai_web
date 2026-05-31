
// 飞书应用凭证
const APP_ID = 'cli_aa90722cff785cb1';
const APP_SECRET = 'DN357WYy4Rq7g7pfb5PDmb7QbygHcVCK';

// 多维表格信息（从链接提取）
const BASE_ID = 'LrzibrgRsaviAQsiywBcpZQ4nwc';
const TABLE_ID = 'tblEUJfrNGtkUJLR';

let accessToken = '';

// 获取 Access Token
async function getAccessToken(): Promise<string> {
  const response = await fetch(
    'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_id: APP_ID,
        app_secret: APP_SECRET,
      }),
    }
  );

  const data = await response.json();
  if (data.tenant_access_token) {
    return data.tenant_access_token;
  }
  throw new Error(data.msg || '获取 Access Token 失败');
}

// 获取记录列表
async function getRecords(token: string) {
  const response = await fetch(
    `https://open.feishu.cn/open-apis/base/v1/bases/${BASE_ID}/tables/${TABLE_ID}/records?page_size=10`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return await response.json();
}

// 创建记录
async function createRecord(token: string, data: any) {
  const response = await fetch(
    `https://open.feishu.cn/open-apis/base/v1/bases/${BASE_ID}/tables/${TABLE_ID}/records`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [
          {
            fields: data,
          },
        ],
      }),
    }
  );
  return await response.json();
}

async function main() {
  console.log('=== 飞书多维表格 API 测试 ===\n');

  try {
    // 1. 获取 Access Token
    console.log('1. 正在获取 Access Token...');
    accessToken = await getAccessToken();
    console.log('✅ Access Token 获取成功!');
    console.log(`   Token: ${accessToken.substring(0, 20)}...\n`);

    // 2. 读取记录
    console.log('2. 正在读取多维表格记录...');
    const records = await getRecords(accessToken);
    
    if (records.code === 0 && records.data?.items) {
      console.log('✅ 记录读取成功!');
      console.log(`   共找到 ${records.data.items.length} 条记录`);
      console.log('');
      console.log('📋 前5条记录预览:');
      console.log('--------------------------------------------------');
      
      records.data.items.slice(0, 5).forEach((record: any, index: number) => {
        console.log(`\n记录 ${index + 1}:`);
        console.log(`  ID: ${record.record_id}`);
        console.log(`  作业ID: ${record.fields['作业ID']}`);
        console.log(`  优秀作业标记: ${record.fields['优秀作业标记']}`);
        console.log(`  学习评分: ${record.fields['学习评分']}`);
        console.log(`  老师批改状态: ${record.fields['老师批改状态']?.[0] || '未设置'}`);
        console.log(`  提交状态: ${record.fields['提交状态']?.[0] || '未设置'}`);
      });
      console.log('');
    } else {
      console.log('❌ 记录读取失败');
      console.log(`   错误码: ${records.code}`);
      console.log(`   错误信息: ${records.msg}`);
      console.log('');
      console.log('💡 提示: 应用身份(tenant_access_token)可能没有权限访问该表格');
      console.log('   需要使用用户身份(user_access_token)或配置应用权限');
    }

  } catch (error: any) {
    console.log('❌ 测试失败');
    console.log(`   错误: ${error.message}`);
  }

  console.log('=== 测试结束 ===');
}

main();
