import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import './Experience.css'

const EXPERIENCES = [
  {
    role: 'Web Development Intern',
    company: 'Apcorn',
    location: 'Dhaka',
    period: 'Dec 2024 – Mar 2025',
    points: [
      'Engineered responsive web pages using HTML5/CSS3 with focus on cross-device compatibility.',
      'Revitalized UI/UX for existing sites following modern Material Design standards.',
      'Managed codebase integrity and collaborative workflows using Git and GitHub.',
      'Resolved frontend bugs and optimized load times during team sprints.'
    ]
  }
]

export default function Experience() {
  const [ref, inView] = useInView({ triggerOnce: true })

  return (
    <section id="experience">
      <div className="section-label">Work Experience</div>
      <motion.h2
        className="section-title"
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        Where I've worked
      </motion.h2>

      {EXPERIENCES.map((exp, i) => (
        <ExpItem key={i} exp={exp} index={i} />
      ))}

      {/* Currently seeking */}
      <motion.div
        className="seeking-banner"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <span className="seeking-dot" />
        <span>Currently seeking entry-level & junior developer roles</span>
        <a href="#contact" className="btn btn-primary seeking-btn">Let's Talk →</a>
      </motion.div>
    </section>
  )
}

function ExpItem({ exp, index }) {
  const [ref, inView] = useInView({ triggerOnce: true })

  return (
    <motion.div
      ref={ref}
      className="exp-item"
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1 }}
    >
      <div className="exp-meta">
        <div className="exp-date">{exp.period}</div>
        <div className="exp-company">{exp.company}, {exp.location}</div>
      </div>
      <div className="exp-body">
        <h3 className="exp-role">{exp.role}</h3>
        <ul className="exp-points">
          {exp.points.map((pt, i) => (
            <li key={i}>{pt}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}
