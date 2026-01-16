
import { MandatoryChannel, LevelRequirement, Task, TaskType } from './types';

// ==========================================
// 🛡️ SECURITY CONFIGURATION
// ==========================================
export const SUPER_ADMIN_ID = 929198867; // Your Telegram ID
export const BOT_TOKEN = "7434869863:AAEZC1Y4Cb_91-jYtDdybr97XkH7fuC2weM";

export const DEFAULT_SETTINGS = {
  mandatoryChannels: [
    { id: '1', name: 'EarnBot Official', url: 'https://t.me/earnbot_news' },
    { id: '2', name: 'Alpha Crypto', url: 'https://t.me/alpha_crypto' },
    { id: '3', name: 'Task Updates', url: 'https://t.me/task_updates' },
    { id: '4', name: 'Payment Proofs', url: 'https://t.me/payment_proofs' },
    { id: '5', name: 'Community Chat', url: 'https://t.me/community' },
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

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    creatorId: 'admin',
    type: TaskType.YOUTUBE,
    title: 'Watch New Strategy',
    url: 'https://youtube.com',
    reward: 50,
    timer: 30,
    approved: true,
    viewCount: 0
  }
];

export const LEVEL_REQUIREMENTS = (level: number, currentSettings?: LevelRequirement[]) => {
  const source = currentSettings || DEFAULT_SETTINGS.levelRequirements;
  const nextLevel = level + 1;
  const requirement = source.find(r => r.level === nextLevel);
  return requirement ? requirement.xpNeeded : source[source.length - 1].xpNeeded;
};
