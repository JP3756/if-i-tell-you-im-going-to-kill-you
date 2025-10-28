# 🚀 QUICK START GUIDE - CLANDESTINE

## ✅ Servers are Running!

**Backend:** http://localhost:3000  
**Frontend:** http://localhost:5173

---

## 🎯 Test the Complete Flow

### Step 1: Generate Your First QR Invitation

1. Open your browser to: **http://localhost:5173**
2. Click **"Admin Access"** at the bottom
3. Enter master token: `dbtc-secret-2025-alpha`
4. Click **"Generate QR Invitation"**
5. Download the QR code or copy the invitation URL

### Step 2: Use the Invitation

**Option A - Scan QR Code:**
- Scan the downloaded QR code with your phone
- Follow the link to create your account

**Option B - Direct URL:**
- Copy the invitation URL from the admin panel
- Open it in a new incognito/private browser window (to simulate a new user)
- Example: `http://localhost:5173/invite/xxxxx-xxxx-xxxx-xxxx`

### Step 3: Create Your Account

1. The invitation will be validated automatically
2. Choose a username (3-20 characters, letters/numbers/underscore)
3. Click **"Create Account"**
4. Read the Privacy Manifesto
5. Click **"Enter Clandestine"**

### Step 4: Use the App

1. You're now in the feed!
2. Create your first post (max 500 characters)
3. Posts auto-delete after 24 hours
4. Open another browser/incognito window to create more users and test

---

## 🔑 Default Credentials

**Master Token:** `dbtc-secret-2025-alpha`  
*(Found in `backend/.env` - change this for production!)*

---

## 📊 What's Working

✅ **Backend** (Port 3000)
- QR invitation generation
- Token validation
- User signup (username only, no email/phone)
- Session management
- Ephemeral posts (24hr auto-delete)
- Privacy-first data storage

✅ **Frontend** (Port 5173)
- Landing page
- Admin panel (QR generation)
- Invite validation page
- Username signup
- Privacy manifesto
- Feed with posts
- Dark minimalist UI

---

## 🗂️ Database Location

**File:** `backend/clandestine.json`

This JSON file stores all data. View it to see:
- Users created
- Active posts
- Used invitation tokens

To reset everything, delete this file and restart the backend.

---

## 🛑 Stop the Servers

Press `Ctrl+C` in each terminal window to stop the servers.

---

## 🎨 Features Demonstrated

### Core Privacy Features
- ✅ QR-based invitation only (no public signup)
- ✅ No email verification
- ✅ No phone verification
- ✅ Username-only authentication
- ✅ Ephemeral posts (24hr expiration)
- ✅ No IP logging
- ✅ No analytics/tracking
- ✅ No third-party scripts

### Technical Features
- ✅ React + React Router
- ✅ Tailwind CSS (dark theme)
- ✅ Node.js + Express backend
- ✅ JSON-based database (portable)
- ✅ Session-based auth
- ✅ Auto-cleanup of expired posts
- ✅ Responsive design

---

## 📱 Next Steps

### For Development:
1. Create multiple test users
2. Post messages and watch them expire
3. Test the invitation system
4. Customize the color scheme in `vite-project/tailwind.config.js`

### For Production:
1. Change `MASTER_INVITE_TOKEN` to a secure random string
2. Replace JSON database with PostgreSQL/Supabase
3. Deploy backend to Render/Railway
4. Deploy frontend to Vercel/Netlify
5. Enable HTTPS
6. Update CORS settings with production URLs

---

## 🐛 Troubleshooting

**Frontend can't connect to backend:**
- Check that backend is running on port 3000
- Verify `VITE_API_URL` in `vite-project/.env`

**Can't generate QR codes:**
- Verify master token matches `backend/.env`
- Check backend console for errors

**Posts not showing:**
- Make sure you're logged in
- Check browser console for errors
- Verify backend API is responding

---

## 📖 Full Documentation

See `README.md` for complete setup instructions, deployment guide, and philosophy.

---

**🔒 Clandestine - Privacy First. Students Only. No Footprints.**
