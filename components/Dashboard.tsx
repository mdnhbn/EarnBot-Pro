
import React from 'react';
import { User } from '../types';
import { LEVEL_REQUIREMENTS } from '../constants';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const nextLevelXp = LEVEL_REQUIREMENTS(user.level);
  const progress = (user.xp / nextLevelXp) * 100;

  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-blue-100 text-sm opacity-80">Welcome back,</p>
              <h2 className="text-2xl font-bold">@{user.username}</h2>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
              <span className="font-bold">Lvl {user.level}</span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-blue-100 text-sm mb-2">Total Balance</p>
            <h3 className="text-4xl font-extrabold flex items-center gap-2">
              <span className="text-yellow-400">💎</span> {user.balance.toLocaleString()}
            </h3>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-blue-100">
              <span>XP Progress</span>
              <span>{user.xp} / {nextLevelXp} XP</span>
            </div>
            <div className="h-3 bg-blue-900/50 rounded-full overflow-hidden border border-white/10">
              <div 
                className="h-full bg-white rounded-full transition-all duration-1000" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-2xl block mb-1">🎯</span>
          <p className="text-slate-400 text-xs uppercase font-semibold">Tasks Completed</p>
          <p className="text-xl font-bold">42</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <span className="text-2xl block mb-1">🤝</span>
          <p className="text-slate-400 text-xs uppercase font-semibold">Referrals</p>
          <p className="text-xl font-bold">12</p>
        </div>
      </div>

      {/* Announcements */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="bg-slate-800/50 p-3 border-b border-slate-800">
          <h4 className="text-sm font-bold flex items-center gap-2">
            <span className="text-blue-400">⚡</span> Special Promotions
          </h4>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center text-xl shrink-0">🔥</div>
            <div>
              <h5 className="font-bold text-sm">Level 5 Bonus</h5>
              <p className="text-slate-400 text-xs">Reach Level 5 to unlock a 1.5x multiplier on all tasks!</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center text-xl shrink-0">🚀</div>
            <div>
              <h5 className="font-bold text-sm">Withdrawal Speed</h5>
              <p className="text-slate-400 text-xs">New automated USDT withdrawals processed in 5 minutes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
