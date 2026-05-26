import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logoutUser, isAdmin, isAuthenticated } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
    setDropOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/categories', label: 'Categories' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoAccent}>Shop</span>Karo
        </Link>

        {/* Desktop links */}
        <div style={styles.links}>
          {navLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                ...styles.link,
                ...(location.pathname === l.to ? styles.linkActive : {}),
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={styles.right}>
          {/* Cart */}
          <Link to="/cart" style={styles.cartBtn}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {count > 0 && <span style={styles.badge}>{count}</span>}
          </Link>

          {/* Auth */}
          {isAuthenticated ? (
            <div style={styles.userWrap}>
              <button style={styles.userBtn} onClick={() => setDropOpen(!dropOpen)}>
                <div style={styles.avatar}>{user?.name?.[0]?.toUpperCase() || 'U'}</div>
                <span style={styles.userName}>{user?.name?.split(' ')[0]}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {dropOpen && (
                <div style={styles.dropdown}>
                  <Link to="/my-orders" style={styles.dropItem} onClick={() => setDropOpen(false)}>My Orders</Link>
                  <Link to="/profile" style={styles.dropItem} onClick={() => setDropOpen(false)}>Profile</Link>
                  {isAdmin && <Link to="/admin" style={styles.dropItem} onClick={() => setDropOpen(false)}>Admin Panel</Link>}
                  <div style={styles.dropDivider} />
                  <button style={{ ...styles.dropItem, ...styles.dropLogout }} onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div style={styles.authLinks}>
              <Link to="/login" style={styles.loginBtn}>Login</Link>
              <Link to="/signup" style={styles.signupBtn}>Sign Up</Link>
            </div>
          )}

          {/* Hamburger */}
          <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
            <span style={{ ...styles.bar, ...(menuOpen ? styles.bar1Open : {}) }} />
            <span style={{ ...styles.bar, ...(menuOpen ? styles.bar2Open : {}) }} />
            <span style={{ ...styles.bar, ...(menuOpen ? styles.bar3Open : {}) }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} style={styles.mobileLink} onClick={() => setMenuOpen(false)}>{l.label}</Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link to="/my-orders" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>My Orders</Link>
              {isAdmin && <Link to="/admin" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Admin Panel</Link>}
              <button style={{ ...styles.mobileLink, background: 'none', border: 'none', textAlign: 'left', color: '#ff6b6b', cursor: 'pointer' }} onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/signup" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    position: 'sticky', top: 0, zIndex: 1000,
    background: 'rgba(10,10,15,0.92)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  inner: {
    maxWidth: 1280, margin: '0 auto',
    padding: '0 clamp(12px, 3vw, 24px)',
    height: 'clamp(56px, 12vw, 68px)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  logo: {
    fontFamily: 'Syne, sans-serif',
    fontSize: 'clamp(18px, 5vw, 26px)', fontWeight: 800,
    color: '#f0ece6', textDecoration: 'none',
    letterSpacing: '-0.5px', whiteSpace: 'nowrap',
  },
  logoAccent: { color: '#e8c547' },
  links: { display: 'none', gap: 4, alignItems: 'center' },
  link: {
    fontFamily: 'Syne, sans-serif',
    color: 'rgba(240,236,230,0.6)',
    textDecoration: 'none',
    padding: '6px 12px',
    borderRadius: 8,
    fontSize: 'clamp(12px, 2vw, 14px)', fontWeight: 600,
    transition: 'all 0.2s',
  },
  linkActive: { color: '#f0ece6', background: 'rgba(255,255,255,0.08)' },
  right: { display: 'flex', alignItems: 'center', gap: 'clamp(6px, 2vw, 12px)' },
  cartBtn: {
    position: 'relative',
    color: '#f0ece6',
    display: 'flex', alignItems: 'center',
    padding: '6px 8px',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.05)',
    transition: 'background 0.2s', fontSize: 'clamp(16px, 3vw, 20px)',
  },
  badge: {
    position: 'absolute', top: -4, right: -4,
    background: '#e8c547', color: '#0a0a0f',
    borderRadius: '50%', width: 18, height: 18,
    fontSize: 10, fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  userWrap: { position: 'relative' },
  userBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10, padding: '6px 10px',
    color: '#f0ece6', cursor: 'pointer',
    fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(12px, 2vw, 14px)',
    transition: 'all 0.2s',
  },
  avatar: {
    width: 'clamp(24px, 5vw, 28px)', height: 'clamp(24px, 5vw, 28px)',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #e8c547, #f0a500)',
    color: '#0a0a0f',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: 'clamp(10px, 2vw, 13px)',
    fontFamily: 'Syne, sans-serif', flexShrink: 0,
  },
  userName: { fontSize: 'clamp(12px, 2vw, 14px)', fontWeight: 500 },
  dropdown: {
    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
    background: '#13131a',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, padding: '8px',
    minWidth: 160,
    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
    zIndex: 100,
  },
  dropItem: {
    display: 'block', width: '100%',
    padding: '10px 12px',
    color: 'rgba(240,236,230,0.8)',
    textDecoration: 'none',
    borderRadius: 8,
    fontSize: 'clamp(12px, 2vw, 14px)', fontWeight: 500,
    transition: 'all 0.15s',
    background: 'none', border: 'none',
    cursor: 'pointer', textAlign: 'left',
    fontFamily: 'DM Sans, sans-serif',
  },
  dropLogout: { color: '#ff6b6b' },
  dropDivider: {
    height: 1, background: 'rgba(255,255,255,0.06)',
    margin: '4px 0',
  },
  authLinks: { display: 'none', gap: 6, alignItems: 'center' },
  loginBtn: {
    padding: '6px 12px', borderRadius: 8,
    color: 'rgba(240,236,230,0.7)',
    textDecoration: 'none',
    fontSize: 'clamp(12px, 2vw, 14px)', fontWeight: 500,
    fontFamily: 'Syne, sans-serif',
    transition: 'color 0.2s',
  },
  signupBtn: {
    padding: '6px 14px', borderRadius: 8,
    background: '#e8c547', color: '#0a0a0f',
    textDecoration: 'none',
    fontSize: 'clamp(12px, 2vw, 14px)', fontWeight: 700,
    fontFamily: 'Syne, sans-serif',
    transition: 'all 0.2s',
  },
  hamburger: {
    display: 'flex', flexDirection: 'column', gap: 5,
    background: 'none', border: 'none', cursor: 'pointer',
    padding: 6, '@media (min-width: 769px)': { display: 'none' },
  },
  bar: {
    display: 'block', width: 'clamp(18px, 4vw, 22px)', height: 2,
    background: '#f0ece6', borderRadius: 2,
    transition: 'all 0.3s',
  },
  bar1Open: { transform: 'translateY(7px) rotate(45deg)' },
  bar2Open: { opacity: 0 },
  bar3Open: { transform: 'translateY(-7px) rotate(-45deg)' },
  mobileMenu: {
    borderTop: '1px solid rgba(255,255,255,0.06)',
    padding: 'clamp(12px, 3vw, 16px) clamp(12px, 3vw, 24px)',
    display: 'flex', flexDirection: 'column', gap: 4,
  },

  mobileLink: {
    color: 'rgba(240,236,230,0.8)', textDecoration: 'none',
    padding: '12px 0', fontSize: 16,
    fontFamily: 'Syne, sans-serif', fontWeight: 600,
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
};

export default Navbar;
