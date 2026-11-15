import { siteMeta } from '../data/site'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const startYear = siteMeta.startYear
  const yearLabel = startYear !== currentYear ? `${startYear}-${currentYear}` : String(startYear)

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        {/* 英文行禁止浏览器翻译，避免与译文叠成重影 */}
        <p className="site-footer__copy notranslate" translate="no">
          <span>©</span>
          <span className="site-footer__em">{yearLabel}</span>
          <span className="site-footer__mark" aria-hidden>
            ✦
          </span>
          <span className="site-footer__em">{siteMeta.name}</span>
          <span>. All rights reserved.</span>
        </p>

        <p className="site-footer__beian">
          <a href={siteMeta.icp.link} target="_blank" rel="noopener noreferrer" className="site-footer__link">
            {siteMeta.icp.text}
          </a>
          <span className="site-footer__sep" aria-hidden>
            |
          </span>
          <a
            href={siteMeta.police.link}
            target="_blank"
            rel="noopener noreferrer"
            className="site-footer__link site-footer__link--police"
          >
            <img src={siteMeta.police.icon} alt="" width={14} height={14} />
            {siteMeta.police.text}
          </a>
        </p>

        <p className="site-footer__built notranslate" translate="no">
          <span>Built with</span>
          <a href="https://vite.dev" target="_blank" rel="noopener noreferrer" className="site-footer__link">
            Vite
          </a>
          <span className="site-footer__dot" aria-hidden>
            ·
          </span>
          <span>{siteMeta.title}</span>
        </p>
      </div>
    </footer>
  )
}
