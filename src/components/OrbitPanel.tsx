interface OrbitPanelProps {
  className?: string
}

// Profile用の装飾: 柔らかい光の玉がゆっくり漂う、有機的で温かみのあるデザイン
export default function OrbitPanel({ className = '' }: OrbitPanelProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: 'linear-gradient(160deg, var(--color-ink) 0%, #24314a 100%)' }}
    >
      <div
        className="animate-orbit-a absolute -left-8 -top-8 h-40 w-40 rounded-full opacity-60 blur-2xl"
        style={{ backgroundColor: 'var(--color-lime)' }}
      />
      <div
        className="animate-orbit-b absolute -right-10 -bottom-10 h-56 w-56 rounded-full opacity-50 blur-2xl"
        style={{ backgroundColor: '#a9c3d8' }}
      />
      <div
        className="animate-orbit-c absolute left-1/3 top-1/2 h-24 w-24 rounded-full opacity-50 blur-xl"
        style={{ backgroundColor: 'var(--color-cream)' }}
      />
    </div>
  )
}
