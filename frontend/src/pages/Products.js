import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../utils/api';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState('');
  const [error, setError] = useState('');
  const limit = 12;

  useEffect(() => { 
    getCategories().then(r => {
      const cats = r.data?.data || r.data?.categories || [];
      setCategories(Array.isArray(cats) ? cats : []);
    }).catch(() => setCategories([]));
  }, []);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    setError('');
    const params = { page, limit };
    if (search) params.search = search;
    if (selectedCat) params.category = selectedCat;
    if (sort) params.sort = sort;
    getProducts(params)
      .then(r => {
        const prods = r.data?.data || r.data?.products || [];
        const tot = r.data?.totalProducts || r.data?.total || 0;
        setProducts(Array.isArray(prods) ? prods : []);
        setTotal(tot);
      })
      .catch(err => {
        const message = err.response?.status === 429
          ? 'Server is busy because too many requests were sent. Please refresh after a few seconds.'
          : err.response?.data?.message || 'Could not load products. Please try again.';
        setError(message);
      })
      .finally(() => setLoading(false));
  }, [page, search, selectedCat, sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>All Products</h1>

        {/* Filters */}
        <div style={styles.filters}>
          <div style={styles.searchWrap}>
            <svg style={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              style={styles.searchInput}
              type="text" placeholder="Search products..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select style={styles.select} value={selectedCat} onChange={e => { setSelectedCat(e.target.value); setPage(1); }}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
          <select style={styles.select} value={sort} onChange={e => setSort(e.target.value)}>
            <option value="">Sort By</option>
            <option value="price">Price: Low to High</option>
            <option value="-price">Price: High to Low</option>
            <option value="-createdAt">Newest First</option>
            <option value="-ratings">Top Rated</option>
          </select>
        </div>

        {/* Results count */}
        <p style={styles.count}>{total > 0 ? `${total} products found` : ''}</p>

        {/* Grid */}
        {error && <div style={styles.error}>{error}</div>}

        {loading ? <Loader /> : !error && products.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyText}>No products found. Try adjusting your filters.</p>
          </div>
        ) : !error && (
          <div style={styles.grid}>
            {products.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button style={styles.pgBtn} disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} style={{ ...styles.pgBtn, ...(n === page ? styles.pgActive : {}) }} onClick={() => setPage(n)}>{n}</button>
            ))}
            <button style={styles.pgBtn} disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { padding: 'clamp(24px, 6vw, 60px) 12px', minHeight: '80vh' },
  container: { maxWidth: 1280, margin: '0 auto' },
  title: {
    fontFamily: 'Syne, sans-serif', fontSize: 'clamp(28px, 6vw, 52px)',
    fontWeight: 800, color: '#f0ece6', marginBottom: 'clamp(16px, 4vw, 36px)',
  },
  filters: {
    display: 'flex', gap: 'clamp(8px, 2vw, 12px)', flexWrap: 'wrap',
    marginBottom: 'clamp(12px, 3vw, 24px)',
  },
  searchWrap: {
    flex: 1, minWidth: 'clamp(150px, 50vw, 240px)', position: 'relative',
    display: 'flex', alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute', left: 'clamp(8px, 2vw, 14px)',
    color: 'rgba(240,236,230,0.4)', pointerEvents: 'none', fontSize: 'clamp(14px, 2vw, 16px)',
  },
  searchInput: {
    width: '100%', padding: 'clamp(8px, 2vw, 12px) clamp(8px, 2vw, 14px) clamp(8px, 2vw, 12px) clamp(34px, 8vw, 44px)',
    background: '#13131a', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, color: '#f0ece6',
    fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(13px, 2vw, 15px)',
    outline: 'none',
  },
  select: {
    padding: 'clamp(8px, 2vw, 12px) clamp(10px, 2vw, 16px)',
    background: '#13131a', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, color: '#f0ece6',
    fontFamily: 'DM Sans, sans-serif', fontSize: 'clamp(13px, 2vw, 15px)',
    outline: 'none', cursor: 'pointer',
  },
  count: { color: 'rgba(240,236,230,0.4)', fontSize: 'clamp(11px, 2vw, 13px)', marginBottom: 'clamp(12px, 3vw, 20px)' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(140px, 30vw, 260px), 1fr))',
    gap: 'clamp(12px, 3vw, 24px)',
  },
  empty: { textAlign: 'center', padding: 'clamp(40px, 10vw, 80px) 12px' },
  emptyText: { color: 'rgba(240,236,230,0.4)', fontSize: 'clamp(13px, 2vw, 16px)' },
  error: {
    padding: 'clamp(10px, 2vw, 14px) clamp(12px, 3vw, 16px)',
    borderRadius: 8,
    background: 'rgba(255,107,107,0.1)',
    border: '1px solid rgba(255,107,107,0.25)',
    color: '#ffb4b4',
    marginBottom: 20,
    fontSize: 'clamp(12px, 2vw, 14px)',
  },
  pagination: { display: 'flex', justifyContent: 'center', gap: 'clamp(4px, 1vw, 8px)', marginTop: 'clamp(24px, 6vw, 48px)', flexWrap: 'wrap' },
  pgBtn: {
    padding: 'clamp(7px, 2vw, 10px) clamp(10px, 2vw, 16px)', borderRadius: 8,
    background: '#13131a', border: '1px solid rgba(255,255,255,0.1)',
    color: '#f0ece6', cursor: 'pointer',
    fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 'clamp(12px, 2vw, 14px)',
    transition: 'all 0.2s',
  },
  pgActive: { background: '#e8c547', color: '#0a0a0f', border: '1px solid #e8c547' },
};

export default Products;
