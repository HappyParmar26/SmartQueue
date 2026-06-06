import React, { useState } from 'react'

function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="navbar">
      <style>{`
        .navbar{background:#111827;color:#fff;border-bottom:1px solid rgba(255,255,255,0.04)}
        .nav-container{max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:0.75rem 1rem}
        .brand{font-weight:700;font-size:1.05rem}
        .nav-links{display:flex;gap:1rem;list-style:none;margin:0;padding:0}
        .nav-links a{color:inherit;text-decoration:none;padding:0.5rem 0.75rem;border-radius:6px}
        .nav-links a:hover{background:rgba(255,255,255,0.04)}
        .burger{display:none;background:none;border:none;color:inherit;font-size:1.25rem;padding:0.25rem}
        @media (max-width:640px){
          .burger{display:block}
          .nav-links{position:absolute;top:56px;right:1rem;background:#0b1220;flex-direction:column;padding:0.5rem;border-radius:8px;box-shadow:0 6px 18px rgba(2,6,23,0.6);display:none}
          .nav-links.open{display:flex}
        }
      `}</style>

      <div className="nav-container">
        <div className="brand">SmartQueue</div>

        <nav>
          <button
            className="burger"
            aria-label="Toggle menu"
            onClick={() => setOpen((s) => !s)}
          >
            ☰
          </button>

          <ul className={`nav-links ${open ? 'open' : ''}`}>
            <li><a href="/">Home</a></li>
            <li><a href="#">Queue</a></li>
            <li><a href="#">Tickets</a></li>
            <li><a href="#">Help</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
