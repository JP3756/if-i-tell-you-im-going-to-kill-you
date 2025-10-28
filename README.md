# 🔒 CLANDESTINE

**A private, invitation-only social app exclusively for Don Bosco Technical College students.**

> "No names. No tracking. No footprints."

---

## 🎯 Overview

Clandestine is a privacy-first, ephemeral social network designed for DBTC students. Built on principles of anonymity, security, and trust, it offers:

- **QR-based invitation system** - No public registration
- **Zero personal data collection** - No emails, no phones, no tracking
- **Ephemeral posts** - Auto-delete after 24 hours
- **Minimal design** - Dark, fast, and exclusive
- **Complete privacy** - No analytics, no third-party scripts

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 19
- React Router (navigation)
- Tailwind CSS (styling)
- Vite (build tool)

**Backend:**
- Node.js + Express
- SQLite (local database)
- better-sqlite3 (database driver)
- QRCode (invitation generation)

**Security:**
- Session-based authentication
- No IP logging
- Strict CSP headers
- No external resources

---

## 📁 Project Structure

```
clandestine/
├── backend/                 # Node.js backend
│   ├── routes/
│   │   ├── invite.js       # QR invitation endpoints
│   │   ├── auth.js         # Authentication (username only)
│   │   └── posts.js        # Ephemeral posts system
│   ├── database.js         # SQLite setup & schema
│   ├── server.js           # Express server
│   ├── package.json
│   └── .env.example
│
└── vite-project/           # React frontend (rename to 'frontend' if desired)
    ├── src/
    │   ├── pages/
    │   │   ├── Landing.jsx    # Entry page
    │   │   ├── Invite.jsx     # Token validation
    │   │   ├── Signup.jsx     # Username creation
    │   │   ├── Manifesto.jsx  # Privacy creed
    │   │   ├── Feed.jsx       # Main app (posts)
    │   │   └── Admin.jsx      # QR generation
    │   ├── api.js             # Backend API client
    │   ├── App.jsx            # Main router
    │   └── index.css          # Tailwind styles
    ├── package.json
    └── .env.example
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### 1. Backend Setup

```powershell
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Edit .env and set your master token
# Example: MASTER_INVITE_TOKEN=your-secret-token-here

# Start backend server
npm start
```

Backend will run on `http://localhost:3000`

### 2. Frontend Setup

```powershell
# Navigate to frontend folder
cd vite-project

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 🔐 Initial Setup & Usage

### Step 1: Generate First Invitation

1. Open browser to `http://localhost:5173`
2. Click "Admin Access"
3. Enter your `MASTER_INVITE_TOKEN` from backend/.env
4. Click "Generate QR Invitation"
5. Download the QR code image

### Step 2: Create Your Account

1. Scan the QR code with your phone (or open the URL)
2. You'll be redirected to the invite validation page
3. Create a username (3-20 characters, alphanumeric + underscore)
4. Read the privacy manifesto
5. Access the feed

### Step 3: Share with Others

- Generate new QR codes for each student you want to invite
- Each QR code can only be used once
- Share physically or digitally

---

## 📖 Core Features Explained

### QR Invitation System

- **Master Token**: Admin uses this to generate invitations
- **Unique Tokens**: Each QR contains a one-time-use token
- **No Verification**: The invitation IS the verification
- **Single Use**: Token expires after one successful signup

### Username-Only Authentication

- No email required
- No phone verification
- No password (session-based)
- Username is the only identifier

### Ephemeral Posts

- All posts auto-delete after 24 hours
- Countdown timer shows time remaining
- Users can delete their own posts early
- No permanent record

### Privacy Guarantees

**We DO NOT collect:**
- Email addresses
- Phone numbers
- Real names
- IP addresses
- Location data
- Analytics/tracking data

**We ONLY store:**
- Username (chosen by user)
- Posts (deleted after 24h)
- Session tokens (temporary)

---

## 🌐 Deployment

### Backend Deployment (Render/Railway)

1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables:
   ```
   PORT=3000
   MASTER_INVITE_TOKEN=your-secure-token
   FRONTEND_URL=https://your-frontend-url.com
   SESSION_SECRET=another-secure-random-string
   ```

### Frontend Deployment (Vercel/Netlify)

1. Create new site from Git
2. Set root directory: `vite-project`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

### Important: CORS Configuration

Update backend `.env` with your production frontend URL:
```
FRONTEND_URL=https://clandestine.vercel.app
```

---

## 🛡️ Security Features

- **Strict CSP**: No external scripts or resources allowed
- **No Tracking**: Zero analytics or telemetry
- **Session Tokens**: Secure, temporary authentication
- **Input Validation**: All user input sanitized
- **Rate Limiting**: Prevent abuse (add middleware if needed)
- **HTTPS Only**: Enforce secure connections in production

---

## 🧪 Testing Locally

### Test the Full Flow:

1. Start both backend and frontend
2. Generate QR code via Admin panel
3. Open QR URL in new incognito window
4. Create account with username
5. View manifesto
6. Create posts in feed
7. Wait 24 hours or check database to verify auto-deletion

### Check Database:

```powershell
# In backend folder
npm install -g sqlite3
sqlite3 clandestine.db

# View tables
.tables

# View users
SELECT * FROM users;

# View posts with expiration
SELECT id, content, datetime(expires_at/1000, 'unixepoch') as expires FROM posts;

# Exit
.quit
```

---

## 📝 Environment Variables Reference

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `MASTER_INVITE_TOKEN` | Admin token for QR generation | `dbtc-secret-2025` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `SESSION_SECRET` | Session token encryption | Random string |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API endpoint | `http://localhost:3000/api` |

---

## 🎨 Customization

### Change Color Scheme

Edit `vite-project/tailwind.config.js`:

```js
colors: {
  'clandestine': {
    'darkest': '#0a0a0a',    // Background
    'blue': '#2563eb',        // Primary accent
    // ... modify as needed
  }
}
```

### Adjust Post Expiration Time

Edit `backend/routes/posts.js`:

```js
// Change from 24 hours to 12 hours
const expiresAt = now + (12 * 60 * 60 * 1000);
```

### Modify Post Length Limit

Edit `backend/routes/posts.js` and `vite-project/src/pages/Feed.jsx`:

```js
const maxLength = 1000; // Increase from 500
```

---

## 🔧 Troubleshooting

### Backend won't start

- Check if port 3000 is available
- Verify Node.js version (18+)
- Delete `node_modules` and reinstall

### Frontend API errors

- Verify backend is running
- Check `VITE_API_URL` in `.env`
- Check browser console for CORS errors

### QR codes not generating

- Verify `MASTER_INVITE_TOKEN` matches backend `.env`
- Check backend console for errors
- Try generating token manually via API tool

### Posts not auto-deleting

- Check backend console for cleanup messages
- Verify database `expires_at` timestamps
- Restart backend server

---

## 📊 Database Schema

### users
```sql
id              INTEGER PRIMARY KEY
username        TEXT UNIQUE NOT NULL
invite_token    TEXT NOT NULL
created_at      INTEGER NOT NULL
session_token   TEXT UNIQUE
```

### posts
```sql
id          INTEGER PRIMARY KEY
user_id     INTEGER (FK -> users.id)
content     TEXT NOT NULL
created_at  INTEGER NOT NULL
expires_at  INTEGER NOT NULL
```

### invite_tokens
```sql
token       TEXT PRIMARY KEY
created_at  INTEGER NOT NULL
used        BOOLEAN DEFAULT 0
used_at     INTEGER
```

---

## 🚫 What NOT to Add

To maintain privacy-first principles, **DO NOT** add:

- ❌ Email/phone verification
- ❌ Google Analytics or any analytics
- ❌ Facebook Pixel or social trackers
- ❌ External CDNs for libraries
- ❌ User profiles with personal info
- ❌ IP logging or geolocation
- ❌ Permanent post storage
- ❌ Like/comment counts (tracking behavior)

---

## 🤝 Contributing

This is a private, student-only project. Keep it clandestine.

**Core Principles:**
1. Privacy over features
2. Simplicity over complexity
3. Security over convenience
4. Anonymity over personalization

---

## 📜 License

**UNLICENSED** - Private project for Don Bosco Technical College students only.

---

## 💡 Philosophy

Clandestine exists to prove that social networking doesn't require surveillance capitalism. 

By removing emails, tracking, and permanent records, we create a space where students can connect authentically without fear of data exploitation or long-term consequences.

This isn't just an app—it's a statement.

**Stay clandestine. Stay private. Stay ahead.**

---

## 📞 Support

For issues or questions, contact the project maintainer through internal DBTC channels only.

Remember: No public forums. No external support. Keep it internal.

---

*Built with privacy, designed for trust, made for Don Bosco Technical College.*
