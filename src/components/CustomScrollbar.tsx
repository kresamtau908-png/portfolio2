import { useEffect, useRef, useState } from 'react'

export default function CustomScrollbar() {
  const [visible, setVisible] = useState(false)
  const [top, setTop] = useState(0)
  const hideTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const trackHeight = window.innerHeight * 0.8
    const thumbHeight = window.innerHeight * 0.06

    const onScroll = () => {
      const doc = document.documentElement
      const maxScroll = doc.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? doc.scrollTop / maxScroll : 0
      setTop(progress * (trackHeight - thumbHeight))
      setVisible(true)

      window.clearTimeout(hideTimer.current)
      hideTimer.current = window.setTimeout(() => setVisible(false), 900)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearTimeout(hideTimer.current)
    }
  }, [])

  return (
    <div className={`custom-scrollbar ${visible ? 'visible' : ''}`} aria-hidden="true">
      <div className="custom-scrollbar-thumb" style={{ top }} />
    </div>
  )
}
