import { Fragment, useEffect, useMemo, useRef, useState } from 'react'

interface ScrollQuoteProps {
  text: string
  caption?: string
}

// Deterministic pseudo-random offset per word, so the layout always
// starts from the same scatter instead of re-randomizing on render.
function seededRandom(seed: number) {
  const x = Math.sin(seed * 999) * 10000
  return x - Math.floor(x)
}

// 参考: giats.me の引用セクション。単語ごとにランダムな順番で、画面の手前（奥行き方向）から
// 横軸でパタンと倒れた状態で現れ、奥へ下がりながら起き上がって定位置に着地する
const WORD_DURATION = 0.6 // 1単語が着地するまでにかける、英語本文の進捗(0〜1)に対する割合
const PERSPECTIVE = 1000 // px: 奥行きの基準。単語の開始位置(Z)はこれより手前に置く
const SMOOTHING_TIME = 0.55 // 秒: スクロールに対する追従の遅れ。大きいほどゆっくり揃う（約3倍の時間でほぼ追いつく）
const MAX_LAG = 0.1 // 表示の進捗が、スクロール位置から遅れてよい最大量（セクション全体に対する割合）

export default function ScrollQuote({ text, caption }: ScrollQuoteProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const words = useMemo(() => text.split(' '), [text])
  const [progress, setProgress] = useState(0)

  // 各単語の開始タイミング（ランダムな順番）と、開始時の位置・奥行き・倒れ具合
  const offsets = useMemo(
    () =>
      words.map((_, i) => ({
        start: seededRandom(i + 7) * (1 - WORD_DURATION),
        x: (seededRandom(i) - 0.5) * 190, // %: 単語自身の幅に対する横ずれ（最大で約1単語分）
        y: (seededRandom(i + 40) - 0.5) * 18, // %: 単語自身の高さに対する縦ずれ
        z: 500 + seededRandom(i + 60) * 420, // px: 手前にどれだけ飛び出しているか
        rotateX: (seededRandom(i + 120) - 0.5) * 176, // deg: 横軸まわりの倒れ具合（最大±88°）
      })),
    [words],
  )

  // スクロール位置から求めた進捗(target)に、表示上の進捗を少し遅れて追いつかせる。
  // 速くスクロールしても一瞬で揃わず、SMOOTHING_TIME秒ほどかけてなめらかに組み上がる
  // セクションの位置は毎フレーム getBoundingClientRect で読まず、ページ上の位置と高さを
  // あらかじめ控えておき、スクロール量(scrollY)との差から進捗を求める。
  // 毎フレーム位置を読むと、そのたびにページ全体のレイアウト計算が走り、スクロール中のカクつきの原因になる
  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    let raf = 0
    let current = 0
    let lastTime = performance.now()
    let sectionTop = 0
    let scrollable = 0

    const measure = () => {
      sectionTop = el.getBoundingClientRect().top + window.scrollY
      scrollable = el.offsetHeight - window.innerHeight
    }
    measure()
    // 上にあるセクションの高さが変わる（フォント読み込みなど）と位置がずれるため、ページの高さの変化でも測り直す
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(document.body)
    window.addEventListener('resize', measure)

    const update = (now: number) => {
      // rAFのタイムスタンプは開始時のperformance.now()より前になることがあるため、負の値にならないようにする
      const dt = Math.min(0.1, Math.max(0, (now - lastTime) / 1000))
      lastTime = now
      const target = scrollable > 0 ? Math.min(1, Math.max(0, (window.scrollY - sectionTop) / scrollable)) : 0
      current += (target - current) * (1 - Math.exp(-dt / SMOOTHING_TIME))
      // 速くスクロールしても遅れすぎないよう、スクロール位置との差をMAX_LAGまでに抑える。
      // これにより、画面に留まる区間(CAPTION_END〜1)の途中で必ずキャプションまで表示しきる
      current = Math.min(target + MAX_LAG, Math.max(target - MAX_LAG, current))
      if (Math.abs(target - current) < 0.0005) current = target
      // 値が変わらない間（セクションの外にいる間など）はReactが再描画を省略する
      setProgress(current)
      raf = requestAnimationFrame(update)
    }
    raf = requestAnimationFrame(update)

    return () => {
      cancelAnimationFrame(raf)
      resizeObserver.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  // 英語本文はスクロール全体の前半だけで組み上げ終え、日本語キャプションは
  // それが完了してから現れる。CAPTION_END以降は、すべて表示された状態のまま
  // 画面に留まる区間にして、表示しきる前にセクションが流れていかないようにする
  const ENGLISH_END = 0.65
  const CAPTION_END = 0.85
  const textProgress = Math.min(1, progress / ENGLISH_END)

  const renderWord = (word: string, i: number) => {
    const offset = offsets[i]
    const local = Math.min(1, Math.max(0, (textProgress - offset.start) / WORD_DURATION))
    // ゆるやかに減速しながら、ふわっと着地する（序盤で一気に寄りすぎないよう、減速の弱いカーブにする）
    const eased = Math.sin((local * Math.PI) / 2)
    const inv = 1 - eased

    return (
      <span
        className="inline-block will-change-transform"
        style={{
          opacity: eased,
          transform:
            inv > 0
              ? `translate(${inv * offset.x}%, ${inv * offset.y}%) translate3d(0, 0, ${inv * offset.z}px) rotateX(${inv * offset.rotateX}deg)`
              : 'none',
        }}
      >
        {word}
      </span>
    )
  }

  return (
    <section ref={wrapperRef} className="relative h-[400vh] bg-cream">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center gap-5 overflow-hidden px-8 nav:px-[6vw]">
        <p className="text-h3 max-w-3xl text-center font-semibold" style={{ perspective: `${PERSPECTIVE}px` }}>
          {words.map((word, i) => (
            <Fragment key={i}>
              {i > 0 && ' '}
              {renderWord(word, i)}
            </Fragment>
          ))}
        </p>

        {caption &&
          (() => {
            // 英語本文が最後まで表示され終わってから、位置は動かさずぼかしだけが
            // 解けるようにゆっくり現れる
            const local = Math.min(1, Math.max(0, (progress - ENGLISH_END) / (CAPTION_END - ENGLISH_END)))
            const eased = local * local * (3 - 2 * local)
            const remaining = 1 - eased
            return (
              // captionに含めた改行(\n)の位置で改行する（「静かに」が行の途中で分かれないように）。
              // 画面が狭くて折り返す場合も、文節の区切りで改行し、各行の長さをそろえて
              // 「る。」のような短い行が1つだけ残らないようにする
              <p
                className="text-p-l max-w-2xl whitespace-pre-line text-center text-balance text-ink/50 [word-break:auto-phrase]"
                style={{
                  opacity: eased,
                  filter: `blur(${remaining * 5}px)`,
                }}
              >
                {caption}
              </p>
            )
          })()}
      </div>
    </section>
  )
}
