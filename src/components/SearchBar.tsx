import { useState, type FormEvent } from 'react'
import type { SearchEngine } from '../data/bookmarks'

type SearchBarProps = {
  engines: SearchEngine[]
  activeId?: string
  onEngineChange: (id: string) => void
}

export default function SearchBar({ engines, activeId, onEngineChange }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const active = engines.find((e) => e.id === activeId) || engines[0]

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const q = query.trim()
    if (!q || !active) return
    const target = active.url.replace('%s', encodeURIComponent(q))
    window.open(target, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="hero" id="search">
      <h1 className="hero__title">上网，从这里开始！</h1>
      <p className="hero__quote">个人导航起始页 · 填链接即可</p>

      <div className="search">
        <div className="search__tabs" role="tablist" aria-label="搜索引擎">
          {engines.map((engine) => (
            <button
              key={engine.id}
              type="button"
              role="tab"
              aria-selected={engine.id === active.id}
              className={
                engine.id === active.id ? 'search__tab search__tab--active' : 'search__tab'
              }
              onClick={() => onEngineChange(engine.id)}
            >
              {engine.name}
            </button>
          ))}
        </div>
        <form className="search__form" onSubmit={handleSubmit}>
          <input
            className="search__input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="( ゜- ゜)つロ 干杯~"
            aria-label="搜索"
          />
          <button className="search__submit" type="submit" aria-label="搜索">
            <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden>
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2.2" />
              <path
                d="M16.5 16.5L21 21"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </form>
      </div>
    </section>
  )
}
