import { useState } from 'react'

// TODO: Formspreeでフォーム作成後、実際のエンドポイントURLに差し替える
// 例: https://formspree.io/f/xxxxxxxx
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'

const fieldClass =
  'w-full border-b border-cream/30 bg-transparent py-3 text-p-l text-cream placeholder:text-cream/40 outline-none transition-colors focus:border-cream'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'not-configured' | 'submitting' | 'sent'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (FORMSPREE_ENDPOINT.includes('YOUR_FORM_ID')) {
      setStatus('not-configured')
      return
    }

    const form = e.currentTarget
    setStatus('submitting')
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
      setStatus(res.ok ? 'sent' : 'idle')
      if (res.ok) form.reset()
    } catch {
      setStatus('idle')
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

      {status === 'not-configured' && (
        <p className="text-p-x text-cream/50">
          ※ Formspreeのエンドポイント未設定のため、送信は準備中です。
        </p>
      )}
      {status === 'sent' && <p className="text-p-x text-lime">送信しました。ありがとうございます。</p>}
    </form>
  )
}
