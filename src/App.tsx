import { useMemo, useState } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import CategorySection from './components/CategorySection'
import Footer from './components/Footer'
import { categories, searchEngines } from './data/bookmarks'

const BG_API = 'https://api.yppp.net/api.php'

export default function App() {
  const [engineId, setEngineId] = useState(searchEngines[0]?.id)
  const [menuOpen, setMenuOpen] = useState(false)
  const bgUrl = useMemo(() => `${BG_API}?t=${Date.now()}`, [])

  return (
    <div className="page" style={{ backgroundImage: `url("${bgUrl}")` }}>
      <div className="page__shade" aria-hidden />

      <div className="page__shell">
        <Header
          categories={categories}
          menuOpen={menuOpen}
          onMenuToggle={() => setMenuOpen((v) => !v)}
          onMenuClose={() => setMenuOpen(false)}
        />
        <SearchBar
          engines={searchEngines}
          activeId={engineId}
          onEngineChange={setEngineId}
        />
        <div className="categories">
          {categories.map((category) => (
            <CategorySection key={category.id} category={category} />
          ))}
        </div>
        <Footer />
      </div>
    </div>
  )
}
