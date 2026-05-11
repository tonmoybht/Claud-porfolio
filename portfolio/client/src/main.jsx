import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#111418',
          color: '#e8eaf0',
          border: '1px solid rgba(0,229,192,0.2)',
          fontFamily: "'DM Mono', monospace",
          fontSize: '0.8rem'
        },
        success: { iconTheme: { primary: '#00e5c0', secondary: '#111418' } }
      }}
    />
  </React.StrictMode>
)
