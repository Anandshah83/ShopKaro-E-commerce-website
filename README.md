# 🛍️ ShopKaro — Full Stack E-Commerce App

A complete full-stack e-commerce application with a production-grade Node.js REST API backend and a beautiful React frontend.

---

## 📁 Project Structure

```
product-api-fullstack/
├── backend/          ← Node.js + Express + MongoDB API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── app.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/         ← React 18 Frontend
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── context/
    │   └── utils/
    ├── public/
    └── package.json
```

---

## 🚀 Quick Start

### 1. Start the Backend

```bash
cd backend
npm install
# Edit .env with your values
npm run dev
# Backend runs at http://localhost:5000
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm start
# Frontend runs at http://localhost:3000
```

---

## 🌟 Frontend Features

| Feature | Description |
|---------|-------------|
| 🏠 Homepage | Hero banner, stats, categories, featured products |
| 🛍️ Products | Grid with search, filter, sort, pagination |
| 📦 Product Detail | Images, reviews, add to cart, rating |
| 🔐 Auth | JWT-based Login & Signup |
| 🛒 Cart | Add/remove items, quantity, persistent |
| 💳 Checkout | Razorpay payment + COD fallback |
| 📋 My Orders | Order history with status |
| 👤 Profile | Update profile info |
| 🔧 Admin Panel | Manage users, products, orders, categories |

---

## 👨‍💻 Author

**Anand Shah** — [@Anandshah83](https://github.com/Anandshah83)
