
/**
 * BACKEND LOGIC (Node.js + Express + MongoDB)
 * ------------------------------------------
 * INSTRUCTIONS:
 * 1. Install dependencies: npm install express mongoose node-fetch dotenv cors
 * 2. Paste your MongoDB URL below in the MONGO_URI variable.
 * 3. Run with: node server.js
 */

const express = require('express');
const mongoose = require('mongoose');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors()); // Allows your frontend to talk to this backend

// ==========================================
// 🔑 DATABASE & BOT CONFIGURATION
// ==========================================
// PASTE YOUR MONGODB URL HERE BETWEEN THE QUOTES:
const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/earnbot?retryWrites=true&w=majority";
const BOT_TOKEN = "7434869863:AAEZC1Y4Cb_91-jYtDdybr97XkH7fuC2weM";

// Connect to MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB Successfully'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// MONGO MODELS
const UserSchema = new mongoose.Schema({
    telegramId: { type: Number, unique: true },
    username: String,
    balance: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false }
});
const User = mongoose.model('User', UserSchema);

// TELEGRAM VERIFICATION API
app.post('/api/verify', async (req, res) => {
    const { userId, channels } = req.body;
    
    try {
        let allJoined = true;
        for (const channel of channels) {
            // Extracts channel username from URL (e.g., https://t.me/example -> @example)
            const channelPart = channel.url.split('t.me/')[1];
            if (!channelPart) continue;
            
            const chatId = "@" + channelPart.replace('/', '');
            
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getChatMember?chat_id=${chatId}&user_id=${userId}`);
            const data = await response.json();
            
            const memberStatus = data.result?.status;
            // Statuses that count as "Joined"
            const validStatuses = ['member', 'administrator', 'creator'];
            
            if (!validStatuses.includes(memberStatus)) {
                allJoined = false;
                break;
            }
        }

        if (allJoined) {
            await User.findOneAndUpdate(
                { telegramId: userId }, 
                { isVerified: true }, 
                { upsert: true }
            );
            res.json({ success: true });
        } else {
            res.json({ success: false, message: "User has not joined all channels" });
        }
    } catch (error) {
        console.error('Verification Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET USER DATA
app.get('/api/user/:tgId', async (req, res) => {
    try {
        const user = await User.findOne({ telegramId: req.params.tgId });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
