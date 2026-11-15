#!/usr/bin/env bash
# 构建并 rsync 到远端起始页目录（与博客 / 简历静态目录分离）。
# 前提：本机 ~/.ssh/config 已配置 Host（默认 jiangbyte）且可用密钥免密登录。
# 密钥 / IP / 用户名不要写进本脚本或提交到仓库。
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# 可通过环境变量覆盖，例如：
#   DEPLOY_SSH_HOST=myserver DEPLOY_REMOTE_DIR=/opt/nginx-gateway/sites/start npm run deploy
# 默认 REMOTE_DIR 指向 start 子站目录，切勿与博客 html 共用，避免 --delete 互相覆盖。
SSH_HOST="${DEPLOY_SSH_HOST:-jiangbyte}"
REMOTE_DIR="${DEPLOY_REMOTE_DIR:-/opt/nginx-gateway/sites/start}"
DIST_DIR="${DEPLOY_DIST_DIR:-dist}"

if [[ ! -d node_modules ]]; then
  echo "==> npm install"
  npm install
fi

echo "==> npm run build"
npm run build

if [[ ! -d "$DIST_DIR" ]]; then
  echo "error: 构建产物不存在: $DIST_DIR" >&2
  exit 1
fi

if ! ssh -o BatchMode=yes -o ConnectTimeout=8 "$SSH_HOST" "true" 2>/dev/null; then
  cat >&2 <<EOF
error: 无法免密连接到 SSH Host「${SSH_HOST}」。

请在本机配置 ~/.ssh/config，例如：

  Host jiangbyte
      HostName 【服务器 IP】
      User root
      IdentityFile ~/.ssh/【你的私钥】
      IdentitiesOnly yes

然后执行: ssh-copy-id -i ~/.ssh/【你的公钥】 jiangbyte
EOF
  exit 1
fi

echo "==> rsync ${DIST_DIR}/ -> ${SSH_HOST}:${REMOTE_DIR}/"
rsync -avz --delete "${DIST_DIR}/" "${SSH_HOST}:${REMOTE_DIR}/"
echo "==> done"
