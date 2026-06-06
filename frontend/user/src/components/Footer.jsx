import React from 'react'

function Footer() {
  const year = new Date().getFullYear()
  const styles = {
    footer: {
      background: '#0f1724',
      color: '#cbd5e1',
      padding: '24px 16px',
      fontSize: 14,
    },
    container: {
      maxWidth: 1024,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    },
    topRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 12,
    },
    nav: {
      display: 'flex',
      gap: 12,
      alignItems: 'center',
    },
    link: {
      color: '#cbd5e1',
      textDecoration: 'none',
      opacity: 0.9,
    },
    small: {
      color: '#94a3b8',
      fontSize: 13,
    },
    social: {
      display: 'flex',
      gap: 8,
      alignItems: 'center',
    },
    logo: {
      fontWeight: 700,
      color: '#fff',
    },
  }

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.topRow}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <div style={styles.logo}>SmartQueue</div>
            <div style={styles.small}>Efficient queuing for modern teams</div>
          </div>

          <nav style={styles.nav} aria-label="Footer navigation">
            <a style={styles.link} href="#">Home</a>
            <a style={styles.link} href="#features">Features</a>
            <a style={styles.link} href="#pricing">Pricing</a>
            <a style={styles.link} href="#contact">Contact</a>
          </nav>

          <div style={styles.social} aria-hidden>
            <a style={styles.link} href="https://twitter.com" target="_blank" rel="noreferrer">Twitter</a>
            <a style={styles.link} href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8}}>
          <div style={styles.small}>© {year} SmartQueue. All rights reserved.</div>
          <div style={styles.small}>
            <a style={styles.link} href="#privacy">Privacy</a>
            <span style={{margin: '0 8px', color: '#334155'}}>•</span>
            <a style={styles.link} href="#terms">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
