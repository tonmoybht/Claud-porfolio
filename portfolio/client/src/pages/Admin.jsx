import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../utils/api'
import './Admin.css'

const STATUS_COLORS = {
  unread: '#00e5c0',
  read: '#f7df1e',
  replied: '#22c55e'
}

export default function Admin() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [stats, setStats] = useState({ total: 0, unread: 0, replied: 0 })

  useEffect(() => {
    loadMessages()
  }, [filter])

  async function loadMessages() {
    setLoading(true)
    try {
      const params = filter !== 'all' ? { status: filter } : {}
      const { data } = await api.get('/contact', { params })
      setMessages(data.data)
      setStats({
        total: data.pagination.total,
        unread: data.data.filter(m => m.status === 'unread').length,
        replied: data.data.filter(m => m.status === 'replied').length
      })
    } catch (err) {
      setError('Could not load messages. Make sure the server is running.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })

  return (
    <div className="admin">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Admin <span>Panel</span></h1>
          <p className="admin-sub">Contact message inbox</p>
        </div>
        <a href="/" className="admin-back">← Back to Portfolio</a>
      </div>

      {/* Stats */}
      <div className="admin-stats">
        {[
          { label: 'Total Messages', value: stats.total, color: 'var(--accent)' },
          { label: 'Unread', value: stats.unread, color: '#f7df1e' },
          { label: 'Replied', value: stats.replied, color: '#22c55e' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-val" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="admin-filters">
        {['all', 'unread', 'read', 'replied'].map(f => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
        <button className="filter-btn refresh" onClick={loadMessages}>↻ Refresh</button>
      </div>

      {error && <div className="admin-error">⚠ {error}</div>}

      <div className="admin-body">
        {/* Message list */}
        <div className="msg-list">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="msg-item skeleton">
                  <div className="skeleton-box" style={{ width: '40%', height: 14, marginBottom: 8 }} />
                  <div className="skeleton-box" style={{ width: '65%', height: 11 }} />
                </div>
              ))
            : messages.length === 0
              ? <div className="msg-empty">No messages found.</div>
              : messages.map((msg, i) => (
                  <motion.div
                    key={msg._id}
                    className={`msg-item ${selected?._id === msg._id ? 'selected' : ''} ${msg.status}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setSelected(msg)}
                  >
                    <div className="msg-item-top">
                      <span className="msg-name">{msg.name}</span>
                      <span
                        className="msg-status-dot"
                        style={{ background: STATUS_COLORS[msg.status] }}
                        title={msg.status}
                      />
                    </div>
                    <div className="msg-email">{msg.email}</div>
                    <div className="msg-preview">{msg.message.slice(0, 60)}…</div>
                    <div className="msg-date">{formatDate(msg.createdAt)}</div>
                  </motion.div>
                ))
          }
        </div>

        {/* Message detail */}
        <div className="msg-detail">
          {selected ? (
            <motion.div
              key={selected._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="detail-header">
                <div>
                  <div className="detail-name">{selected.name}</div>
                  <a className="detail-email" href={`mailto:${selected.email}`}>{selected.email}</a>
                </div>
                <span
                  className="detail-status"
                  style={{ borderColor: STATUS_COLORS[selected.status], color: STATUS_COLORS[selected.status] }}
                >
                  {selected.status}
                </span>
              </div>
              <div className="detail-subject">Subject: {selected.subject}</div>
              <div className="detail-date">{formatDate(selected.createdAt)}</div>
              <div className="detail-msg">{selected.message}</div>
              <div className="detail-actions">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="btn btn-primary">
                  Reply via Email ↗
                </a>
              </div>
            </motion.div>
          ) : (
            <div className="detail-empty">Select a message to view it</div>
          )}
        </div>
      </div>
    </div>
  )
}
