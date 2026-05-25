import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../utils/api';
import toast from 'react-hot-toast';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const res = await signup({ name: form.name, email: form.email, password: form.password, role: form.role });
      const user = res.data?.data || res.data?.user;
      if (!user) throw new Error('Invalid signup response');
      toast.success(`Account created! Please login to continue`);
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}><span style={{ color: '#e8c547' }}>Shop</span>Karo</div>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.sub}>Join thousands of happy shoppers</p>

        <div style={styles.roleSelector}>
          {['user', 'admin'].map(role => (
            <button
              type="button"
              key={role}
              style={{
                ...styles.roleBtn,
                background: form.role === role ? '#e8c547' : 'rgba(255,255,255,0.05)',
                color: form.role === role ? '#0a0a0f' : '#f0ece6',
              }}
              onClick={() => setForm(prev => ({ ...prev, role }))}
            >
              {role === 'admin' ? 'Admin Account' : 'User Account'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {[
            { key: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
            { key: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
            { key: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 characters' },
            { key: 'confirmPassword', label: 'Confirm Password', type: 'password', placeholder: 'Repeat password' },
          ].map(f => (
            <div key={f.key} style={styles.field}>
              <label style={styles.label}>{f.label}</label>
              <input
                style={styles.input} type={f.type} required
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
              />
            </div>
          ))}
          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.switch}>
          Already have an account? <Link to="/login" style={styles.switchLink}>Sign In</Link>
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
    width: '100%', maxWidth: 420,
    background: '#13131a', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20, padding: '44px 40px',
  },
  logo: { fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, color: '#f0ece6', marginBottom: 24, textAlign: 'center' },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: '#f0ece6', marginBottom: 8, textAlign: 'center' },
  sub: { color: 'rgba(240,236,230,0.45)', fontSize: 14, textAlign: 'center', marginBottom: 32 },
  roleSelector: { display: 'flex', gap: 12, marginBottom: 24 },
  roleBtn: {
    flex: 1, padding: '12px',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 10, fontFamily: 'Syne, sans-serif', fontSize: 14,
    fontWeight: 700, cursor: 'pointer',
  },
  form: { display: 'flex', flexDirection: 'column', gap: 18 },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 13, fontWeight: 600, color: 'rgba(240,236,230,0.6)', fontFamily: 'Syne, sans-serif' },
  input: {
    padding: '13px 16px',
    background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, color: '#f0ece6',
    fontFamily: 'DM Sans, sans-serif', fontSize: 15, outline: 'none',
  },
  btn: {
    padding: '14px', marginTop: 8,
    background: '#e8c547', color: '#0a0a0f',
    border: 'none', borderRadius: 12,
    fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700,
    cursor: 'pointer',
  },
  switch: { textAlign: 'center', marginTop: 24, color: 'rgba(240,236,230,0.4)', fontSize: 14 },
  switchLink: { color: '#e8c547', textDecoration: 'none', fontWeight: 600 },
};

export default Signup;
