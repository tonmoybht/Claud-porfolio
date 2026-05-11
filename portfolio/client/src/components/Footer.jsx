import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        © {new Date().getFullYear()} <span className="footer-name">Tonmoy Bhattacharjee</span>
        <span className="footer-sep">—</span>
        Built with React, Node.js & MongoDB
      </div>
      <div className="footer-links">
        <a href="https://github.com/tonmoybht" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="mailto:tonmoybht985@gmail.com">Email</a>
        <a href="#home">Back to top ↑</a>
      </div>
    </footer>
  )
}
