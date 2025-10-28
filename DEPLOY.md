# 🔒 IF I TELL YOU I'M GOING TO KILL YOU

**Tactical, zero-trace communications network for DBTC operatives.**

> "IF I TELL YOU, I'M GOING TO KILL YOU." — All transmissions auto-destruct in 24 hours.

---

## 🎯 PROJECT OVERVIEW

Secure, invitation-only social network with:
- QR-based credential authentication
- Username-only (callsign) system
- Auto-destructing posts (24hr)
- Zero tracking/analytics
- Military-grade operational security

---

## 🚀 QUICK DEPLOY

### Backend (Render/Railway)
1. Connect this repo
2. Root directory: `backend`
3. Build: `npm install`
4. Start: `node server.js`
5. Add environment variables (see below)

### Frontend (Vercel/Netlify)
1. Connect this repo
2. Root directory: `vite-project`
3. Build: `npm run build`
4. Output: `dist`
5. Add environment variable: `VITE_API_URL`

---

## 🔐 ENVIRONMENT VARIABLES

### Backend (.env)
```
PORT=3000
MASTER_INVITE_TOKEN=your-secure-admin-token-here
FRONTEND_URL=https://your-frontend-url.vercel.app
SESSION_SECRET=your-random-secret-string-here
```

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

---

## 💻 LOCAL DEVELOPMENT

```powershell
# Backend
cd backend
npm install
node server.js

# Frontend (new terminal)
cd vite-project
npm install
npm run dev
```

---

## 🎖️ TECH STACK

**Frontend:** React 19, React Router, Tailwind CSS, Vite  
**Backend:** Node.js, Express, JSON storage  
**Security:** Zero-trace, no analytics, session-based auth

---

## 📋 MISSION STATUS

✅ QR credential generation  
✅ Single-use authentication  
✅ Callsign registration  
✅ Auto-destruct transmissions  
✅ Zero personal data collection  
✅ Military tactical UI  

---

**CLASSIFIED · DBTC SECURE NETWORK · ZERO FOOTPRINT**
