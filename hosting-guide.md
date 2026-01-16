
# 🚀 EarnBot Pro Final Setup Guide

### 1. Database Setup (MongoDB Atlas)
1.  Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and sign up for a **Free Account**.
2.  Deploy a **Free Tier Cluster**.
3.  Go to **Database Access** -> **Add New Database User**. Set a username and password (e.g., `admin` and `password123`).
4.  Go to **Network Access** -> **Add IP Address** -> Click **"Allow Access From Anywhere"**.
5.  Go to **Database** -> **Connect** -> **Connect your application**.
6.  Copy the connection string. It looks like: `mongodb+srv://admin:<password>@cluster0.abc.mongodb.net/...`
7.  Open `server.js` and paste this link into the `MONGO_URI` variable (Replace `<password>` with your actual password).

### 2. Bot Token Integration
Your token `7434869863:AAEZC1Y4Cb_91-jYtDdybr97XkH7fuC2weM` is already added to `server.js` and `constants.ts`. 
*   **Important**: Make sure your Bot is an **Administrator** in all 5 mandatory channels so it has permission to check if users joined.

### 3. Hosting the Backend (Node.js)
1.  Install [Node.js](https://nodejs.org/) on your computer.
2.  Open your terminal/command prompt in the project folder.
3.  Run: `npm install express mongoose node-fetch cors dotenv`
4.  Run: `node server.js`
5.  Your backend is now live on `http://localhost:3000`.

### 4. Hosting the Frontend (React)
1.  Upload the frontend files to **Vercel** or **Netlify**.
2.  In `App.tsx`, update any API calls to point to your backend URL instead of `localStorage` once you are ready for full production.

### 5. Admin Access
Your Telegram ID `929198867` is set as the Super Admin. Only you will see the gear icon ⚙️ in the navigation bar.
