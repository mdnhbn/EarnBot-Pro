
export enum TaskType {
  YOUTUBE = 'YOUTUBE',
  FACEBOOK = 'FACEBOOK',
  DAILYMOTION = 'DAILYMOTION',
  ADSTERRA = 'ADSTERRA',
  CUSTOM = 'CUSTOM'
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  telegramId: number;
  username: string;
  balance: number;
  xp: number;
  level: number;
  role: UserRole;
  joinedChannels: string[];
  isBanned: boolean;
  isVerified: boolean; // Tracking if they passed the Join Guard
  walletAddress?: string;
}

export interface Task {
  id: string;
  creatorId: string;
  type: TaskType;
  title: string;
  url: string;
  reward: number;
  timer: number;
  approved: boolean;
  viewCount: number;
}

export interface MandatoryChannel {
  id: string;
  name: string;
  url: string;
}

export interface LevelRequirement {
  level: number;
  xpNeeded: number;
  bonus: number;
}

export interface Withdrawal {
  id: string;
  userId: string;
  username: string;
  amount: number;
  currency: 'USDT' | 'TRX';
  address: string;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
  createdAt: string;
}

export interface GlobalSettings {
  mandatoryChannels: MandatoryChannel[];
  levelRequirements: LevelRequirement[];
  minWithdrawalUSDT: number;
  minWithdrawalTRX: number;
}
