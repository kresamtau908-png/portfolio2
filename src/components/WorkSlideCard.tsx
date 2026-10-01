interface WorkSlideCardProps {
  no: string
  title: string
  color: string
  tags: string[]
  image?: string
  url?: string // 公開中のサイト。指定するとカードの画像・タイトルから開ける
  repo?: string // ソースコード（GitHubなど）
  notes?: string[] // 制作の経緯や期間など。カードの幅が狭いので短い箇条書きで
}

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-p-x inline-flex items-center gap-1 border-b border-cream/30 text-cream/70 transition-colors hover:border-cream hover:text-cream"
    >
      {label}
      <span aria-hidden="true">↗</span>
    </a>
  )
}

export default function WorkSlideCard({ no, title, color, tags, image, url, repo, notes }: WorkSlideCardProps) {
  const visual = (
    <div className="relative aspect-4/5 overflow-hidden rounded-[0.8vw]" style={{ backgroundColor: color }}>
      {image ? (
        <img
          src={image}
          alt={title}
          className="ease-brand absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-p-x text-cream/40">Coming soon</span>
        </div>
      )}
    </div>
  )

  return (
    <div className="flex w-72 shrink-0 flex-col gap-5 nav:w-[24vw] nav:gap-[1.4vw]">
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`${title}を開く`} className="group/card">
          {visual}
        </a>
      ) : (
        visual
      )}
      <div className="flex items-center justify-between px-1">
        <span className="text-h5 font-medium">{title}</span>
        <span className="text-p-x text-cream/40">{no}</span>
      </div>
      <div className="flex flex-wrap gap-2.5 px-1">
        {tags.map((tag) => (
          <span key={tag} className="text-p-xs rounded-full border border-cream/20 px-3 py-1 text-cream/50">
            {tag}
          </span>
        ))}
      </div>
      {notes && notes.length > 0 && (
        <ul className="flex flex-col gap-1 px-1">
          {notes.map((note) => (
            <li key={note} className="text-p-x flex gap-2 text-cream/60">
              <span aria-hidden="true" className="text-cream/30">
                ・
              </span>
              <span>{note}</span>
            </li>
          ))}
        </ul>
      )}
      {(url || repo) && (
        <div className="flex gap-5 px-1">
          {url && <ExternalLink href={url} label="Site" />}
          {repo && <ExternalLink href={repo} label="GitHub" />}
        </div>
      )}
    </div>
  )
}
