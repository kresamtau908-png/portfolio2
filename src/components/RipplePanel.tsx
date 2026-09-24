interface RipplePanelProps {
  className?: string
}

// About用の装飾: 中心の点から波紋が静かに広がり続ける。
// 「一歩ずつ踏み出す・じわじわ広がっていく」を表す抽象モチーフ。
export default function RipplePanel({ className = '' }: RipplePanelProps) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: 'linear-gradient(135deg, var(--color-ink) 0%, var(--color-lime) 100%)' }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="animate-ripple absolute h-28 w-28 rounded-full border-2 nav:h-[9vw] nav:w-[9vw]"
          style={{ borderColor: 'rgba(247,244,238,0.55)', animationDelay: `${i * 1.4}s` }}
        />
      ))}
      <span className="relative h-3 w-3 rounded-full" style={{ backgroundColor: '#f7f4ee' }} />
    </div>
  )
}
