import CircleButton from './CircleButton'
import { scrollToSection } from '../utils/scroll'

const SITEMAP = ['Home', 'About', 'Skills', 'Works', 'Philosophy', 'Profile']

function FooterLink({ label, sectionId }: { label: string; sectionId?: string }) {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault()
        if (sectionId) scrollToSection(sectionId)
      }}
      className="group text-p relative flex w-fit items-center gap-2"
    >
      <svg
        viewBox="0 0 24 24"
        className="ease-brand h-3 w-3 -rotate-90 fill-none stroke-cream stroke-2 transition-transform duration-400 group-hover:translate-x-2 group-hover:-rotate-[150deg]"
      >
        <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="ease-brand inline-block transition-transform duration-400 group-hover:translate-x-2">
        {label}
      </span>
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="layout-grid relative overflow-hidden border-t border-cream/10 bg-ink-deep pt-20 text-cream nav:pt-[6vw]">
      <div className="col-span-6 flex flex-col gap-3 nav:col-span-7">
        <span className="text-p-x tracking-[0.2em] text-cream/50">Sitemap</span>
        {SITEMAP.map((link) => (
          <FooterLink key={link} label={link} sectionId={link.toLowerCase()} />
        ))}
      </div>

      <div className="col-span-6 mt-10 flex flex-col gap-2 nav:col-span-8 nav:col-start-9 nav:mt-0">
        <span className="text-p-x tracking-[0.2em] text-cream/50">Contact</span>
        {/* TODO: 実際の連絡先メールアドレスに差し替える */}
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="text-h4 w-fit border-b border-cream/30 transition-colors hover:border-cream"
        >
          your@email.com
        </a>
        <p className="text-p-l mt-6 max-w-xs text-cream/50">Step by step, built with care.</p>
      </div>

      <div className="col-span-6 mt-16 flex items-end justify-between nav:col-span-16 nav:mt-[5vw]">
        <p className="text-p-xs text-cream/40">&copy; 2026 Portfolio. All Rights Reserved.</p>
        <CircleButton
          onClick={() =>
            window.appLenis ? window.appLenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: 'smooth' })
          }
        />
      </div>

      {/* 行の高さ(0.9)からはみ出すgの下端ぶん(約0.13em)だけ下に余白を取り、文字の下端をページ下端にそろえる */}
      <p
        aria-hidden="true"
        className="col-span-6 -mx-(--layout-margin) mt-10 pb-[0.13em] select-none whitespace-nowrap text-center text-[15.2vw] font-semibold leading-[0.9] tracking-[-0.04em] text-cream/15 nav:col-span-16 nav:mt-[3vw]"
      >
        Quiet Strength
      </p>
    </footer>
  )
}
