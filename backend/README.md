# 🛍️ Product Management REST API

> A production-grade RESTful API built from scratch over 20+ days of active development. This project is actively being developed with new features added regularly.

---

## 📌 Project Status

🟢 **Backend Complete — React Frontend In Progress**

| Phase | Status |
|-------|--------|
| MVC Architecture | ✅ Complete |
| Project Setup | ✅ Complete |
| Models (Product, Category, User) | ✅ Complete |
| Controllers | ✅ Complete |
| Routes with API Versioning | ✅ Complete |
| Input Validation | ✅ Complete |
| Custom Middleware (Logger, Auth) | ✅ Complete |
| Error Handling Middleware | ✅ Complete |
| File Uploads with Multer | ✅ Complete |
| Security (Helmet, CORS, Rate Limiting) | ✅ Complete |
| MongoDB + Mongoose Integration | ✅ Complete |
| JWT Authentication + bcrypt | ✅ Complete |
| Role Based Access Control | ✅ Complete |
| Reviews System | ✅ Complete |
| Payment Integration (Razorpay) | ✅ Complete |
| Seeder File | ✅ Complete |
| Admin Dashboard | ✅ Complete |
| Search, Filtering & Pagination | ✅ Complete |
| Order Management | ✅ Complete |
| React Frontend | 🔄 In Progress |

---

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT (jsonwebtoken) + bcrypt
- **File Uploads:** Multer
- **Payment:** Razorpay
- **Security:** Helmet, CORS, express-rate-limit
- **Environment:** dotenv
- **Dev Tools:** nodemon

---

## 📁 Project Structure

```
product-api/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── category.controller.js
│   │   ├── user.controller.js
│   │   ├── review.controller.js
│   │   ├── payment.controller.js
│   │   └── order.controller.js
│   ├── models/
│   │   ├── product.model.js
│   │   ├── category.model.js
│   │   ├── user.model.js
│   │   ├── review.model.js
│   │   └── order.model.js
│   ├── routes/
│   │   ├── auth.route.js
│   │   ├── product.route.js
│   │   ├── category.route.js
│   │   ├── user.route.js
│   │   ├── review.route.js
│   │   ├── payment.route.js
│   │   ├── order.route.js
│   │   └── admin.route.js
│   ├── middleware/
│   │   ├── logger.js
│   │   ├── auth.js
│   │   ├── role.js
│   │   └── errorHandler.js
│   ├── config/
│   │   ├── db.js
│   │   └── multer.js
│   ├── data/
│   │   └── seeder.js
│   └── app.js
├── uploads/
├── .env.example
├── .gitignore
├── server.js
└── package.json
```

---

## 🔗 API Endpoints

### Auth Routes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/v1/auth/signup | Register new user | No |
| POST | /api/v1/auth/login | Login and get JWT token | No |

### Product Routes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/v1/products | Get all products (search & pagination) | No |
| GET | /api/v1/products/:id | Get product by ID | No |
| POST | /api/v1/products | Create product | Yes |
| PUT | /api/v1/products/:id | Update product | Yes |
| DELETE | /api/v1/products/:id | Delete product | Yes |
| POST | /api/v1/products/:id/upload | Upload product image | Yes |

### Category Routes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/v1/category | Get all categories | No |
| GET | /api/v1/category/:id | Get category by ID | No |
| POST | /api/v1/category | Create category | No |
| PUT | /api/v1/category/:id | Update category | No |
| DELETE | /api/v1/category/:id | Delete category | No |

### User Routes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/v1/users | Get all users | No |
| GET | /api/v1/users/:id | Get user by ID | No |
| PUT | /api/v1/users/:id | Update user | No |
| DELETE | /api/v1/users/:id | Delete user | No |

### Review Routes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/v1/reviews/:id | Get all reviews for a product | No |
| POST | /api/v1/reviews/:id | Create a review | Yes |
| DELETE | /api/v1/reviews/:id | Delete a review | Yes |

### Order Routes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/v1/orders | Create an order | Yes |
| GET | /api/v1/orders/my-orders | Get logged in user's orders | Yes |
| GET | /api/v1/orders/:id | Get order by ID | Yes |
| PUT | /api/v1/orders/:id/status | Update order status | Admin |
| GET | /api/v1/orders/all | Get all orders | Admin |

### Payment Routes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/v1/payment/create-order | Create Razorpay order | Yes |
| POST | /api/v1/payment/verify | Verify payment signature | Yes |

### Admin Routes
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | /api/v1/admin/users | Get all users | Admin |
| DELETE | /api/v1/admin/users/:id | Delete any user | Admin |
| GET | /api/v1/admin/products | Get all products | Admin |
| DELETE | /api/v1/admin/products/:id | Delete any product | Admin |
| PUT | /api/v1/admin/products/:id | Update any product | Admin |

---

## ⚙️ Setup & Installation

```bash
# Clone the repository
git clone https://github.com/SatishRana8791/product-api.git

# Navigate to project folder
cd product-api

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Fill in your values in .env

# Run in development mode
npm run dev

# Seed sample data
npm run seed
```

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/product-api
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

---

## 🛡️ Security Features

- Passwords hashed with **bcrypt** before storing in database
- JWT tokens expire after 7 days
- **Helmet** sets secure HTTP headers
- **CORS** configured for cross-origin requests
- **Rate limiting** — max 100 requests per 15 minutes per IP
- Protected routes require valid JWT token
- Admin routes protected by role-based access control

---

## 📅 Development Log

This project is being built day by day as part of a structured mentorship program learning backend development from scratch.

- **Week 1** — MVC architecture, project setup, models
- **Week 2** — Controllers, routes, input validation, middleware
- **Week 3** — Error handling, file uploads, security, MongoDB integration
- **Week 4** — JWT authentication, bcrypt, role-based access control
- **Week 5** — Reviews, Razorpay payments, admin dashboard, search, pagination, order management
- **Coming up** — React frontend

---

## 👨‍💻 Author

**Satish Rana**
- GitHub: [@SatishRana8791](https://github.com/SatishRana8791)

---

> ⭐ This project is actively maintained and updated daily.