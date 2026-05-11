import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import toast from 'react-hot-toast'
import { submitContact } from '../utils/api'
import './Contact.css'

const CONTACT_ITEMS = [
  { icon: '✉', label: 'Email', value: 'tonmoybht985@gmail.com', href: 'mailto:tonmoybht985@gmail.com' },
  { icon: '📞', label: 'Phone', value: '+880 1302-677793', href: 'tel:+8801302677793' },
  { icon: '⌥', label: 'GitHub', value: 'github.com/tonmoybht', href: 'https://github.com/tonmoybht', external: true },
  { icon: '📍', label: 'Location', value: 'Banasree, Rampura, Dhaka, Bangladesh', href: null }
]

const initialForm = { name: '', email: '', subject: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [ref, inView] = useInView({ triggerOnce: true })

  const validate = () => {
    const errs = {}
    if (!form.name.trim() || form.name.length < 2) errs.name = 'Name must be at least 2 characters'
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Valid email required'
    if (!form.message.trim() || form.message.length < 10) errs.message = 'Message must be at least 10 characters'
    return errs
  }

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    try {
      const data = await submitContact(form)
      toast.success(data.message || "Message sent! I'll get back to you soon.")
      setForm(initialForm)
      setErrors({})
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.'
      toast.error(msg)
      // Show field errors from server
      if (err.response?.data?.errors) {
        const serverErrs = {}
        err.response.data.errors.forEach(e => { serverErrs[e.field] = e.message })
        setErrors(serverErrs)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="contact-section">
      <div className="section-label">Get in Touch</div>
      <motion.h2
        className="section-title"
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        Let's work together
      </motion.h2>

      <div className="contact-grid">
        {/* Contact info */}
        <motion.div
          className="contact-info"
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.1 }}
        >
          {CONTACT_ITEMS.map(item => (
            item.href ? (
              <a
                key={item.label}
                className="contact-item"
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
              >
                <span className="contact-icon">{item.icon}</span>
                <div>
                  <div className="contact-label">{item.label}</div>
                  <div className="contact-val">{item.value}</div>
                </div>
              </a>
            ) : (
              <div key={item.label} className="contact-item">
                <span className="contact-icon">{item.icon}</span>
                <div>
                  <div className="contact-label">{item.label}</div>
                  <div className="contact-val">{item.value}</div>
                </div>
              </div>
            )
          ))}
        </motion.div>

        {/* Form */}
        <motion.form
          className="contact-form"
          onSubmit={handleSubmit}
          noValidate
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.2 }}
        >
          <div className="form-row">
            <Field label="Your Name" name="name" value={form.name} onChange={handleChange} error={errors.name} placeholder="John Doe" />
            <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="john@example.com" />
          </div>
          <Field label="Subject (optional)" name="subject" value={form.subject} onChange={handleChange} placeholder="Portfolio Inquiry" />
          <Field label="Message" name="message" value={form.message} onChange={handleChange} error={errors.message} placeholder="Tell me about your project..." textarea />

          <motion.button
            type="submit"
            className={`btn btn-primary submit-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? (
              <><span className="spinner" /> Sending...</>
            ) : (
              'Send Message →'
            )}
          </motion.button>
        </motion.form>
      </div>
    </section>
  )
}

function Field({ label, name, value, onChange, error, placeholder, type = 'text', textarea }) {
  const El = textarea ? 'textarea' : 'input'
  return (
    <div className="form-field">
      <label className="form-label">{label}</label>
      <El
        className={`form-input ${error ? 'form-input--error' : ''}`}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={textarea ? 5 : undefined}
      />
      {error && <span className="form-error">{error}</span>}
    </div>
  )
}
