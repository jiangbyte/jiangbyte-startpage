import BookmarkCard from './BookmarkCard'
import { normalizeItem, type Category } from '../data/bookmarks'

type CategorySectionProps = {
  category: Category
}

export default function CategorySection({ category }: CategorySectionProps) {
  return (
    <section className="category glass" id={category.id}>
      <h2 className="category__title">
        <span className="category__mark" aria-hidden />
        {category.title}
      </h2>
      <div className="category__grid">
        {category.items.map((raw, index) => {
          const item = normalizeItem(raw)
          return <BookmarkCard key={`${item.url}-${index}`} item={item} />
        })}
      </div>
    </section>
  )
}
