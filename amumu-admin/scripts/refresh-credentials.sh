#!/usr/bin/env bash
#================================================================
# 阿木木后台 · 刷新 CloudBase 临时凭据
# 用途：CLI 用 refreshToken 换新一批临时 secret，同步到 .env / .env.local
# 用法：
#   bash scripts/refresh-credentials.sh
# 说明：临时凭据约 2 小时过期；长期使用建议改用永久 SecretId/SecretKey
#================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ADMIN_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"          # amumu-admin
WEB_DIR="$(cd "$ADMIN_DIR/.." && pwd)"             # web（含 .env.local）

ENV_ID="amumu-d8gqz038oab87f530"

echo "→ 1/4 触发 CloudBase CLI 刷新凭据（用本机 refreshToken 换新临时密钥）…"
# 任意一次真实请求会触发 CLI 自动续期 refreshToken
tcb env list -e "$ENV_ID" >/dev/null 2>&1 || true
tcb login --flow device --json >/dev/null 2>&1 || true

echo "→ 2/4 读取最新凭据并写回配置…"
python3 - "$ADMIN_DIR" "$WEB_DIR" "$ENV_ID" <<'PY'
import json, os, sys, time

admin_dir, web_dir, env_id = sys.argv[1], sys.argv[2], sys.argv[3]
auth = os.path.expanduser('~/.config/.cloudbase/auth.json')
c = json.load(open(auth))['credential']
expire_s = round(c.get('tmpExpired', 0) / 1000 - time.time())

content = (
    "TENCENTCLOUD_SECRETID=%s\n"
    "TENCENTCLOUD_SECRETKEY=%s\n"
    "TENCENTCLOUD_SESSIONTOKEN=%s\n"
    "TENCENTCLOUD_ENV=%s\n"
    "TENCENTCLOUD_REGION=ap-shanghai\n"
) % (c['tmpSecretId'], c['tmpSecretKey'], c['tmpToken'], env_id)

open(os.path.join(admin_dir, '.env'), 'w').write(content)
open(os.path.join(web_dir, '.env.local'), 'w').write(content)

print(f"   已更新：{admin_dir}/.env , {web_dir}/.env.local")
print(f"   新临时凭据剩余有效期约 {expire_s} 秒（{expire_s/3600:.1f} 小时）")
PY

echo "→ 3/4 校验 .env 有值…"
python3 - "$ADMIN_DIR" <<'PY'
import os, sys
p = os.path.join(sys.argv[1], '.env')
ok = all(x.split('=', 1)[1].strip() for x in open(p) if x.strip() and '=' in x)
print("   校验结果:", "OK ✓" if ok else "FAIL ✗")
PY

echo "→ 4/4 提示：若后台正在运行，需重启才能加载新凭据"
echo "   （本地）:  kill -9 \$(lsof -t -iTCP:3199 -sTCP:LISTEN); PORT=3199 node server/index.js &"
echo "完成。"