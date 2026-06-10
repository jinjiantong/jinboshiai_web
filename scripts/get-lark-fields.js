const axios = require('axios');

const APP_ID = 'cli_a96bb944bef89bcb';
const APP_SECRET = 'IkQIF3w2JIUD9WFssvzwOdSPbnkiKaHp';
const BASE_TOKEN = 'LrzibrgRsaviAQsiywBcpZQ4nwc';
const COURSES_TABLE_ID = 'tblDDKeft6iLlGAx';

async function getAccessToken() {
  const response = await axios.post('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    app_id: APP_ID,
    app_secret: APP_SECRET
  });
  
  if (response.data.code !== 0) {
    throw new Error(`获取token失败: ${response.data.msg}`);
  }
  
  return response.data.tenant_access_token;
}

async function getTables() {
  const token = await getAccessToken();
  const response = await axios.get(`https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (response.data.code !== 0) {
    throw new Error(`获取表格列表失败: ${response.data.msg}`);
  }
  
  return response.data.data?.items || [];
}

async function getFields(tableId) {
  const token = await getAccessToken();
  const response = await axios.get(`https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${tableId}/fields`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (response.data.code !== 0) {
    throw new Error(`获取字段失败: ${response.data.msg}`);
  }
  
  return response.data.data?.items || [];
}

function getFieldType(type) {
  switch (type) {
    case 1: return 'text';
    case 2: return 'number';
    case 3: return 'text';
    case 4: return 'checkbox';
    case 5: return 'select';
    case 7: return 'date';
    case 11: return 'link';
    case 13: return 'currency';
    case 15: return 'multiSelect';
    case 17: return 'number';
    case 18: return 'checkbox';
    case 1001: return 'createdUser';
    case 1002: return 'createdTime';
    case 1003: return 'lastModifiedUser';
    case 1004: return 'lastModifiedTime';
    default: return 'text';
  }
}

async function main() {
  try {
    console.log('📚 获取飞书表格字段信息...\n');
    
    const tables = await getTables();
    console.log(`✅ 找到 ${tables.length} 个表格:\n`);
    tables.forEach(t => console.log(`  - ${t.table_id}: ${t.name}`));
    
    console.log('\n' + '='.repeat(60));
    console.log('📝 各表格字段配置\n');
    
    for (const table of tables) {
      console.log(`\n### ${table.name} (${table.table_id})`);
      console.log('```javascript');
      console.log(`${table.name.toLowerCase()}: {`);
      console.log(`  tableId: '${table.table_id}',`);
      console.log('  fields: [');
      
      const fields = await getFields(table.table_id);
      fields.forEach(field => {
        const type = getFieldType(field.type);
        console.log(`    { name: '${field.field_name}', type: '${type}' },`);
      });
      
      console.log('  ],');
      console.log('},');
      console.log('```');
      
      await new Promise(r => setTimeout(r, 500));
    }
    
  } catch (error) {
    console.error('❌ 获取字段失败:', error.message);
  }
}

main();