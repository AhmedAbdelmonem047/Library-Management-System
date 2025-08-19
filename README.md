# 📚 Route Academy — Backend Node.js Exam: Library Management System

A  **Library Management System** built using **Node.js, Express, MongoDB/Mongoose, Joi, Bcrypt, and JWT**.  
to build secure RESTful APIs to manage **users, books, and transactions**, with robust validation, authentication, and error handling.  
This README contains everything needed to set up, and run the project.

---

## ✨ Key Features

- **Auth & Security**: JWT authentication, Bcrypt password hashing, Joi validation, input sanitization (Mongo injection safe), rate-limited login.
- **Users**: Register, Login, Get Profile.
- **Books**: CRUD, list all, advanced search (`title`/`author` partial match), pagination, sorting.
- **Transactions**: Borrow, Return, View user transactions, Admin: view all with filters & sorting.
- **RBAC (Bonus)**: Admin-only routes & user-owned restrictions.
- **Clean Architecture**: Modular routers, controllers, services, middlewares, models.
- **Consistent Errors**: Centralized error handler with JSON responses.

---

## 🧱 Database Schemas (structure only)

> **Note:** Below is the required structure (no code). You may implement with Mongoose.

### User
- `email`: **String**, required, unique
- `password`: **String**, required (hashed)
- `name`: **String**, required
- `role`: **String**, required, enum: `['admin', 'member']`
- `createdAt`: **Date**, default: now

### Book
- `title`: **String**, required
- `author`: **String**, required
- `publishedYear`: **Number**, required
- `availableCopies`: **Number**, required, default: `1`
- `createdAt`: **Date**, default: now

### Transaction
- `userId`: **ObjectId** (ref **User**), required
- `bookId`: **ObjectId** (ref **Book**), required
- `borrowDate`: **Date**, required, default: now
- `returnDate`: **Date**, optional
- `status`: **String**, required, enum: `['borrowed', 'returned']`

---

## 🗂️ Recommended Project Structure

```
src/
  config/
    .env
  DB/
    models/
      user.model.js
      book.model.js
      transaction.model.js
    connectionDb.js
  middlewares/
    authentication.js
    authorization.js
    globalErrorHandling.js
    inputSanitization.js
    rateLimiter.js
    validation.js
  modules/
    books/
      books.controller.js
      books.service.js
      books.validation.js
    transactions/
      transactions.controller.js
      transactions.service.js
      transactions.validation.js
    users/
      users.controller.js
      users.service.js
      users.validation.js
  utils/
    general_rules/
      index.js
    hash/
      index.js
    token/
      index.js
    index.js
  app.controller.js
index.js
```

---

## ⚙️ Setup & Run

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local or Atlas)

### 1) Clone & Install
```bash
git clone https://github.com/AhmedAbdelminem047/Library-Managemnet-System.git
cd <your-repo>
npm install
```

### 2) Environment Variables
Create a `.env` file in the project root:
```env
PORT = "3000"
DB_URL ="mongodb://127.0.0.1:27017/<DB_NAME>"
SALT_ROUNDS = "10"
SECRET_KEY = "SecretKey"
ACCESS_TOKEN_USER = "AccessToken"
ACCESS_TOKEN_ADMIN = "AccessTokenAdmin"
REFRESH_TOKEN_USER = "RefreshToken"
REFRESH_USER_ADMIN = "RefreshTokenAdmin"

```

### 3) Run
```bash
# dev
npm run dev

# prod
npm run start
```

Server runs at: `http://localhost:3000`

---

## 🔐 Security & Middleware

### JWT Auth (required for all routes except register/login)
- Header: `Authorization: bearer/admin <token>`

### Bcrypt Passwords
- Hash on register, compare on login

### Joi Validation
- Validate `req.body` / `req.query` with schemas
- On fail → `400 Bad Request`

### Input Sanitization (Mongo injection safe)
Use a safe sanitizer that **does not** reassign `req.query` (compatible with Express v5):
```js
// sanitize.middleware.js
function scrub(obj) {
  if (!obj || typeof obj !== 'object') return;
  for (const k of Object.keys(obj)) {
    if (k.startsWith('$') || k.includes('.')) delete obj[k];
    else scrub(obj[k]);
  }
}
export function mongoSanitize(req, res, next) {
  scrub(req.body); scrub(req.query); scrub(req.params);
  next();
}
```

### Rate Limiting (login only)
```js
// rateLimit.middleware.js
import rateLimit from 'express-rate-limit';
export const loginLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  max: Number(process.env.RATE_LIMIT_MAX || 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please try again later.' }
});
```
Apply to `POST /api/users/login` only.

### 404 & Error Handler (Express v5)
```js
// after all routes
app.use((req, res) => {
  res.status(404).json({ message: `URL not found: ${req.originalUrl}` });
});

// global error handler
app.use((err, req, res, next) => {
  const status = err.statusCode || err.status || 500;
  res.status(status).json({ message: err.message || 'Internal Server Error' });
});
```

## 🧰 Testing (Postman / curl)
Postman Collection: https://documenter.getpostman.com/view/42236168/2sB3BGJAac

## 📄 License

MIT — feel free to use this structure for your projects.
