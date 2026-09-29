import { useEffect, useMemo, useRef, useState } from 'react'

interface HeroBlocksProps {
  rows?: number
  cols?: number
  className?: string
}

// 参考: giats.me のヒーロー帯にある、ガラス質のブロックが組み上がっていく演出。
// スクロールには連動させず、表示されてから一定時間で自動的に、各ブロックがランダムな
// 順番・ランダムな方向からスライドインしながら定位置に収まっていく。
function seededRandom(seed: number) {
  const x = Math.sin(seed * 999) * 10000
  return x - Math.floor(x)
}

function smoothstep(x: number) {
  const t = Math.min(1, Math.max(0, x))
  return t * t * (3 - 2 * t)
}

// Loader（読み込み演出）が隠れ終わる頃に組み上がりを開始するための待ち時間、
// および組み上がりにかける時間
const ENTRANCE_DELAY = 4.4 // 秒: Loaderが終わる3.4秒から、さらに1秒ずらして本体のフェードインと重ならないようにする
const ENTRANCE_DURATION = 2.5 // 秒: 組み上がりにかける時間

// 完成後の待機演出:「ランダムな1箇所のブロックが消え、隣にある既存のブロックが
// その空いた場所へスライドしてそのまま居座る→隣が抜けてできた場所には、
// 新しいブロックが別の方向からスライドインしてくる」という一連のイベントを、
// 1つの時計で管理する。元の配置には戻さず、盤面の中身は少しずつ入れ替わっていく。
// 常にどこか1箇所だけで起きる、静かな頻度のイベントにしている。
// 各フェーズの長さ（秒）。eventTimeはイベント開始からの経過秒数として扱う
const PHASE_VANISH = 1.0 // 消えるマスがフェードアウトしきるまで
const PHASE_PAUSE = 1.0 // フェードアウトしきってから、隣が動き出すまでの間
const PHASE_SLIDE = 1.3 // 隣が実際にスライドしていく時間（この間に背景の色自体も連続的に変化する）
const PHASE_GAP = 0.15 // 新しいブロックが登場するまでの短い間
const PHASE_ARRIVE = 1.2 // 新しいブロックがスライドインしてくる時間

const T_VANISH_END = PHASE_VANISH
const T_SLIDE_START = T_VANISH_END + PHASE_PAUSE
const T_SLIDE_END = T_SLIDE_START + PHASE_SLIDE
const T_GAP_END = T_SLIDE_END + PHASE_GAP
const EVENT_DURATION = T_GAP_END + PHASE_ARRIVE // 秒: 1回のイベント全体にかかる時間

const EVENT_SILENCE_MIN = 2 // 秒: 1つのイベントが終わってから、次のブロックが消え始めるまでの最短の間
const EVENT_SILENCE_RANGE = 4 // 秒: その間のランダムな振れ幅
const IDLE_START_DELAY = 0.8 // 秒: 組み上がりが完成してから、最初のイベントが始まるまでの間

export default function HeroBlocks({ rows = 4, cols = 5, className = '' }: HeroBlocksProps) {
  const total = rows * cols
  // 隣接するブロック同士のしきい値の間隔（フェードにかかる猶予幅）
  const band = Math.min(0.2, 1.8 / total)
  // 組み上がり開始直後から、最初の何個かはすでに現れている状態にするための前倒し量
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

  // 待機演出のイベント一覧を先に生成しておく。ページを開くたびに毎回違う流れになるよう、
  // ここだけはMath.random()を使う（表示中はイベント自体を毎回作り直したりはしない）。
  // emptyIndex/neighborIndexは毎回ランダムに選ぶ。最後まで行ったら最初に戻ってループする
  // （ループが1周すると盤面の入れ替わりも最初の状態にリセットされる）
  const { events, loopDuration } = useMemo(() => {
    const list: {
      time: number
      emptyIndex: number
      neighborIndex: number
      dRow: number
      dCol: number
      arriveAngle: number
      arriveDistance: number
      arriveRotate: number
    }[] = []
    let t = 0

    // emptyIndexを毎回独立に抽選すると、同じマスが連続で選ばれて「固定されている」ように
    // 見えることがある。9マスなら9回で必ず全マスを1回ずつ使う「袋（バッグ）」方式にして、
    // 連続で同じマスが選ばれないようにしつつ、長い目で見ても均等に散らばるようにする
    let bag: number[] = []
    let bagCursor = 0
    let lastEmptyIndex = -1
    const refillBag = () => {
      const arr = Array.from({ length: total }, (_, i) => i)
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
      }
      if (arr[0] === lastEmptyIndex && arr.length > 1) {
        ;[arr[0], arr[1]] = [arr[1], arr[0]]
      }
      bagCursor = 0
      return arr
    }
    bag = refillBag()

    for (let n = 0; n < 40; n++) {
      if (bagCursor >= bag.length) {
        bag = refillBag()
      }
      const emptyIndex = bag[bagCursor]
      bagCursor += 1
      lastEmptyIndex = emptyIndex
      const row = Math.floor(emptyIndex / cols)
      const col = emptyIndex % cols
      const neighbors: number[] = []
      if (row > 0) neighbors.push(emptyIndex - cols)
      if (row < rows - 1) neighbors.push(emptyIndex + cols)
      if (col > 0) neighbors.push(emptyIndex - 1)
      if (col < cols - 1) neighbors.push(emptyIndex + 1)
      if (neighbors.length === 0) continue

      const neighborIndex = neighbors[Math.floor(Math.random() * neighbors.length)]
      const dRow = row - Math.floor(neighborIndex / cols)
      const dCol = col - (neighborIndex % cols)

      list.push({
        time: t,
        emptyIndex,
        neighborIndex,
        dRow,
        dCol,
        // 新しく登場するブロックがスライドインしてくる方向・距離（%、マスのサイズ基準）・回転（隣とは無関係のランダムな向き）
        arriveAngle: Math.random() * Math.PI * 2,
        arriveDistance: 40 + Math.random() * 60,
        arriveRotate: (Math.random() - 0.5) * 80,
      })
      // 次のイベントは、今のイベントが完全に終わってから一定の間を置いて始まる
      t += EVENT_DURATION + EVENT_SILENCE_MIN + Math.random() * EVENT_SILENCE_RANGE
    }
    return { events: list, loopDuration: t }
  }, [total, rows, cols])

  // 表示されてからの経過時間を、1つのタイマーで一貫して計測する。
  // 画面外にある間は再描画を止める（毎フレームの再描画がスクロール中のカクつきの原因になるため）。
  // 時計そのものは進み続けるので、画面内に戻ったときは本来の時刻の状態から再開する
  const rootRef = useRef<HTMLDivElement>(null)
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    let raf = 0
    let visible = true
    const startedAt = performance.now()
    const tick = (now: number) => {
      if (visible) setElapsed((now - startedAt) / 1000)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    if (rootRef.current) observer.observe(rootRef.current)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [])

  // 組み上がりの進捗(0〜1)。Loaderの表示時間だけ待ってから、ENTRANCE_DURATION秒かけて進む
  const progress = Math.min(1, Math.max(0, (elapsed - ENTRANCE_DELAY) / ENTRANCE_DURATION))
  const isComplete = progress >= 1

  const idleClock = elapsed - ENTRANCE_DELAY - ENTRANCE_DURATION - IDLE_START_DELAY
  const t = loopDuration > 0 && idleClock > 0 ? idleClock % loopDuration : 0
  const activeEvent = isComplete && idleClock > 0 ? events.find((e) => t >= e.time && t < e.time + EVENT_DURATION) : undefined
  // イベント開始からの経過秒数（0〜EVENT_DURATION）として扱う
  let eventTime = 0
  if (activeEvent) {
    eventTime = t - activeEvent.time
  }

  // 指定したマス番号本来の位置を、背景の切り出し位置（%）として返す
  const positionOf = (index: number) => ({
    x: cols > 1 ? ((index % cols) / (cols - 1)) * 100 : 0,
    y: rows > 1 ? (Math.floor(index / cols) / (rows - 1)) * 100 : 0,
  })

  return (
    <div
      ref={rootRef}
      className={`grid ${className}`}
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, gridTemplateRows: `repeat(${rows}, 1fr)` }}
    >
      {blocks.map(({ start, x, y, rotate }, i) => {
        const local = Math.min(1, Math.max(0, (progress - start) / band))
        const eased = 1 - Math.pow(1 - local, 3)
        const inv = 1 - eased

        let opacity = eased
        let transform = `translate(${inv * x}px, ${inv * y}px) rotate(${inv * rotate}deg) scale(${0.75 + eased * 0.25})`
        // 全タイル共通の1枚のグラデーションを、そのマス本来の位置に応じて切り出す。
        // 完成時に境目なく1枚のパネルに見えるようにする。1つのブロックに戻った瞬間は
        // 必ずこの本来の位置に揃う
        let bgPos = positionOf(i)

        if (isComplete) {
          opacity = 1
          transform = 'translate(0, 0)'

          if (activeEvent && i === activeEvent.emptyIndex) {
            // このマス（消える側）: 自分の中身が先にフェードアウトし、1秒ほど空いたままになる。
            // 隣が実際に到着する（＝隣の背景がこのマスの色に変わり終わる）タイミングで、
            // 中身がすでに揃った状態としてそのまま現れる
            if (eventTime < T_VANISH_END) {
              opacity = 1 - smoothstep(eventTime / PHASE_VANISH)
            } else if (eventTime < T_SLIDE_END) {
              opacity = 0
            }
          }

          if (activeEvent && i === activeEvent.neighborIndex) {
            // 隣のマス: 実体（見た目）はそのまま、消えたマスが空いてから1秒待って
            // 空いた場所へ実際にスライドしていく。移動している最中に、背景の切り出し位置も
            // 自分の色から消えたマスの色へ連続的に移り変わるので、「別の新しいブロックが
            // 出現した」のではなく、同じブロックの色がなめらかに変わって見える。
            // 到着後は一瞬で消え、（見えないうちに）元の場所へ戻ってから、
            // 無関係な方向から新しい中身がスライドインしてくる。行き来する動きそのものは見せない
            if (eventTime < T_SLIDE_START) {
              // 待機中はそのまま自分の場所にいる
            } else if (eventTime < T_SLIDE_END) {
              const slideProgress = smoothstep((eventTime - T_SLIDE_START) / PHASE_SLIDE)
              transform = `translate(${activeEvent.dCol * slideProgress * 100}%, ${activeEvent.dRow * slideProgress * 100}%)`
              const ownPos = positionOf(i)
              const targetPos = positionOf(activeEvent.emptyIndex)
              bgPos = {
                x: ownPos.x + (targetPos.x - ownPos.x) * slideProgress,
                y: ownPos.y + (targetPos.y - ownPos.y) * slideProgress,
              }
            } else if (eventTime < T_GAP_END) {
              opacity = 0
            } else {
              const p = smoothstep((eventTime - T_GAP_END) / PHASE_ARRIVE)
              const remaining = 1 - p
              opacity = p
              const arriveX = Math.cos(activeEvent.arriveAngle) * activeEvent.arriveDistance
              const arriveY = Math.sin(activeEvent.arriveAngle) * activeEvent.arriveDistance
              transform = `translate(${remaining * arriveX}%, ${remaining * arriveY}%) rotate(${remaining * activeEvent.arriveRotate}deg)`
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
              backgroundPosition: `${bgPos.x}% ${bgPos.y}%`,
              transform,
            }}
          />
        )
      })}
    </div>
  )
}
