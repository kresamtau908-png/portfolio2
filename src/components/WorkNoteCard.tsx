interface WorkNoteCardProps {
  no: string
  title: string
  description: string
  tags: string[]
  className?: string
}

export default function WorkNoteCard({ no, title, description, tags, className = '' }: WorkNoteCardProps) {
  return (
    <div className={`w-full max-w-sm bg-cream p-6 text-ink nav:p-[1.6vw] ${className}`}>
      <span className="text-p-x text-ink/40">{no}</span>
      <h3 className="text-h4 mb-2 mt-1 font-semibold">{title}</h3>
      <p className="text-p mb-4 text-ink/60">{description}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="text-p-xs rounded-full border border-ink/15 px-3 py-1 text-ink/50">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
