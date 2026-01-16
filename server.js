
/**
 * EARNBOT PRO - BACKEND ENGINE (ESM VERSION)
 * ----------------------------
 * Handles MongoDB persistence, Telegram verification, and User management.
 */

import express from 'express';
import mongoose from 'mongoose';
import fetch from 'node-fetch';
import cors from 'cors';
import 'dotenv/config';

const app = express();

// Standard Middlewares
app.use(cors());
app.use(express.json());

// ==========================================
// 🔑 CONFIGURATION
// ==========================================
const MONGO_URI = "mongodb+srv://mdnhbn_db_user:Hacker%40%23674621@cluster0.o6gdrcc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const BOT_TOKEN = "7434869863:AAEZC1Y4Cb_91-jYtDdybr97XkH7fuC2weM";

// ==========================================
// 🗄️ DATABASE SCHEMAS
// ==========================================

const UserSchema = new mongoose.Schema({
  telegramId: { type: Number, unique: true, required: true },
  username: String,
  balance: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  isVerified: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  role: { type: String, default: 'USER' }
});

const TaskSchema = new mongoose.Schema({
  id: String,
  creatorId: String,
  type: String,
  title: String,
  url: String,
  reward: Number,
  timer: Number,
  approved: { type: Boolean, default: false }
});

const SettingsSchema = new mongoose.Schema({
  id: { type: String, default: 'global' },
  mandatoryChannels: Array,
  levelRequirements: Array,
  minWithdrawalUSDT: Number,
  minWithdrawalTRX: Number
});

const WithdrawalSchema = new mongoose.Schema({
  id: String,
  userId: String,
  username: String,
  amount: Number,
  currency: String,
  address: String,
  status: { type: String, default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Task = mongoose.model('Task', TaskSchema);
const Settings = mongoose.model('Settings', SettingsSchema);
const Withdrawal = mongoose.model('Withdrawal', WithdrawalSchema);

// ==========================================
// 📡 API ENDPOINTS
// ==========================================

// Request Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Initial Load
app.get('/api/init/:tgId', async (req, res) => {
  try {
    const tgId = parseInt(req.params.tgId);
    console.log(`Initializing app for user: ${tgId}`);
    
    let user = await User.findOne({ telegramId: tgId });
    const tasks = await Task.find({});
    const withdrawals = await Withdrawal.find({});
    const allUsers = await User.find({}).limit(100); 
    let settings = await Settings.findOne({ id: 'global' });

    if (!settings) {
      console.log("No settings found, creating defaults...");
      settings = await Settings.create({
        id: 'global',
        mandatoryChannels: [
          { id: '1', name: 'EarnBot News', url: 'https://t.me/earnbot_news' }
        ],
        levelRequirements: [
          { level: 1, xpNeeded: 0, bonus: 0 },
          { level: 2, xpNeeded: 500, bonus: 50 },
          { level: 3, xpNeeded: 1500, bonus: 150 },
          { level: 4, xpNeeded: 4000, bonus: 400 },
          { level: 5, xpNeeded: 10000, bonus: 1000 }
        ],
        minWithdrawalUSDT: 1000,
        minWithdrawalTRX: 500
      });
    }

    res.status(200).json({ user, tasks, settings, withdrawals, allUsers });
  } catch (err) {
    console.error("Init Error:", err);
    res.status(500).json({ error: "Failed to initialize app data" });
  }
});

// Create/Update User Stats
app.post('/api/user/sync', async (req, res) => {
  const { telegramId, username, balance, xp, level, isVerified, role } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { telegramId },
      { username, balance, xp, level, isVerified, role },
      { upsert: true, new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin Update Settings
app.post('/api/admin/settings', async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate({ id: 'global' }, req.body, { upsert: true, new: true });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Task Management
app.post('/api/admin/tasks', async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/tasks/:id', async (req, res) => {
  try {
    await Task.deleteOne({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Withdrawal Processing
app.post('/api/withdrawals', async (req, res) => {
  try {
    const w = await Withdrawal.create(req.body);
    res.json(w);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/admin/withdrawals/:id', async (req, res) => {
  try {
    const w = await Withdrawal.findOneAndUpdate({ id: req.params.id }, { status: req.body.status }, { new: true });
    res.json(w);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Telegram Verification
app.post('/api/verify', async (req, res) => {
  const { userId, channels } = req.body;
  try {
    let allJoined = true;
    for (const channel of channels) {
      const channelPart = channel.url.split('t.me/')[1];
      if (!channelPart) continue;
      const chatId = "@" + channelPart.replace('/', '');
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getChatMember?chat_id=${chatId}&user_id=${userId}`);
      const data = await response.json();
      if (!['member', 'administrator', 'creator'].includes(data.result?.status)) {
        allJoined = false;
        break;
      }
    }
    if (allJoined) {
      await User.findOneAndUpdate({ telegramId: userId }, { isVerified: true });
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 404 Handler for API
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Connect and Start
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`🚀 API running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });
