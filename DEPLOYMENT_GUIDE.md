# 🚀 Fast Deployment Guide: Vercel (Frontend) + Render (Backend)

Follow these simple steps to deploy **Limitless AI** for free in under 5 minutes.

---

## Part 1: Deploy Backend on Render (Free)

1. Push your code to a GitHub repository:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```
2. Go to **[dashboard.render.com](https://dashboard.render.com/)** and click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Configure the service settings:
   - **Name:** `limitless-backend` (or your choice)
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free
5. *(Optional)* Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: *(your Google Gemini API key if you have one)*
6. Click **Deploy Web Service**.
7. Once deployed, copy your Render URL:  
   👉 `https://limitless-backend.onrender.com`

---

## Part 2: Deploy Frontend on Vercel (Free)

1. Go to **[vercel.com](https://vercel.com/)** and click **Add New...** → **Project**.
2. Select your GitHub repository.
3. In project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** click Edit and choose `frontend`
4. Expand **Environment Variables** and add:
   - **Key:** `VITE_API_URL`
   - **Value:** Your Render backend URL (e.g., `https://limitless-backend.onrender.com`)
5. Click **Deploy**!

🎉 Your website will be live worldwide with automatic HTTPS and SPA routing enabled!
