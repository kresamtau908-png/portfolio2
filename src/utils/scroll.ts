const HEADER_OFFSET = 90

export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return

  if (window.appLenis) {
    window.appLenis.scrollTo(el, { offset: -HEADER_OFFSET })
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
    window.scrollTo({ top, behavior: 'smooth' })
  }
}
