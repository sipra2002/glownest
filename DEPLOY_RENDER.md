# Deploying GlowNest to Render

GlowNest is fully configured for seamless deployment on **[Render](https://render.com)** as a unified full-stack application (the Express backend serves the API and also serves the built Vite React frontend).

---

## ⚡ Method 1: Blueprint Deployment (Fastest & Automated)

Render can automatically read the included `render.yaml` file to configure all build steps and environment variables.

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Configure for Render deployment"
   git push origin main
   ```

2. **Open Render Dashboard:**
   - Go to **[dashboard.render.com](https://dashboard.render.com)**.
   - Click the **"New +"** button at the top right and select **"Blueprint"**.

3. **Connect Repository:**
   - Select your `glownest` repository.
   - Render will detect `render.yaml` automatically.

4. **Click "Apply":**
   - Render will provision your service, install dependencies, generate the Prisma client, build both backend and frontend, and start the app.
   - Your live URL will appear on your service dashboard (e.g., `https://glownest.onrender.com`).

---

## 🛠️ Method 2: Manual Web Service Setup

If you prefer setting up the Web Service manually:

1. In Render Dashboard, click **"New +"** → **"Web Service"**.
2. Connect your GitHub repository.
3. Configure the following fields:
   - **Name:** `glownest`
   - **Region:** `Singapore` (recommended, as your Neon DB is in `ap-southeast-1`) or `Oregon`
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:**
     ```bash
     npm install --include=dev && npm run render:build
     ```
   - **Start Command:**
     ```bash
     npm start
     ```
   - **Health Check Path:**
     ```
     /api/health
     ```

4. **Environment Variables:**
   Under the **Environment Variables** section, add:

   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `DATABASE_URL` | `postgresql://neondb_owner:npg_IaDWd2h1ECwN@ep-patient-frost-azlyyi55-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require` |
   | `JWT_ACCESS_SECRET` | *(Click "Generate" or type a secure random string)* |
   | `JWT_REFRESH_SECRET` | *(Click "Generate" or type a secure random string)* |
   | `ANALYSIS_PROVIDER` | `demo` |
   | `STORAGE_DRIVER` | `local` |

5. Click **"Create Web Service"**.

---

## 🔍 How It Works in Production

- **Single Service:** You only need **1 free web service** on Render. The Express server serves API routes (`/api/v1/*`), health checks (`/api/health`), and automatically serves the pre-built React frontend (`client/dist`) with client-side SPA routing support.
- **Zero CORS Issues:** Because both frontend and backend share the same origin, cookies and API calls work immediately without cross-domain configuration.
- **Zero-Downtime Health Check:** Render probes `GET /api/health` before routing live traffic to ensure smooth deployments.

