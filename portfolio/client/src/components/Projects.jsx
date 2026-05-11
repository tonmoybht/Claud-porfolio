import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useProjects } from '../hooks'
import './Projects.css'

const LANG_COLORS = {
  HTML: '#e44d26',
  CSS: '#264de4',
  JavaScript: '#f7df1e',
  Bootstrap: '#7952b3',
  MongoDB: '#47a248',
  React: '#61dafb',
}

function ProjectCard({ project, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <motion.a
      ref={ref}
      className="project-card"
      href={project.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      whileHover={{ y: -5 }}
    >
      <div className="project-header">
        <div className="project-icon">{project.icon}</div>
        <span className="project-arrow">↗</span>
      </div>
      <div>
        <h3 className="project-name">{project.title}</h3>
        <p className="project-desc">{project.description}</p>
      </div>
      <div className="project-footer">
        {project.languages.map(lang => (
          <span key={lang} className="lang-tag">
            <span
              className="lang-dot"
              style={{ background: LANG_COLORS[lang] || '#888' }}
            />
            {lang}
          </span>
        ))}
      </div>
    </motion.a>
  )
}

function SkeletonCard() {
  return (
    <div className="project-card skeleton">
      <div className="skeleton-box" style={{ width: 42, height: 42, borderRadius: 8 }} />
      <div>
        <div className="skeleton-box" style={{ width: '60%', height: 16, marginBottom: 10 }} />
        <div className="skeleton-box" style={{ width: '100%', height: 11, marginBottom: 6 }} />
        <div className="skeleton-box" style={{ width: '85%', height: 11 }} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div className="skeleton-box" style={{ width: 60, height: 24, borderRadius: 20 }} />
        <div className="skeleton-box" style={{ width: 50, height: 24, borderRadius: 20 }} />
      </div>
    </div>
  )
}

export default function Projects() {
  const { projects, loading, error } = useProjects({ pinned: true })
  const [ref, inView] = useInView({ triggerOnce: true })

  return (
    <section id="projects" className="projects-section">
      <div className="section-label">GitHub Pins</div>
      <motion.h2
        className="section-title"
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        Featured Projects
      </motion.h2>

      {error && (
        <div className="projects-error">
          ⚠ Could not load projects from API. Check that the server is running.
        </div>
      )}

      <div className="projects-grid">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)
        }
      </div>

      <motion.div
        className="github-cta"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.6 }}
      >
        <a
          href="https://github.com/tonmoybht"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
        >
          View all repositories on GitHub ↗
        </a>
      </motion.div>
    </section>
  )
}
