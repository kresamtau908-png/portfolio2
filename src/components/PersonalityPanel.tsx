interface PersonalityPanelProps {
  className?: string
}

// Profile用の装飾: 柔らかい光のにじみ＋ゆっくり逆回転するダイヤ形。
// About（円＋三角形）／Philosophy（○□△のアイコン）と図形の言語を揃えつつ、
// Profileらしい温かみを持たせている。要素は絞って、ごちゃつかないようにしている。
export default function PersonalityPanel({ className = '' }: PersonalityPanelProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: 'linear-gradient(160deg, var(--color-ink) 0%, #24314a 100%)' }}
    >
      <div
        className="animate-orbit-a absolute -right-12 -top-12 h-64 w-64 rounded-full opacity-60 blur-2xl nav:h-[20vw] nav:w-[20vw]"
        style={{ backgroundColor: 'var(--color-lime)' }}
      />

      <div className="animate-spin-slow-reverse absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="h-[54%] w-[54%]">
          <rect
            x="40"
            y="40"
            width="120"
            height="120"
            rx="12"
            fill="none"
            stroke="rgba(247,244,238,0.75)"
            strokeWidth="2.5"
            transform="rotate(45 100 100)"
          />
        </svg>
      </div>

      <span
        className="animate-pulse-soft absolute bottom-10 left-10 h-5 w-5 rounded-full nav:h-[1.4vw] nav:w-[1.4vw]"
        style={{ backgroundColor: '#f7f4ee' }}
      />
    </div>
  )
}
