import React from 'react';

const Loader = ({ text = 'Loading...' }) => (
  <div style={styles.wrap}>
    <div style={styles.spinner} />
    <p style={styles.text}>{text}</p>
  </div>
);

const styles = {
  wrap: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '80px 20px', gap: 16,
  },
  spinner: {
    width: 44, height: 44,
    border: '3px solid rgba(255,255,255,0.08)',
    borderTop: '3px solid #e8c547',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  text: {
    color: 'rgba(240,236,230,0.4)',
    fontSize: 14, fontFamily: 'Syne, sans-serif',
  },
};

// Inject keyframes
if (typeof document !== 'undefined') {
  const s = document.createElement('style');
  s.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(s);
}

export default Loader;
