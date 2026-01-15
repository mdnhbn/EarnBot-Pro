
# 🚀 EarnBot Pro Deployment Guide

### 1. Bot Token Setup
This app is a **Telegram Mini App (TWA)**. 
1. Open **BotFather** on Telegram.
2. Create a new bot or select your existing one.
3. Go to **Bot Settings** -> **Menu Button** -> **Configure Menu Button**.
4. Set the URL to where you host this React code (e.g., your Vercel/Netlify URL).

### 2. Database Connection (Node.js)
If you move this to a real backend (Node.js):
- Change the `useEffect` in `App.tsx` from `localStorage` to `axios.get('/api/settings')`.
- Inside your Node.js `.env` file, paste your MongoDB URL:
  `MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/earnbot`
- Paste your Bot Token:
  `TELEGRAM_BOT_TOKEN=729381:AAH_ExampleToken`

### 3. Admin Access
In `constants.ts`, I have set:
`export const SUPER_ADMIN_ID = 929198867;`
**CRITICAL**: Replace `929198867` with YOUR actual Telegram ID. You can find your ID by messaging `@userinfobot` on Telegram.

### 4. Hosting
- **Frontend**: Upload this folder to **Vercel** or **Netlify**. It is ready to run immediately.
- **Backend**: You will need a simple Express.js server to handle the MongoDB calls if you want to store data forever across all users.
