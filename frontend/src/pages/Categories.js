import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../utils/api';
import Loader from '../components/Loader';

const palette = ['#e8c547','#4ade80','#60a5fa','#f87171','#c084fc','#fb923c','#34d399','#a78bfa'];

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(r => {
        const cats = r.data?.data || r.data?.categories || [];
        setCategories(Array.isArray(cats) ? cats : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Browse Categories</h1>
        <p style={styles.sub}>Explore products by category</p>
        {loading ? <Loader /> : (
          <div style={styles.grid}>
            {categories.map((cat, i) => (
              <Link key={cat._id} to={`/products?category=${cat._id}`} style={{ ...styles.card, borderColor: palette[i % palette.length] + '30' }}>
                <div style={{ ...styles.iconWrap, background: palette[i % palette.length] + '15' }}>
                  <span style={{ ...styles.icon, color: palette[i % palette.length] }}>
                    {cat.name?.[0]?.toUpperCase()}
                  </span>
                </div>
                <h3 style={styles.name}>{cat.name}</h3>
                {cat.description && <p style={styles.desc}>{cat.description}</p>}
                <div style={{ ...styles.arrow, color: palette[i % palette.length] }}>→</div>
              </Link>
            ))}
          </div>
        )}
        {categories.length === 0 && !loading && (
          <p style={{ textAlign: 'center', color: 'rgba(240,236,230,0.4)', padding: '60px 0' }}>No categories found.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { padding: 'clamp(24px, 6vw, 60px) 12px', minHeight: '80vh' },
  container: { maxWidth: 1280, margin: '0 auto' },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px, 6vw, 52px)', fontWeight: 800, color: '#f0ece6', marginBottom: 'clamp(8px, 2vw, 12px)' },
  sub: { color: 'rgba(240,236,230,0.45)', fontSize: 'clamp(13px, 2vw, 16px)', marginBottom: 'clamp(24px, 6vw, 48px)' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(140px, 30vw, 220px), 1fr))',
    gap: 'clamp(12px, 3vw, 20px)',
  },
  card: {
    background: '#13131a',
    border: '1px solid',
    borderRadius: 'clamp(14px, 3vw, 18px)',
    padding: 'clamp(16px, 4vw, 32px) clamp(12px, 3vw, 24px)',
    textDecoration: 'none', color: '#f0ece6',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    textAlign: 'center', gap: 'clamp(8px, 2vw, 12px)',
    transition: 'all 0.2s',
    position: 'relative',
  },
  iconWrap: {
    width: 'clamp(48px, 15vw, 72px)', height: 'clamp(48px, 15vw, 72px)', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  icon: { fontFamily: 'Syne, sans-serif', fontSize: 'clamp(18px, 4vw, 28px)', fontWeight: 800 },
  name: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 'clamp(14px, 3vw, 18px)' },
  desc: { color: 'rgba(240,236,230,0.45)', fontSize: 'clamp(11px, 2vw, 13px)', lineHeight: 1.6 },
  arrow: { fontSize: 'clamp(16px, 3vw, 22px)', fontWeight: 700, marginTop: 'clamp(4px, 1vw, 8px)' },
};

export default Categories;
