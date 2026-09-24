import { useInView } from '../hooks/useInView'
import RevealText from './RevealText'

const SKILLS = [
  { name: 'HTML', note: 'セマンティックな構造設計' },
  { name: 'CSS', note: 'レイアウト・アニメーション' },
  { name: 'JavaScript', note: 'DOM操作・非同期処理' },
  { name: 'TypeScript', note: '型による安全な実装' },
  { name: 'React', note: 'コンポーネント設計' },
  { name: 'Tailwind CSS', note: 'ユーティリティファーストなスタイリング' },
  { name: 'Git / GitHub', note: 'バージョン管理・チーム開発' },
  { name: 'Figma', note: 'デザインの読み解きと実装' },
]

function SkillItem({ name, note, index }: { name: string; note: string; index: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3)

  return (
    <div
      ref={ref}
      className="ease-brand flex items-start gap-6 border-b border-ink/10 py-8 transition-[opacity,transform,filter] duration-700 nav:gap-[1.5vw] nav:py-[2.2vw]"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'scale(1) translateY(0)' : 'scale(1.08) translateY(12px)',
        filter: inView ? 'blur(0px)' : 'blur(6px)',
        transitionDelay: inView ? `${(index % 2) * 80}ms` : '0ms',
      }}
    >
      <span className="text-p-x w-8 shrink-0 pt-1 text-ink/40">{String(index + 1).padStart(2, '0')}</span>
      <span className="text-h5 w-38 shrink-0 font-medium nav:w-42">{name}</span>
      <span className="text-p pt-1 text-ink/60">{note}</span>
    </div>
  )
}

export default function Skills() {
  return (
    <section id="skills" className="layout-grid bg-cream py-28 nav:py-[11vw]">
      <div className="col-span-6 mb-16 nav:col-span-16 nav:mb-[4.5vw]">
        <div className="flex items-center gap-4">
          <span className="text-p-x text-ink/40">02</span>
          <span className="text-p-x tracking-[0.2em] text-ink/50">SKILLS</span>
        </div>
        <h2 className="text-h2 mt-4 nav:mt-[1vw]">
          <RevealText text="積み重ねてきた技術" />
        </h2>
      </div>

      <div className="col-span-6 grid grid-cols-1 nav:col-span-16 nav:grid-cols-2 nav:gap-x-[4.5vw]">
        {SKILLS.map((skill, i) => (
          <SkillItem key={skill.name} name={skill.name} note={skill.note} index={i} />
        ))}
      </div>
    </section>
  )
}
