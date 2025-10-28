# 🚀 DEPLOYMENT GUIDE - IF I TELL YOU I'M GOING TO KILL YOU

Deploy your app so QR codes work on real phones and devices.

---

## 🎯 QUICK DEPLOYMENT (Recommended)

### Option 1: Deploy to Render + Vercel (FREE)

This is the **easiest and most reliable** option for a functional QR-based app.

---

## 📦 STEP 1: Deploy Backend (Render)

### 1.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended)

### 1.2 Deploy Backend
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository OR use "Public Git Repository"
   - Repository URL: Your GitHub repo (if you pushed it)
   - OR manually deploy (see below)
3. Configure:
   - **Name:** `clandestine-backend` (or any name)
   - **Environment:** `Node`
   - **Region:** Choose closest to Philippines
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** `Free`

### 1.3 Add Environment Variables
In Render dashboard, add these environment variables:

```
PORT=3000
NODE_ENV=production
MASTER_INVITE_TOKEN=your-super-secret-token-here
FRONTEND_URL=https://your-app-name.vercel.app
SESSION_SECRET=another-random-secret-string-here
```

**Important:** Change `MASTER_INVITE_TOKEN` to something secure!

### 1.4 Deploy
- Click **"Create Web Service"**
- Wait for deployment (2-5 minutes)
- Copy your backend URL: `https://clandestine-backend-xxxx.onrender.com`

---

## 🌐 STEP 2: Deploy Frontend (Vercel)

### 2.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub (recommended)

### 2.2 Deploy Frontend
1. Click **"Add New..."** → **"Project"**
2. Import your repository OR drag & drop `vite-project` folder
3. Configure:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `vite-project`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 2.3 Add Environment Variable
In Vercel project settings → Environment Variables:

```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

Use the backend URL from Step 1.4

### 2.4 Deploy
- Click **"Deploy"**
- Wait for deployment (1-2 minutes)
- Copy your frontend URL: `https://your-app-name.vercel.app`

---

## 🔄 STEP 3: Update Backend with Frontend URL

1. Go back to Render dashboard
2. Go to your backend service → **Environment**
3. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://your-app-name.vercel.app
   ```
4. Save changes (this will redeploy the backend)

---

## ✅ STEP 4: Test Your Deployment

1. Open `https://your-app-name.vercel.app`
2. Click **"Admin Access"**
3. Enter your `MASTER_INVITE_TOKEN`
4. Generate a QR code
5. Scan it with your phone
6. It should work! 🎉

---

## 📱 Alternative: Deploy to Railway (Easier)

Railway hosts both frontend and backend in one place.

### Deploy to Railway:

1. Go to https://railway.app
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Railway will auto-detect and deploy both services

**Add these environment variables in Railway:**

For backend service:
```
MASTER_INVITE_TOKEN=your-secret-token
FRONTEND_URL=https://your-railway-app.up.railway.app
SESSION_SECRET=random-secret-string
```

For frontend service:
```
VITE_API_URL=https://your-backend.up.railway.app/api
```

---

## 🐙 STEP 5: Push to GitHub (Required for Render/Vercel)

If you haven't pushed your code to GitHub yet:

```powershell
# Initialize git (if not already)
cd c:\if-i-tell-you-im-going-to-kill-you
git init

# Create .gitignore
# (already exists, just verify it includes node_modules, .env, etc.)

# Add all files
git add .

# Commit
git commit -m "Initial commit: If I Tell You I'm Going To Kill You"

# Create GitHub repository (via GitHub website)
# Then connect and push:
git remote add origin https://github.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

---

## 🔐 SECURITY CHECKLIST

Before deploying:

- ✅ Change `MASTER_INVITE_TOKEN` to something secure
- ✅ Change `SESSION_SECRET` to a random string
- ✅ Never commit `.env` files (should be in `.gitignore`)
- ✅ Update CORS settings in backend for production URL
- ✅ Test QR codes on real phones

---

## 🛠️ TROUBLESHOOTING

### QR codes don't work on phones
- **Check:** Backend and frontend URLs are correct in environment variables
- **Check:** CORS is configured properly (FRONTEND_URL matches)
- **Check:** Both services are deployed and running

### "Invalid admin token" error
- **Check:** MASTER_INVITE_TOKEN matches in backend environment and your admin panel input

### "Failed to fetch" errors
- **Check:** VITE_API_URL in frontend points to correct backend URL
- **Check:** Backend is running (visit backend URL/api/health)

### Backend crashes
- **Check:** All dependencies are installed
- **Check:** Environment variables are set correctly
- **Check:** Logs in Render/Railway dashboard

---

## 📊 POST-DEPLOYMENT

### Test the full flow:
1. Visit your deployed frontend URL
2. Go to Admin panel
3. Generate QR code
4. Share QR with phone
5. Scan and create account
6. Post messages
7. Verify 24-hour auto-delete

### Monitor your app:
- **Render:** Check logs and metrics in dashboard
- **Vercel:** Check analytics and deployment logs
- **Railway:** Check metrics and logs

---

## 💰 COSTS

**Free tier limits:**
- **Render:** Free tier available (sleeps after 15 min inactivity)
- **Vercel:** 100GB bandwidth/month free
- **Railway:** $5 free credit monthly

For DBTC student use, free tier should be sufficient.

---

## 🔄 UPDATING YOUR APP

After making changes:

1. Push to GitHub:
   ```powershell
   git add .
   git commit -m "Update message"
   git push
   ```

2. **Render/Vercel/Railway** will auto-deploy from GitHub
3. Changes go live in 1-5 minutes

---

## 📞 SUPPORT

If deployment fails:
1. Check the deployment logs
2. Verify environment variables
3. Test backend health: `https://your-backend-url/api/health`
4. Test frontend build locally: `npm run build`

---

**🎖️ MISSION STATUS: READY FOR DEPLOYMENT**

Your tactical communications network is ready to go live. Follow the steps above and your QR codes will work on any device worldwide.
