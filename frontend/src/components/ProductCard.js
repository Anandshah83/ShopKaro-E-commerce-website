import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../utils/api';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const stock = product.stock ?? product.quantity ?? (product.inStock ? 1 : 0);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      style: { background: '#13131a', color: '#f0ece6', border: '1px solid rgba(255,255,255,0.1)' },
      iconTheme: { primary: '#e8c547', secondary: '#0a0a0f' },
    });
  };

  const placeholderImg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%231a1a25" width="400" height="300"/%3E%3Ctext x="50%" y="50%" font-size="16" fill="%23e8c547" text-anchor="middle" dy=".3em" font-family="Arial"%3ENo Image%3C/text%3E%3C/svg%3E';
  
  const imgUrl = product.image
    ? getImageUrl(product.image)
    : placeholderImg;

  return (
    <Link to={`/products/${product._id}`} style={styles.card}>
      <div style={styles.imgWrap}>
        <img src={imgUrl} alt={product.name} style={styles.img} onError={(e) => {
          if (e.target.src !== placeholderImg) e.target.src = placeholderImg;
        }} />
        <div style={styles.imgOverlay} />
        {stock === 0 && <div style={styles.outOfStock}>Out of Stock</div>}
      </div>
      <div style={styles.body}>
        <div style={styles.category}>{product.category?.name || 'Uncategorized'}</div>
        <h3 style={styles.name}>{product.name}</h3>
        <p style={styles.desc}>{product.description?.slice(0, 70)}...</p>
        <div style={styles.footer}>
          <span style={styles.price}>₹{product.price?.toLocaleString('en-IN')}</span>
          <button
            style={{ ...styles.addBtn, ...(stock === 0 ? styles.disabledBtn : {}) }}
            onClick={handleAdd}
            disabled={stock === 0}
          >
            {stock === 0 ? 'Sold Out' : '+ Add'}
          </button>
        </div>
        {product.ratings > 0 && (
          <div style={styles.rating}>
            {'★'.repeat(Math.round(product.ratings))}{'☆'.repeat(5 - Math.round(product.ratings))}
            <span style={styles.ratingNum}>({product.numReviews || 0})</span>
          </div>
        )}
      </div>
    </Link>
  );
};

const styles = {
  card: {
    background: '#13131a',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16,
    overflow: 'hidden',
    textDecoration: 'none',
    color: '#f0ece6',
    display: 'flex', flexDirection: 'column',
    transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
    cursor: 'pointer',
  },
  imgWrap: { position: 'relative', aspectRatio: '4/3', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' },
  imgOverlay: {
    position: 'absolute', inset: 0,
    background: 'linear-gradient(to top, rgba(10,10,15,0.7) 0%, transparent 50%)',
  },
  outOfStock: {
    position: 'absolute', top: 12, right: 12,
    background: '#ff6b6b', color: '#fff',
    padding: '4px 10px', borderRadius: 20,
    fontSize: 11, fontWeight: 700, fontFamily: 'Syne, sans-serif',
  },
  body: { padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 },
  category: {
    fontSize: 11, fontWeight: 700, letterSpacing: 1.5,
    color: '#e8c547', textTransform: 'uppercase',
    fontFamily: 'Syne, sans-serif',
  },
  name: {
    fontFamily: 'Syne, sans-serif',
    fontSize: 18, fontWeight: 700,
    lineHeight: 1.3, color: '#f0ece6',
  },
  desc: {
    fontSize: 13, color: 'rgba(240,236,230,0.5)',
    lineHeight: 1.6, flex: 1,
  },
  footer: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginTop: 8,
  },
  price: {
    fontFamily: 'Syne, sans-serif',
    fontSize: 22, fontWeight: 800,
    color: '#e8c547',
  },
  addBtn: {
    background: '#e8c547', color: '#0a0a0f',
    border: 'none', borderRadius: 8,
    padding: '8px 16px',
    fontFamily: 'Syne, sans-serif',
    fontSize: 13, fontWeight: 700,
    cursor: 'pointer', transition: 'all 0.2s',
  },
  disabledBtn: {
    background: 'rgba(255,255,255,0.1)', color: 'rgba(240,236,230,0.4)',
    cursor: 'not-allowed',
  },
  rating: {
    fontSize: 13, color: '#e8c547',
    display: 'flex', gap: 4, alignItems: 'center',
  },
  ratingNum: { color: 'rgba(240,236,230,0.5)', fontSize: 12 },
};

export default ProductCard;
