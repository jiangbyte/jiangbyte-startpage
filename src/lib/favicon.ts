const CACHE_KEY = 'startpage:favicon-url:v2'
/** favicon 缓存 2 小时后失效，重新探测站点路径 */
const CACHE_TTL_MS = 2 * 60 * 60 * 1000

type FaviconEntry = { src: string; ts: number }
type FaviconCache = Record<string, FaviconEntry>

function readCache(): FaviconCache {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as FaviconCache
    return pruneExpired(parsed)
  } catch {
    return {}
  }
}

function writeCache(cache: FaviconCache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    // ignore quota / private mode
  }
}

/** 清理过期项，避免 localStorage 堆积 */
function pruneExpired(cache: FaviconCache): FaviconCache {
  const now = Date.now()
  let changed = false
  const next: FaviconCache = {}
  for (const [host, entry] of Object.entries(cache)) {
    if (!entry?.src || !entry?.ts) {
      changed = true
      continue
    }
    if (now - entry.ts > CACHE_TTL_MS) {
      changed = true
      continue
    }
    next[host] = entry
  }
  if (changed) writeCache(next)
  return next
}

/** 从页面链接解析 origin / hostname */
export function parsePageOrigin(pageUrl: string): { origin: string; hostname: string } {
  try {
    const u = new URL(pageUrl)
    return {
      origin: u.origin,
      hostname: u.hostname.replace(/^www\./, ''),
    }
  } catch {
    return { origin: pageUrl, hostname: pageUrl }
  }
}

/**
 * 仅根据链接自身域名构造常见 favicon 路径（不走第三方 API）
 */
export function buildFaviconCandidates(pageUrl: string): string[] {
  const { origin } = parsePageOrigin(pageUrl)
  return [
    `${origin}/favicon.ico`,
    `${origin}/favicon.png`,
    `${origin}/favicon.svg`,
    `${origin}/apple-touch-icon.png`,
    `${origin}/apple-touch-icon-precomposed.png`,
    `${origin}/apple-touch-icon-180x180.png`,
  ]
}

/** 未过期才返回缓存地址 */
export function getCachedFaviconUrl(hostname: string): string | null {
  const entry = readCache()[hostname]
  if (!entry) return null
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    clearCachedFaviconUrl(hostname)
    return null
  }
  return entry.src
}

/** 写入/刷新缓存时间戳（命中成功时调用，保证滑动续期） */
export function setCachedFaviconUrl(hostname: string, src: string) {
  const cache = readCache()
  cache[hostname] = { src, ts: Date.now() }
  writeCache(cache)
}

export function clearCachedFaviconUrl(hostname: string) {
  const cache = readCache()
  delete cache[hostname]
  writeCache(cache)
}

/**
 * 候选列表：有效缓存优先，过期则从头探测站点路径
 */
export function getFaviconQueue(pageUrl: string): string[] {
  const { hostname } = parsePageOrigin(pageUrl)
  const cached = getCachedFaviconUrl(hostname)
  const candidates = buildFaviconCandidates(pageUrl)
  if (!cached) return candidates
  return [cached, ...candidates.filter((u) => u !== cached)]
}
