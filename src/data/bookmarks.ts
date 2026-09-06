/** 搜索引擎：%s 会被替换为查询词 */
export type SearchEngine = {
  id: string
  name: string
  url: string
}

/** 书签条目：url 必填；title / description 可选覆盖 */
export type BookmarkItem = {
  url: string
  title?: string
  description?: string
}

/** 配置里可用字符串简写 */
export type BookmarkInput = BookmarkItem | string

export type Category = {
  id: string
  title: string
  items: BookmarkInput[]
}

export const searchEngines: SearchEngine[] = [
  { id: 'bing', name: '必应', url: 'https://www.bing.com/search?q=%s' },
  { id: 'google', name: '谷歌', url: 'https://www.google.com/search?q=%s' },
  { id: 'sogou', name: '搜狗', url: 'https://www.sogou.com/web?query=%s' },
  { id: 'yandex', name: 'Yandex', url: 'https://yandex.com/search/?text=%s' },
  { id: 'duckduckgo', name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=%s' },
  { id: 'zhihu', name: '知乎', url: 'https://www.zhihu.com/search?type=content&q=%s' },
  { id: 'weibo', name: '微博', url: 'https://s.weibo.com/weibo?q=%s' },
  { id: 'bilibili', name: '哔哩哔哩', url: 'https://search.bilibili.com/all?keyword=%s' },
  { id: 'github', name: 'GitHub', url: 'https://github.com/search?q=%s&type=repositories' },
  { id: 'gitee', name: 'Gitee', url: 'https://search.gitee.com/?type=repository&q=%s' },
]

/**
 * 分类与书签（来自浏览器导出 bookmarks.html）
 * - 只填 url，title / description 自动获取
 */
export const categories: Category[] = [
  {
    id: 'common',
    title: '常用导航',
    items: [
      { url: 'https://github.com/' },
      { url: 'https://github.com/jiangbyte' },
      { url: 'https://gitee.com/' },
      { url: 'https://b18tqccrlpo.feishu.cn/drive/home/' },
      { url: 'https://chat.deepseek.com/' },
      { url: 'https://qianwen.com/' },
      { url: 'https://www.doubao.com/chat/' },
      { url: 'https://www.kimi.com/zh/' },
      { url: 'https://www.bilibili.com/' },
      { url: 'https://www.programmercarl.com/' },
      { url: 'https://leetcode.cn/' },
      { url: 'https://xiaolincoding.com/' },
      { url: 'https://wx.zsxq.com/group/48411118851818' },
    ],
  },
  {
    id: 'tools',
    title: '快捷工具',
    items: [
      { url: 'https://editor.mdnice.com/' },
      { url: 'https://gitmoji.js.org/' },
      { url: 'https://icones.netlify.app/' },
      { url: 'https://www.toolhelper.cn/Color/Palette' },
      { url: 'https://greasyfork.org/zh-CN' },
      { url: 'https://www.latexlive.com/' },
      { url: 'https://www.emojiall.com/zh-hans/categories/I' },
      { url: 'https://www.iconfont.cn/' },
      { url: 'https://smallpdf.com/cn/edit-pdf' },
      { url: 'https://smallpdf.com/cn' },
      { url: 'https://ionic.io/ionicons' },
      { url: 'https://sa-token.cc/' },
      { url: 'https://www.naiveui.com/zh-CN/os-theme/components/data-table' },
      { url: 'https://github.com/Mikoto10032/DeepLearning' },
      { url: 'https://www.koukoutu.com/' },
      { url: 'https://www.ico51.cn/' },
      { url: 'https://flathub.org/' },
    ],
  },
  {
    id: 'jobs',
    title: '招聘',
    items: [
      { url: 'https://www.zhipin.com/' },
      { url: 'https://xiaoyuan.zhaopin.com/' },
      { url: 'https://c.liepin.com/' },
      { url: 'https://www.iguopin.com/' },
      { url: 'https://www.nowcoder.com/' },
      { url: 'https://www.yingjiesheng.com/' },
      { url: 'https://www.offerstar.cn/recruitment' },
      { url: 'https://www.offerleida.com/home' },
      { url: 'https://offer.gfjianli.com/' },
      { url: 'https://www.yupao.com/' },
      { url: 'https://we.51job.com/pc/my/myjob' },
      { url: 'https://www.qiuzhifangzhou.com/campus' },
      { url: 'https://jianli.xiaolinnote.com/' },
    ],
  },
  {
    id: 'dev',
    title: '开发',
    items: [
      { url: 'https://juejin.cn/user/1968540037686224' },
      {
        url: 'https://www.xiaofucode.com/guide/springboot101/%E6%96%87%E6%A1%A3/%E9%9B%86%E6%88%90Knife4j.html',
      },
    ],
  },
]

/** 将简写字符串规范化为 { url } */
export function normalizeItem(item: BookmarkInput): BookmarkItem {
  if (typeof item === 'string') {
    return { url: item }
  }
  return item
}
