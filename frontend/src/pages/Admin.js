import React, { useEffect, useState } from 'react';
import {
  adminGetUsers,
  adminDeleteUser,
  adminGetProducts,
  adminDeleteProduct,
  getAllOrders,
  updateOrderStatus,
  createCategory,
  deleteCategory,
  getCategories,
  createProduct,
  uploadProductImage,
  adminUpdateProduct,
} from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const tabs = ['Dashboard', 'Products', 'Users', 'Orders', 'Categories'];

const Admin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCat, setNewCat] = useState('');
  const [savingProduct, setSavingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    quantity: '',
    description: '',
    ratings: '',
    categoryId: '',
    image: null,
  });

  const emptyProductForm = {
    name: '',
    price: '',
    quantity: '',
    description: '',
    ratings: '',
    categoryId: '',
    image: null,
  };

  useEffect(() => { if (!isAdmin) navigate('/'); }, [isAdmin, navigate]);

  useEffect(() => {
    setLoading(true);
    Promise.all([adminGetUsers(), adminGetProducts(), getAllOrders(), getCategories()])
      .then(([u, p, o, c]) => {
        setUsers(u.data.data || u.data.users || u.data || []);
        setProducts(p.data.data || p.data.products || p.data || []);
        setOrders(o.data.data || o.data.orders || o.data || []);
        setCategories(c.data.data || c.data.categories || c.data || []);
      })
      .catch(() => toast.error('Failed to load admin data'))
      .finally(() => setLoading(false));
  }, []);

  const delUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await adminDeleteUser(id);
    setUsers(u => u.filter(x => x._id !== id));
    toast.success('User deleted');
  };

  const delProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await adminDeleteProduct(id);
    setProducts(p => p.filter(x => x._id !== id));
    toast.success('Product deleted');
  };

  const updateStatus = async (id, status) => {
    await updateOrderStatus(id, status);
    setOrders(o => o.map(x => x._id === id ? { ...x, status } : x));
    toast.success('Status updated');
  };

  const addCategory = async () => {
    if (!newCat.trim()) return;
    try {
      const r = await createCategory({ name: newCat });
      setCategories(c => [...c, r.data.data || r.data.category || r.data]);
      setNewCat('');
      toast.success('Category added');
    } catch {
      toast.error('Failed to add category');
    }
  };

  const delCategory = async (id) => {
    if (!window.confirm('Delete category?')) return;
    await deleteCategory(id);
    setCategories(c => c.filter(x => x._id !== id));
    toast.success('Category deleted');
  };

  const resetProductForm = () => {
    setProductForm(emptyProductForm);
    setEditingProduct(null);
  };

  const startEditProduct = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name || '',
      price: product.price ?? '',
      quantity: product.quantity ?? '',
      description: product.description || '',
      ratings: product.ratings ?? '',
      categoryId: product.categoryId || '',
      image: null,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.quantity) {
      return toast.error('Please add product name, price and quantity');
    }
    setSavingProduct(true);
    try {
      const payload = {
        name: productForm.name,
        price: Number(productForm.price),
        quantity: Number(productForm.quantity),
        inStock: Number(productForm.quantity) > 0,
        description: productForm.description,
        ratings: Number(productForm.ratings) || 0,
        categoryId: productForm.categoryId || undefined,
      };

      const saved = editingProduct
        ? await adminUpdateProduct(editingProduct._id, payload)
        : await createProduct(payload);
      let savedProduct = saved.data.data || saved.data.product || saved.data;

      if (productForm.image) {
        const formData = new FormData();
        formData.append('image', productForm.image);
        const uploaded = await uploadProductImage(savedProduct._id, formData);
        savedProduct = uploaded.data.data || uploaded.data.product || uploaded.data;
      }

      setProducts(products => editingProduct
        ? products.map(p => p._id === savedProduct._id ? savedProduct : p)
        : [savedProduct, ...products]
      );
      resetProductForm();
      toast.success(editingProduct ? 'Product updated' : 'Product added');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setSavingProduct(false);
    }
  };

  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((s, o) => s + (o.totalAmount || o.totalAmounts || 0), 0);

  const stats = [
    { label: 'Total Users', value: users.length, color: '#60a5fa' },
    { label: 'Total Products', value: products.length, color: '#4ade80' },
    { label: 'Total Orders', value: orders.length, color: '#f59e0b' },
    { label: 'Revenue', value: `Rs ${totalRevenue.toLocaleString('en-IN')}`, color: '#e8c547' },
  ];

  if (loading) return <Loader text="Loading admin data..." />;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Admin Panel</h1>

        <div style={styles.tabs}>
          {tabs.map(t => (
            <button key={t} style={{ ...styles.tab, ...(activeTab === t ? styles.tabActive : {}) }} onClick={() => setActiveTab(t)}>{t}</button>
          ))}
        </div>

        {activeTab === 'Dashboard' && (
          <div>
            <div style={styles.statsGrid}>
              {stats.map(s => (
                <div key={s.label} style={{ ...styles.statCard, borderColor: s.color + '25' }}>
                  <div style={{ ...styles.statVal, color: s.color }}>{s.value}</div>
                  <div style={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={styles.recentTitle}>Recent Orders</div>
            <div style={styles.table}>
              <div style={{ ...styles.tableRow, ...styles.tableHead }}>
                <span>Order ID</span><span>User</span><span>Amount</span><span>Status</span>
              </div>
              {orders.slice(0, 5).map(o => (
                <div key={o._id} style={styles.tableRow}>
                  <span style={styles.mono}>#{o._id?.slice(-6).toUpperCase()}</span>
                  <span style={styles.dim}>{o.user?.name || o.userId?.name || 'User'}</span>
                  <span style={{ color: '#e8c547' }}>Rs {(o.totalAmount || o.totalAmounts || 0).toLocaleString('en-IN')}</span>
                  <span style={statusStyle(o.status)}>{o.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Products' && (
          <div>
            <form onSubmit={saveProduct} style={styles.productForm}>
              <div style={styles.formTitle}>{editingProduct ? `Editing: ${editingProduct.name}` : 'Add Product'}</div>
              <input style={styles.formInput} placeholder="Product name" value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} />
              <input style={styles.formInput} type="number" min="0" placeholder="Price" value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} />
              <input style={styles.formInput} type="number" min="0" placeholder="Quantity" value={productForm.quantity} onChange={e => setProductForm(f => ({ ...f, quantity: e.target.value }))} />
              <input style={styles.formInput} type="number" min="0" max="5" step="0.1" placeholder="Rating" value={productForm.ratings} onChange={e => setProductForm(f => ({ ...f, ratings: e.target.value }))} />
              <select style={styles.formInput} value={productForm.categoryId} onChange={e => setProductForm(f => ({ ...f, categoryId: e.target.value }))}>
                <option value="">No category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <input key={editingProduct?._id || 'new'} style={styles.formInput} type="file" accept="image/*" onChange={e => setProductForm(f => ({ ...f, image: e.target.files?.[0] || null }))} />
              <textarea style={{ ...styles.formInput, gridColumn: '1 / -1', minHeight: 80 }} placeholder="Description" value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} />
              <div style={styles.formActions}>
                <button type="submit" style={styles.catBtn} disabled={savingProduct}>{savingProduct ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}</button>
                {editingProduct && <button type="button" style={styles.cancelEditBtn} onClick={resetProductForm} disabled={savingProduct}>Cancel Edit</button>}
              </div>
            </form>

            <div style={styles.table}>
              <div style={{ ...styles.tableRow, ...styles.tableHead, gridTemplateColumns: 'repeat(4, 1fr) 150px' }}>
                <span>Name</span><span>Price</span><span>Qty</span><span>Rating</span><span>Action</span>
              </div>
              {products.map(p => (
                <div key={p._id} style={{ ...styles.tableRow, gridTemplateColumns: 'repeat(4, 1fr) 150px' }}>
                  <span>{p.name}</span>
                  <span style={{ color: '#e8c547' }}>Rs {p.price?.toLocaleString('en-IN')}</span>
                  <span style={{ color: (p.quantity || 0) > 0 ? '#4ade80' : '#ff6b6b' }}>{p.quantity || 0}</span>
                  <span style={styles.dim}>{p.ratings || 0}/5</span>
                  <div style={styles.actionBtns}>
                    <button style={styles.editBtn} onClick={() => startEditProduct(p)}>Edit</button>
                    <button style={styles.delBtn} onClick={() => delProduct(p._id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'Users' && (
          <div style={styles.table}>
            <div style={{ ...styles.tableRow, ...styles.tableHead }}>
              <span>Name</span><span>Email</span><span>Role</span><span>Action</span>
            </div>
            {users.map(u => (
              <div key={u._id} style={styles.tableRow}>
                <span>{u.name}</span>
                <span style={styles.dim}>{u.email}</span>
                <span style={{ color: u.role === 'admin' ? '#e8c547' : 'rgba(240,236,230,0.5)', textTransform: 'capitalize' }}>{u.role}</span>
                <button style={styles.delBtn} onClick={() => delUser(u._id)} disabled={u.role === 'admin'}>Delete</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Orders' && (
          <div style={styles.table}>
            <div style={{ ...styles.tableRow, ...styles.tableHead, gridTemplateColumns: 'repeat(5, 1fr)' }}>
              <span>Order ID</span><span>User</span><span>Amount</span><span>Status</span><span>Update</span>
            </div>
            {orders.map(o => (
              <div key={o._id} style={{ ...styles.tableRow, gridTemplateColumns: 'repeat(5, 1fr)' }}>
                <span style={styles.mono}>#{o._id?.slice(-6).toUpperCase()}</span>
                <span style={styles.dim}>{o.user?.name || o.userId?.name || '-'}</span>
                <span style={{ color: '#e8c547' }}>Rs {(o.totalAmount || o.totalAmounts || 0).toLocaleString('en-IN')}</span>
                <span style={statusStyle(o.status)}>{o.status}</span>
                <select style={styles.statusSelect} value={o.status} onChange={e => updateStatus(o._id, e.target.value)}>
                  {['pending','processing','shipped','delivered','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Categories' && (
          <div>
            <div style={styles.catAdd}>
              <input style={styles.catInput} placeholder="New category name..." value={newCat} onChange={e => setNewCat(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCategory()} />
              <button style={styles.catBtn} onClick={addCategory}>Add Category</button>
            </div>
            <div style={styles.catList}>
              {categories.map(c => (
                <div key={c._id} style={styles.catRow}>
                  <span>{c.name}</span>
                  <button style={styles.delBtn} onClick={() => delCategory(c._id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const statusStyle = (status) => ({
  color: status === 'delivered' ? '#4ade80' : status === 'cancelled' ? '#ff6b6b' : '#f59e0b',
  textTransform: 'capitalize',
});

const styles = {
  page: { padding: '60px 24px', minHeight: '80vh' },
  container: { maxWidth: 1200, margin: '0 auto' },
  title: { fontFamily: 'Syne, sans-serif', fontSize: 40, fontWeight: 800, color: '#f0ece6', marginBottom: 32 },
  tabs: { display: 'flex', gap: 8, marginBottom: 36, flexWrap: 'wrap' },
  tab: {
    padding: '10px 20px', borderRadius: 10,
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    color: 'rgba(240,236,230,0.5)', cursor: 'pointer',
    fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 600,
  },
  tabActive: { background: '#e8c547', color: '#0a0a0f', border: '1px solid #e8c547' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 40 },
  statCard: { background: '#13131a', border: '1px solid', borderRadius: 8, padding: '24px 20px', textAlign: 'center' },
  statVal: { fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, marginBottom: 6 },
  statLabel: { color: 'rgba(240,236,230,0.45)', fontSize: 13 },
  recentTitle: { fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 700, color: '#f0ece6', marginBottom: 16 },
  table: { background: '#13131a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, overflow: 'hidden' },
  tableRow: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)',
    gap: 12, alignItems: 'center',
  },
  tableHead: { background: 'rgba(255,255,255,0.03)', color: 'rgba(240,236,230,0.4)', fontSize: 12, fontWeight: 700, fontFamily: 'Syne, sans-serif', letterSpacing: 1 },
  mono: { fontFamily: 'monospace', color: '#e8c547', fontSize: 14 },
  dim: { color: 'rgba(240,236,230,0.5)', fontSize: 13 },
  delBtn: {
    padding: '6px 14px', borderRadius: 7,
    background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.2)',
    color: '#ff6b6b', cursor: 'pointer', fontSize: 12, fontWeight: 600,
    fontFamily: 'Syne, sans-serif',
  },
  statusSelect: {
    padding: '6px 10px', borderRadius: 7,
    background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)',
    color: '#f0ece6', fontSize: 12, outline: 'none', cursor: 'pointer',
  },
  productForm: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 12,
    background: '#13131a',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  formInput: {
    padding: '12px 14px',
    background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8, color: '#f0ece6',
    fontFamily: 'DM Sans, sans-serif', fontSize: 14, outline: 'none',
  },
  formTitle: {
    gridColumn: '1 / -1',
    fontFamily: 'Syne, sans-serif',
    fontSize: 16,
    fontWeight: 700,
    color: '#f0ece6',
  },
  formActions: { gridColumn: '1 / -1', display: 'flex', gap: 10, flexWrap: 'wrap' },
  actionBtns: { display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' },
  editBtn: {
    padding: '6px 14px', borderRadius: 7,
    background: 'rgba(232,197,71,0.12)', border: '1px solid rgba(232,197,71,0.25)',
    color: '#e8c547', cursor: 'pointer', fontSize: 12, fontWeight: 600,
    fontFamily: 'Syne, sans-serif',
  },
  cancelEditBtn: {
    padding: '12px 24px',
    background: 'rgba(255,255,255,0.06)', color: '#f0ece6',
    border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8,
    fontFamily: 'Syne, sans-serif', fontWeight: 700, cursor: 'pointer',
  },
  catAdd: { display: 'flex', gap: 12, marginBottom: 24 },
  catInput: {
    flex: 1, padding: '12px 16px',
    background: '#13131a', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10, color: '#f0ece6',
    fontFamily: 'DM Sans, sans-serif', fontSize: 15, outline: 'none',
  },
  catBtn: {
    padding: '12px 24px',
    background: '#e8c547', color: '#0a0a0f',
    border: 'none', borderRadius: 8,
    fontFamily: 'Syne, sans-serif', fontWeight: 700, cursor: 'pointer',
  },
  catList: { background: '#13131a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, overflow: 'hidden' },
  catRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)',
    color: '#f0ece6', fontFamily: 'DM Sans, sans-serif',
  },
};

export default Admin;
