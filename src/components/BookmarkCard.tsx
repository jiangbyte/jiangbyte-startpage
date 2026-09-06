import SiteIcon from './SiteIcon'
import { useLinkMeta } from '../hooks/useLinkMeta'
import type { BookmarkItem } from '../data/bookmarks'

type BookmarkCardProps = {
  item: BookmarkItem
}

export default function BookmarkCard({ item }: BookmarkCardProps) {
  const { url, title: overrideTitle, description: overrideDescription } = item
  const { title, description, titleLoading, descriptionLoading } = useLinkMeta(url, {
    title: overrideTitle,
    description: overrideDescription,
  })

  return (
    <a
      className="bookmark-card"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={description ? `${title} — ${description}` : title}
    >
      <span className="bookmark-card__icon">
        <SiteIcon url={url} size={40} />
      </span>
      <span className="bookmark-card__text">
        {titleLoading ? (
          <span className="skeleton skeleton--title" />
        ) : (
          <span className="bookmark-card__title">{title}</span>
        )}
        {descriptionLoading ? (
          <span className="skeleton skeleton--desc" />
        ) : description ? (
          <span className="bookmark-card__desc">{description}</span>
        ) : null}
      </span>
    </a>
  )
}
