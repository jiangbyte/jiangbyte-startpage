import { useEffect, useState } from 'react'

const CACHE_KEY = 'startpage:link-meta:v3'
/** 硬过期：超过后丢弃，必须重新拉取 */
const CACHE_TTL_MS = 2 * 60 * 60 * 1000
/** 软过期：仍展示旧数据，但后台刷新（TTL 的一半） */
const CACHE_REVALIDATE_MS = 1 * 60 * 60 * 1000

type LinkMeta = {
  title: string | null
  description: string | null
}

type MetaState = LinkMeta & { loading: boolean }

type CacheEntry = { ts: number; data: LinkMeta }
type CacheStore = Record<string, CacheEntry>

type LinkOverrides = {
  title?: string
  description?: string
}

export function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function readCache(): CacheStore {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return {}
    return pruneExpired(JSON.parse(raw) as CacheStore)
  } catch {
    return {}
  }
}

function writeCache(cache: CacheStore) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    // ignore quota / private mode
  }
}

function pruneExpired(cache: CacheStore): CacheStore {
  const now = Date.now()
  let changed = false
  const next: CacheStore = {}
  for (const [url, entry] of Object.entries(cache)) {
    if (!entry?.ts || !entry?.data) {
      changed = true
      continue
    }
    if (now - entry.ts > CACHE_TTL_MS) {
      changed = true
      continue
    }
    next[url] = entry
  }
  if (changed) writeCache(next)
  return next
}

function getCacheEntry(url: string): CacheEntry | null {
  const entry = readCache()[url]
  if (!entry) return null
  if (Date.now() - entry.ts > CACHE_TTL_MS) return null
  return entry
}

function setCachedMeta(url: string, data: LinkMeta) {
  const cache = readCache()
  cache[url] = { ts: Date.now(), data }
  writeCache(cache)
}

function fetchMeta(url: string): Promise<LinkMeta> {
  const endpoint = `https://api.microlink.io/?url=${encodeURIComponent(url)}&meta=true`
  return fetch(endpoint)
    .then((res) => res.json())
    .then((json: any) => ({
      title: json?.data?.title || null,
      description: json?.data?.description || null,
    }))
}

/**
 * 合并手写字段与自动元数据
 * - 配置有 title/description → 直接用，不请求对应字段
 * - 两字段都手写 → 跳过 Microlink
 * - 缓存 2h 硬过期；超过 1h 后台静默刷新
 */
export function useLinkMeta(url: string, overrides: LinkOverrides = {}) {
  const hasTitle = Boolean(overrides.title)
  const hasDescription = Boolean(overrides.description)
  const needsFetch = Boolean(url) && (!hasTitle || !hasDescription)

  const [meta, setMeta] = useState<MetaState>(() => {
    if (!needsFetch) {
      return { title: null, description: null, loading: false }
    }
    const entry = getCacheEntry(url)
    if (entry) {
      return { ...entry.data, loading: false }
    }
    return { title: null, description: null, loading: true }
  })

  useEffect(() => {
    if (!needsFetch) {
      setMeta({ title: null, description: null, loading: false })
      return
    }

    const entry = getCacheEntry(url)
    let cancelled = false

    if (entry) {
      setMeta({ ...entry.data, loading: false })
      const age = Date.now() - entry.ts
      // 未到软过期：不刷新
      if (age <= CACHE_REVALIDATE_MS) {
        return
      }
      // 软过期：后台更新，成功后换新缓存
      fetchMeta(url)
        .then((data) => {
          if (cancelled) return
          setCachedMeta(url, data)
          setMeta({ ...data, loading: false })
        })
        .catch(() => {
          // 保留旧数据
        })
      return () => {
        cancelled = true
      }
    }

    setMeta((prev) => ({ ...prev, loading: true }))

    fetchMeta(url)
      .then((data) => {
        if (cancelled) return
        setCachedMeta(url, data)
        setMeta({ ...data, loading: false })
      })
      .catch(() => {
        if (cancelled) return
        setMeta({ title: null, description: null, loading: false })
      })

    return () => {
      cancelled = true
    }
  }, [url, needsFetch])

  const hostname = getHostname(url)
  const titleLoading = !hasTitle && meta.loading
  const descriptionLoading = !hasDescription && meta.loading

  return {
    title: hasTitle ? overrides.title! : meta.title || hostname,
    description: hasDescription ? overrides.description! : meta.description || '',
    titleLoading,
    descriptionLoading,
    hostname,
  }
}
