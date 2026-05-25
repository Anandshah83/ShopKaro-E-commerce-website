import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
});

export const API_ORIGIN = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1').replace(/\/api\/v1\/?$/, '');

export const getImageUrl = (image) => {
  if (!image) return '';
  if (/^https?:\/\//i.test(image) || image.startsWith('data:')) return image;
  return `${API_ORIGIN}/uploads/${encodeURIComponent(image)}`;
};

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);

// Products
export const getProducts = (params) => API.get('/products', { params });
export const getProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);
export const uploadProductImage = (id, formData) => API.post(`/products/${id}/upload`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

// Categories
export const getCategories = () => API.get('/category');
export const getCategory = (id) => API.get(`/category/${id}`);
export const createCategory = (data) => API.post('/category', data);
export const updateCategory = (id, data) => API.put(`/category/${id}`, data);
export const deleteCategory = (id) => API.delete(`/category/${id}`);

// Users
export const getUsers = () => API.get('/users');
export const getUser = (id) => API.get(`/users/${id}`);
export const updateUser = (id, data) => API.put(`/users/${id}`, data);
export const deleteUser = (id) => API.delete(`/users/${id}`);

// Reviews
export const getReviews = (productId) => API.get(`/reviews/${productId}`);
export const createReview = (productId, data) => API.post(`/reviews/${productId}`, data);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);

// Orders
export const createOrder = (data) => API.post('/orders', data);
export const getMyOrders = () => API.get('/orders/my-orders');
export const getOrder = (id) => API.get(`/orders/${id}`);
export const getAllOrders = () => API.get('/orders/all');
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });

// Payments
export const createPaymentOrder = (data) => API.post('/payment/create-order', data);
export const verifyPayment = (data) => API.post('/payment/verify', data);

// Admin
export const adminGetUsers = () => API.get('/admin/users');
export const adminDeleteUser = (id) => API.delete(`/admin/users/${id}`);
export const adminGetProducts = () => API.get('/admin/products');
export const adminDeleteProduct = (id) => API.delete(`/admin/products/${id}`);
export const adminUpdateProduct = (id, data) => API.put(`/admin/products/${id}`, data);

export default API;
