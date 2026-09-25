import { useEffect, useMemo, useState } from 'react'

interface HeroBlocksProps {
  progress: number
  rows?: number
  cols?: number
  className?: string
}

// 参考: giats.me のヒーロー帯にある、ガラス質のブロックが組み上がっていく演出。
// スクロール進捗(progress: 0〜1)に応じて、各ブロックがランダムな順番・ランダムな方向から
// スライドインしながら定位置に収まっていく。「積み重ねる」ことを視覚的に語るため、
// Hero側でスクロールに合わせて計算したprogressを受け取るだけのプレゼンテーション用コンポーネントにしている。
function seededRandom(seed: number) {
  const x = Math.sin(seed * 999) * 10000
  return x - Math.floor(x)
}

function smoothstep(x: number) {
  const t = Math.min(1, Math.max(0, x))
  return t * t * (3 - 2 * t)
}

// 完成後の待機演出:「1つのブロックが消え、隣にある既存のブロックがその空いた場所へ
// スライドして埋める→隣のブロックが自分の場所へ戻る→消えたブロックが元の場所に戻る」
// という一連のイベントを、1つの時計(clock)で管理する。全ブロックが同時に動く独立ループではなく、
// 常にどこか1箇所だけで起きる、静かな頻度のイベントにしている。
const EVENT_DURATION = 7 // 秒: 1回のイベント（消える→隣が来る→隣が戻る→戻る）にかかる時間
const EVENT_GAP_MIN = 30 // 秒: イベント間の最短間隔
const EVENT_GAP_RANGE = 26 // 秒: 間隔のランダムな振れ幅

export default function HeroBlocks({ progress, rows = 4, cols = 5, className = '' }: HeroBlocksProps) {
  const total = rows * cols
  // 隣接するブロック同士のしきい値の間隔（フェードにかかる猶予幅）
  const band = Math.min(0.2, 1.8 / total)
  // ページ表示直後（progress=0）から、最初の何個かはすでに現れている状態にするための前倒し量
  const headStart = 0.15

  // 各ブロックにランダムな出現順（しきい値）と、スライドインしてくる方向・距離・回転を割り当てる。
  // 決定的シャッフル/擬似乱数なので、毎回同じ結果になる
  const blocks = useMemo(() => {
    const order = Array.from({ length: total }, (_, i) => i)
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(i + 1) * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }
    const result = new Array(total)
    order.forEach((blockIndex, orderPos) => {
      const angle = seededRandom(blockIndex) * Math.PI * 2
      const distance = 70 + seededRandom(blockIndex + 40) * 130
      result[blockIndex] = {
        start: (orderPos / total) * (1 - band) - headStart,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        rotate: (seededRandom(blockIndex + 90) - 0.5) * 50,
      }
    })
    return result
  }, [total, band])

  // 待機演出のイベント一覧を先に生成しておく（決定的な擬似乱数なので毎回同じ流れになる）。
  // 最後まで行ったら最初に戻ってループする
  const { events, loopDuration } = useMemo(() => {
    const list: { time: number; emptyIndex: number; neighborIndex: number; dRow: number; dCol: number }[] = []
    let t = 8
    for (let n = 0; n < 30; n++) {
      const emptyIndex = Math.floor(seededRandom(n * 13 + 1) * total)
      const row = Math.floor(emptyIndex / cols)
      const col = emptyIndex % cols
      const neighbors: number[] = []
      if (row > 0) neighbors.push(emptyIndex - cols)
      if (row < rows - 1) neighbors.push(emptyIndex + cols)
      if (col > 0) neighbors.push(emptyIndex - 1)
      if (col < cols - 1) neighbors.push(emptyIndex + 1)
      if (neighbors.length === 0) continue

      const neighborIndex = neighbors[Math.floor(seededRandom(n * 13 + 2) * neighbors.length)]
      const dRow = row - Math.floor(neighborIndex / cols)
      const dCol = col - (neighborIndex % cols)

      list.push({ time: t, emptyIndex, neighborIndex, dRow, dCol })
      t += EVENT_GAP_MIN + seededRandom(n * 13 + 3) * EVENT_GAP_RANGE
    }
    return { events: list, loopDuration: t }
  }, [total, rows, cols])

  // 全ブロックの登場アニメーションが完了してから待機演出に切り替える
  const isComplete = progress >= 0.98

  // 待機演出用の時計。完成後だけ動かす
  const [clock, setClock] = useState(0)
  useEffect(() => {
    if (!isComplete) return
    let raf = 0
    const startedAt = performance.now()
    const tick = (now: number) => {
      setClock((now - startedAt) / 1000)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isComplete])

  const t = loopDuration > 0 ? clock % loopDuration : 0
  const activeEvent = events.find((e) => t >= e.time && t < e.time + EVENT_DURATION)
  let eventLocal = 0
  if (activeEvent) {
    eventLocal = (t - activeEvent.time) / EVENT_DURATION
  }

  // 消えるブロックの不透明度: 前半でフェードアウトし、後半でフェードイン
  const emptyOpacity =
    eventLocal < 0.2
      ? 1 - smoothstep(eventLocal / 0.2)
      : eventLocal < 0.8
        ? 0
        : smoothstep((eventLocal - 0.8) / 0.2)

  // 隣のブロックが空いた場所へ向かう量(0〜1): 行き→滞在→戻り
  const visitAmount =
    eventLocal < 0.2
      ? 0
      : eventLocal < 0.4
        ? smoothstep((eventLocal - 0.2) / 0.2)
        : eventLocal < 0.6
          ? 1
          : eventLocal < 0.8
            ? 1 - smoothstep((eventLocal - 0.6) / 0.2)
            : 0

  return (
    <div
      className={`grid ${className}`}
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
    >
      {blocks.map(({ start, x, y, rotate }, i) => {
        const local = Math.min(1, Math.max(0, (progress - start) / band))
        const eased = 1 - Math.pow(1 - local, 3)
        const inv = 1 - eased

        // 全タイル共通の1枚のグラデーションを、各タイルの位置に応じて切り出す。
        // 完成時に境目なく1枚のパネルに見えるよう、backgroundSize/Positionでスライスする
        const row = Math.floor(i / cols)
        const col = i % cols

        let opacity = eased
        let transform = `translate(${inv * x}px, ${inv * y}px) rotate(${inv * rotate}deg) scale(${0.75 + eased * 0.25})`

        if (isComplete) {
          opacity = 1
          transform = 'translate(0, 0)'
          if (activeEvent) {
            if (i === activeEvent.emptyIndex) {
              opacity = emptyOpacity
            } else if (i === activeEvent.neighborIndex) {
              transform = `translate(${activeEvent.dCol * 100 * visitAmount}%, ${activeEvent.dRow * 100 * visitAmount}%)`
            }
          }
        }

        return (
          <div
            key={i}
            className="will-change-transform"
            style={{
              opacity,
              margin: '-0.6px',
              backgroundImage:
                'linear-gradient(135deg, rgba(247,244,238,1) 0%, rgba(124,147,172,1) 30%, rgba(24,35,56,1) 100%)',
              backgroundSize: `${cols * 100}% ${rows * 100}%`,
              backgroundPosition: `${cols > 1 ? (col / (cols - 1)) * 100 : 0}% ${
                rows > 1 ? (row / (rows - 1)) * 100 : 0
              }%`,
              transform,
            }}
          />
        )
      })}
    </div>
  )
}
