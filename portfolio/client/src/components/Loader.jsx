import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import './Loader.css'

export default function Loader({ onDone }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const steps = [20, 45, 70, 90, 100]
    let i = 0
    const tick = setInterval(() => {
      setCount(steps[i])
      i++
      if (i >= steps.length) {
        clearInterval(tick)
        setTimeout(onDone, 400)
      }
    }, 260)
    return () => clearInterval(tick)
  }, [onDone])

  return (
    <motion.div
      className="loader"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="loader-inner">
        <motion.div
          className="loader-logo"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          TB.
        </motion.div>
        <div className="loader-bar-wrap">
          <motion.div
            className="loader-bar"
            initial={{ width: 0 }}
            animate={{ width: `${count}%` }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          />
        </div>
        <div className="loader-count">{count}%</div>
      </div>
    </motion.div>
  )
}
