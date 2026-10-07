import PillButton from './PillButton'
import { scrollToSection } from '../utils/scroll'

interface HeaderProps {
  menuOpen: boolean
  onToggleMenu: () => void
}

export default function Header({ menuOpen, onToggleMenu }: HeaderProps) {
  return (
    <header className="layout-grid animate-header-in fixed top-0 left-0 z-50 w-full items-center py-4 nav:py-[1.4vw]">
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault()
          scrollToSection('home')
        }}
        className="text-h6 col-span-3 w-fit rounded-full bg-accent/90 px-4 py-1.5 font-semibold text-ink shadow-[0_0.32vw_0.52vw_rgba(0,0,0,0.04)] backdrop-blur-sm nav:col-span-3 nav:px-[1vw] nav:py-[0.4vw]"
      >
        Portfolio
      </a>

      <div className="col-span-3 col-start-4 flex items-center justify-end gap-3 nav:col-span-8 nav:col-start-9">
        <PillButton label="Contact" onClick={() => scrollToSection('contact')} />
        <button
          type="button"
          onClick={onToggleMenu}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          // 濃紺のセクション（Contact・Footerなど）の上でも輪郭が見えるよう、薄いクリーム色の縁取りを付ける
          className="relative flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-5 text-cream shadow-[0_0.32vw_0.52vw_rgba(0,0,0,0.04)] ring-1 ring-cream/25 nav:h-[2.5vw] nav:px-[1.25vw]"
        >
          <span className="text-p-x">Menu</span>
          <span className="flex h-3 w-4 flex-col justify-between">
            <span
              className={`h-[1.5px] w-full bg-cream transition-transform duration-300 ${
                menuOpen ? 'translate-y-[5px] rotate-45' : ''
              }`}
            />
            <span
              className={`h-[1.5px] w-full bg-cream transition-transform duration-300 ${
                menuOpen ? '-translate-y-[5px] -rotate-45' : ''
              }`}
            />
          </span>
        </button>
      </div>
    </header>
  )
}
