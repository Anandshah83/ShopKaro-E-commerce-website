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
  page: { padding: '60px 24px', minHeight: '80vh' },
  container: { maxWidth: 1280, margin: '0 auto' },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, color: '#f0ece6', marginBottom: 12 },
  sub: { color: 'rgba(240,236,230,0.45)', fontSize: 16, marginBottom: 48 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: 20,
  },
  card: {
    background: '#13131a',
    border: '1px solid',
    borderRadius: 18,
    padding: '32px 24px',
    textDecoration: 'none', color: '#f0ece6',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    textAlign: 'center', gap: 12,
    transition: 'all 0.2s',
    position: 'relative',
  },
  iconWrap: {
    width: 72, height: 72, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  icon: { fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800 },
  name: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18 },
  desc: { color: 'rgba(240,236,230,0.45)', fontSize: 13, lineHeight: 1.6 },
  arrow: { fontSize: 22, fontWeight: 700, marginTop: 8 },
};

export default Categories;
