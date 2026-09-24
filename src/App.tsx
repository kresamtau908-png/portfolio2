import { useState } from 'react'
import About from './components/About'
import Contact from './components/Contact'
import CustomScrollbar from './components/CustomScrollbar'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import Loader from './components/Loader'
import MenuOverlay from './components/MenuOverlay'
import Philosophy from './components/Philosophy'
import Profile from './components/Profile'
import ScrollQuote from './components/ScrollQuote'
import Skills from './components/Skills'
import Works from './components/Works'
import { useLenis } from './hooks/useLenis'

function App() {
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scaleOriginY, setScaleOriginY] = useState(0)
  useLenis()

  const openMenu = () => {
    const y = window.appLenis?.scroll ?? window.scrollY
    setScaleOriginY(y + window.innerHeight / 2)
    setMenuOpen(true)
  }

  return (
    <>
      {loading && <Loader onDone={() => setLoading(false)} />}

      <div className="noise-overlay" />
      <CustomScrollbar />

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div
        className={`app-shell relative bg-cream ${menuOpen ? 'menu-open' : ''}`}
        style={{ transformOrigin: `center ${scaleOriginY}px` }}
      >
        <Header menuOpen={menuOpen} onToggleMenu={() => (menuOpen ? setMenuOpen(false) : openMenu())} />

        <main className={`relative transition-opacity duration-700 ${loading ? 'opacity-0' : 'opacity-100'}`}>
          <Hero />
          <About />
          <ScrollQuote text="静かに学び、丁寧につくる。" />
          <Skills />
          <Works />
          <Philosophy />
          <Profile />
          <Contact />
          <Footer />
        </main>
      </div>
    </>
  )
}

export default App
