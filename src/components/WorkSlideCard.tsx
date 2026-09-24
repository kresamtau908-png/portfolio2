interface WorkSlideCardProps {
  no: string
  title: string
  color: string
  tags: string[]
  image?: string
}

export default function WorkSlideCard({ no, title, color, tags, image }: WorkSlideCardProps) {
  return (
    <div className="flex w-56 shrink-0 flex-col gap-4 nav:w-[16vw] nav:gap-[1vw]">
      <div className="relative aspect-3/4 overflow-hidden rounded-[0.6vw]" style={{ backgroundColor: color }}>
        {image ? (
          <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-p-x text-cream/40">Coming soon</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between px-1">
        <span className="text-h6 font-medium">{title}</span>
        <span className="text-p-x text-cream/40">{no}</span>
      </div>
      <div className="flex flex-wrap gap-2 px-1">
        {tags.map((tag) => (
          <span key={tag} className="text-p-xs rounded-full border border-cream/20 px-3 py-1 text-cream/50">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
