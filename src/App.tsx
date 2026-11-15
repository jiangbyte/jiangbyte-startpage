import { useState } from 'react'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import CategorySection from './components/CategorySection'
import Footer from './components/Footer'
import Snowfall from './components/Snowfall'
import { categories, searchEngines } from './data/bookmarks'

export default function App() {
  const [engineId, setEngineId] = useState(searchEngines[0]?.id)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div
      className="page"
      style={{ backgroundImage: 'url("/img/cover/37.webp")' }}
    >
      <div className="page__shade" aria-hidden />
      <Snowfall />

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
