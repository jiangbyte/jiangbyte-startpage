# Startpage

个人书签导航起始页（Vite + React + TypeScript）。无数据库；书签写在代码里，**url 必填**，title / description 可选覆盖。

在线地址：https://start.jiangbyte.cn

## 快速开始

```bash
npm install
npm run dev
```

构建静态产物：

```bash
npm run build
```

产物在 `dist/`。

## 部署

```bash
npm run deploy

# 或显式指定
DEPLOY_SSH_HOST=myserver DEPLOY_REMOTE_DIR=/opt/nginx-gateway/sites/start npm run deploy
```

默认构建并 rsync 到 `/opt/nginx-gateway/sites/start`（`start.jiangbyte.cn`）。密钥与服务器地址写在本机 `~/.ssh/config`，不要提交进仓库。

## 添加书签

编辑 [`src/data/bookmarks.ts`](src/data/bookmarks.ts)：

```ts
{
  id: 'common',
  title: '常用导航', // 分类名（分组标签）
  items: [
    // 只填链接 → title / description 自动从网页元数据获取
    { url: 'https://github.com/jiangbyte' },

    // 有手写则覆盖自动结果
    {
      url: 'https://jiangbyte.cn',
      title: '博客',
      description: '个人站点',
    },

    // 只覆盖 title 也可以
    { url: 'https://juejin.cn', title: '掘金' },

    // 字符串简写等价于 { url: '...' }
    'https://react.dev',
  ],
}
```

### 字段规则

| 字段 | 规则 |
|------|------|
| `url` | 必填 |
| `title` | 有则用手写；否则 Microlink 拉取；失败回退 hostname |
| `description` | 有则用手写；否则自动拉取；失败则不显示 |
| 图标 | 解析书签自身域名下的 `/favicon.ico` 等路径，成功结果缓存到 `localStorage`；失败用字母头像 |

两字段都手写时不会请求元数据接口。

- **title / description 缓存**：2 小时硬过期；超过 1 小时会后台静默刷新。
- **favicon 缓存**：解析站点自身路径，成功结果缓存 2 小时；加载失败或过期会重新探测。

## 搜索引擎

同文件中的 `searchEngines`：切换 Tab 后回车，在新标签页打开对应搜索。URL 里用 `%s` 占位查询词。
