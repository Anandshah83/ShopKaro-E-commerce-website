import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getCategories } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const accountLinks = isAuthenticated
    ? [['/my-orders', 'My Orders']]
    : [['/login', 'Login'], ['/signup', 'Sign Up'], ['/my-orders', 'My Orders']];

  useEffect(() => {
    Promise.all([getProducts({ limit: 8 }), getCategories()])
      .then(([pr, cat]) => {
        const p = pr?.data;
        const productsArr = Array.isArray(p?.products)
          ? p.products
          : Array.isArray(p?.data)
            ? p.data
            : Array.isArray(p)
              ? p
              : [];

        const c = cat?.data;
        const categoriesArr = Array.isArray(c?.categories)
          ? c.categories
          : Array.isArray(c?.data)
            ? c.data
            : Array.isArray(c)
              ? c
              : [];

        setProducts(productsArr);
        setCategories(categoriesArr);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroBg} />
        <div style={styles.heroContent}>
          <div style={styles.heroTag}>New Collection 2026</div>
          <h1 style={styles.heroTitle}>
            Discover<br />
            <span style={styles.heroAccent}>Premium</span><br />
            Products
          </h1>
          <p style={styles.heroSub}>
            Curated selection of top-quality products. Fast delivery, secure payments, and hassle-free returns.
          </p>
          <div style={styles.heroBtns}>
            <Link to="/products" style={styles.heroBtn}>Shop Now →</Link>
            <Link to="/categories" style={styles.heroBtn2}>Browse Categories</Link>
          </div>
        </div>
        <div style={styles.heroStats}>
          {[['10K+', 'Products'], ['50K+', 'Customers'], ['4.9★', 'Rating']].map(([n, l]) => (
            <div key={l} style={styles.stat}>
              <span style={styles.statNum}>{n}</span>
              <span style={styles.statLabel}>{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section style={styles.section}>
          <div style={styles.container}>
            <div style={styles.sectionHead}>
              <h2 style={styles.sectionTitle}>Shop by Category</h2>
              <Link to="/categories" style={styles.seeAll}>See All →</Link>
            </div>
            <div style={styles.catGrid}>
              {categories.slice(0, 6).map(cat => (
                <Link key={cat._id} to={`/products?category=${cat._id}`} style={styles.catCard}>
                  <div style={styles.catIcon}>
                    {cat.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <span style={styles.catName}>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products */}
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.sectionHead}>
            <h2 style={styles.sectionTitle}>Featured Products</h2>
            <Link to="/products" style={styles.seeAll}>View All →</Link>
          </div>
          {loading ? <Loader /> : (
            <div style={styles.productGrid}>
              {products.slice(0, 8).map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={styles.cta}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to shop?</h2>
          <p style={styles.ctaSub}>Join thousands of happy customers today</p>
          <Link to={isAuthenticated ? '/products' : '/signup'} style={styles.ctaBtn}>
            {isAuthenticated ? 'Start Shopping' : 'Get Started Free'}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.container}>
          <div style={styles.footerGrid}>
            <div>
              <div style={styles.footerLogo}><span style={{ color: '#e8c547' }}>Shop</span>Karo</div>
              <p style={styles.footerDesc}>Your one-stop premium shopping destination.</p>
            </div>
            <div>
              <h4 style={styles.footerHead}>Quick Links</h4>
              {[['/', 'Home'], ['/products', 'Products'], ['/categories', 'Categories']].map(([to, l]) => (
                <Link key={to} to={to} style={styles.footerLink}>{l}</Link>
              ))}
            </div>
            <div>
              <h4 style={styles.footerHead}>Account</h4>
              {accountLinks.map(([to, l]) => (
                <Link key={to} to={to} style={styles.footerLink}>{l}</Link>
              ))}
            </div>
            <div>
              <h4 style={styles.footerHead}>Powered By</h4>
              <p style={styles.footerDesc}>Node.js + Express<br />MongoDB + Mongoose<br />JWT + Razorpay</p>
            </div>
          </div>
          <div style={styles.footerBottom}>
            © 2026 ShopKaro. Built by <a href="https://github.com/Anandshah83" style={{ color: '#e8c547' }}>Anand Shah</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  hero: {
    position: 'relative', minHeight: 'clamp(70vh, 90vh, 100vh)',
    display: 'flex', flexDirection: 'column',
    justifyContent: 'center',
    padding: 'clamp(40px, 10vw, 80px) clamp(12px, 4vw, 24px) clamp(40px, 8vw, 60px)',
    overflow: 'hidden',
  },
  heroBg: {
    position: 'absolute', inset: 0,
    background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(232,197,71,0.15) 0%, transparent 70%), radial-gradient(ellipse 60% 60% at 80% 100%, rgba(100,80,200,0.1) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  heroContent: { maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 },
  heroTag: {
    display: 'inline-block',
    background: 'rgba(232,197,71,0.12)',
    border: '1px solid rgba(232,197,71,0.3)',
    color: '#e8c547',
    padding: '6px 18px', borderRadius: 20,
    fontSize: 13, fontWeight: 700,
    fontFamily: 'Syne, sans-serif', letterSpacing: 1,
    marginBottom: 24,
  },
  heroTitle: {
    fontFamily: 'Syne, sans-serif',
    fontSize: 'clamp(32px, 6vw, 96px)',
    fontWeight: 800, lineHeight: 1.1,
    color: '#f0ece6', marginBottom: 'clamp(16px, 4vw, 24px)',
    letterSpacing: '-2px',
  },
  heroAccent: {
    background: 'linear-gradient(135deg, #e8c547 0%, #f0a500 100%)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  heroSub: {
    fontSize: 'clamp(14px, 3vw, 18px)', color: 'rgba(240,236,230,0.55)',
    lineHeight: 1.7, maxWidth: 480, margin: '0 auto 24px',
  },
  heroBtns: { display: 'flex', gap: 'clamp(8px, 2vw, 12px)', justifyContent: 'center', flexWrap: 'wrap' },
  heroBtn: {
    background: '#e8c547', color: '#0a0a0f',
    textDecoration: 'none', padding: 'clamp(10px, 2vw, 14px) clamp(20px, 4vw, 32px)',
    borderRadius: 'clamp(8px, 2vw, 12px)', fontFamily: 'Syne, sans-serif',
    fontSize: 'clamp(13px, 2.5vw, 16px)', fontWeight: 700,
    transition: 'all 0.2s',
  },
  heroBtn2: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#f0ece6',
    textDecoration: 'none', padding: 'clamp(10px, 2vw, 14px) clamp(20px, 4vw, 32px)',
    borderRadius: 'clamp(8px, 2vw, 12px)', fontFamily: 'Syne, sans-serif',
    fontSize: 'clamp(13px, 2.5vw, 16px)', fontWeight: 600,
  },
  heroStats: {
    display: 'flex', justifyContent: 'center', gap: 'clamp(24px, 8vw, 60px)',
    marginTop: 'clamp(40px, 8vw, 60px)', position: 'relative', zIndex: 1,
    flexWrap: 'wrap',
  },
  stat: { textAlign: 'center' },
  statNum: {
    display: 'block',
    fontFamily: 'Syne, sans-serif',
    fontSize: 'clamp(20px, 5vw, 32px)', fontWeight: 800, color: '#e8c547',
  },
  statLabel: { fontSize: 'clamp(11px, 2vw, 13px)', color: 'rgba(240,236,230,0.45)' },
  section: { padding: 'clamp(40px, 10vw, 80px) clamp(12px, 4vw, 24px)' },
  container: { maxWidth: 1280, margin: '0 auto' },
  sectionHead: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
    marginBottom: 'clamp(24px, 5vw, 40px)',
    gap: 'clamp(12px, 3vw, 16px)',
    flexWrap: 'wrap',
  },
  sectionTitle: {
    fontFamily: 'Syne, sans-serif',
    fontSize: 'clamp(22px, 5vw, 40px)',
    fontWeight: 800, color: '#f0ece6',
  },
  seeAll: {
    color: '#e8c547', textDecoration: 'none',
    fontFamily: 'Syne, sans-serif', fontWeight: 700,
    fontSize: 14,
  },
  catGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(100px, 20vw, 140px), 1fr))',
    gap: 'clamp(12px, 3vw, 16px)',
  },
  catCard: {
    background: '#13131a',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 'clamp(12px, 2vw, 16px)',
    padding: 'clamp(16px, 4vw, 28px) clamp(12px, 3vw, 16px)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 'clamp(8px, 2vw, 12px)',
    textDecoration: 'none', color: '#f0ece6',
    transition: 'all 0.2s',
  },
  catIcon: {
    width: 'clamp(40px, 10vw, 56px)', height: 'clamp(40px, 10vw, 56px)', borderRadius: '50%',
    background: 'rgba(232,197,71,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Syne, sans-serif', fontSize: 'clamp(16px, 4vw, 22px)', fontWeight: 800,
    color: '#e8c547',
  },
  catName: {
    fontFamily: 'Syne, sans-serif', fontWeight: 700,
    fontSize: 'clamp(11px, 2vw, 13px)', textAlign: 'center',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(140px, 40vw, 260px), 1fr))',
    gap: 'clamp(12px, 3vw, 24px)',
  },
  cta: {
    background: 'linear-gradient(135deg, rgba(232,197,71,0.12) 0%, rgba(100,80,200,0.08) 100%)',
    borderTop: '1px solid rgba(232,197,71,0.15)',
    borderBottom: '1px solid rgba(232,197,71,0.15)',
    padding: 'clamp(40px, 10vw, 80px) clamp(12px, 4vw, 24px)', textAlign: 'center',
  },
  ctaContent: { maxWidth: 500, margin: '0 auto', padding: '0 clamp(12px, 3vw, 20px)' },
  ctaTitle: {
    fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px, 6vw, 42px)',
    fontWeight: 800, color: '#f0ece6', marginBottom: 'clamp(8px, 2vw, 12px)',
  },
  ctaSub: { color: 'rgba(240,236,230,0.55)', fontSize: 'clamp(14px, 3vw, 16px)', marginBottom: 'clamp(20px, 5vw, 32px)' },
  ctaBtn: {
    display: 'inline-block',
    background: '#e8c547', color: '#0a0a0f',
    textDecoration: 'none', padding: 'clamp(10px, 2vw, 14px) clamp(24px, 5vw, 36px)',
    borderRadius: 'clamp(8px, 2vw, 12px)', fontFamily: 'Syne, sans-serif',
    fontSize: 'clamp(13px, 2.5vw, 16px)', fontWeight: 700,
  },
  footer: {
    background: '#0d0d12',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    padding: 'clamp(40px, 8vw, 60px) clamp(12px, 4vw, 24px) clamp(20px, 5vw, 30px)',
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(120px, 30vw, 180px), 1fr))',
    gap: 'clamp(24px, 5vw, 40px)', marginBottom: 'clamp(24px, 5vw, 40px)',
  },
  footerLogo: {
    fontFamily: 'Syne, sans-serif',
    fontSize: 22, fontWeight: 800,
    color: '#f0ece6', marginBottom: 12,
  },
  footerDesc: { color: 'rgba(240,236,230,0.4)', fontSize: 13, lineHeight: 1.8 },
  footerHead: {
    fontFamily: 'Syne, sans-serif', fontWeight: 700,
    fontSize: 13, color: '#f0ece6',
    marginBottom: 16, letterSpacing: 1,
    textTransform: 'uppercase',
  },
  footerLink: {
    display: 'block',
    color: 'rgba(240,236,230,0.45)',
    textDecoration: 'none', fontSize: 13,
    marginBottom: 10,
    transition: 'color 0.2s',
  },
  footerBottom: {
    borderTop: '1px solid rgba(255,255,255,0.06)',
    paddingTop: 24,
    color: 'rgba(240,236,230,0.3)',
    fontSize: 13, textAlign: 'center',
  },
};

export default Home;
