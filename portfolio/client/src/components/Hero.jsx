import { motion } from 'framer-motion'
import { TypeAnimation } from 'react-type-animation'
import './Hero.css'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }
})

export default function Hero() {
  return (
    <section className="hero" id="home">
      {/* Background glows */}
      <div className="hero-glow hero-glow--teal" />
      <div className="hero-glow hero-glow--red" />

      <div className="hero-content">
        <motion.div className="hero-tag" {...fadeUp(0.2)}>
          <span className="hero-tag-line" />
          Available for opportunities
        </motion.div>

        <motion.h1 className="hero-name" {...fadeUp(0.35)}>
          Tonmoy<br />
          <span className="hero-name-accent">Bhattacharjee</span>
        </motion.h1>

        <motion.p className="hero-subtitle" {...fadeUp(0.5)}>
          <TypeAnimation
            sequence={[
              'CS Graduate & Web Developer',
              2000,
              'Frontend Engineer',
              2000,
              'MERN Stack Learner',
              2000,
              'Based in Dhaka, Bangladesh',
              2000,
            ]}
            speed={50}
            repeat={Infinity}
          />
        </motion.p>

        <motion.p className="hero-desc" {...fadeUp(0.65)}>
          Motivated developer with a strong foundation in HTML, CSS, and JavaScript.
          Currently advancing expertise in the MERN stack and building responsive,
          accessible web experiences.
        </motion.p>

        <motion.div className="hero-ctas" {...fadeUp(0.8)}>
          <a href="#projects" className="btn btn-primary">View Projects ↓</a>
          <a href="#contact" className="btn btn-outline">Get in Touch</a>
          <a
            href="https://github.com/tonmoybht"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            GitHub ↗
          </a>
        </motion.div>

        <motion.div className="hero-stack-label" {...fadeUp(0.95)}>
          <span>Tech Stack</span>
          <div className="hero-stack-badges">
            {['HTML5', 'CSS3', 'JS', 'React', 'Node', 'MongoDB'].map(t => (
              <span key={t} className="stack-badge">{t}</span>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        className="hero-visual"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <div className="avatar-wrap">
          <div className="avatar-ring ring-1" />
          <div className="avatar-ring ring-2" />
          <div className="avatar-initials">TB</div>
          <div className="status-badge">
            <span className="status-dot" />
            Open to work
          </div>
        </div>
      </motion.div>
    </section>
  )
}
