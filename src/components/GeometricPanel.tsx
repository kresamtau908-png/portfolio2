interface GeometricPanelProps {
  className?: string
}

// About用の装飾: 円と回転する三角形を組み合わせた、少し存在感のある幾何学モチーフ。
// Worksのスライド演出（syuz'gen参考）と同じく、抽象図形でトーンを揃えている。
export default function GeometricPanel({ className = '' }: GeometricPanelProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: 'linear-gradient(135deg, var(--color-ink) 0%, #24314a 100%)' }}
    >
      <div
        className="absolute -left-12 -top-12 h-64 w-64 rounded-full nav:h-[20vw] nav:w-[20vw]"
        style={{ backgroundColor: 'var(--color-lime)', opacity: 0.9 }}
      />
      <div
        className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full nav:h-[15vw] nav:w-[15vw]"
        style={{ border: '2px solid rgba(247,244,238,0.35)' }}
      />

      <div className="animate-spin-slow absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="h-[62%] w-[62%]">
          <polygon
            points="100,15 185,170 15,170"
            fill="none"
            stroke="rgba(247,244,238,0.75)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <span
        className="animate-pulse-soft absolute bottom-10 right-10 h-5 w-5 rounded-full nav:h-[1.4vw] nav:w-[1.4vw]"
        style={{ backgroundColor: '#f7f4ee' }}
      />
    </div>
  )
}
