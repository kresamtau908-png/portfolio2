import type { ElementType } from 'react'
import { useInView } from '../hooks/useInView'

interface RevealTextProps {
  text: string
  as?: ElementType
  className?: string
  delay?: number
}

export default function RevealText({ text, as: Tag = 'span', className = '', delay = 0 }: RevealTextProps) {
  const { ref, inView } = useInView<HTMLSpanElement>()
  const words = text.split(' ')

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden align-top pb-[0.1em]">
          <span
            className="ease-brand inline-block will-change-transform transition-[transform,opacity] duration-450"
            style={{
              transform: inView ? 'translateY(0) skewY(0)' : 'translateY(100%) skewY(1deg)',
              opacity: inView ? 1 : 0,
              transitionDelay: `${delay + i * 0.05}s`,
            }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        </span>
      ))}
    </Tag>
  )
}
