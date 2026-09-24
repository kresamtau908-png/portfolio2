interface WorkBadgeProps {
  no: string
  title: string
  color: string
  textColor?: string
  image?: string
  swayDelay?: number
  className?: string
}

export default function WorkBadge({
  no,
  title,
  color,
  textColor = '#ffffff',
  image,
  swayDelay = 0,
  className = '',
}: WorkBadgeProps) {
  return (
    <div
      className={`animate-badge-sway flex flex-col items-center ${className}`}
      style={{ transformOrigin: 'top center', animationDelay: `${swayDelay}s` }}
    >
      {/* metal clip */}
      <svg width="18" height="20" viewBox="0 0 18 20" className="text-cream/50">
        <path d="M9 0c4 0 6 2.5 6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <rect x="5" y="0" width="8" height="6" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>

      {/* fabric strap */}
      <div className="h-10 w-6 rounded-b-sm nav:h-[3vw] nav:w-[1.6vw]" style={{ backgroundColor: color }} />

      {/* clasp */}
      <svg width="16" height="18" viewBox="0 0 16 18" className="-mb-1 text-cream/50">
        <rect x="4" y="0" width="8" height="10" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="8" cy="14" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>

      {/* ID card: work screenshot as the "photo", name plate at the bottom */}
      <div
        className="relative aspect-3/4 w-40 overflow-hidden rounded-2xl shadow-[0_1.2vw_2vw_rgba(0,0,0,0.28)] nav:w-[11vw] nav:rounded-[1.2vw]"
        style={{ backgroundColor: color }}
      >
        {image ? (
          <img src={image} alt={title} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-8 w-8 opacity-30" style={{ color: textColor }}>
              <rect x="3" y="4" width="18" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="9" cy="10" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M4 16l5-4 4 3 3-3 4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
        )}

        <div className="absolute right-2 top-2 h-3.5 w-3.5 rounded-full border border-current/60" style={{ color: textColor }} />

        <div
          className="absolute inset-x-0 bottom-0 px-3 py-2.5 nav:px-[0.9vw] nav:py-[0.8vw]"
          style={{ backgroundColor: color, color: textColor }}
        >
          <p className="text-p-xs font-semibold leading-tight">{title}</p>
          <p className="text-p-xs leading-tight opacity-75">No. {no}</p>
        </div>
      </div>
    </div>
  )
}
