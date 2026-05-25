import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct, getReviews, createReview, deleteReview, getImageUrl } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([getProduct(id), getReviews(id)])
      .then(([pr, rv]) => {
        const prod = pr.data?.data || pr.data?.product || pr.data;
        const revs = rv.data?.data || rv.data?.reviews || [];
        setProduct(Array.isArray(prod) ? {} : prod);
        setReviews(Array.isArray(revs) ? revs : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    addToCart(product, qty);
    toast.success(`${qty}x ${product.name} added to cart!`, {
      style: { background: '#13131a', color: '#f0ece6', border: '1px solid rgba(255,255,255,0.1)' },
    });
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please login to review');
    setSubmitting(true);
    try {
      await createReview(id, reviewForm);
      const rv = await getReviews(id);
      const revs = rv.data?.data || rv.data?.reviews || [];
      setReviews(Array.isArray(revs) ? revs : []);
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error submitting review');
    } finally { setSubmitting(false); }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews(r => r.filter(rv => rv._id !== reviewId));
      toast.success('Review deleted');
    } catch { toast.error('Could not delete review'); }
  };

  if (loading) return <Loader />;
  if (!product) return <div style={styles.notFound}>Product not found</div>;

  const stock = product.stock ?? product.quantity ?? (product.inStock ? 1 : 0);
  const imgUrl = product.image
    ? getImageUrl(product.image)
    : `https://via.placeholder.com/600x500/1a1a25/e8c547?text=${encodeURIComponent(product.name)}`;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <Link to="/products" style={styles.back}>← Back to Products</Link>

        <div style={styles.productWrap}>
          {/* Image */}
          <div style={styles.imgSection}>
            <div style={styles.imgBox}>
              <img src={imgUrl} alt={product.name} style={styles.img}
                onError={e => e.target.src = `https://via.placeholder.com/600x500/1a1a25/e8c547?text=${encodeURIComponent(product.name)}`}
              />
            </div>
          </div>

          {/* Info */}
          <div style={styles.info}>
            <div style={styles.category}>{product.category?.name || 'Uncategorized'}</div>
            <h1 style={styles.name}>{product.name}</h1>

            {product.ratings > 0 && (
              <div style={styles.ratingRow}>
                <span style={styles.stars}>{'★'.repeat(Math.round(product.ratings))}{'☆'.repeat(5 - Math.round(product.ratings))}</span>
                <span style={styles.ratingText}>{product.ratings?.toFixed(1)} ({product.numReviews || 0} reviews)</span>
              </div>
            )}

            <div style={styles.price}>₹{product.price?.toLocaleString('en-IN')}</div>

            <p style={styles.desc}>{product.description}</p>

            <div style={styles.stockBadge}>
              {stock > 0
                ? <span style={styles.inStock}>✓ In Stock ({product.stock} available)</span>
                : <span style={styles.outStock}>✗ Out of Stock</span>}
            </div>

            {stock > 0 && (
              <div style={styles.qtyRow}>
                <button style={styles.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span style={styles.qtyNum}>{qty}</span>
                <button style={styles.qtyBtn} onClick={() => setQty(q => Math.min(stock, q + 1))}>+</button>
              </div>
            )}

            <div style={styles.actions}>
              <button style={styles.addBtn} onClick={handleAdd} disabled={stock === 0}>
                {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <Link to="/cart" style={styles.buyBtn}>Buy Now</Link>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div style={styles.reviewsSection}>
          <h2 style={styles.reviewsTitle}>Customer Reviews</h2>

          {isAuthenticated && (
            <form onSubmit={handleReview} style={styles.reviewForm}>
              <h3 style={styles.reviewFormTitle}>Write a Review</h3>
              <div style={styles.ratingSelect}>
                <label style={styles.label}>Rating</label>
                <select style={styles.select} value={reviewForm.rating} onChange={e => setReviewForm(f => ({ ...f, rating: Number(e.target.value) }))}>
                  {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{'★'.repeat(n)} {n} stars</option>)}
                </select>
              </div>
              <div>
                <label style={styles.label}>Comment</label>
                <textarea
                  style={styles.textarea}
                  rows={4} required
                  placeholder="Share your experience..."
                  value={reviewForm.comment}
                  onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                />
              </div>
              <button type="submit" style={styles.submitBtn} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}

          <div style={styles.reviewList}>
            {reviews.length === 0 && <p style={styles.noReviews}>No reviews yet. Be the first!</p>}
            {reviews.map(rv => (
              <div key={rv._id} style={styles.reviewCard}>
                <div style={styles.reviewHead}>
                  <div style={styles.reviewAvatar}>{rv.userId?.name?.[0]?.toUpperCase() || 'U'}</div>
                  <div>
                    <div style={styles.reviewUser}>{rv.userId?.name || 'User'}</div>
                    <div style={styles.reviewStars}>{'★'.repeat(rv.rating)}{'☆'.repeat(5 - rv.rating)}</div>
                  </div>
                  {(user?._id === rv.userId?._id || user?.role === 'admin') && (
                    <button style={styles.delBtn} onClick={() => handleDeleteReview(rv._id)}>✕</button>
                  )}
                </div>
                <p style={styles.reviewComment}>{rv.reviewComment || rv.comment}</p>
                <span style={styles.reviewDate}>{new Date(rv.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '40px 24px', minHeight: '80vh' },
  container: { maxWidth: 1280, margin: '0 auto' },
  notFound: { textAlign: 'center', padding: '80px', color: 'rgba(240,236,230,0.4)', fontSize: 18 },
  back: {
    color: 'rgba(240,236,230,0.5)', textDecoration: 'none',
    fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 14,
    display: 'inline-block', marginBottom: 32,
  },
  productWrap: {
    display: 'grid', gridTemplateColumns: '1fr 1fr',
    gap: 60, marginBottom: 80,
  },
  imgSection: {},
  imgBox: {
    borderRadius: 20, overflow: 'hidden',
    background: '#13131a',
    border: '1px solid rgba(255,255,255,0.07)',
    aspectRatio: '4/3',
  },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  info: { display: 'flex', flexDirection: 'column', gap: 20 },
  category: {
    fontSize: 12, fontWeight: 700, letterSpacing: 2,
    color: '#e8c547', textTransform: 'uppercase',
    fontFamily: 'Syne, sans-serif',
  },
  name: {
    fontFamily: 'Syne, sans-serif', fontWeight: 800,
    fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 1.2,
    color: '#f0ece6',
  },
  ratingRow: { display: 'flex', alignItems: 'center', gap: 10 },
  stars: { color: '#e8c547', fontSize: 18 },
  ratingText: { color: 'rgba(240,236,230,0.5)', fontSize: 14 },
  price: {
    fontFamily: 'Syne, sans-serif', fontSize: 38, fontWeight: 800,
    color: '#e8c547',
  },
  desc: { color: 'rgba(240,236,230,0.6)', fontSize: 16, lineHeight: 1.7 },
  stockBadge: {},
  inStock: { color: '#4ade80', fontSize: 14, fontWeight: 600 },
  outStock: { color: '#ff6b6b', fontSize: 14, fontWeight: 600 },
  qtyRow: { display: 'flex', alignItems: 'center', gap: 16 },
  qtyBtn: {
    width: 40, height: 40, borderRadius: 10,
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#f0ece6', fontSize: 20, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  qtyNum: {
    fontFamily: 'Syne, sans-serif', fontWeight: 700,
    fontSize: 20, minWidth: 32, textAlign: 'center',
  },
  actions: { display: 'flex', gap: 12 },
  addBtn: {
    flex: 1, padding: '14px 24px',
    background: '#e8c547', color: '#0a0a0f',
    border: 'none', borderRadius: 12,
    fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700,
    cursor: 'pointer', transition: 'all 0.2s',
  },
  buyBtn: {
    flex: 1, padding: '14px 24px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#f0ece6', borderRadius: 12,
    fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700,
    textDecoration: 'none', textAlign: 'center',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  reviewsSection: {},
  reviewsTitle: {
    fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800,
    color: '#f0ece6', marginBottom: 32,
  },
  reviewForm: {
    background: '#13131a', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16, padding: 28, marginBottom: 36,
    display: 'flex', flexDirection: 'column', gap: 16,
  },
  reviewFormTitle: {
    fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18,
    color: '#f0ece6',
  },
  label: { display: 'block', marginBottom: 8, fontSize: 13, color: 'rgba(240,236,230,0.55)', fontWeight: 600 },
  ratingSelect: {},
  select: {
    padding: '10px 14px',
    background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, color: '#f0ece6',
    fontFamily: 'DM Sans, sans-serif', fontSize: 14, outline: 'none',
  },
  textarea: {
    width: '100%', padding: '12px 14px',
    background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, color: '#f0ece6',
    fontFamily: 'DM Sans, sans-serif', fontSize: 14,
    outline: 'none', resize: 'vertical',
  },
  submitBtn: {
    padding: '12px 28px',
    background: '#e8c547', color: '#0a0a0f',
    border: 'none', borderRadius: 10,
    fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700,
    cursor: 'pointer', alignSelf: 'flex-start',
  },
  reviewList: { display: 'flex', flexDirection: 'column', gap: 16 },
  noReviews: { color: 'rgba(240,236,230,0.4)', fontSize: 15, textAlign: 'center', padding: '40px 0' },
  reviewCard: {
    background: '#13131a', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 14, padding: '20px 24px',
  },
  reviewHead: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 },
  reviewAvatar: {
    width: 40, height: 40, borderRadius: '50%',
    background: 'rgba(232,197,71,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#e8c547', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 16,
  },
  reviewUser: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#f0ece6' },
  reviewStars: { color: '#e8c547', fontSize: 14, marginTop: 2 },
  delBtn: {
    marginLeft: 'auto',
    background: 'none', border: 'none',
    color: 'rgba(255,107,107,0.6)', cursor: 'pointer', fontSize: 16,
  },
  reviewComment: { color: 'rgba(240,236,230,0.65)', fontSize: 14, lineHeight: 1.7, marginBottom: 8 },
  reviewDate: { color: 'rgba(240,236,230,0.3)', fontSize: 12 },
};

export default ProductDetail;
