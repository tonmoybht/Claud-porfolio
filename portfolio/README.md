# Tonmoy Bhattacharjee — Portfolio (MERN Stack)

A full-stack portfolio built with **MongoDB · Express.js · React 18 · Node.js**.

---

## 🗂 Project Structure

```
portfolio/
├── server/
│   ├── middleware/logger.js     # Colorized request logger
│   ├── models/Contact.js        # Mongoose schema
│   ├── routes/contact.js        # POST + GET /api/contact
│   ├── routes/projects.js       # GET /api/projects (GitHub pins)
│   ├── server.js                # Express entry — API + static serving
│   └── .env.example
│
├── client/
│   ├── public/favicon.svg
│   └── src/
│       ├── components/
│       │   ├── Loader.jsx       # Animated splash screen
│       │   ├── Navbar.jsx       # Fixed nav + scroll progress bar
│       │   ├── Hero.jsx         # Typing animation, avatar, CTAs
│       │   ├── Skills.jsx       # Animated skill cards
│       │   ├── Experience.jsx   # Work history
│       │   ├── Projects.jsx     # Fetched from /api/projects
│       │   ├── Education.jsx    # Degrees + certifications
│       │   ├── Contact.jsx      # Form → POST /api/contact
│       │   └── Footer.jsx
│       ├── pages/Admin.jsx      # /admin — contact message inbox
│       ├── hooks/index.js       # useProjects, useScrollProgress
│       ├── utils/api.js         # Axios client
│       └── App.jsx              # Router + Loader + AnimatePresence
│
├── Procfile                     # Railway / Heroku
└── package.json                 # Root: dev, build, start scripts
```

---

## 🚀 Quick Start

### 1. Install everything
```bash
npm run install:all
```

### 2. Set up environment
```bash
cd server && cp .env.example .env
# Edit .env: set MONGO_URI to your MongoDB connection string
```

### 3. Run in development
```bash
# From project root — starts Express :5000 + Vite :3000
npm run dev
```

Open **http://localhost:3000** · Admin at **http://localhost:3000/admin**

---

## 🔌 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Server + DB status |
| GET | `/api/projects` | All pinned projects |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/contact` | List messages (admin) |

---

## 🏗 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router v6, Framer Motion |
| Build | Vite 5 |
| Backend | Node.js, Express 4 |
| Database | MongoDB, Mongoose 8 |
| Validation | express-validator |

---

## 🌐 Deploy to Railway (free)

1. Push to GitHub
2. Railway → New Project → Deploy from repo
3. Add env vars: `MONGO_URI`, `NODE_ENV=production`
4. Done — Railway picks up `Procfile` automatically

---

## ✨ Features

- Animated loader · scroll progress bar · typewriter hero
- Framer Motion scroll-reveal throughout
- Contact form saved to MongoDB with validation
- Admin inbox at `/admin` to read all messages
- Rate limiting on all API routes
- Single Express server serves both API + React in production
- Fully responsive, dark editorial design

---

**Tonmoy Bhattacharjee** · tonmoybht985@gmail.com · [github.com/tonmoybht](https://github.com/tonmoybht)
