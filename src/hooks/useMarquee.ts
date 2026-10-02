import { useEffect, useRef } from 'react'

const SECONDS_PER_SET = 26 // 秒: カード1セット分が流れるのにかける時間（以前のCSSアニメーションと同じ速さ）
const EASE_TIME = 0.25 // 秒: 速さが目標の速さに近づく速さ。止まる・動き出すまで約0.5〜0.75秒かかる
const DRAG_THRESHOLD = 6 // px: これ以上動かしたらクリックではなくドラッグとみなす
const MAX_FLING_SPEED = 3000 // px/秒: ドラッグを離したときに残す勢いの上限

// 横に流れ続けるカード列（マーキー）を制御する。
// - マウスを「カードの上」に乗せたときだけ、ゆっくり減速して止まる（離すとゆっくり動き出す）
// - マウスのドラッグやスマホのスワイプで左右に動かせる。離したときは勢いを残したまま、元の流れに戻る
// - ドラッグした後のクリックでリンクが開かないようにする
// itemsPerSet: 1セットあたりのカード枚数。列は同じセットを複数並べておき、1セット分ずれたら位置を戻してループさせる
export function useMarquee(itemsPerSet: number) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!viewport || !track) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let x = 0 // 列の横位置(px)。左に流れるほど小さくなる
    let speed = 0 // 現在の速さ(px/秒)。正の値で左へ流れる
    let setWidth = 0
    let baseSpeed = 0

    const measure = () => {
      const first = track.children[0] as HTMLElement | undefined
      const nextSet = track.children[itemsPerSet] as HTMLElement | undefined
      setWidth = first && nextSet ? nextSet.offsetLeft - first.offsetLeft : 0
      // 動きを減らす設定の環境では自動では流さない（ドラッグでは動かせる）
      baseSpeed = reduceMotion || !setWidth ? 0 : setWidth / SECONDS_PER_SET
    }
    measure()
    speed = baseSpeed
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(track)

    // 1セット分ずれたら位置を戻す（見た目は同じなので継ぎ目なくループする）
    const wrap = () => {
      if (!setWidth) return
      while (x <= -setWidth) x += setWidth
      while (x > 0) x -= setWidth
    }

    // --- マウスがカードの上にあるか ---
    let hovering = false
    const onPointerOver = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      hovering = !!(e.target as Element).closest('[data-marquee-item]')
    }
    const onPointerLeave = () => {
      hovering = false
    }

    // --- ドラッグ・スワイプ ---
    let pressed = false
    let dragging = false
    let pointerId = -1
    let startX = 0
    let lastX = 0
    let lastMoveTime = 0
    let dragVelocity = 0
    let suppressClick = false

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return
      pressed = true
      dragging = false
      suppressClick = false
      pointerId = e.pointerId
      startX = lastX = e.clientX
      lastMoveTime = performance.now()
      dragVelocity = 0
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!pressed || e.pointerId !== pointerId) return
      if (!dragging && Math.abs(e.clientX - startX) > DRAG_THRESHOLD) {
        dragging = true
        // ドラッグと判定してからポインターを捕まえる（ただのクリックはリンクにそのまま届くようにするため）
        // （ポインターがすでに離れている場合などは捕まえられないが、ドラッグ自体は続けられる）
        try {
          viewport.setPointerCapture(pointerId)
        } catch {
          /* 捕まえられなくてもドラッグは続ける */
        }
        viewport.dataset.dragging = 'true'
      }
      if (dragging) {
        const dx = e.clientX - lastX
        const now = performance.now()
        const dt = (now - lastMoveTime) / 1000
        x += dx
        if (dt > 0) dragVelocity = -dx / dt
        lastMoveTime = now
      }
      lastX = e.clientX
    }
    const endDrag = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return
      pressed = false
      if (!dragging) return
      dragging = false
      suppressClick = true
      delete viewport.dataset.dragging
      if (viewport.hasPointerCapture(pointerId)) viewport.releasePointerCapture(pointerId)
      // 離す直前に指が止まっていたら勢いは残さない
      const idle = performance.now() - lastMoveTime > 100
      speed = idle ? 0 : Math.max(-MAX_FLING_SPEED, Math.min(MAX_FLING_SPEED, dragVelocity))
    }
    // ドラッグした直後のクリックでリンクが開かないようにする
    const onClickCapture = (e: MouseEvent) => {
      if (!suppressClick) return
      e.preventDefault()
      e.stopPropagation()
      suppressClick = false
    }
    // 画像やリンクをブラウザ標準のドラッグで掴んでしまわないようにする
    const onDragStart = (e: DragEvent) => e.preventDefault()

    viewport.addEventListener('pointerover', onPointerOver)
    viewport.addEventListener('pointerleave', onPointerLeave)
    viewport.addEventListener('pointerdown', onPointerDown)
    viewport.addEventListener('pointermove', onPointerMove)
    viewport.addEventListener('pointerup', endDrag)
    viewport.addEventListener('pointercancel', endDrag)
    viewport.addEventListener('click', onClickCapture, true)
    viewport.addEventListener('dragstart', onDragStart)

    // --- 毎フレームの更新（画面外にある間は止める） ---
    let raf = 0
    let lastTime = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0, (now - lastTime) / 1000))
      lastTime = now
      if (!dragging) {
        const target = hovering ? 0 : baseSpeed
        speed += (target - speed) * (1 - Math.exp(-dt / EASE_TIME))
        x -= speed * dt
      }
      wrap()
      track.style.transform = `translate3d(${x}px, 0, 0)`
      raf = requestAnimationFrame(tick)
    }
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !raf) {
        lastTime = performance.now()
        raf = requestAnimationFrame(tick)
      } else if (!entry.isIntersecting && raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    })
    intersectionObserver.observe(viewport)

    return () => {
      cancelAnimationFrame(raf)
      intersectionObserver.disconnect()
      resizeObserver.disconnect()
      viewport.removeEventListener('pointerover', onPointerOver)
      viewport.removeEventListener('pointerleave', onPointerLeave)
      viewport.removeEventListener('pointerdown', onPointerDown)
      viewport.removeEventListener('pointermove', onPointerMove)
      viewport.removeEventListener('pointerup', endDrag)
      viewport.removeEventListener('pointercancel', endDrag)
      viewport.removeEventListener('click', onClickCapture, true)
      viewport.removeEventListener('dragstart', onDragStart)
    }
  }, [itemsPerSet])

  return { viewportRef, trackRef }
}
