import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../utils/api';
import Loader from '../components/Loader';

const statusColor = {
  pending: '#f59e0b',
  processing: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: '#4ade80',
  cancelled: '#ff6b6b',
  paid: '#4ade80',
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(r => {
        const ord = r.data?.data || r.data?.orders || [];
        setOrders(Array.isArray(ord) ? ord : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>My Orders</h1>

        {orders.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyText}>You haven't placed any orders yet.</p>
            <Link to="/products" style={styles.shopBtn}>Start Shopping →</Link>
          </div>
        ) : (
          <div style={styles.list}>
            {orders.map(order => (
              <div key={order._id} style={styles.orderCard}>
                <div style={styles.orderHead}>
                  <div>
                    <div style={styles.orderId}>Order #{order._id?.slice(-8).toUpperCase()}</div>
                    <div style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  </div>
                  <div style={styles.badges}>
                    <span style={{ ...styles.badge, color: statusColor[order.status] || '#f0ece6', borderColor: statusColor[order.status] || 'rgba(255,255,255,0.2)' }}>
                      {order.status?.toUpperCase()}
                    </span>
                    <span style={{ ...styles.badge, color: statusColor[order.paymentStatus] || '#f0ece6', borderColor: statusColor[order.paymentStatus] || 'rgba(255,255,255,0.2)' }}>
                      {order.paymentStatus?.toUpperCase() || 'PENDING'}
                    </span>
                  </div>
                </div>

                <div style={styles.items}>
                  {order.items?.map((item, i) => (
                    <div key={i} style={styles.item}>
                      <span style={styles.itemName}>{item.product?.name || 'Product'}</span>
                      <span style={styles.itemQty}>x{item.qty}</span>
                      <span style={styles.itemPrice}>₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <div style={styles.orderFoot}>
                  {order.shippingAddress && (
                    <div style={styles.address}>
                      📍 {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zip}
                    </div>
                  )}
                  <div style={styles.total}>Total: <span style={styles.totalAmt}>₹{order.totalAmount?.toLocaleString('en-IN')}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { padding: '60px 24px', minHeight: '80vh' },
  container: { maxWidth: 860, margin: '0 auto' },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 36, fontWeight: 800, color: '#f0ece6', marginBottom: 36 },
  empty: { textAlign: 'center', padding: '80px 20px' },
  emptyText: { color: 'rgba(240,236,230,0.4)', fontSize: 16, marginBottom: 24 },
  shopBtn: {
    display: 'inline-block',
    background: '#e8c547', color: '#0a0a0f',
    textDecoration: 'none', padding: '12px 28px',
    borderRadius: 10, fontFamily: 'Syne, sans-serif', fontWeight: 700,
  },
  list: { display: 'flex', flexDirection: 'column', gap: 20 },
  orderCard: {
    background: '#13131a', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16, overflow: 'hidden',
  },
  orderHead: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  orderId: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: '#f0ece6' },
  orderDate: { color: 'rgba(240,236,230,0.4)', fontSize: 12, marginTop: 4 },
  badges: { display: 'flex', gap: 8 },
  badge: {
    padding: '4px 12px', borderRadius: 20,
    border: '1px solid',
    fontSize: 11, fontWeight: 700,
    fontFamily: 'Syne, sans-serif', letterSpacing: 0.5,
  },
  items: { padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 10 },
  item: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  itemName: { flex: 1, color: '#f0ece6', fontSize: 14 },
  itemQty: { color: 'rgba(240,236,230,0.4)', fontSize: 13 },
  itemPrice: { fontFamily: 'Syne, sans-serif', fontWeight: 600, color: '#e8c547', minWidth: 80, textAlign: 'right' },
  orderFoot: {
    padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    flexWrap: 'wrap', gap: 8,
  },
  address: { color: 'rgba(240,236,230,0.4)', fontSize: 13 },
  total: { color: 'rgba(240,236,230,0.6)', fontSize: 14, fontFamily: 'Syne, sans-serif' },
  totalAmt: { color: '#e8c547', fontWeight: 800, fontSize: 18 },
};

export default MyOrders;
