import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../utils/api';
import Loader from '../components/Loader';

const statusColor = {
  pending: '#f59e0b',
  processing: '#3b82f6',
  shipped: '#8b5cf6',
  out_for_delivery: '#06b6d4',
  delivered: '#4ade80',
  cancelled: '#ff6b6b',
  paid: '#4ade80',
};

const statusIcon = {
  pending: '⏳',
  processing: '📦',
  shipped: '🚚',
  out_for_delivery: '📍',
  delivered: '✓',
  cancelled: '✕',
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

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
                <div style={styles.orderHead} onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}>
                  <div style={styles.orderInfo}>
                    <div style={styles.orderId}>Order #{order._id?.slice(-8).toUpperCase()}</div>
                    <div style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  </div>
                  <div style={styles.badges}>
                    <span style={{ ...styles.badge, color: statusColor[order.status] || '#f0ece6', borderColor: statusColor[order.status] || 'rgba(255,255,255,0.2)' }}>
                      {statusIcon[order.status]} {order.status?.toUpperCase().replace(/_/g, ' ')}
                    </span>
                    <span style={{ ...styles.badge, color: statusColor[order.paymentStatus] || '#f0ece6', borderColor: statusColor[order.paymentStatus] || 'rgba(255,255,255,0.2)' }}>
                      {statusIcon[order.paymentStatus]} {order.paymentStatus?.toUpperCase() || 'PENDING'}
                    </span>
                  </div>
                  <div style={styles.expandIcon}>{expandedOrder === order._id ? '▼' : '▶'}</div>
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

                {/* Tracking Information */}
                {expandedOrder === order._id && (
                  <div style={styles.trackingSection}>
                    <div style={styles.trackingHeader}>
                      <h3 style={styles.trackingTitle}>Order Tracking</h3>
                      {order.trackingNumber && (
                        <div style={styles.trackingNumber}>
                          Tracking #: <span style={styles.trackNum}>{order.trackingNumber}</span>
                        </div>
                      )}
                    </div>
                    
                    {order.currentLocation && (
                      <div style={styles.currentLocation}>
                        📍 Current Location: <span style={styles.locationText}>{order.currentLocation}</span>
                      </div>
                    )}

                    {order.estimatedDelivery && (
                      <div style={styles.estimatedDelivery}>
                        📅 Estimated Delivery: <span style={styles.deliveryText}>{new Date(order.estimatedDelivery).toLocaleDateString('en-IN')}</span>
                      </div>
                    )}

                    {order.trackingHistory && order.trackingHistory.length > 0 && (
                      <div style={styles.timeline}>
                        <h4 style={styles.timelineTitle}>Tracking Timeline</h4>
                        <div style={styles.timelineContent}>
                          {order.trackingHistory.map((event, i) => (
                            <div key={i} style={styles.timelineEvent}>
                              <div style={styles.timelineMarker}>
                                <div style={{
                                  ...styles.timelineCircle,
                                  backgroundColor: statusColor[event.status] || '#e8c547',
                                }}>{statusIcon[event.status] || '•'}</div>
                                {i < order.trackingHistory.length - 1 && <div style={styles.timelineLine}></div>}
                              </div>
                              <div style={styles.timelineContent2}>
                                <div style={styles.eventName}>{event.event}</div>
                                {event.location && <div style={styles.eventLocation}>📍 {event.location}</div>}
                                {event.description && <div style={styles.eventDesc}>{event.description}</div>}
                                <div style={styles.eventTime}>{new Date(event.timestamp).toLocaleString('en-IN')}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  page: { padding: 'clamp(40px, 8vw, 80px) clamp(12px, 3vw, 24px)', minHeight: '80vh' },
  container: { maxWidth: 860, margin: '0 auto' },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 'clamp(22px, 5vw, 36px)', fontWeight: 800, color: '#f0ece6', marginBottom: 'clamp(24px, 6vw, 36px)' },
  empty: { textAlign: 'center', padding: 'clamp(40px, 10vw, 80px) clamp(12px, 3vw, 20px)' },
  emptyText: { color: 'rgba(240,236,230,0.4)', fontSize: 'clamp(13px, 3vw, 16px)', marginBottom: 'clamp(16px, 4vw, 24px)' },
  shopBtn: {
    display: 'inline-block',
    background: '#e8c547', color: '#0a0a0f',
    textDecoration: 'none', padding: 'clamp(10px, 2vw, 12px) clamp(20px, 5vw, 28px)',
    borderRadius: 10, fontFamily: 'Syne, sans-serif', fontWeight: 700,
    fontSize: 'clamp(13px, 2vw, 15px)',
  },
  list: { display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 3vw, 20px)' },
  orderCard: {
    background: '#13131a', border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 'clamp(12px, 2vw, 16px)', overflow: 'hidden',
  },
  orderHead: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: 'clamp(14px, 3vw, 20px) clamp(12px, 3vw, 24px)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    cursor: 'pointer',
    gap: 'clamp(8px, 2vw, 12px)',
    flexWrap: 'wrap',
  },
  orderInfo: { flex: 1, minWidth: '150px' },
  orderId: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 'clamp(13px, 2vw, 15px)', color: '#f0ece6' },
  orderDate: { color: 'rgba(240,236,230,0.4)', fontSize: 'clamp(11px, 2vw, 12px)', marginTop: 'clamp(4px, 1vw, 4px)' },
  badges: { display: 'flex', gap: 'clamp(6px, 1vw, 8px)', flexWrap: 'wrap' },
  badge: {
    padding: 'clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)', borderRadius: 20,
    border: '1px solid',
    fontSize: 'clamp(10px, 1.5vw, 11px)', fontWeight: 700,
    fontFamily: 'Syne, sans-serif', letterSpacing: 0.5,
  },
  expandIcon: { color: '#e8c547', fontWeight: 'bold', fontSize: 'clamp(12px, 2vw, 14px)', cursor: 'pointer' },
  items: { padding: 'clamp(12px, 2vw, 16px) clamp(12px, 3vw, 24px)', display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 2vw, 10px)' },
  item: {
    display: 'flex', alignItems: 'center', gap: 'clamp(8px, 2vw, 12px)',
    padding: 'clamp(6px, 1vw, 8px) 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
    flexWrap: 'wrap',
  },
  itemName: { flex: 1, color: '#f0ece6', fontSize: 'clamp(12px, 2vw, 14px)' },
  itemQty: { color: 'rgba(240,236,230,0.4)', fontSize: 'clamp(11px, 2vw, 13px)' },
  itemPrice: { fontFamily: 'Syne, sans-serif', fontWeight: 600, color: '#e8c547', minWidth: 'clamp(60px, 15vw, 80px)', textAlign: 'right', fontSize: 'clamp(12px, 2vw, 13px)' },
  orderFoot: {
    padding: 'clamp(12px, 2vw, 16px) clamp(12px, 3vw, 24px)', borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    flexWrap: 'wrap', gap: 'clamp(8px, 2vw, 12px)',
  },
  address: { color: 'rgba(240,236,230,0.4)', fontSize: 'clamp(11px, 2vw, 13px)', flex: 1, minWidth: '200px' },
  total: { color: 'rgba(240,236,230,0.6)', fontSize: 'clamp(13px, 2vw, 14px)', fontFamily: 'Syne, sans-serif' },
  totalAmt: { color: '#e8c547', fontWeight: 800, fontSize: 'clamp(14px, 3vw, 18px)' },

  // Tracking Styles
  trackingSection: {
    background: 'rgba(232,197,71,0.05)',
    border: '1px solid rgba(232,197,71,0.15)',
    borderTop: '2px solid rgba(232,197,71,0.3)',
    padding: 'clamp(16px, 4vw, 24px)',
    borderRadius: '0 0 12px 12px',
  },
  trackingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 'clamp(12px, 3vw, 16px)',
    flexWrap: 'wrap',
    gap: 'clamp(8px, 2vw, 12px)',
  },
  trackingTitle: {
    fontFamily: 'Syne, sans-serif',
    fontSize: 'clamp(14px, 3vw, 16px)',
    fontWeight: 700,
    color: '#e8c547',
    margin: 0,
  },
  trackingNumber: {
    fontSize: 'clamp(11px, 2vw, 12px)',
    color: 'rgba(240,236,230,0.6)',
  },
  trackNum: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 600,
    color: '#e8c547',
  },
  currentLocation: {
    fontSize: 'clamp(12px, 2vw, 14px)',
    color: 'rgba(240,236,230,0.7)',
    marginBottom: 'clamp(8px, 2vw, 12px)',
  },
  locationText: {
    fontWeight: 600,
    color: '#f0ece6',
  },
  estimatedDelivery: {
    fontSize: 'clamp(12px, 2vw, 14px)',
    color: 'rgba(240,236,230,0.7)',
    marginBottom: 'clamp(12px, 3vw, 16px)',
  },
  deliveryText: {
    fontWeight: 600,
    color: '#f0ece6',
  },
  timeline: {
    marginTop: 'clamp(16px, 4vw, 24px)',
  },
  timelineTitle: {
    fontFamily: 'Syne, sans-serif',
    fontSize: 'clamp(12px, 2vw, 14px)',
    fontWeight: 700,
    color: 'rgba(240,236,230,0.8)',
    margin: '0 0 clamp(12px, 3vw, 16px) 0',
  },
  timelineContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'clamp(12px, 3vw, 16px)',
  },
  timelineEvent: {
    display: 'flex',
    gap: 'clamp(12px, 3vw, 16px)',
  },
  timelineMarker: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    minWidth: 'clamp(40px, 8vw, 50px)',
  },
  timelineCircle: {
    width: 'clamp(32px, 6vw, 40px)',
    height: 'clamp(32px, 6vw, 40px)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#0a0a0f',
    fontWeight: 'bold',
    fontSize: 'clamp(14px, 3vw, 18px)',
    flexShrink: 0,
    boxShadow: '0 0 12px rgba(232,197,71,0.3)',
  },
  timelineLine: {
    flex: 1,
    width: '2px',
    background: 'linear-gradient(to bottom, rgba(232,197,71,0.3), transparent)',
    minHeight: 'clamp(24px, 5vw, 40px)',
  },
  timelineContent2: {
    flex: 1,
    paddingTop: 'clamp(4px, 1vw, 8px)',
  },
  eventName: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 600,
    color: '#f0ece6',
    fontSize: 'clamp(12px, 2vw, 14px)',
  },
  eventLocation: {
    fontSize: 'clamp(11px, 2vw, 12px)',
    color: 'rgba(240,236,230,0.6)',
    marginTop: 'clamp(4px, 1vw, 6px)',
  },
  eventDesc: {
    fontSize: 'clamp(11px, 2vw, 12px)',
    color: 'rgba(240,236,230,0.5)',
    marginTop: 'clamp(4px, 1vw, 6px)',
  },
  eventTime: {
    fontSize: 'clamp(10px, 1.5vw, 11px)',
    color: 'rgba(240,236,230,0.4)',
    marginTop: 'clamp(4px, 1vw, 6px)',
  },
};

export default MyOrders;
