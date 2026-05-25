import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder, createPaymentOrder, verifyPayment, getImageUrl } from '../utils/api';
import toast from 'react-hot-toast';

const loadRazorpayScript = () => {
  if (window.Razorpay) return Promise.resolve(true);

  const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
  if (existingScript) {
    return new Promise((resolve) => {
      existingScript.addEventListener('load', () => resolve(true), { once: true });
      existingScript.addEventListener('error', () => resolve(false), { once: true });
      setTimeout(() => resolve(!!window.Razorpay), 3000);
    });
  }

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Cart = () => {
  const { cart, removeFromCart, updateQty, clearCart, total, count } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '', country: 'India' });
  const [showAddr, setShowAddr] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated) return navigate('/login');
    setShowAddr(true);
  };

  const handlePaymentMethodSelect = async (method) => {
    if (!address.street || !address.city || !address.state || !address.zip) return toast.error('Please fill all address fields');
    
    setShowPaymentModal(false);
    setPlacing(true);
    
    try {
      const orderData = {
        items: cart.map(i => ({ product: i._id, qty: i.qty, price: i.price })),
        shippingAddress: address,
        totalAmount: total,
        paymentMethod: method,
      };

      if (method === 'cod') {
        // Direct COD order placement
        await createOrder({ 
          ...orderData, 
          razorpayOrderId: 'COD_' + Date.now(), 
          paymentStatus: 'pending' 
        });
        clearCart();
        toast.success('Order placed successfully! (Cash on Delivery)');
        navigate('/my-orders');
      } else {
        // Online Payment (Razorpay)
        const razorpayLoaded = await loadRazorpayScript();
        if (!razorpayLoaded || !window.Razorpay) {
          toast.error('Razorpay could not load. Check your internet connection and try again.');
          setPlacing(false);
          return;
        }

        const razResp = await createPaymentOrder({ amount: total });
        const razOrder = razResp.data?.data || razResp.data;

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY || 'rzp_test_SrWncI64b0JSm9',
          amount: razOrder.amount,
          currency: 'INR',
          name: 'ShopKaro',
          description: `Order for ${count} item(s)`,
          order_id: razOrder.id,
          handler: async function (response) {
            try {
              await verifyPayment({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              });
              await createOrder({ 
                ...orderData, 
                paymentStatus: 'paid', 
                razorpayOrderId: razOrder.id 
              });
              clearCart();
              toast.success('Order placed successfully! Payment confirmed');
              navigate('/my-orders');
            } catch (err) { 
              toast.error('Payment verification failed'); 
              setPlacing(false);
            }
          },
          prefill: { name: user?.name, email: user?.email },
          theme: { color: '#e8c547' },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function () {
          toast.error('Payment failed or was cancelled');
          setPlacing(false);
        });
        rzp.open();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
      setPlacing(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city || !address.state || !address.zip) return toast.error('Please fill all address fields');
    setShowPaymentModal(true);
  };

  if (cart.length === 0) return (
    <div style={styles.empty}>
      <div style={styles.emptyIcon}>🛒</div>
      <h2 style={styles.emptyTitle}>Your cart is empty</h2>
      <p style={styles.emptySub}>Discover amazing products and add them to your cart</p>
      <Link to="/products" style={styles.shopBtn}>Start Shopping</Link>
    </div>
  );

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      
      {/* Payment Method Modal */}
      {showPaymentModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>Select Payment Method</h2>
            <p style={styles.modalDesc}>Choose how you want to pay for your order</p>
            
            <button 
              style={styles.paymentOption}
              onClick={() => handlePaymentMethodSelect('online')}
              disabled={placing}
            >
              <div style={styles.paymentIcon}>💳</div>
              <div>
                <div style={styles.paymentName}>Online Payment</div>
                <div style={styles.paymentSubtext}>Pay via Razorpay (Card, UPI, Net Banking)</div>
              </div>
              <div style={styles.paymentArrow}>→</div>
            </button>

            <button 
              style={styles.paymentOption}
              onClick={() => handlePaymentMethodSelect('cod')}
              disabled={placing}
            >
              <div style={styles.paymentIcon}>💵</div>
              <div>
                <div style={styles.paymentName}>Cash on Delivery</div>
                <div style={styles.paymentSubtext}>Pay when you receive your order</div>
              </div>
              <div style={styles.paymentArrow}>→</div>
            </button>

            <button 
              style={styles.cancelBtn}
              onClick={() => setShowPaymentModal(false)}
              disabled={placing}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={styles.container}>
        <h1 style={styles.title}>Shopping Cart <span style={styles.count}>({count} items)</span></h1>

        <div style={styles.layout}>
          {/* Items */}
          <div style={styles.items}>
            {cart.map(item => {
              const placeholderImg = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="90"%3E%3Crect fill="%231a1a25" width="120" height="90"/%3E%3Ctext x="50%" y="50%" font-size="12" fill="%23e8c547" text-anchor="middle" dy=".3em" font-family="Arial"%3ENo Image%3C/text%3E%3C/svg%3E';
              const imgUrl = item.image ? getImageUrl(item.image) : placeholderImg;
              return (
                <div key={item._id} style={styles.item}>
                  <img src={imgUrl} alt={item.name} style={styles.itemImg}
                    onError={(e) => { if (e.target.src !== placeholderImg) e.target.src = placeholderImg; }}
                  />
                  <div style={styles.itemInfo}>
                    <Link to={`/products/${item._id}`} style={styles.itemName}>{item.name}</Link>
                    <div style={styles.itemPrice}>₹{item.price?.toLocaleString('en-IN')} each</div>
                  </div>
                  <div style={styles.itemQty}>
                    <button style={styles.qtyBtn} onClick={() => updateQty(item._id, item.qty - 1)}>−</button>
                    <span style={styles.qtyNum}>{item.qty}</span>
                    <button style={styles.qtyBtn} onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
                  </div>
                  <div style={styles.itemTotal}>₹{(item.price * item.qty).toLocaleString('en-IN')}</div>
                  <button style={styles.removeBtn} onClick={() => removeFromCart(item._id)}>✕</button>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div style={styles.summary}>
            <h2 style={styles.summaryTitle}>Order Summary</h2>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Subtotal ({count} items)</span>
              <span style={styles.summaryVal}>₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Shipping</span>
              <span style={{ color: '#4ade80', fontWeight: 600 }}>Free</span>
            </div>
            <div style={styles.summaryDivider} />
            <div style={styles.summaryRow}>
              <span style={styles.summaryTotal}>Total</span>
              <span style={styles.summaryTotalVal}>₹{total.toLocaleString('en-IN')}</span>
            </div>

            {!showAddr ? (
              <button style={styles.checkoutBtn} onClick={handleCheckout}>
                {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>
            ) : (
              <div style={styles.addrForm}>
                <h3 style={styles.addrTitle}>Delivery Address</h3>
                {[
                  { key: 'street', label: 'Street Address', placeholder: '123 Main St' },
                  { key: 'city', label: 'City', placeholder: 'Mumbai' },
                  { key: 'state', label: 'State', placeholder: 'Maharashtra' },
                  { key: 'zip', label: 'PIN Code', placeholder: '400001' },
                  { key: 'country', label: 'Country', placeholder: 'India' },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 12 }}>
                    <label style={styles.addrLabel}>{f.label}</label>
                    <input
                      style={styles.addrInput} placeholder={f.placeholder}
                      value={address[f.key]}
                      onChange={e => setAddress(a => ({ ...a, [f.key]: e.target.value }))}
                    />
                  </div>
                ))}
                <button style={styles.checkoutBtn} onClick={handlePlaceOrder} disabled={placing}>
                  {placing ? 'Processing...' : 'Proceed to Payment'}
                </button>
              </div>
            )}

            <button style={styles.clearBtn} onClick={clearCart}>Clear Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '60px 24px', minHeight: '80vh' },
  container: { maxWidth: 1200, margin: '0 auto' },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 36, fontWeight: 800, color: '#f0ece6', marginBottom: 36 },
  count: { color: 'rgba(240,236,230,0.4)', fontSize: 22 },
  layout: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32, alignItems: 'start' },
  items: { display: 'flex', flexDirection: 'column', gap: 16 },
  item: {
    background: '#13131a', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 14, padding: '20px 24px',
    display: 'flex', alignItems: 'center', gap: 20,
  },
  itemImg: { width: 90, height: 70, objectFit: 'cover', borderRadius: 10, flexShrink: 0 },
  itemInfo: { flex: 1 },
  itemName: {
    fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16,
    color: '#f0ece6', textDecoration: 'none', display: 'block', marginBottom: 6,
  },
  itemPrice: { color: 'rgba(240,236,230,0.45)', fontSize: 13 },
  itemQty: { display: 'flex', alignItems: 'center', gap: 10 },
  qtyBtn: {
    width: 32, height: 32, borderRadius: 8,
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#f0ece6', fontSize: 18, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  qtyNum: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, minWidth: 24, textAlign: 'center' },
  itemTotal: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: '#e8c547', minWidth: 80, textAlign: 'right' },
  removeBtn: {
    background: 'none', border: 'none',
    color: 'rgba(255,107,107,0.6)', cursor: 'pointer', fontSize: 16,
  },
  summary: {
    background: '#13131a', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 18, padding: 28, position: 'sticky', top: 88,
  },
  summaryTitle: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 20, color: '#f0ece6', marginBottom: 24 },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  summaryLabel: { color: 'rgba(240,236,230,0.55)', fontSize: 14 },
  summaryVal: { fontWeight: 600, color: '#f0ece6' },
  summaryDivider: { height: 1, background: 'rgba(255,255,255,0.06)', margin: '16px 0' },
  summaryTotal: { fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 17, color: '#f0ece6' },
  summaryTotalVal: { fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: '#e8c547' },
  checkoutBtn: {
    width: '100%', padding: '14px', marginTop: 20,
    background: '#e8c547', color: '#0a0a0f',
    border: 'none', borderRadius: 12,
    fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700,
    cursor: 'pointer',
  },
  clearBtn: {
    width: '100%', padding: '10px', marginTop: 10,
    background: 'none', color: 'rgba(255,107,107,0.7)',
    border: '1px solid rgba(255,107,107,0.2)', borderRadius: 10,
    fontFamily: 'DM Sans, sans-serif', fontSize: 14,
    cursor: 'pointer',
  },
  addrForm: { marginTop: 20 },
  addrTitle: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: '#f0ece6', marginBottom: 16 },
  addrLabel: { display: 'block', fontSize: 12, color: 'rgba(240,236,230,0.5)', marginBottom: 6 },
  addrInput: {
    width: '100%', padding: '10px 12px',
    background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, color: '#f0ece6',
    fontFamily: 'DM Sans, sans-serif', fontSize: 14, outline: 'none',
  },
  empty: {
    minHeight: '80vh', display: 'flex',
    flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '40px',
    textAlign: 'center',
  },
  emptyIcon: { fontSize: 80, marginBottom: 24 },
  emptyTitle: { fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 800, color: '#f0ece6', marginBottom: 12 },
  emptySub: { color: 'rgba(240,236,230,0.45)', fontSize: 16, marginBottom: 32 },
  shopBtn: {
    background: '#e8c547', color: '#0a0a0f',
    textDecoration: 'none', padding: '14px 36px',
    borderRadius: 12, fontFamily: 'Syne, sans-serif',
    fontSize: 16, fontWeight: 700,
  },
  modalOverlay: {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    background: '#13131a', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 20, padding: 32, maxWidth: 420,
    animation: 'slideUp 0.3s ease-out',
  },
  modalTitle: {
    fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800,
    color: '#f0ece6', marginBottom: 8,
  },
  modalDesc: {
    color: 'rgba(240,236,230,0.5)', fontSize: 14,
    marginBottom: 24,
  },
  paymentOption: {
    width: '100%', padding: 16, marginBottom: 12,
    background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 12, color: '#f0ece6',
    display: 'flex', alignItems: 'center', gap: 12,
    cursor: 'pointer', transition: 'all 0.2s',
    fontFamily: 'DM Sans, sans-serif',
  },
  paymentIcon: { fontSize: 28, flexShrink: 0 },
  paymentName: {
    fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16,
    color: '#f0ece6',
  },
  paymentSubtext: {
    fontSize: 12, color: 'rgba(240,236,230,0.4)',
    marginTop: 4,
  },
  paymentArrow: {
    marginLeft: 'auto', fontSize: 18,
    color: '#e8c547', fontWeight: 700,
  },
  cancelBtn: {
    width: '100%', padding: '12px',
    background: 'none', border: '1px solid rgba(255,255,255,0.2)',
    color: 'rgba(240,236,230,0.5)', borderRadius: 10,
    fontFamily: 'DM Sans, sans-serif', fontSize: 14,
    cursor: 'pointer', marginTop: 12,
  },
};

export default Cart;
