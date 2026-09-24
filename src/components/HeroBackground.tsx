interface ShapeConfig {
  type: 'circle' | 'square' | 'triangle'
  top: string
  left: string
  size: string
  variant: 'fill' | 'bold' | 'line'
  animation: string
}

const SHAPES: ShapeConfig[] = [
  // 大きな塗りつぶしの円：静止時でも一目で分かる存在感の核
  { type: 'circle', top: '4%', left: '68%', size: '24vw', variant: 'fill', animation: 'animate-hero-drift-a' },
  { type: 'triangle', top: '58%', left: '10%', size: '8vw', variant: 'bold', animation: 'animate-hero-drift-b' },
  { type: 'square', top: '14%', left: '4%', size: '6vw', variant: 'bold', animation: 'animate-hero-drift-c' },
  { type: 'circle', top: '74%', left: '82%', size: '4vw', variant: 'line', animation: 'animate-hero-drift-d' },
]

function ShapeIcon({ type, variant }: { type: ShapeConfig['type']; variant: ShapeConfig['variant'] }) {
  const stroke =
    variant === 'fill'
      ? { fill: 'var(--color-lime)', fillOpacity: 0.16, stroke: 'none' }
      : variant === 'bold'
        ? { fill: 'none', stroke: 'var(--color-ink)', strokeOpacity: 0.45, strokeWidth: 2.5 }
        : { fill: 'none', stroke: 'var(--color-ink)', strokeOpacity: 0.3, strokeWidth: 1.5 }

  return (
    <svg viewBox="0 0 48 48" className="h-full w-full">
      {type === 'circle' && <circle cx="24" cy="24" r="20" {...stroke} />}
      {type === 'square' && <rect x="5" y="5" width="38" height="38" {...stroke} />}
      {type === 'triangle' && <polygon points="24,4 45,42 3,42" strokeLinejoin="round" {...stroke} />}
    </svg>
  )
}

// ゆっくり自動で漂う幾何学図形。
// About/Philosophy/Profileと同じ○□△の言語で統一。大きな塗り円で存在感を出しつつ、
// マウス操作に関係なく常にゆったりとした動きを持たせている。
export default function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {SHAPES.map((shape, i) => (
        <div
          key={i}
          className={`absolute ${shape.animation}`}
          style={{ top: shape.top, left: shape.left, width: shape.size, height: shape.size }}
        >
          <ShapeIcon type={shape.type} variant={shape.variant} />
        </div>
      ))}
    </div>
  )
}
