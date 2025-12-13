<!--
  Artify - Full-stack Artist Community & Marketplace
  Production-ready, developer-friendly README for the repository root.
-->

# 🎨 Artify — Artist Community & Marketplace

> A full-stack platform for artists to showcase work, discover gigs and teachers, and buy/sell second-hand musical instruments.

Built as a modern web application with a React frontend and a Node/Express + MongoDB backend. This repository contains two top-level projects: `client/` (frontend) and `server/` (backend).

---

## 🧭 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Summary](#api-summary)
- [Development Scripts](#development-scripts)
- [Contributing](#contributing)
- [Author](#author)

---

## 🔍 Overview

Artify is a community-first marketplace where musicians and performing artists can connect, find events, discover teachers, and trade instruments. The platform supports role-based users (regular users and sellers), secure authentication, geo-based shop discovery, and a simple marketplace for listings.

This repository contains:
- `client/` — React frontend (UI, pages, components)
- `server/` — Node.js + Express backend (APIs, authentication, database models)

## ✨ Features

- Secure authentication with JWT and token blacklist
- Role-based access control (User, Seller)
- User profile creation and skills showcase
- Seller onboarding and item/shop listings
- GeoJSON-based nearby shop discovery
- Responsive React frontend with Tailwind CSS

## 🛠️ Tech Stack

- Frontend: React, Tailwind CSS, Axios
- Backend: Node.js, Express, Mongoose
- Database: MongoDB Atlas
- Auth & Security: JWT, bcrypt, cookie-parser, CORS

---

## 🚀 Installation (Quick Start)

Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB Atlas account or any MongoDB connection

Clone the repository

```bash
git clone https://github.com/NitishCodeMaster/Artify.git
cd Artify
```

Install and run the backend

```pwsh
cd server
npm install
# create and configure .env (see Environment Variables below)
npm run dev   # starts server with nodemon (development)
```

Install and run the frontend

```pwsh
cd client
npm install
npm run dev   # or `npm start` depending on the client setup
```

Open the frontend in the browser (likely `http://localhost:3000` or `http://localhost:5173` depending on the client) and the API at `http://localhost:5000` (or the `PORT` you configured).

---

## 🔐 Environment Variables

Create a `.env` file in `server/` and (if required) in `client/`.

Server (`server/.env`) - example keys:

```text
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
COOKIE_SECRET=your_cookie_secret
```

Client environment variables vary by toolchain:
- For Create React App: use `REACT_APP_API_URL=http://localhost:5000`
- For Vite: use `VITE_API_URL=http://localhost:5000`

Keep secrets out of version control. Consider adding a `.env.example` documenting keys (without real secrets).

---

## 🗂️ Project Structure

Top-level layout:

```
Artify/
├─ client/        # React frontend (UI)
├─ server/        # Node + Express backend (APIs)
│   ├─ config/    # DB and config
│   ├─ controllers/# Business logic
│   ├─ middleware/ # auth, error handlers
│   ├─ models/    # Mongoose models
│   ├─ routes/    # Express routes
│   └─ server.js  # app entrypoint
└─ README.md      # <-- you are here
```

Refer to `server/README.md` for backend-specific details and `client/README.md` (if present) for frontend setup.

---

## 📡 API Summary

This is a concise overview. For full details, read the route files in `server/routes/` and controllers in `server/controllers/`.

Auth & User

- `POST /users/register` — Register a new user
- `POST /users/login` — Login (returns JWT / sets cookie)
- `POST /users/logout` — Logout (blacklist token)
- `GET /users/me` — Get current user's profile (protected)
- `PUT /users/profile` — Update user profile (protected)

Seller & Marketplace

- `POST /sellers/register` — Register as a seller
- `POST /sellers/create-listing` — Create an item or shop listing (protected)
- `GET /sellers/nearby` — Find nearby shops / sellers (GeoJSON query)

Notes
- Protected endpoints require a valid JWT and appropriate role. Check `server/middleware/authMiddleware.js` for details.

---

## ⚙️ Development Scripts

Common scripts you will use (verify `package.json` files inside `client/` and `server/`):

- `npm install` — install dependencies
- `npm run dev` — start development server (frontend or backend)
- `npm start` — production start

Example: start both services (open two terminals)

```pwsh
# Terminal A
cd server
npm run dev

# Terminal B
cd client
npm run dev
```

---

## 🤝 Contributing

We welcome contributions. Please follow this workflow:

1. Fork the repository and create a descriptive branch (`feature/your-feature`, `fix/issue-description`).
2. Keep changes focused and add tests where applicable.
3. Ensure code style and linting pass.
4. Open a PR against `main` with a clear description and linked issue (if any).

Guidelines
- Write clear commit messages.
- Keep secrets out of commits.
- Add documentation updates for public-facing changes to the README or route docs.

---

## 💬 Author

Nitish Kumar — Full-Stack Developer & Music Enthusiast

If you like this project, please give it a ⭐ on GitHub and consider opening issues or PRs for improvements.

---

If you'd like, I can also:
- add a `server/.env.example` and `client/.env.example`,
- generate an OpenAPI (Swagger) spec from the routes,
- or create a `CONTRIBUTING.md` with a template PR checklist.
