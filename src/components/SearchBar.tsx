import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import type { SearchEngine } from '../data/bookmarks'

type SearchBarProps = {
  engines: SearchEngine[]
  activeId?: string
  onEngineChange: (id: string) => void
}

export default function SearchBar({ engines, activeId, onEngineChange }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const active = engines.find((e) => e.id === activeId) || engines[0]

  useEffect(() => {
    if (!open) return
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const q = query.trim()
    if (!q || !active) return
    const target = active.url.replace('%s', encodeURIComponent(q))
    window.open(target, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="hero" id="search">
      <h1 className="hero__title">从这里开始</h1>
      <p className="hero__quote">Charlie 的个人起始页</p>

      <div className="search" ref={rootRef}>
        <form className="search__form" onSubmit={handleSubmit}>
          <div className={open ? 'search__engine search__engine--open' : 'search__engine'}>
            <button
              type="button"
              className="search__engine-btn"
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-controls={listId}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="search__engine-label">{active?.name ?? '搜索引擎'}</span>
              <svg className="search__engine-caret" viewBox="0 0 20 20" width="14" height="14" aria-hidden>
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {open ? (
              <ul id={listId} className="search__engine-menu" role="listbox" aria-label="搜索引擎">
                {engines.map((engine) => {
                  const selected = engine.id === active?.id
                  return (
                    <li key={engine.id} role="option" aria-selected={selected}>
                      <button
                        type="button"
                        className={
                          selected
                            ? 'search__engine-option search__engine-option--active'
                            : 'search__engine-option'
                        }
                        onClick={() => {
                          onEngineChange(engine.id)
                          setOpen(false)
                        }}
                      >
                        {engine.name}
                      </button>
                    </li>
                  )
                })}
              </ul>
            ) : null}
          </div>

          <input
            className="search__input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索…"
            aria-label="搜索"
          />
          <button className="search__submit" type="submit" aria-label="搜索">
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
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
