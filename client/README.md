# 📝 Keeper — A Full-Stack Google Keep Clone

A production-style note-taking application built from the ground up with a **React frontend**, **Node.js/Express backend**, and **PostgreSQL (Neon)** database. Supports email/password authentication, Google OAuth2 login, full notes CRUD, and a custom dark/light theme system.

> Built as a hands-on project to apply backend skills (Node.js, REST APIs, PostgreSQL, JWT, OAuth2) alongside React frontend development.

---

## 🚀 Live Demo

| | Link |
|---|---|
| Frontend | *[https://google-keep-clone-self-iota.vercel.app/]* |
| Backend API | *[https://google-keep-clone-6mu2.onrender.com]* |

---

## ✨ Features

- 🔐 **Dual authentication** — Email/password (bcrypt + JWT) and Google OAuth2 (Passport.js)
- 📝 **Full notes CRUD** — Create, read, update, delete, with pin/unpin support
- 🎨 **Dark / Light mode** — Persisted via `localStorage`, respects system preference on first load
- 🛡️ **Protected routes** — Both frontend (React Router guards) and backend (JWT middleware)
- 👤 **User-scoped data** — Each user only sees their own notes, enforced at the database query level
- 📱 **Responsive design** — Works cleanly on mobile and desktop
- 🎯 **Custom design system** — Paper-inspired sticky-note aesthetic, not a default UI library look

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React.js (Vite) | UI library + fast build tooling |
| React Router DOM | Client-side routing & protected routes |
| Axios | HTTP client with request interceptors |
| Context API | Global state (auth, theme) without prop drilling |
| Custom CSS | Hand-built design system using CSS variables |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| PostgreSQL (Neon) | Relational database, serverless hosting |
| Passport.js | Google OAuth2 strategy |
| bcrypt | Password hashing |
| jsonwebtoken (JWT) | Stateless authentication |
| express-session | Required for the OAuth2 handshake |

---

## 🏗️ Architecture

```
┌──────────────────┐         REST API (JSON)        ┌───────────────────┐
│   React Frontend  │ ◀─────────────────────────────▶ │  Express Backend   │
│   (Vite, :5173)   │     Axios + JWT in headers      │   (Node, :5000)    │
└──────────────────┘                                  └─────────┬──────────┘
                                                                  │
                                                                  ▼
                                                        ┌───────────────────┐
                                                        │  PostgreSQL (Neon) │
                                                        │  users / notes     │
                                                        └───────────────────┘
```

The frontend and backend are **fully decoupled** — separate `package.json`, separate `node_modules`, separate deployments. This mirrors how real full-stack applications are structured and deployed in production.

---

## 🔑 Authentication Flow

### Email / Password
```
Signup → bcrypt hashes password → stored in PostgreSQL → JWT issued
Login  → bcrypt compares password → JWT issued on match
```

### Google OAuth2
```
"Continue with Google" clicked
        ↓
Browser redirected to Google consent screen
        ↓
User approves → Google redirects to backend callback
        ↓
Passport.js verifies profile, finds/creates user in DB
        ↓
Backend issues its OWN JWT (same as email/password flow)
        ↓
Browser redirected to frontend with token in URL
        ↓
Frontend extracts token, logs user in via shared AuthContext
```

**Design decision:** Regardless of how a user authenticates, the rest of the application only ever deals with a single, consistent JWT. This keeps authorization logic simple and avoids branching based on login method.

---

## 🗄️ Database Schema

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200),
    content TEXT,
    color VARCHAR(20) DEFAULT '#ffffff',
    is_pinned BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notes_user_id ON notes(user_id);
```

**Design decisions:**
- `ON DELETE CASCADE` — deleting a user automatically removes their notes
- `password` and `google_id` are both nullable since a user authenticates via exactly one method
- Index on `user_id` — keeps note fetches fast as data grows

---

## 📌 API Endpoints

### Auth
| Method | Endpoint | Description | Protected |
|---|---|---|---|
| POST | `/api/auth/signup` | Register with email/password | No |
| POST | `/api/auth/login` | Login with email/password | No |
| GET | `/api/auth/google` | Initiate Google OAuth2 flow | No |
| GET | `/api/auth/google/callback` | Google OAuth2 callback handler | No |

### Notes
| Method | Endpoint | Description | Protected |
|---|---|---|---|
| GET | `/api/notes` | Get all notes for logged-in user | Yes (JWT) |
| POST | `/api/notes` | Create a new note | Yes (JWT) |
| PUT | `/api/notes/:id` | Update a note | Yes (JWT) |
| DELETE | `/api/notes/:id` | Delete a note | Yes (JWT) |

---

## 📁 Project Structure

```
Google-Keep-Clone/
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js         # Axios instance, auto-attaches JWT
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # Global auth state
│   │   │   └── ThemeContext.jsx # Dark/light mode state
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── OAuthSuccess.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── CreateNote.jsx
│   │   │   └── NoteCard.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
├── server/
│   ├── config/
│   │   ├── db.js
│   │   └── passport.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── notesController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── notesRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- A [Neon](https://neon.tech) PostgreSQL database (free tier)
- A [Google Cloud](https://console.cloud.google.com) OAuth2 Client ID & Secret

### 1. Clone the repository

```bash
git clone https://github.com/ASHxKING/Google-Keep-Clone.git
cd Google-Keep-Clone
```

### 2. Backend setup

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```env
DATABASE_URL=your_neon_connection_string
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
PORT=5000
```

Start the server:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd ../client
npm install
npm run dev
```

Visit `http://localhost:5173`

---

## 🔒 Security Highlights

- Passwords hashed with **bcrypt** (10 salt rounds), never stored in plain text
- **JWT** tokens expire after 7 days, verified on every protected request
- **CORS** explicitly scoped to the frontend origin, not wildcard
- Notes scoped per user at the **SQL query level** — no user can access another's data
- Credentials and connection strings kept out of version control via `.gitignore`

---

## 📚 What I Learned Building This

- Designing a relational schema with foreign keys and cascading deletes
- Full request lifecycle between decoupled frontend and backend (CORS, JWT headers, Axios interceptors)
- Implementing both stateless (JWT) and stateful (OAuth2 handshake) authentication in the same app
- Using React Context API for both authentication and theming without prop drilling
- Structuring a project the way real companies separate frontend/backend deployments

---

## 🚧 Future Improvements

- [ ] Search and filter notes
- [ ] Note color picker (schema already supports it)
- [ ] Archive view
- [ ] Rich text formatting
- [ ] Unit tests (Jest) for backend controllers

---

## 👤 Author

**Aashish Kumar** — Backend-Heavy Full-Stack Engineer

- 🔗 [LinkedIn](https://www.linkedin.com/in/ash0904/)
- 💻 [GitHub](https://github.com/ASHxKING)
- 📧 ashish.ak26@gmail.com

---

## 📄 License

MIT License — free to use as a reference for your own learning.
