import { scrollToSection } from '../utils/scroll'

interface MenuOverlayProps {
  open: boolean
  onClose: () => void
}

const NAV = ['Home', 'About', 'Skills', 'Works', 'Philosophy', 'Profile', 'Contact']
const SOCIAL = ['GitHub', 'X', 'Email']

function MenuColumn({
  title,
  links,
  activeLink,
  onNavigate,
  onClose,
}: {
  title: string
  links: string[]
  activeLink?: string
  onNavigate?: (label: string) => void
  onClose: () => void
}) {
  return (
    <div>
      <h6 className="text-h6 mb-5 font-semibold text-cream/50 nav:mb-[1.2vw]">{title}</h6>
      <ul className="flex flex-col gap-3 nav:gap-[0.8vw]">
        {links.map((link) => (
          <li key={link}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (onNavigate) {
                  onNavigate(link)
                } else {
                  onClose()
                }
              }}
              className={`text-h5 group relative inline-block font-normal text-cream/90 transition-colors duration-300 hover:text-cream ${
                link === activeLink ? 'text-cream' : ''
              }`}
            >
              {link}
              <span
                className={`absolute -bottom-0.5 left-0 h-px bg-cream transition-transform duration-300 ease-out ${
                  link === activeLink ? 'w-full' : 'w-full scale-x-0 group-hover:scale-x-100'
                }`}
                style={{ transformOrigin: 'left' }}
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function MenuOverlay({ open, onClose }: MenuOverlayProps) {
  const handleNavigate = (label: string) => {
    onClose()
    scrollToSection(label.toLowerCase())
  }

  return (
    <nav
      className={`ease-brand fixed right-0 top-0 z-40 h-full w-full bg-ink text-cream transition-transform duration-600 nav:w-[40vw] ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
      aria-hidden={!open}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close menu"
        className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-cream/60 transition-colors hover:bg-cream hover:text-ink nav:right-[3.3vw] nav:top-[1.4vw] nav:h-[2.5vw] nav:w-[2.5vw]"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>

      <div className="flex h-full flex-col justify-center gap-10 px-8 py-24 nav:gap-[3vw] nav:px-[3.3vw]">
        <MenuColumn title="Navigation" links={NAV} activeLink="Home" onNavigate={handleNavigate} onClose={onClose} />
        <MenuColumn title="Follow" links={SOCIAL} onClose={onClose} />
      </div>
    </nav>
  )
}
