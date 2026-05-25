import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateUser } from '../utils/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, loginUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateUser(user._id, form);
      loginUser(res.data.user || { ...user, ...form }, localStorage.getItem('token'));
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally { setSaving(false); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.avatarLg}>{user?.name?.[0]?.toUpperCase()}</div>
        <h1 style={styles.title}>My Profile</h1>
        <div style={styles.role}>{user?.role === 'admin' ? '👑 Admin' : '🛍️ Customer'}</div>

        <form onSubmit={handleSave} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input style={styles.input} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <button type="submit" style={styles.btn} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' },
  card: {
    width: '100%', maxWidth: 460,
    background: '#13131a', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 20, padding: '48px 40px', textAlign: 'center',
  },
  avatarLg: {
    width: 80, height: 80, borderRadius: '50%',
    background: 'linear-gradient(135deg, #e8c547, #f0a500)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 800,
    color: '#0a0a0f', margin: '0 auto 20px',
  },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: '#f0ece6', marginBottom: 8 },
  role: { color: '#e8c547', fontSize: 14, fontWeight: 600, marginBottom: 32 },
  form: { display: 'flex', flexDirection: 'column', gap: 18, textAlign: 'left' },
  field: { display: 'flex', flexDirection: 'column', gap: 8 },
  label: { fontSize: 13, fontWeight: 600, color: 'rgba(240,236,230,0.6)', fontFamily: 'Syne, sans-serif' },
  input: {
    padding: '13px 16px',
    background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, color: '#f0ece6',
    fontFamily: 'DM Sans, sans-serif', fontSize: 15, outline: 'none',
  },
  btn: {
    padding: '13px', marginTop: 8,
    background: '#e8c547', color: '#0a0a0f',
    border: 'none', borderRadius: 12,
    fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, cursor: 'pointer',
  },
};

export default Profile;
