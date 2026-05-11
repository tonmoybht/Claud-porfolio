import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import './Skills.css'

const SKILLS = [
  {
    category: 'Frontend',
    accent: 'teal',
    items: ['HTML5', 'CSS3', 'Flexbox', 'Grid', 'JavaScript ES6+', 'Responsive Design']
  },
  {
    category: 'MERN Stack',
    accent: 'red',
    note: '— Learning',
    items: ['MongoDB', 'Express.js', 'React.js', 'Node.js']
  },
  {
    category: 'Databases & Version Control',
    accent: 'teal',
    items: ['SQL / MySQL', 'CRUD Operations', 'Git', 'GitHub']
  },
  {
    category: 'Tools & More',
    accent: 'teal',
    items: ['Python (Basic)', 'VS Code', 'Chrome DevTools', 'Material Design']
  }
]

function SkillCard({ skill, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <motion.div
      ref={ref}
      className={`skill-card skill-card--${skill.accent}`}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <div className="skill-cat">
        {skill.category}
        {skill.note && <span className="skill-note">{skill.note}</span>}
      </div>
      <div className="skill-items">
        {skill.items.map(item => (
          <span key={item} className={`skill-tag ${skill.note ? 'skill-tag--learning' : ''}`}>
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  )
}

export default function Skills() {
  const [ref, inView] = useInView({ triggerOnce: true })

  return (
    <section id="skills" className="skills-section">
      <div className="section-label">Technical Skills</div>
      <motion.h2
        className="section-title"
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        What I work with
      </motion.h2>
      <div className="skills-grid">
        {SKILLS.map((skill, i) => (
          <SkillCard key={skill.category} skill={skill} index={i} />
        ))}
      </div>
    </section>
  )
}
