import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [loginAs, setLoginAs] = useState('user'); // 'user' or 'admin'
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      const token = res.data?.token_no || res.data?.token;
      if (!token) throw new Error('No token received');
      
      const user = res.data?.user;
      if (!user) throw new Error('User data not received');
      if (loginAs === 'admin' && user.role !== 'admin') {
        throw new Error('This account is not an admin account');
      }
      if (loginAs === 'user' && user.role === 'admin') {
        throw new Error('Please use Login as Admin for this account');
      }
      
      loginUser(user, token);
      toast.success(`Welcome back as ${loginAs}!`, {
        style: { background: '#13131a', color: '#f0ece6', border: '1px solid rgba(255,255,255,0.1)' },
      });
      
      // Redirect based on role
      navigate(loginAs === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}><span style={{ color: '#e8c547' }}>Shop</span>Karo</div>
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.sub}>Sign in to continue</p>

        {/* Role Selection */}
        <div style={styles.roleSelector}>
          <button
            style={{
              ...styles.roleBtn,
              background: loginAs === 'user' ? '#e8c547' : 'rgba(255,255,255,0.05)',
              color: loginAs === 'user' ? '#0a0a0f' : '#f0ece6',
            }}
            onClick={() => setLoginAs('user')}
          >
            👤 User
          </button>
          <button
            style={{
              ...styles.roleBtn,
              background: loginAs === 'admin' ? '#e8c547' : 'rgba(255,255,255,0.05)',
              color: loginAs === 'admin' ? '#0a0a0f' : '#f0ece6',
            }}
            onClick={() => setLoginAs('admin')}
          >
            🔐 Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input
              style={styles.input} type="email" required
              placeholder="you@example.com"
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input} type="password" required
              placeholder="Enter your password"
              value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            />
          </div>
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Signing in...' : `Sign In as ${loginAs === 'admin' ? 'Admin' : 'User'}`}
          </button>
        </form>

        <p style={styles.switch}>
          Don't have an account? <Link to="/signup" style={styles.switchLink}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    padding: '40px 24px',
    background: 'radial-gradient(ellipse at 50% 0%, rgba(232,197,71,0.08) 0%, transparent 60%)',
  },
  card: {
    width: '95%', maxWidth: 420,
    background: '#13131a', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20, padding: 'clamp(24px, 5vw, 44px) clamp(20px, 5vw, 40px)',
  },
  logo: {
    fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800,
    color: '#f0ece6', marginBottom: 24, textAlign: 'center',
  },
  title: {
    fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800,
    color: '#f0ece6', marginBottom: 8, textAlign: 'center',
  },
  sub: { color: 'rgba(240,236,230,0.45)', fontSize: 14, textAlign: 'center', marginBottom: 32 },
  roleSelector: {
    display: 'flex', gap: 12, marginBottom: 24,
  },
  roleBtn: {
    flex: 1, padding: '12px',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 10, fontFamily: 'Syne, sans-serif', fontSize: 14,
    fontWeight: 700, cursor: 'pointer',
    transition: 'all 0.2s',
  },
  form: { display: 'flex', flexDirection: 'column', gap: 20 },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 13, fontWeight: 600, color: 'rgba(240,236,230,0.6)', fontFamily: 'Syne, sans-serif' },
  input: {
    padding: '13px 16px',
    background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, color: '#f0ece6',
    fontFamily: 'DM Sans, sans-serif', fontSize: 15, outline: 'none',
    transition: 'border-color 0.2s',
  },
  btn: {
    padding: '14px', marginTop: 8,
    background: '#e8c547', color: '#0a0a0f',
    border: 'none', borderRadius: 12,
    fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700,
    cursor: 'pointer', transition: 'all 0.2s',
  },
  switch: { textAlign: 'center', marginTop: 24, color: 'rgba(240,236,230,0.4)', fontSize: 14 },
  switchLink: { color: '#e8c547', textDecoration: 'none', fontWeight: 600 },
};

export default Login;
