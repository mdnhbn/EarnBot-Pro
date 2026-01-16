
# 🚀 Final Deployment Checklist

### 1. Final Code Check
- **Backend**: `server.js` is updated with your MongoDB string.
- **Frontend**: `App.tsx` is configured to communicate with the API.

### 2. Push to GitHub
Open your terminal in the project folder and run:
```bash
git init
git add .
git commit -m "Final Build: EarnBot Pro with MongoDB Integrated"
# Create a new repository on github.com, then copy the link
git remote add origin YOUR_GITHUB_REPO_LINK
git branch -M main
git push -u origin main
```

### 3. Deploy Backend (Render.com - Best for Free Node.js)
1. Go to [Render.com](https://render.com) and sign in with GitHub.
2. Click **New +** -> **Web Service**.
3. Select your repository.
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Once deployed, copy your Render URL (e.g., `https://earnbot-api.onrender.com`).

### 4. Deploy Frontend (Vercel)
1. Go to [Vercel.com](https://vercel.com) and import your GitHub repo.
2. Under "Environment Variables", add:
   - `REACT_APP_API_BASE`: (Your Render URL from step 3)
3. Click **Deploy**.

### 5. Telegram Setup
Update your Bot's Menu URL in **BotFather** to point to your Vercel frontend link.

**Congratulations! Your bot is now fully autonomous and powered by Hacker Database.**
