import { motion } from 'framer-motion'
import { useScrollProgress, useActiveSection } from '../hooks'
import './Navbar.css'

const NAV_LINKS = ['skills', 'experience', 'projects', 'education', 'contact']

export default function Navbar() {
  const progress = useScrollProgress()
  const active = useActiveSection(NAV_LINKS)

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="scroll-bar"
        style={{ scaleX: progress / 100, transformOrigin: 'left' }}
      />

      <motion.nav
        className="navbar"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <a href="#home" className="nav-logo">TB.</a>
        <ul className="nav-links">
          {NAV_LINKS.map(link => (
            <li key={link}>
              <a
                href={`#${link}`}
                className={`nav-link ${active === link ? 'active' : ''}`}
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      </motion.nav>
    </>
  )
}
