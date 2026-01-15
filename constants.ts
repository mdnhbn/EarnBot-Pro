
import { User, UserRole, MandatoryChannel, LevelRequirement, Task, TaskType } from './types';

// ==========================================
// CONFIGURATION - CHANGE YOUR ID HERE
// ==========================================
export const SUPER_ADMIN_ID = 929198867; 

export const DEFAULT_SETTINGS = {
  mandatoryChannels: [
    { id: '1', name: 'EarnBot Official', url: 'https://t.me/earnbot_news' },
    { id: '2', name: 'Crypto Alpha', url: 'https://t.me/crypto_alpha' },
    { id: '3', name: 'Airdrop King', url: 'https://t.me/airdrop_king' },
    { id: '4', name: 'Paid Ads 1', url: 'https://t.me/ads_1' },
    { id: '5', name: 'Support Group', url: 'https://t.me/support' },
  ],
  levelRequirements: [
    { level: 1, xpNeeded: 0, bonus: 0 },
    { level: 2, xpNeeded: 500, bonus: 50 },
    { level: 3, xpNeeded: 1500, bonus: 150 },
    { level: 4, xpNeeded: 4000, bonus: 400 },
    { level: 5, xpNeeded: 10000, bonus: 1000 },
  ],
  minWithdrawalUSDT: 1000,
  minWithdrawalTRX: 500,
};

// Fix: Exporting LEVEL_REQUIREMENTS helper function to determine XP threshold for the next level.
// This matches the expected usage in components/Dashboard.tsx
export const LEVEL_REQUIREMENTS = (level: number) => {
  const nextLevel = level + 1;
  const requirement = DEFAULT_SETTINGS.levelRequirements.find(r => r.level === nextLevel);
  // Return the XP needed for the next level, or the cap level requirement if already at max.
  return requirement ? requirement.xpNeeded : DEFAULT_SETTINGS.levelRequirements[DEFAULT_SETTINGS.levelRequirements.length - 1].xpNeeded;
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    creatorId: 'admin',
    type: TaskType.YOUTUBE,
    title: 'Watch & Subscribe',
    url: 'https://youtube.com',
    reward: 50,
    timer: 30,
    approved: true,
    viewCount: 0
  }
];
