interface PillButtonProps {
  label: string
  variant?: 'light' | 'dark'
  className?: string
  onClick?: () => void
}

export default function PillButton({ label, variant = 'light', className = '', onClick }: PillButtonProps) {
  const bg = variant === 'light' ? 'bg-accent text-ink' : 'bg-ink text-cream'

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault()
        onClick?.()
      }}
      className={`group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-full px-6 text-p-x font-medium shadow-[0_0.32vw_0.52vw_rgba(0,0,0,0.04)] nav:h-[2.5vw] nav:px-[1.25vw] ${bg} ${className}`}
    >
      <span className="ease-brand absolute left-1/2 top-1/2 z-0 h-0 w-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime transition-[width,height] duration-600 group-hover:h-[16vw] group-hover:w-[16vw]" />
      <span className="ease-brand relative z-10 whitespace-nowrap transition-transform duration-600 group-hover:-translate-x-1">
        {label}
      </span>
      <svg
        viewBox="0 0 24 24"
        className="ease-brand relative z-10 ml-2 h-2.5 w-2.5 -rotate-90 fill-current transition-transform duration-600 group-hover:translate-x-1"
      >
        <path d="M12 2l10 10-10 10-1.4-1.4L18.2 13H2v-2h16.2l-7.6-7.6z" />
      </svg>
    </a>
  )
}
