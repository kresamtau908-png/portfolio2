import { useState } from 'react'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xqpabozo'

const fieldClass =
  'ease-brand w-full rounded-[0.5vw] border border-cream/25 bg-cream/5 px-4 py-3 text-p-l text-cream placeholder:text-cream/40 outline-none transition-colors duration-300 focus:border-cream/70 focus:bg-cream/10'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const form = e.currentTarget
    setStatus('submitting')
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setStatus('sent')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-lg flex-col gap-6 text-left nav:gap-[1.6vw]">
      <input type="text" name="name" placeholder="Your name" required className={fieldClass} />
      <input type="email" name="email" placeholder="Your email" required className={fieldClass} />
      <textarea name="message" placeholder="Your message" required rows={3} className={`${fieldClass} resize-none`} />

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="ease-brand group relative inline-flex h-10 w-fit items-center justify-center overflow-hidden rounded-full bg-cream px-6 text-p-x font-medium text-ink shadow-[0_0.32vw_0.52vw_rgba(0,0,0,0.04)] transition-opacity duration-300 disabled:opacity-60 nav:h-[2.5vw] nav:px-[1.25vw]"
      >
        <span className="ease-brand absolute left-1/2 top-1/2 z-0 h-0 w-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime transition-[width,height] duration-600 group-hover:h-[16vw] group-hover:w-[16vw]" />
        <span className="relative z-10 whitespace-nowrap uppercase tracking-wide">
          {status === 'submitting' ? 'Sending...' : 'Send message'}
        </span>
      </button>

      {status === 'error' && (
        <p className="text-p-x text-cream/50">送信に失敗しました。時間をおいて再度お試しください。</p>
      )}
      {status === 'sent' && <p className="text-p-x text-lime">送信しました。ありがとうございます。</p>}
    </form>
  )
}
