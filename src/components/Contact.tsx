import ContactForm from './ContactForm'
import RevealText from './RevealText'

export default function Contact() {
  return (
    <section id="contact" className="layout-grid bg-ink py-32 text-cream nav:py-[13vw]">
      <div className="col-span-6 flex flex-col items-start gap-7 nav:col-span-12 nav:col-start-3 nav:items-center nav:gap-[2vw] nav:text-center">
        <span className="text-p-x tracking-[0.2em] text-lime">CONTACT</span>
        <h2 className="text-h1">
          <RevealText text="丁寧に" className="block" />
          <RevealText text="向き合います" className="block" delay={0.1} />
        </h2>
        <p className="text-p-l text-cream/60">ご質問やお問い合わせは下記フォームよりお気軽にご連絡ください</p>
        <div className="mt-4 flex w-full justify-center nav:mt-[1.5vw]">
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
