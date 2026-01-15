
# MongoDB Schema - EarnBot Pro

### 1. User Schema
```json
{
  "telegramId": { "type": "Number", "unique": true, "required": true },
  "username": { "type": "String", "required": true },
  "balance": { "type": "Number", "default": 0 },
  "xp": { "type": "Number", "default": 0 },
  "level": { "type": "Number", "default": 1 },
  "role": { "type": "String", "enum": ["USER", "ADMIN"], "default": "USER" },
  "joinedChannels": [{ "type": "String" }],
  "isBanned": { "type": "Boolean", "default": false },
  "walletAddress": { "type": "String" },
  "ipAddress": { "type": "String" },
  "lastClaimAt": { "type": "Date" },
  "referralCode": { "type": "String", "unique": true },
  "referredBy": { "type": "ObjectId", "ref": "User" }
}
```

### 2. Task Schema
```json
{
  "creatorId": { "type": "ObjectId", "ref": "User", "required": true },
  "type": { "type": "String", "enum": ["YOUTUBE", "FACEBOOK", "DAILYMOTION", "ADSTERRA", "CUSTOM"] },
  "title": { "type": "String", "required": true },
  "url": { "type": "String", "required": true },
  "reward": { "type": "Number", "required": true },
  "timer": { "type": "Number", "default": 30 },
  "approved": { "type": "Boolean", "default": false },
  "totalViews": { "type": "Number", "default": 0 },
  "maxViews": { "type": "Number", "required": true },
  "completedBy": [{ "type": "ObjectId", "ref": "User" }]
}
```

### 3. Withdrawal Schema
```json
{
  "userId": { "type": "ObjectId", "ref": "User", "required": true },
  "amount": { "type": "Number", "required": true },
  "currency": { "type": "String", "enum": ["USDT", "TRX"] },
  "address": { "type": "String", "required": true },
  "status": { "type": "String", "enum": ["PENDING", "COMPLETED", "REJECTED"], "default": "PENDING" },
  "createdAt": { "type": "Date", "default": "Date.now" }
}
```

### 4. Admin Settings Schema
```json
{
  "mandatoryChannels": [{ "id": "String", "name": "String", "url": "String" }],
  "xpMultiplier": { "type": "Number", "default": 1 },
  "levelRewards": [{ "level": "Number", "bonus": "Number" }]
}
```
