import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import './Education.css'

export default function Education() {
  const [ref, inView] = useInView({ triggerOnce: true })

  const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.5, delay }
  })

  return (
    <section id="education">
      <div className="section-label">Education & Certifications</div>
      <motion.h2 className="section-title" ref={ref} {...fadeIn()}>
        Academic Background
      </motion.h2>

      <div className="edu-grid">
        <motion.div className="edu-card edu-card--main" {...fadeIn(0.1)}>
          <div>
            <div className="edu-degree">BSc in Computer Science & Engineering</div>
            <div className="edu-inst">Southeast University, Dhaka</div>
            <div className="edu-year">2018 – 2025</div>
            <div className="cert-badge">🔐 Cybersecurity — Arena Web Security (2021)</div>
          </div>
          <div className="edu-gpa">2.65</div>
        </motion.div>

        <motion.div className="edu-card" {...fadeIn(0.18)}>
          <div className="edu-degree">HSC</div>
          <div className="edu-inst">Shaheen College</div>
          <div className="edu-year-sm">GPA: 2.92</div>
        </motion.div>

        <motion.div className="edu-card" {...fadeIn(0.26)}>
          <div className="edu-degree">SSC</div>
          <div className="edu-inst">Winsome School & College</div>
          <div className="edu-year-sm">GPA: 3.44</div>
        </motion.div>
      </div>

      {/* Languages */}
      <motion.div className="lang-section" {...fadeIn(0.34)}>
        <div className="lang-title">Languages</div>
        <div className="lang-chips">
          <div className="lang-chip">
            <span className="lang-flag">🇧🇩</span>
            <span>Bengali</span>
            <span className="lang-level">Native</span>
          </div>
          <div className="lang-chip">
            <span className="lang-flag">🇬🇧</span>
            <span>English</span>
            <span className="lang-level">Intermediate</span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
