# 🚀 RevenueShield Deployment Guide

RevenueShield is configured for seamless deployment to **Render**, **Railway**, **Docker**, or **Vercel**.

Because the production Express server (`apps/api`) serves both the **REST API** (`/api/*`) and the built **React SPA Frontend** (`apps/web/dist`), the simplest and cleanest way to deploy RevenueShield is as a **single unified web service** on **Render** or **Railway**.

---

## ⚡ Option 1: 1-Click Free Deployment on Render (Recommended)

Render offers a free tier for Node.js web services.

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Configure production deployment and Docker"
   git push origin main
   ```
2. Go to [dashboard.render.com](https://dashboard.render.com) and click **New +** $\to$ **Web Service**.
3. Select your repository `Dimple2906/RevenueSheild`.
4. Configure the settings:
   - **Name**: `revenueshield`
   - **Environment**: `Node`
   - **Build Command**:
     ```bash
     npm install && npm run db:generate && npm run db:push && npm run db:seed && npm run build
     ```
   - **Start Command**:
     ```bash
     npm run start
     ```
   - **Environment Variables**:
     - `NODE_ENV`: `production`
     - `DATABASE_URL`: `file:./packages/database/prisma/dev.db`
     - `RAZORPAY_KEY_ID`: `rzp_test_demo12345678` (or your live Razorpay Key ID)
     - `RAZORPAY_KEY_SECRET`: `secret_demo12345678` (or your live Razorpay Key Secret)
     - `RAZORPAY_WEBHOOK_SECRET`: `webhook_secret_demo`
5. Click **Create Web Service**. Your fullstack app and live interactive dashboard will be live at `https://revenueshield.onrender.com`.

---

## 🚂 Option 2: 1-Click Deployment on Railway

1. Go to [railway.app](https://railway.app) and click **New Project** $\to$ **Deploy from GitHub repo**.
2. Select `Dimple2906/RevenueSheild`.
3. In Railway **Settings**:
   - **Build Command**: `npm install && npm run db:generate && npm run db:push && npm run db:seed && npm run build`
   - **Start Command**: `npm run start`
4. Add environment variables:
   - `PORT`: `4000` (or leave default, Railway assigns automatically)
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: `file:./packages/database/prisma/dev.db`
   - `RAZORPAY_KEY_ID`: `rzp_test_demo12345678`
   - `RAZORPAY_KEY_SECRET`: `secret_demo12345678`
5. Click **Deploy**. Railway will provision a public domain `https://revenueshield.up.railway.app`.

---

## 🐳 Option 3: Docker / Container Deployment

A multi-stage `Dockerfile` and `docker-compose.yml` are included in the repository.

### Run with Docker Compose:
```bash
docker compose up -d --build
```
The app will be accessible at [http://localhost:4000](http://localhost:4000).

### Build & Run Container Manually:
```bash
docker build -t revenueshield:latest .
docker run -p 4000:4000 -e PORT=4000 revenueshield:latest
```

---

## ▲ Option 4: Split Deployment (Vercel Frontend + Render/Railway Backend)

If you prefer hosting the React frontend on **Vercel** and the backend on **Render/Railway**:

1. **Deploy Backend on Render/Railway** as described in Option 1 or 2. Note your backend URL (e.g., `https://revenueshield-api.onrender.com`).
2. **Deploy Frontend on Vercel**:
   - Go to [vercel.com](https://vercel.com) $\to$ **Add New Project** $\to$ Select `RevenueSheild`.
   - **Root Directory**: `apps/web` (or leave blank and use included `vercel.json`).
   - Add Environment Variable:
     - `VITE_API_URL`: `https://revenueshield-api.onrender.com/api`
   - Click **Deploy**.
