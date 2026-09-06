import { useMemo, useState } from 'react'
import {
  clearCachedFaviconUrl,
  getFaviconQueue,
  parsePageOrigin,
  setCachedFaviconUrl,
} from '../lib/favicon'

type SiteIconProps = {
  url: string
  size?: number
}

function letterFromHost(hostname: string) {
  const ch = (hostname || '?').replace(/^[^a-zA-Z0-9\u4e00-\u9fff]+/, '')[0]
  return (ch || '?').toUpperCase()
}

export default function SiteIcon({ url, size = 40 }: SiteIconProps) {
  const { hostname } = useMemo(() => parsePageOrigin(url), [url])
  const queue = useMemo(() => getFaviconQueue(url), [url])
  const [index, setIndex] = useState(0)

  const exhausted = index >= queue.length
  const current = queue[index]

  if (exhausted || !current) {
    return (
      <span
        className="site-icon site-icon--letter"
        style={{ width: size, height: size, fontSize: size * 0.4 }}
        aria-hidden
      >
        {letterFromHost(hostname)}
      </span>
    )
  }

  return (
    <img
      className="site-icon"
      src={current}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      referrerPolicy="no-referrer"
      onLoad={() => {
        // 成功加载时刷新时间戳，保证滑动续期
        setCachedFaviconUrl(hostname, current)
      }}
      onError={() => {
        // 当前地址失败：若是缓存项则清除，继续试后续候选
        clearCachedFaviconUrl(hostname)
        setIndex((i) => i + 1)
      }}
    />
  )
}
