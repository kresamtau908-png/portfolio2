const HEADER_OFFSET = 90

// offset はスクロール後に要素の上端が画面上からどれだけ離れて表示されるか（px）。
// 値が大きいほど下に表示される。上下のpaddingが大きいセクションは、
// 中身（見出しやフォーム）が画面に収まるようマイナス値で余分に送り込む。
const OFFSET_OVERRIDE: Record<string, number> = {
  contact: -90,
}

export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return

  const offset = OFFSET_OVERRIDE[id] ?? HEADER_OFFSET

  if (window.appLenis) {
    window.appLenis.scrollTo(el, { offset: -offset })
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}
