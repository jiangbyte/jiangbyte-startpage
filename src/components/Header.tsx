import { useEffect, useState } from 'react'
import type { Category } from '../data/bookmarks'

const WEEKDAYS = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

function pad(n: number) {
  return String(n).padStart(2, '0')
}

type HeaderProps = {
  categories: Category[]
  menuOpen: boolean
  onMenuToggle: () => void
  onMenuClose: () => void
}

export default function Header({
  categories,
  menuOpen,
  onMenuToggle,
  onMenuClose,
}: HeaderProps) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onMenuClose()
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen, onMenuClose])

  const dateText = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${WEEKDAYS[now.getDay()]}`
  const timeText = `${pad(now.getHours())}:${pad(now.getMinutes())}`

  return (
    <>
      <header className="topbar">
        <button
          type="button"
          className="topbar__menu-btn"
          aria-label="打开菜单"
          aria-expanded={menuOpen}
          onClick={onMenuToggle}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className="topbar__nav topbar__nav--desktop" aria-label="站点导航">
          <a href="#search">主页</a>
          {categories.map((c) => (
            <a key={c.id} href={`#${c.id}`}>
              {c.title}
            </a>
          ))}
        </nav>

        <div className="topbar__clock topbar__clock--desktop">
          <span className="topbar__date">{dateText}</span>
          <span className="topbar__time">{timeText}</span>
        </div>
      </header>

      <div className="topbar__clock topbar__clock--mobile">
        <span className="topbar__date">{dateText}</span>
        <span className="topbar__time">{timeText}</span>
      </div>

      <div
        className={menuOpen ? 'drawer-mask drawer-mask--open' : 'drawer-mask'}
        onClick={onMenuClose}
        aria-hidden
      />
      <aside
        className={menuOpen ? 'drawer drawer--open' : 'drawer'}
        aria-hidden={!menuOpen}
        aria-label="分类菜单"
      >
        <div className="drawer__head">导航</div>
        <nav className="drawer__nav">
          <a href="#search" onClick={onMenuClose}>
            搜索
          </a>
          {categories.map((c) => (
            <a key={c.id} href={`#${c.id}`} onClick={onMenuClose}>
              {c.title}
            </a>
          ))}
        </nav>
      </aside>
    </>
  )
}
