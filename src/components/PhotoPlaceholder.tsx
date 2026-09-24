interface PhotoPlaceholderProps {
  label?: string
  className?: string
}

// TODO: 実際の写真が用意でき次第、<img> タグに差し替える
export default function PhotoPlaceholder({ label = 'Photo', className = '' }: PhotoPlaceholderProps) {
  return (
    <div className={`flex h-full w-full flex-col items-center justify-center gap-3 bg-ink/5 ${className}`}>
      <svg viewBox="0 0 24 24" className="h-8 w-8 text-ink/25">
        <rect x="3" y="4" width="18" height="14" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="9" cy="10" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M4 16l5-4 4 3 3-3 4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <span className="text-p-x text-ink/30">{label}</span>
    </div>
  )
}
