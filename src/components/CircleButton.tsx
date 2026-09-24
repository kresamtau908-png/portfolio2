interface CircleButtonProps {
  onClick?: () => void
  direction?: 'up' | 'down'
  className?: string
}

export default function CircleButton({ onClick, direction = 'up', className = '' }: CircleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === 'up' ? 'Go to top' : 'Scroll down'}
      className={`group relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-accent shadow-[0_0.32vw_0.52vw_rgba(0,0,0,0.04)] nav:h-[4vw] nav:w-[4vw] ${className}`}
    >
      <span className="ease-brand absolute left-1/2 top-1/2 z-0 h-0 w-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime transition-[width,height] duration-600 group-hover:h-[25vw] group-hover:w-[25vw]" />
      <svg
        viewBox="0 0 24 24"
        className={`relative z-10 h-4 w-4 fill-none stroke-ink stroke-2 transition-transform duration-300 nav:h-[1.5vw] nav:w-[1.5vw] ${direction === 'down' ? 'rotate-180' : ''}`}
      >
        <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
