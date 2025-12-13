🎨 Artify — Artist Community & Marketplace 

Artify is a full-stack web application designed for artists to showcase skills, find events, and buy/sell second-hand musical instruments.
It helps artists discover gigs, jamming sessions, teachers, and connect with the artist community.

🚀 Features
🔐 Authentication

User & Seller registration

Secure login with JWT

---
# 🎨 Artify — Backend (Server)

Backend-focused documentation for the Artify project. This file documents how to run, develop, and secure the Node/Express server powering the Artify platform.

## 🧭 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Security](#security)
- [Quick Setup](#quick-setup)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Summary](#api-summary)
- [Usage & Scripts](#usage--scripts)
- [Troubleshooting](#troubleshooting)
- [Author](#author)

---

## 🔍 Overview

Artify backend provides REST APIs for authentication, user & seller profiles, marketplace listings, and geo-based shop discovery. The server uses MongoDB (Atlas) for persistence and focuses on simple, secure endpoints that support the React frontend.

## ✨ Features

- JWT-based authentication with token blacklist for safe logout
- Role-based access control (User / Seller)
- User profile management and avatar upload hooks
- Seller onboarding and item/shop listings
- GeoJSON-powered nearby shop search
- Secure password hashing and cookie-based session handling

## 🛠️ Tech Stack

- Node.js + Express
- MongoDB (Atlas) with Mongoose ODM
- Authentication: JSON Web Tokens (JWT)
- Security utilities: bcrypt, cookie-parser, cors, helmet (if present)
- Dev tools: nodemon, dotenv

## 🔐 Security

Security is a primary concern for the backend. Key measures implemented (or recommended):

- Password hashing: All user passwords MUST be hashed with `bcrypt` before storage. Use a secure salt rounds value (e.g., 10–12).
- JWT: Access tokens are signed with `JWT_SECRET`. Tokens contain minimal user info (id, role) and short expiration.
- Token blacklist: On logout, tokens are stored (blacklisted) to prevent reuse until expiry.
- Cookies: Tokens may be returned in HttpOnly cookies to mitigate XSS. If you set cookies, use `HttpOnly`, `Secure` (production), and `SameSite` attributes.
- Transport: Always run the server behind HTTPS in production to protect JWT and password transport.

Example (password hash + compare):

```js
// Hashing
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash(password, 10);

// Verify
const ok = await bcrypt.compare(candidatePassword, user.passwordHash);
```

Example (issuing JWT):

```js
const jwt = require('jsonwebtoken');
const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
```

---

## 🚀 Quick Setup

Prerequisites
- Node.js (v16+ recommended)
- npm (or yarn)
- MongoDB connection (Atlas recommended)

Start locally (PowerShell)

```pwsh
cd server
npm install
# create a `.env` per the section below
npm run dev    # starts server with nodemon
```

The server listens on `PORT` (default 5000). Endpoints are available at `http://localhost:${process.env.PORT || 5000}`.

## ⚙️ Environment Variables

Create `server/.env` with the following keys (example):

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/artify?retryWrites=true&w=majority
JWT_SECRET=supersecret_jwt_key
COOKIE_SECRET=optional_cookie_secret
NODE_ENV=development
```

Notes
- Use a separate production `.env` and never commit secrets.
- Consider using a secret manager (AWS Secrets Manager, Azure Key Vault, etc.) for production.

---

## 🗂️ Project Structure

```
server/
├─ config/
│  └─ db.js                # DB connection
├─ controllers/
│  ├─ userController.js
│  └─ sellerController.js
├─ middleware/
│  └─ authMiddleware.js    # JWT verification, role checks
├─ models/
│  ├─ userModel.js
│  ├─ sellerModel.js
│  └─ blacklistTokenModel.js
├─ routes/
│  ├─ userRoutes.js
│  └─ sellerRoutes.js
├─ utils/
│  └─ validators.js        # optional
├─ server.js               # app entrypoint
└─ package.json
```

Open the files above to find route definitions, controllers, and model schemas.

---

## 📡 API Summary

This summary lists primary endpoints. See `routes/` for exact route parameters and request/response shapes.

Auth & User

- `POST /users/register` — Register a new user
	- Body: `{ name, email, password, ... }`
- `POST /users/login` — Login; returns JWT (or sets HttpOnly cookie)
	- Body: `{ email, password }`
- `POST /users/logout` — Logout; blacklists token
- `GET /users/me` — Get current user (protected)
- `PUT /users/profile` — Update user profile (protected)

Seller & Marketplace

- `POST /sellers/register` — Register as seller
- `POST /sellers/create-listing` — Create listing (protected by seller role)
- `GET /sellers/nearby` — Geo-based seller/shop search

Protection & roles
- Protected routes require `Authorization: Bearer <token>` header or HttpOnly cookie.
- Role checks typically use `req.user.role` set by the auth middleware.

---

## Usage & Scripts

Check `package.json` for exact scripts. Common scripts used during development:

- `npm run dev` — Start server with `nodemon` (development)
- `npm start` — Start server (production)
- `npm test` — Run tests (if available)

Example: run the server with environment variables in PowerShell

```pwsh
$env:PORT=5000; $env:MONGO_URI='your_uri'; npm run dev
```

Basic request examples (curl)

```bash
# Register
curl -X POST http://localhost:5000/users/register \
	-H "Content-Type: application/json" \
	-d '{"name":"Alice","email":"a@example.com","password":"Secret123"}'

# Login
curl -X POST http://localhost:5000/users/login \
	-H "Content-Type: application/json" \
	-d '{"email":"a@example.com","password":"Secret123"}'
```

---

## Troubleshooting

- nodemon exits with code 1: run `node server.js` to see the full stack trace and check that `MONGO_URI` and `JWT_SECRET` are set.
- MongoDB connection errors: verify `MONGO_URI` and IP/network access on Atlas.
- Auth errors: check token formation, secret parity between token issuer and verifier, and token expiry.

If you'd like, I can run the server here and show logs to help debug the `nodemon server.js` failure you saw earlier.

---

## 🧑‍💻 Author

Nitish Kumar — Full-Stack Developer & Music Enthusiast

If this backend helps you, please ⭐ the repo and contribute improvements via PRs.

---
